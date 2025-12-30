-- Create bgms table
CREATE TABLE IF NOT EXISTS bgms (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    audio_url TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create meditation_texts table
CREATE TABLE IF NOT EXISTS meditation_texts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    step_name VARCHAR NOT NULL,
    text TEXT NOT NULL,
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
CREATE INDEX IF NOT EXISTS idx_meditation_texts_order_index ON meditation_texts(order_index);

-- Add comments for documentation
COMMENT ON TABLE bgms IS 'BGM 정보를 저장하는 테이블';
COMMENT ON TABLE meditation_texts IS '명상 텍스트 단계별 정보를 저장하는 테이블';
COMMENT ON TABLE sessions IS '명상 세션 정보를 저장하는 테이블';

COMMENT ON COLUMN sessions.before_emotion IS '명상 전 감정 점수';
COMMENT ON COLUMN sessions.after_emotion IS '명상 후 감정 점수';
COMMENT ON COLUMN sessions.selected_steps IS '선택된 스킨케어 단계 배열';
COMMENT ON COLUMN sessions.status IS '세션 상태: completed 또는 aborted';

