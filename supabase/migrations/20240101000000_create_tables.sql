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
    step_id VARCHAR NOT NULL,
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_bgm_id ON sessions(bgm_id);
CREATE INDEX IF NOT EXISTS idx_voice_guides_order_index ON voice_guides(order_index);
CREATE INDEX IF NOT EXISTS idx_voice_guides_step_id ON voice_guides(step_id);

-- Add comments for documentation
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

