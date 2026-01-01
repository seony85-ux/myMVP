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

