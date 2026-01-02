-- ============================================================================
-- Initial Database Setup
-- ============================================================================
-- 이 파일은 모든 초기 데이터베이스 스키마와 데이터를 설정합니다.
-- idempotent하게 작성되어 있어 여러 번 실행해도 안전합니다.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. 테이블 생성
-- ----------------------------------------------------------------------------

-- Create bgms table
CREATE TABLE IF NOT EXISTS bgms (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    audio_url TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create voice_guides table
-- 루틴 단계별 음성 가이드 파일 정보를 저장하는 테이블
CREATE TABLE IF NOT EXISTS voice_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    step_id VARCHAR NOT NULL UNIQUE,
    audio_url TEXT NOT NULL,
    silence_after INTEGER DEFAULT 0,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP DEFAULT NOW(),
    before_emotion INTEGER,
    after_emotion INTEGER,
    bgm_id VARCHAR,
    routine_mode VARCHAR,
    selected_steps TEXT[],
    voice_guide_enabled BOOLEAN,
    satisfaction INTEGER,
    reuse_intention BOOLEAN,
    status VARCHAR CHECK (status IN ('completed', 'aborted')),
    completed_at TIMESTAMP,
    CONSTRAINT fk_bgm FOREIGN KEY (bgm_id) REFERENCES bgms(id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 2. 인덱스 생성
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_bgm_id ON sessions(bgm_id);
CREATE INDEX IF NOT EXISTS idx_voice_guides_order_index ON voice_guides(order_index);
CREATE INDEX IF NOT EXISTS idx_voice_guides_step_id ON voice_guides(step_id);

-- ----------------------------------------------------------------------------
-- 3. 테이블 및 컬럼 코멘트 추가
-- ----------------------------------------------------------------------------

COMMENT ON TABLE bgms IS 'BGM 정보를 저장하는 테이블';
COMMENT ON TABLE voice_guides IS '루틴 단계별 음성 가이드 파일 정보를 저장하는 테이블';
COMMENT ON TABLE sessions IS '명상 세션 정보를 저장하는 테이블';

COMMENT ON COLUMN voice_guides.step_id IS '루틴 단계 ID (예: intro1, toner2 등)';
COMMENT ON COLUMN voice_guides.audio_url IS 'Supabase Storage에 저장된 음성 파일 URL';
COMMENT ON COLUMN voice_guides.silence_after IS '음성 재생 후 침묵 시간 (밀리초)';
COMMENT ON COLUMN voice_guides.order_index IS '루틴 재생 순서 (낮을수록 먼저 재생)';

COMMENT ON COLUMN sessions.before_emotion IS '명상 전 감정 점수';
COMMENT ON COLUMN sessions.after_emotion IS '명상 후 감정 점수';
COMMENT ON COLUMN sessions.selected_steps IS '선택된 스킨케어 단계 배열';
COMMENT ON COLUMN sessions.status IS '세션 상태: completed 또는 aborted';

-- ----------------------------------------------------------------------------
-- 4. 초기 데이터 삽입 (voice_guides)
-- ----------------------------------------------------------------------------

-- voice_guides 초기 데이터 삽입 (최종 URL 포함)
-- ON CONFLICT를 사용하여 step_id가 이미 존재하면 업데이트, 없으면 삽입
INSERT INTO voice_guides (step_id, audio_url, silence_after, order_index)
VALUES
    ('intro1', 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/intro1.mp3', 0, 0),
    ('intro2', 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/intro2.mp3', 0, 1),
    ('toner1', 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/toner1.mp3', 0, 2),
    ('toner2', 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/toner2.mp3', 0, 3),
    ('essence1', 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/essence1.mp3', 0, 4),
    ('essence2', 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/essence2.mp3', 0, 5),
    ('cream1', 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/cream1.mp3', 0, 6),
    ('cream2', 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/cream2.mp3', 0, 7),
    ('finish1', 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/finish1.mp3', 0, 8),
    ('finish2', 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/finish2.mp3', 0, 9)
ON CONFLICT (step_id) DO UPDATE SET
    audio_url = EXCLUDED.audio_url,
    silence_after = EXCLUDED.silence_after,
    order_index = EXCLUDED.order_index;

-- ----------------------------------------------------------------------------
-- 5. 초기 데이터 삽입 (bgms)
-- ----------------------------------------------------------------------------

-- bgms 초기 데이터 삽입
-- ON CONFLICT를 사용하여 id가 이미 존재하면 업데이트, 없으면 삽입
INSERT INTO bgms (id, name, description, audio_url, image_url)
VALUES
    ('bgm2', '명상 음악', '차분한 피아노 선율', 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/bgm/piano.mp3', '/images/piano.webp'),
    ('bgm3', '바다의 파도', '평온한 파도 소리', 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/bgm/waves.mp3', '/images/sea.webp')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    audio_url = EXCLUDED.audio_url,
    image_url = EXCLUDED.image_url;

