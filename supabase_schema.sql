-- ==============================================================================
-- SCHEMA CƠ SỞ DỮ LIỆU SUPABASE CHO HOANGLEE MUSIC (AURATUNES CLOUD)
-- Hướng dẫn: Mở Supabase Dashboard -> Vào mục "SQL Editor" -> Dán toàn bộ mã này -> Bấm "Run"
-- ==============================================================================

-- 1. Bật Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tạo Bảng Phòng Nghe Chung (Shared Rooms / Groups)
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL, -- Mã phòng ngắn, ví dụ: 'HOANGLEE', 'CHILLVIBE'
    name TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tạo Bảng Hồ Sơ Người Dùng (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    current_room_code TEXT DEFAULT 'DEFAULT',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tạo Bảng Bài Hát Đám Mây (Cloud Tracks)
CREATE TABLE IF NOT EXISTS public.tracks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT,
    duration NUMERIC NOT NULL DEFAULT 0,
    file_size BIGINT,
    mime_type TEXT DEFAULT 'audio/mpeg',
    storage_path TEXT NOT NULL,
    stream_url TEXT,
    uploader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    uploader_name TEXT DEFAULT 'Thành viên',
    room_code TEXT NOT NULL DEFAULT 'DEFAULT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tạo Bảng Danh Sách Phát Đám Mây (Cloud Playlists)
CREATE TABLE IF NOT EXISTS public.playlists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    track_ids JSONB DEFAULT '[]'::jsonb,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    room_code TEXT NOT NULL DEFAULT 'DEFAULT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) - BẢO MẬT DỮ LIỆU
-- ==============================================================================
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

-- Cho phép đọc/ghi công khai hoặc theo user đăng nhập cho các phòng chung
CREATE POLICY "Public read tracks" ON public.tracks FOR SELECT USING (true);
CREATE POLICY "Authenticated insert tracks" ON public.tracks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can delete own tracks" ON public.tracks FOR DELETE USING (auth.uid() = uploader_id OR uploader_id IS NULL);

CREATE POLICY "Public read playlists" ON public.playlists FOR SELECT USING (true);
CREATE POLICY "Authenticated insert playlists" ON public.playlists FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own playlists" ON public.playlists FOR UPDATE USING (true);
CREATE POLICY "Users can delete own playlists" ON public.playlists FOR DELETE USING (true);

CREATE POLICY "Public read rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Authenticated insert rooms" ON public.rooms FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ==============================================================================
-- 6. TẠO STORAGE BUCKET LƯU TRỮ FILE NHẠC
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('music_files', 'music_files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Access Audio Files" ON storage.objects FOR SELECT USING (bucket_id = 'music_files');
CREATE POLICY "Authenticated Upload Audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'music_files');
CREATE POLICY "Authenticated Delete Audio" ON storage.objects FOR DELETE USING (bucket_id = 'music_files');

-- Tự động thêm profile khi có user đăng ký mới
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, current_room_code)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 'DEFAULT');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
