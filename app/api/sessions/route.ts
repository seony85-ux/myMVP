import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/client';
import { SessionData } from '@/types/session';

/**
 * POST /api/sessions
 * 세션 데이터를 Supabase에 저장
 */
export async function POST(request: NextRequest) {
  try {
    // supabaseAdmin 클라이언트 확인
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client is not available' },
        { status: 500 }
      );
    }

    // 요청 본문 파싱
    const body: SessionData = await request.json();

    // 세션 데이터 준비 (undefined 값 제거)
    // Supabase는 undefined를 null로 처리하지만, 명시적으로 undefined를 제거하는 것이 더 안전
    const sessionData: Partial<{
      before_emotion: number;
      after_emotion: number;
      bgm_id: string;
      routine_mode: string;
      selected_steps: string[];
      voice_guide_enabled: boolean;
      satisfaction: number;
      reuse_intention: boolean;
      status: 'completed' | 'aborted';
      completed_at: string;
    }> = {};

    // 정의된 값만 추가
    if (body.before_emotion !== undefined) sessionData.before_emotion = body.before_emotion;
    if (body.after_emotion !== undefined) sessionData.after_emotion = body.after_emotion;
    if (body.bgm_id !== undefined) sessionData.bgm_id = body.bgm_id;
    if (body.routine_mode !== undefined) sessionData.routine_mode = body.routine_mode;
    if (body.selected_steps !== undefined) sessionData.selected_steps = body.selected_steps;
    if (body.voice_guide_enabled !== undefined) sessionData.voice_guide_enabled = body.voice_guide_enabled;
    if (body.satisfaction !== undefined) sessionData.satisfaction = body.satisfaction;
    if (body.reuse_intention !== undefined) sessionData.reuse_intention = body.reuse_intention;
    if (body.status !== undefined) sessionData.status = body.status;
    if (body.completed_at !== undefined) sessionData.completed_at = body.completed_at;

    // Supabase에 세션 데이터 삽입
    const { data, error } = await supabaseAdmin
      .from('sessions')
      .insert([sessionData])
      .select('id')
      .single();

    // 에러 처리
    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save session', details: error.message },
        { status: 500 }
      );
    }

    // 성공 응답
    return NextResponse.json(
      { id: data.id },
      { status: 201 }
    );
  } catch (error) {
    // 예외 처리
    console.error('API error:', error);
    
    // JSON 파싱 에러인 경우
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // 기타 에러
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

