/**
 * 세션 데이터 타입 정의
 */
export interface SessionData {
  before_emotion?: number;
  after_emotion?: number;
  bgm_id?: string;
  routine_mode?: string;
  selected_steps?: string[];
  voice_guide_enabled?: boolean;
  satisfaction?: number;
  reuse_intention?: boolean;
  status?: 'completed' | 'aborted';
  completed_at?: string; // ISO timestamp
}

