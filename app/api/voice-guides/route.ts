import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/client';

/**
 * GET /api/voice-guides
 * 루틴 단계별 음성 가이드 데이터를 가져옵니다.
 * order_index 기준으로 정렬하여 반환합니다.
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

    // voice_guides 테이블에서 데이터 조회 (order_index 기준 정렬)
    const { data, error } = await supabaseAdmin
      .from('voice_guides')
      .select('step_id, audio_url, silence_after, order_index')
      .order('order_index', { ascending: true });

    // 에러 처리
    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch voice guides', details: error.message },
        { status: 500 }
      );
    }

    // audio_url 유효성 검증 및 로깅
    const validatedData = (data || []).map((guide) => {
      const audioUrl = guide.audio_url;
      
      // null, undefined, 빈 문자열 체크
      if (!audioUrl || audioUrl.trim() === '') {
        console.warn(`[voice-guides API] audio_url이 비어있음: step_id=${guide.step_id}`);
        return { ...guide, audio_url: '', _url_valid: false };
      }

      // URL 형식 검증 (https://로 시작하는지 확인)
      const isValidUrl = audioUrl.startsWith('https://') || audioUrl.startsWith('http://');
      if (!isValidUrl) {
        console.warn(`[voice-guides API] 잘못된 URL 형식: step_id=${guide.step_id}, url=${audioUrl}`);
        return { ...guide, audio_url: audioUrl, _url_valid: false };
      }

      // 디버깅을 위해 유효한 URL 로깅 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        console.log(`[voice-guides API] 유효한 URL: step_id=${guide.step_id}, url=${audioUrl}`);
      }

      return { ...guide, audio_url: audioUrl, _url_valid: true };
    });

    // 유효하지 않은 URL이 있는지 로깅
    const invalidUrls = validatedData.filter((g: any) => !g._url_valid);
    if (invalidUrls.length > 0) {
      console.warn(`[voice-guides API] ${invalidUrls.length}개의 유효하지 않은 audio_url 발견:`, 
        invalidUrls.map((g: any) => ({ step_id: g.step_id, audio_url: g.audio_url }))
      );
    } else {
      console.log(`[voice-guides API] 총 ${validatedData.length}개의 음성 가이드 로드 완료 (모든 URL 유효)`);
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

