-- Insert initial voice_guides data
-- 루틴 단계별 음성 가이드 초기 데이터 삽입
-- 현재는 audio_url이 빈 문자열이지만, 추후 Supabase Storage에 업로드된 URL로 업데이트 예정

INSERT INTO voice_guides (step_id, audio_url, silence_after, order_index)
VALUES
    ('intro1', '', 0, 0),
    ('intro2', '', 0, 1),
    ('toner1', '', 0, 2),
    ('toner2', '', 0, 3),
    ('essence1', '', 0, 4),
    ('essence2', '', 0, 5),
    ('cream1', '', 0, 6),
    ('cream2', '', 0, 7),
    ('finish1', '', 0, 8),
    ('finish2', '', 0, 9)
ON CONFLICT DO NOTHING;

