-- ==============================================================================
-- CHURCH MANAGEMENT SYSTEM - SUPABASE DATABASE SCHEMA & AUTH CONFIGURATION
-- ==============================================================================
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/lpgutiximcoluzvvaqhe/sql

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. CREATE USER PROFILES TABLE (APPROVAL & ROLES)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT DEFAULT '',
    role TEXT DEFAULT 'staff',
    status TEXT DEFAULT 'pending', -- 'approved', 'pending', 'rejected'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATE MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.members (
    id TEXT PRIMARY KEY,
    member_id TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    middle_name TEXT DEFAULT '',
    last_name TEXT NOT NULL,
    gender TEXT DEFAULT 'Male',
    dob TEXT DEFAULT '',
    blood_group TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    email TEXT DEFAULT '',
    address TEXT DEFAULT '',
    city TEXT DEFAULT 'Yabello',
    sub_city TEXT DEFAULT '',
    house_number TEXT DEFAULT '',
    marital_status TEXT DEFAULT 'Single',
    occupation TEXT DEFAULT '',
    emergency_contact_name TEXT DEFAULT '',
    emergency_contact_phone TEXT DEFAULT '',
    emergency_contact_relation TEXT DEFAULT '',
    registered_at TEXT DEFAULT CURRENT_DATE::text,
    registered_by TEXT DEFAULT 'Admin',
    status TEXT DEFAULT 'Active',
    photo TEXT DEFAULT '',
    family_id TEXT,
    family_role TEXT,
    ministry_ids JSONB DEFAULT '[]'::jsonb,
    spiritual_info JSONB DEFAULT '{
        "baptismStatus": "Unbaptized",
        "baptismDate": "",
        "salvationDate": "",
        "certificateNo": "",
        "officiatedBy": "",
        "location": "",
        "witness": ""
    }'::jsonb,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE FAMILIES TABLE
CREATE TABLE IF NOT EXISTS public.families (
    id TEXT PRIMARY KEY,
    family_name TEXT NOT NULL,
    head_member_id TEXT DEFAULT '',
    member_ids JSONB DEFAULT '[]'::jsonb,
    address TEXT DEFAULT '',
    contact_phone TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE MINISTRIES TABLE
CREATE TABLE IF NOT EXISTS public.ministries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    leader_name TEXT DEFAULT '',
    leader_contact TEXT DEFAULT '',
    meeting_schedule TEXT DEFAULT '',
    description TEXT DEFAULT '',
    badge_color TEXT DEFAULT '#2563eb',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CREATE CHURCH SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.church_settings (
    id TEXT PRIMARY KEY DEFAULT 'default_settings',
    church_name TEXT DEFAULT 'EECMY YABELLO',
    tagline TEXT DEFAULT 'Proclaiming Christ, Growing in Faith & Serving in Love',
    senior_pastor TEXT DEFAULT 'Reverend (Kes) Desta Guyo',
    address TEXT DEFAULT 'EECMY Compound, Yabello, Borana, Oromia, Ethiopia',
    phone TEXT DEFAULT '+251 46 443 0122',
    email TEXT DEFAULT 'contact@eecmy-yabello.org',
    website TEXT DEFAULT 'www.eecmy-yabello.org',
    founded_year NUMERIC DEFAULT 1978,
    statement TEXT DEFAULT 'Serving the Whole Person: Spiritual Growth, Community Love, and Holy Discipleship.',
    logo_url TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default settings
INSERT INTO public.church_settings (id, church_name, tagline, senior_pastor, address, phone, email, website, founded_year, statement)
VALUES (
    'default_settings',
    'EECMY YABELLO',
    'Proclaiming Christ, Growing in Faith & Serving in Love',
    'Reverend (Kes) Desta Guyo',
    'EECMY Compound, Yabello, Borana, Oromia, Ethiopia',
    '+251 46 443 0122',
    'contact@eecmy-yabello.org',
    'www.eecmy-yabello.org',
    1978,
    'Serving the Whole Person: Spiritual Growth, Community Love, and Holy Discipleship.'
) ON CONFLICT (id) DO NOTHING;

-- 6. TRIGGER TO AUTO-CREATE USER PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role, status)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'staff'),
        -- If user is the default admin, auto-approve, else set to pending
        CASE 
            WHEN NEW.email = 'admin@church.org' THEN 'approved'
            WHEN COALESCE(NEW.raw_user_meta_data->>'is_admin', 'false') = 'true' THEN 'approved'
            ELSE 'pending'
        END
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.user_profiles.full_name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. SEED DEFAULT ADMIN USER (Pre-confirmed, no email confirmation required)
DO $$
DECLARE
    admin_id UUID := 'a0000000-0000-0000-0000-000000000001';
BEGIN
    -- Insert into auth.users if not exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@church.org') THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            admin_id,
            'authenticated',
            'authenticated',
            'admin@church.org',
            crypt('Admin@Church2026!', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"Lead Pastor / Administrator","role":"admin","is_admin":"true"}',
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );
    END IF;

    -- Ensure profile exists and is approved
    INSERT INTO public.user_profiles (id, email, full_name, role, status)
    VALUES (
        (SELECT id FROM auth.users WHERE email = 'admin@church.org'),
        'admin@church.org',
        'Lead Pastor / Administrator',
        'admin',
        'approved'
    )
    ON CONFLICT (email) DO UPDATE
    SET status = 'approved', role = 'admin';
END $$;

-- 8. ENABLE ROW LEVEL SECURITY (RLS) & SET PERMISSIVE POLICIES
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_settings ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public full access user_profiles" ON public.user_profiles;
    CREATE POLICY "Public full access user_profiles" ON public.user_profiles FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public full access members" ON public.members;
    CREATE POLICY "Public full access members" ON public.members FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public full access families" ON public.families;
    CREATE POLICY "Public full access families" ON public.families FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public full access ministries" ON public.ministries;
    CREATE POLICY "Public full access ministries" ON public.ministries FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Public full access church_settings" ON public.church_settings;
    CREATE POLICY "Public full access church_settings" ON public.church_settings FOR ALL USING (true) WITH CHECK (true);
END $$;
