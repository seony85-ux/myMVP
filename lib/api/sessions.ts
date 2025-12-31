import { SessionData } from '@/types/session';

/**
 * 세션 생성 API 응답 타입
 */
interface CreateSessionResponse {
  id: string;
}

/**
 * 세션을 생성하고 세션 ID를 반환합니다.
 * 
 * @param data - 세션 데이터
 * @returns 생성된 세션의 ID
 * @throws 요청이 실패한 경우 에러를 throw합니다.
 */
export async function createSession(data: SessionData): Promise<string> {
  // completed_at이 제공되지 않은 경우 현재 시각으로 설정
  const sessionData: SessionData = {
    ...data,
    completed_at: data.completed_at || new Date().toISOString(),
  };

  try {
    const response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });

    // 응답이 성공하지 않은 경우 에러 throw
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: 'Failed to create session',
      }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    // 응답에서 세션 ID 추출
    const result: CreateSessionResponse = await response.json();
    return result.id;
  } catch (error) {
    // 네트워크 에러 또는 기타 에러 처리
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while creating session');
  }
}


