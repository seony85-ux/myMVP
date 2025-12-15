# 프런트엔드 설계 문서

## 1. Page/Route 구조 (Next.js App Router)

### 1.1 라우트 구조
```
app/
├── page.tsx                    # 인트로 화면 (루트 경로: /)
├── setup/
│   └── page.tsx               # 루틴 설정 화면 (/setup)
├── voice-guide/
│   └── page.tsx               # 음성 가이드 설정 화면 (/voice-guide)
├── routine/
│   └── page.tsx               # 루틴 진행 화면 (/routine)
├── emotion/
│   └── page.tsx               # 감정 변화 기록 화면 (/emotion)
└── summary/
    └── page.tsx               # 결과 요약 화면 (/summary)
```

### 1.2 라우트 매핑
| 화면명 | 경로 | 설명 |
|--------|------|------|
| 인트로 화면 | `/` | 앱 진입점, 루틴 시작 진입 |
| 루틴 설정 화면 | `/setup` | 감정/BGM/스킨케어 단계 선택 |
| 음성 가이드 설정 화면 | `/voice-guide` | 음성 가이드 On/Off 선택 |
| 루틴 진행 화면 | `/routine` | 명상 + 스킨케어 자동 진행 |
| 감정 변화 기록 화면 | `/emotion` | 루틴 후 감정 상태 기록 |
| 결과 요약 화면 | `/summary` | 루틴 효과 요약 및 피드백 |

### 1.3 네비게이션 플로우
```
/ → /setup → /voice-guide → /routine → /emotion → /summary → /
```

---

## 2. 공통 레이아웃과 UI 컴포넌트 후보

### 2.1 레이아웃 컴포넌트

#### 2.1.1 MobileLayout
- **목적**: 모바일 웹 최적화 레이아웃
- **기능**:
  - 모바일 뷰포트 설정
  - 최대 너비 제한 (예: 428px)
  - 세로 스크롤 지원
  - 안전 영역(Safe Area) 고려
- **사용 위치**: 모든 페이지의 루트 레이아웃

#### 2.1.2 PageContainer
- **목적**: 페이지 콘텐츠 컨테이너
- **기능**:
  - 패딩 및 마진 관리
  - 세로 스크롤 영역 정의
  - 최소 높이 보장 (100vh)
- **사용 위치**: 모든 페이지

#### 2.1.3 SectionContainer
- **목적**: 섹션별 콘텐츠 그룹핑
- **기능**:
  - 섹션 간 간격 관리
  - 섹션 타이틀 표시
- **사용 위치**: 루틴 설정 화면의 각 섹션

---

### 2.2 UI 컴포넌트

#### 2.2.1 Button
- **목적**: 주요 액션 버튼
- **Props**:
  - `variant`: 'primary' | 'secondary' | 'danger' | 'ghost'
  - `size`: 'sm' | 'md' | 'lg'
  - `disabled`: boolean
  - `fullWidth`: boolean
  - `onClick`: () => void
- **사용 위치**: 모든 화면의 CTA 버튼
- **특징**:
  - 최소 높이 48px (터치 친화적)
  - 둥근 모서리
  - 로딩 상태 표시 가능

#### 2.2.2 EmotionSelector
- **목적**: 감정 점수 선택 (1~5)
- **Props**:
  - `value`: number | null
  - `onChange`: (value: number) => void
  - `showLabels`: boolean (점수별 의미 표시)
- **사용 위치**: 
  - 루틴 설정 화면 (섹션 1)
  - 감정 변화 기록 화면
- **UI 형태**: 이모지 또는 원형 버튼 5개

#### 2.2.3 BGMCard
- **목적**: BGM 선택 카드
- **Props**:
  - `id`: string
  - `name`: string
  - `description`: string
  - `selected`: boolean
  - `onSelect`: (id: string | null) => void
- **사용 위치**: 루틴 설정 화면 (섹션 2)
- **UI 형태**: 카드 형태, 선택 시 하이라이트

#### 2.2.4 BGMCardList
- **목적**: BGM 카드 리스트 컨테이너
- **Props**:
  - `bgms`: BGM[]
  - `selectedId`: string | null
  - `onSelect`: (id: string | null) => void
- **사용 위치**: 루틴 설정 화면 (섹션 2)

#### 2.2.5 SkincareStepToggle
- **목적**: 스킨케어 단계 개별 토글
- **Props**:
  - `step`: 'toner' | 'essence' | 'cream' | 'allinone'
  - `label`: string
  - `checked`: boolean
  - `onToggle`: (step: string, checked: boolean) => void
- **사용 위치**: 루틴 설정 화면 (섹션 3)

#### 2.2.6 SkincareStepSelector
- **목적**: 스킨케어 단계 선택 그룹
- **Props**:
  - `selectedSteps`: string[]
  - `onChange`: (steps: string[]) => void
- **사용 위치**: 루틴 설정 화면 (섹션 3)
- **기능**: 최소 1개 이상 선택 검증

#### 2.2.7 Toggle
- **목적**: On/Off 토글 버튼
- **Props**:
  - `value`: boolean
  - `onChange`: (value: boolean) => void
  - `label`: string (선택사항)
  - `size`: 'sm' | 'md' | 'lg'
- **사용 위치**: 음성 가이드 설정 화면
- **특징**: 큰 크기, 터치 친화적

#### 2.2.8 ProgressIndicator
- **목적**: 단계 진행 상태 시각화
- **Props**:
  - `steps`: string[]
  - `currentStep`: number
  - `completedSteps`: number[]
  - `variant`: 'bar' | 'dots'
- **사용 위치**: 루틴 진행 화면
- **UI 형태**: 진행 바 또는 점(dot) 인디케이터

#### 2.2.9 MeditationText
- **목적**: 명상 문장 표시
- **Props**:
  - `text`: string
  - `animate`: boolean (페이드 효과)
- **사용 위치**: 루틴 진행 화면 (중앙 영역)
- **특징**: 중앙 정렬, 큰 폰트, 페이드 전환 효과

#### 2.2.10 StepHeader
- **목적**: 현재 단계명 표시
- **Props**:
  - `stepName`: string
  - `stepNumber`: number
  - `totalSteps`: number
- **사용 위치**: 루틴 진행 화면 (상단 영역)

#### 2.2.11 Dialog / Modal
- **목적**: 확인 다이얼로그
- **Props**:
  - `open`: boolean
  - `title`: string
  - `message`: string
  - `confirmText`: string
  - `cancelText`: string
  - `onConfirm`: () => void
  - `onCancel`: () => void
- **사용 위치**: 
  - 루틴 진행 화면 (중단 확인)
  - 기타 확인이 필요한 액션

#### 2.2.12 ErrorMessage
- **목적**: 에러 메시지 표시
- **Props**:
  - `message`: string
  - `type`: 'error' | 'warning'
- **사용 위치**: 모든 화면의 검증 에러 표시

#### 2.2.13 SatisfactionSelector
- **목적**: 만족도 점수 선택 (1~5)
- **Props**:
  - `value`: number | null
  - `onChange`: (value: number) => void
- **사용 위치**: 결과 요약 화면
- **UI 형태**: EmotionSelector와 동일한 패턴

#### 2.2.14 ReuseIntentionSelector
- **목적**: 재사용 의향 선택 (Yes/No)
- **Props**:
  - `value`: boolean | null
  - `onChange`: (value: boolean) => void
- **사용 위치**: 결과 요약 화면
- **UI 형태**: Yes/No 버튼 또는 토글

#### 2.2.15 EmotionComparison
- **목적**: 감정 변화 요약 표시
- **Props**:
  - `beforeScore`: number
  - `afterScore`: number
  - `variant`: 'number' | 'graph' | 'emoji'
- **사용 위치**: 결과 요약 화면
- **기능**: 변화량 계산 및 강조 표시

---

### 2.3 오디오 관련 컴포넌트

#### 2.3.1 AudioPlayer
- **목적**: BGM 및 음성 가이드 재생
- **Props**:
  - `src`: string (오디오 파일 URL)
  - `type`: 'bgm' | 'voice'
  - `loop`: boolean (BGM용)
  - `autoPlay`: boolean
  - `onError`: () => void
- **사용 위치**: 루틴 진행 화면
- **기능**: 
  - 오디오 로딩 및 재생
  - 오류 시 텍스트 가이드로 대체

#### 2.3.2 AudioManager (Hook)
- **목적**: 오디오 재생 상태 관리
- **반환값**:
  - `playBGM`: (id: string) => void
  - `stopBGM`: () => void
  - `playVoiceGuide`: (text: string) => void
  - `isPlaying`: boolean
- **사용 위치**: 루틴 진행 화면

---

### 2.4 텍스트 컴포넌트

#### 2.4.1 Heading
- **목적**: 제목 텍스트
- **Props**:
  - `level`: 1 | 2 | 3 | 4
  - `align`: 'left' | 'center' | 'right'
- **사용 위치**: 모든 화면의 제목

#### 2.4.2 QuestionText
- **목적**: 질문 텍스트
- **Props**:
  - `text`: string
  - `align`: 'left' | 'center' | 'right'
- **사용 위치**: 질문이 있는 화면

---

## 3. 전역 상태로 관리해야 할 값 목록

### 3.1 세션 상태 (Session State)

#### 3.1.1 세션 기본 정보
```typescript
{
  sessionId: string | null;           // 세션 고유 ID (서버 생성)
  createdAt: Date | null;             // 세션 생성 시간
  status: 'idle' | 'setup' | 'active' | 'completed' | 'cancelled';
}
```

#### 3.1.2 루틴 설정 정보
```typescript
{
  // 감정 상태
  beforeEmotion: number | null;       // 루틴 전 감정 점수 (1~5)
  afterEmotion: number | null;        // 루틴 후 감정 점수 (1~5)
  
  // BGM 설정
  bgmId: string | null;               // 선택된 BGM ID (null = 없음)
  
  // 스킨케어 단계
  selectedSteps: string[];            // 선택된 단계 배열 ['toner', 'essence', ...]
  
  // 음성 가이드 설정
  voiceGuideEnabled: boolean;         // 음성 가이드 사용 여부 (기본값: true)
}
```

#### 3.1.3 루틴 진행 정보
```typescript
{
  // 진행 상태
  currentStepIndex: number;            // 현재 진행 중인 단계 인덱스
  currentStepName: string | null;      // 현재 단계명
  currentMeditationText: string | null; // 현재 명상 문장
  startedAt: Date | null;              // 루틴 시작 시간
  completedAt: Date | null;            // 루틴 완료 시간
  
  // 단계별 정보
  stepProgress: {
    stepName: string;
    startedAt: Date;
    completedAt: Date | null;
    duration: number;                  // 소요 시간 (초)
  }[];
}
```

#### 3.1.4 피드백 정보
```typescript
{
  satisfaction: number | null;         // 만족도 점수 (1~5)
  reuseIntention: boolean | null;       // 재사용 의향 (true/false)
}
```

---

### 3.2 UI 상태 (UI State)

#### 3.2.1 로딩 상태
```typescript
{
  isLoading: boolean;                  // 전역 로딩 상태
  loadingMessage: string | null;       // 로딩 메시지
}
```

#### 3.2.2 에러 상태
```typescript
{
  error: {
    message: string;
    type: 'validation' | 'network' | 'audio' | 'save';
    retryable: boolean;
  } | null;
}
```

#### 3.2.3 다이얼로그 상태
```typescript
{
  dialog: {
    open: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
  } | null;
}
```

---

### 3.3 오디오 상태 (Audio State)

#### 3.3.1 오디오 재생 상태
```typescript
{
  bgm: {
    id: string | null;
    isPlaying: boolean;
    volume: number;                    // 0~1
  };
  voiceGuide: {
    isPlaying: boolean;
    currentText: string | null;
  };
  audioError: {
    type: 'bgm' | 'voice';
    message: string;
  } | null;
}
```

---

### 3.4 데이터 상태 (Data State)

#### 3.4.1 마스터 데이터
```typescript
{
  bgms: BGM[];                         // BGM 목록
  meditationTexts: {
    [stepName: string]: string[];       // 단계별 명상 문장 배열
  };
  stepConfigs: {
    name: string;
    label: string;
    order: number;
    defaultDuration: number;           // 기본 소요 시간 (초)
  }[];
}
```

---

### 3.5 상태 관리 전략

#### 3.5.1 전역 상태 관리 라이브러리
- **추천**: Zustand 또는 React Context API
- **이유**: 
  - 가벼운 상태 관리
  - TypeScript 지원
  - 세션 데이터 중심의 단순한 상태 구조

#### 3.5.2 상태 분리 전략
- **세션 상태**: 전역 상태 (Zustand Store)
- **UI 상태**: 전역 상태 (다이얼로그, 에러 등)
- **오디오 상태**: 전역 상태 또는 Context
- **마스터 데이터**: 서버에서 가져와서 전역 상태에 저장 (캐싱)

#### 3.5.3 상태 초기화
- 세션 시작 시: 세션 상태 초기화
- 세션 완료 시: 세션 상태 유지 (결과 화면 표시용)
- 인트로 화면 복귀 시: 세션 상태 초기화

---

## 4. 추가 고려사항

### 4.1 라우팅 보호
- 루틴 진행 중 뒤로가기 방지 (선택사항)
- 세션 없이 루틴 진행 화면 접근 시 리다이렉트

### 4.2 데이터 영속성
- 세션 데이터는 서버에 저장
- 로컬 스토리지에 임시 저장 (네트워크 오류 대비)

### 4.3 성능 최적화
- 오디오 파일 프리로딩 (선택사항)
- 이미지 최적화
- 코드 스플리팅 (페이지별)

### 4.4 접근성
- 키보드 네비게이션 지원
- 스크린 리더 지원
- 색상 대비 준수

