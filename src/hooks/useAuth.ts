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
              : email.startsWith('user')
              ? '🎵 Bạn Bè HoangLee'
              : currentUser.user_metadata?.full_name || email.split('@')[0] || 'Thành viên',
            currentRoomCode: roomCode || 'HOANGLEE',
            isAdmin,
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Lỗi kiểm tra session Supabase:', err);
      }
    }

    // 2. Kiểm tra Local Session (offline / fallback)
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
              : email.startsWith('user')
              ? '🎵 Bạn Bè HoangLee'
              : u.user_metadata?.full_name || email.split('@')[0] || 'Thành viên',
            currentRoomCode: roomCode || 'HOANGLEE',
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

  // Sign In (Hỗ trợ Admin: levuhoang/lvh@1605, User tích hợp: user/123, và tài khoản tùy chọn)
  const signIn = async (identifier: string, pass: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const email = normalizeEmail(cleanId);
    const isAdminAccount = cleanId === 'levuhoang' || email === 'levuhoang@hoangleemusic.local';
    const isUserAccount = cleanId === 'user' || email === 'user@hoangleemusic.local';

    // 1. TÀI KHOẢN ADMIN: levuhoang / lvh@1605
    if (isAdminAccount && pass === 'lvh@1605') {
      const adminProfile: UserProfile = {
        id: 'admin_master_levuhoang',
        email: 'levuhoang@hoangleemusic.local',
        displayName: '👑 Admin HoangLee',
        isAdmin: true,
        currentRoomCode: 'HOANGLEE',
      };
      joinRoom('HOANGLEE');

      const supabase = getSupabaseClient();
      if (supabase) {
        try {
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

          const { data: signUpData } = await supabase.auth.signUp({
            email: 'levuhoang@hoangleemusic.local',
            password: pass,
            options: { data: { full_name: '👑 Admin HoangLee' } },
          });

          if (signUpData.user) {
            setUser(signUpData.user);
            setProfile(adminProfile);
            localStorage.setItem(STORAGE_LOCAL_USER_KEY, JSON.stringify(adminProfile));
            return signUpData.user;
          }
        } catch {
          // Fallback local
        }
      }

      setUser(adminProfile);
      setProfile(adminProfile);
      localStorage.setItem(STORAGE_LOCAL_USER_KEY, JSON.stringify(adminProfile));
      return adminProfile;
    }

    // 2. TÀI KHOẢN USER TÍCH HỢP SẴN: user / 123 (Vào thẳng phòng HOANGLEE)
    if (isUserAccount && (pass === '123' || pass === '123123')) {
      const userProfile: UserProfile = {
        id: 'user_member_hoanglee',
        email: 'user@hoangleemusic.local',
        displayName: '🎵 Bạn Bè HoangLee',
        isAdmin: false,
        currentRoomCode: 'HOANGLEE',
      };
      joinRoom('HOANGLEE');

      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: 'user@hoangleemusic.local',
            password: 'User@123456!',
          });

          if (!error && data.user) {
            setUser(data.user);
            setProfile(userProfile);
            localStorage.setItem(STORAGE_LOCAL_USER_KEY, JSON.stringify(userProfile));
            return data.user;
          }

          const { data: signUpData } = await supabase.auth.signUp({
            email: 'user@hoangleemusic.local',
            password: 'User@123456!',
            options: { data: { full_name: '🎵 Bạn Bè HoangLee' } },
          });

          if (signUpData.user) {
            setUser(signUpData.user);
            setProfile(userProfile);
            localStorage.setItem(STORAGE_LOCAL_USER_KEY, JSON.stringify(userProfile));
            return signUpData.user;
          }
        } catch {
          // Fallback local
        }
      }

      setUser(userProfile);
      setProfile(userProfile);
      localStorage.setItem(STORAGE_LOCAL_USER_KEY, JSON.stringify(userProfile));
      return userProfile;
    }

    // 3. TÀI KHOẢN SUPABASE THƯỜNG
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
