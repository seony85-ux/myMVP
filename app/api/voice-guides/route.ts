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

    // 성공 응답
    return NextResponse.json(
      { data: data || [] },
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

