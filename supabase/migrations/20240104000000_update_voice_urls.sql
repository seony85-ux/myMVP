-- Update voice_guides audio_url with Supabase Storage URLs
-- 모든 루틴 단계별 음성 파일 URL 업데이트

UPDATE voice_guides 
SET audio_url = CASE 
    WHEN step_id = 'intro1' THEN 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/intro1.mp3'
    WHEN step_id = 'intro2' THEN 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/intro2.mp3'
    WHEN step_id = 'toner1' THEN 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/toner1.mp3'
    WHEN step_id = 'toner2' THEN 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/toner2.mp3'
    WHEN step_id = 'essence1' THEN 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/essence1.mp3'
    WHEN step_id = 'essence2' THEN 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/essence2.mp3'
    WHEN step_id = 'cream1' THEN 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/cream1.mp3'
    WHEN step_id = 'cream2' THEN 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/cream2.mp3'
    WHEN step_id = 'finish1' THEN 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/finish1.mp3'
    WHEN step_id = 'finish2' THEN 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/voice/finish2.mp3'
    ELSE audio_url
END
WHERE step_id IN ('intro1', 'intro2', 'toner1', 'toner2', 'essence1', 'essence2', 'cream1', 'cream2', 'finish1', 'finish2');

