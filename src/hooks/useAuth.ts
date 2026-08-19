import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '../core/supabase/client';
import { UserProfile } from '../types/cloud';

const STORAGE_ROOM_KEY = 'auratunes_room_code';
const STORAGE_LOCAL_USER_KEY = 'auratunes_local_user';

// Helper: Chuẩn hóa tên đăng nhập thành email nếu người dùng chỉ nhập username
function normalizeEmail(input: string): string {
  const clean = input.trim().toLowerCase();
  if (!clean.includes('@')) {
    return `${clean}@hoangleemusic.local`;
  }
  return clean;
}

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roomCode, setRoomCode] = useState<string>(() => {
    return localStorage.getItem(STORAGE_ROOM_KEY) || 'HOANGLEE';
  });
  const [isConfigured, setIsConfigured] = useState<boolean>(isSupabaseConfigured());
  const [loading, setLoading] = useState(true);

  // Switch / Join Room
  const joinRoom = useCallback((code: string) => {
    const clean = code.trim().toUpperCase() || 'HOANGLEE';
    setRoomCode(clean);
    localStorage.setItem(STORAGE_ROOM_KEY, clean);
  }, []);

  // Check auth session
  const checkSession = useCallback(async () => {
    const supabase = getSupabaseClient();
    setIsConfigured(isSupabaseConfigured());

    // 1. Kiểm tra session từ Supabase nếu đã kết nối
    if (supabase) {
      try {
        const { data } = await supabase.auth.getSession();
        const currentUser = data.session?.user || null;
        if (currentUser) {
          setUser(currentUser);
          const email = currentUser.email || '';
          const isAdmin = email.startsWith('levuhoang');
          setProfile({
            id: currentUser.id,
            email,
            displayName: isAdmin
              ? '👑 Admin HoangLee'
              : currentUser.user_metadata?.full_name || email.split('@')[0] || 'HoangLee Member',
            currentRoomCode: roomCode,
            isAdmin,
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Lỗi kiểm tra session Supabase:', err);
      }
    }

    // 2. Kiểm tra Local Admin Session (offline / khi chưa cấu hình Supabase)
    const localUserRaw = localStorage.getItem(STORAGE_LOCAL_USER_KEY);
    if (localUserRaw) {
      try {
        const localUser = JSON.parse(localUserRaw);
        setUser(localUser);
        setProfile(localUser);
        setLoading(false);
        return;
      } catch {
        // ignore
      }
    }

    setUser(null);
    setProfile(null);
    setLoading(false);
  }, [roomCode]);

  useEffect(() => {
    checkSession();

    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        const u = session?.user || null;
        setUser(u);
        if (u) {
          const email = u.email || '';
          const isAdmin = email.startsWith('levuhoang');
          setProfile({
            id: u.id,
            email,
            displayName: isAdmin
              ? '👑 Admin HoangLee'
              : u.user_metadata?.full_name || email.split('@')[0] || 'HoangLee Member',
            currentRoomCode: roomCode,
            isAdmin,
          });
        } else {
          setProfile(null);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [checkSession, roomCode]);

  // Sign In (Hỗ trợ cả email hoặc username levuhoang)
  const signIn = async (identifier: string, pass: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const email = normalizeEmail(cleanId);
    const isAdminAccount = cleanId === 'levuhoang' || email === 'levuhoang@hoangleemusic.local';

    // Kiểm tra tài khoản Admin cứng nếu offline hoặc chưa cấu hình Supabase
    if (isAdminAccount && pass === 'lvh@1605') {
      const adminProfile: UserProfile = {
        id: 'admin_master_levuhoang',
        email: 'levuhoang@hoangleemusic.local',
        displayName: '👑 Admin HoangLee',
        isAdmin: true,
        currentRoomCode: roomCode,
      };

      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          // Thử đăng nhập trên Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email: 'levuhoang@hoangleemusic.local',
            password: pass,
          });

          if (!error && data.user) {
            setUser(data.user);
            setProfile(adminProfile);
            localStorage.setItem(STORAGE_LOCAL_USER_KEY, JSON.stringify(adminProfile));
            return data.user;
          }

          // Nếu chưa có tài khoản admin trên Supabase, tự động đăng ký tạo luôn!
          const { data: signUpData } = await supabase.auth.signUp({
            email: 'levuhoang@hoangleemusic.local',
            password: pass,
            options: {
              data: { full_name: '👑 Admin HoangLee' },
            },
          });

          if (signUpData.user) {
            setUser(signUpData.user);
            setProfile(adminProfile);
            localStorage.setItem(STORAGE_LOCAL_USER_KEY, JSON.stringify(adminProfile));
            return signUpData.user;
          }
        } catch {
          // Fallback to local admin
        }
      }

      // Lưu admin session offline
      setUser(adminProfile);
      setProfile(adminProfile);
      localStorage.setItem(STORAGE_LOCAL_USER_KEY, JSON.stringify(adminProfile));
      return adminProfile;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Tài khoản hoặc mật khẩu không chính xác.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) throw error;
    setUser(data.user);
    return data.user;
  };

  // Sign Up
  const signUp = async (identifier: string, pass: string, displayName: string) => {
    const email = normalizeEmail(identifier);
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Chưa cấu hình kết nối Supabase Cloud.');

    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: displayName,
        },
      },
    });

    if (error) throw error;
    setUser(data.user);
    return data.user;
  };

  // Sign Out
  const signOut = async () => {
    localStorage.removeItem(STORAGE_LOCAL_USER_KEY);
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
  };

  return {
    user,
    profile,
    roomCode,
    isConfigured,
    loading,
    signIn,
    signUp,
    signOut,
    joinRoom,
    refreshAuth: checkSession,
  };
}
