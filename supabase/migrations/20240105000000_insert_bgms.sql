-- Insert BGM data
-- BGM 초기 데이터 삽입

INSERT INTO bgms (id, name, description, audio_url, image_url)
VALUES
    ('bgm2', '명상 음악', '차분한 피아노 선율', 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/bgm/piano.mp3', '/images/piano.webp'),
    ('bgm3', '바다의 파도', '평온한 파도 소리', 'https://iuuzjngznrlivozmoftc.supabase.co/storage/v1/object/public/bgm/waves.mp3', '/images/sea.webp')
ON CONFLICT (id) DO UPDATE SET
    audio_url = EXCLUDED.audio_url,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url;

