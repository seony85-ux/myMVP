import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/client';

/**
 * GET /api/bgms
 * BGM 데이터를 가져옵니다.
 */
export async function GET(request: NextRequest) {
  try {
    // supabaseAdmin 클라이언트 확인
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client is not available' },
        { status: 500 }
      );
    }

    // bgms 테이블에서 데이터 조회
    const { data, error } = await supabaseAdmin
      .from('bgms')
      .select('id, name, description, audio_url, image_url')
      .order('id', { ascending: true });

    // 에러 처리
    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bgms', details: error.message },
        { status: 500 }
      );
    }

    // audio_url 유효성 검증 및 로깅
    const validatedData = (data || []).map((bgm) => {
      const audioUrl = bgm.audio_url;
      
      // null, undefined, 빈 문자열 체크
      if (!audioUrl || audioUrl.trim() === '') {
        console.warn(`[bgms API] audio_url이 비어있음: id=${bgm.id}`);
        return { ...bgm, audio_url: '', _url_valid: false };
      }

      // URL 형식 검증 (https://로 시작하는지 확인)
      const isValidUrl = audioUrl.startsWith('https://') || audioUrl.startsWith('http://');
      if (!isValidUrl) {
        console.warn(`[bgms API] 잘못된 URL 형식: id=${bgm.id}, url=${audioUrl}`);
        return { ...bgm, audio_url: audioUrl, _url_valid: false };
      }

      // 디버깅을 위해 유효한 URL 로깅 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        console.log(`[bgms API] 유효한 URL: id=${bgm.id}, url=${audioUrl}`);
      }

      return { ...bgm, audio_url: audioUrl, _url_valid: true };
    });

    // 유효하지 않은 URL이 있는지 로깅
    const invalidUrls = validatedData.filter((b: any) => !b._url_valid);
    if (invalidUrls.length > 0) {
      console.warn(`[bgms API] ${invalidUrls.length}개의 유효하지 않은 audio_url 발견:`, 
        invalidUrls.map((b: any) => ({ id: b.id, audio_url: b.audio_url }))
      );
    } else {
      console.log(`[bgms API] 총 ${validatedData.length}개의 BGM 로드 완료 (모든 URL 유효)`);
    }

    // _url_valid 메타데이터 제거 (클라이언트에 전달하지 않음)
    const result = validatedData.map(({ _url_valid, ...rest }) => rest);

    // 성공 응답
    return NextResponse.json(
      { data: result },
      { status: 200 }
    );
  } catch (error) {
    // 예외 처리
    console.error('API error:', error);
    
    // 기타 에러
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

