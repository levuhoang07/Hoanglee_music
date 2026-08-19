import { useState, useEffect, useCallback } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '../core/supabase/client';
import { UserProfile } from '../types/cloud';

const STORAGE_ROOM_KEY = 'auratunes_room_code';

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

    if (!supabase) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        setProfile({
          id: currentUser.id,
          email: currentUser.email || '',
          displayName: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'HoangLee Member',
          currentRoomCode: roomCode,
        });
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Lỗi kiểm tra phiên đăng nhập:', err);
    } finally {
      setLoading(false);
    }
  }, [roomCode]);

  useEffect(() => {
    checkSession();

    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        const u = session?.user || null;
        setUser(u);
        if (u) {
          setProfile({
            id: u.id,
            email: u.email || '',
            displayName: u.user_metadata?.full_name || u.email?.split('@')[0] || 'HoangLee Member',
            currentRoomCode: roomCode,
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

  // Sign In with Email
  const signIn = async (email: string, pass: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Chưa cấu hình kết nối Supabase Cloud.');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) throw error;
    setUser(data.user);
    return data.user;
  };

  // Sign Up
  const signUp = async (email: string, pass: string, displayName: string) => {
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
