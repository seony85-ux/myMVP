# 프런트엔드 설계 문서

> **관련 문서**: 
> - 텍스트 및 시간 설정: [ROUTINE_PLAY_TEXTS.md](./ROUTINE_PLAY_TEXTS.md)
> - 프로젝트 요구사항: [PRD2.md](./PRD2.md)

## 1. Page/Route 구조 (Next.js App Router)

### 1.1 라우트 구조
```
app/
├── page.tsx                    # 루트 경로: /intro로 리다이렉트
├── intro/
│   └── page.tsx               # 인트로 화면 (/intro)
├── routine/
│   ├── setup/
│   │   └── page.tsx           # 루틴 설정 화면 (/routine/setup)
│   ├── voice/
│   │   └── page.tsx           # 음성 가이드 설정 화면 (/routine/voice)
│   └── play/
│       ├── page.tsx           # 루틴 진행 화면 (/routine/play)
│       └── RoutinePlayContent.tsx
├── result/
│   ├── emotion/
│   │   └── page.tsx           # 감정 변화 기록 화면 (/result/emotion)
│   └── summary/
│       ├── page.tsx           # 결과 요약 화면 (/result/summary)
│       └── SummaryContent.tsx
└── thank-you/
    └── page.tsx               # 감사 화면 (/thank-you)
```

### 1.2 라우트 매핑
| 화면명 | 경로 | 설명 |
|--------|------|------|
| 인트로 화면 | `/intro` | 앱 진입점, 루틴 시작 진입 |
| 루틴 설정 화면 | `/routine/setup` | 감정/BGM/스킨케어 단계 선택 |
| 음성 가이드 설정 화면 | `/routine/voice` | 음성 가이드 On/Off 선택 |
| 루틴 진행 화면 | `/routine/play` | 명상 + 스킨케어 자동 진행 |
| 감정 변화 기록 화면 | `/result/emotion` | 루틴 후 감정 상태 기록 |
| 결과 요약 화면 | `/result/summary` | 루틴 효과 요약 및 피드백 |
| 감사 화면 | `/thank-you` | 루틴 완료 감사 메시지 |

### 1.3 네비게이션 플로우
```
/ → /intro → /routine/setup → /routine/voice → /routine/play → /result/emotion → /result/summary → /thank-you → /intro
```

---

## 2. 화면별 상세 설계

### 2.1 인트로 화면 (`/intro`)

#### UI 레이아웃
- **상단**: 태그라인 "잠시, 피부에만 집중하는 시간"
- **중앙**: 원형 이미지 + 안내 문구 "짧은 루틴을 시작하세요"
- **하단**: CTA 버튼 [오늘의 루틴 고르기]

#### 기술 설계
- **파일 위치**: `app/intro/page.tsx`
- **기능**: 
  - 버튼 클릭 시 `/routine/setup`으로 이동
- **사용 컴포넌트**: 
  - `AppLayout`
  - `Button` (variant="primary", size="lg", fullWidth)

---

### 2.2 루틴 설정 화면 (`/routine/setup`)

#### UI 레이아웃
- **상단**: 제목 "오늘의 루틴 설정"

**섹션 1: 감정 선택**
- 질문: "지금 기분은 어떤가요?"
- UI: 이모지 기반 1~5 점수, 선택 시 하이라이트, 라벨 표시

**섹션 2: BGM 선택**
- 제목: "배경음"
- 카드형 BGM 리스트 (2개 + 없음)
- 이미지 + 제목 + 분위기 설명 포함

**섹션 3: 루틴 모드 선택**
- 제목: "루틴 모드"
- 선택지: 기본 / 단계별 가이드 (Toggle 또는 라디오 버튼)

**섹션 4: 스킨케어 단계 선택** (루틴 모드: 단계별 가이드인 경우만 표시)
- 제목: "스킨케어 단계"
- 선택 UI: 토글 버튼 (토너 / 에센스 / 크림)
- 최소 1개 선택 필수, 미선택 시 경고 문구 표시

- **하단**: CTA 버튼 [다음]
  - 유효성 검사: 필수 항목 미선택 시 비활성화 또는 에러 메시지

#### 기술 설계
- **파일 위치**: `app/routine/setup/page.tsx`
- **상태 관리**: 
  - `emotionLevel`: 감정 점수 (1~5)
  - `bgmId`: 선택된 BGM ID
  - `routineMode`: 'basic' | 'detailed'
  - `selectedSteps`: 선택된 스킨케어 단계 배열
- **사용 컴포넌트**: 
  - `AppLayout`
  - `SectionBlock`
  - `SectionHeader`
  - `EmotionSelector`
  - `BGMCardList` / `BGMCard`
  - `RoutineModeSelector`
  - `SkincareStepSelector` / `SkincareStepToggle`
  - `CTAContainer`
  - `Button`
- **유효성 검사**: 
  - 감정 선택 필수
  - 단계별 가이드 모드일 때 스킨케어 단계 최소 1개 선택 필수

---

### 2.3 음성 가이드 설정 화면 (`/routine/voice`)

#### UI 레이아웃
- **상단**: 질문 "음성 가이드를 들으시겠어요?"
- **중앙**: On/Off 토글 (기본값: On)
  - 토글 아래 상태별 설명 표시
- **하단**: CTA 버튼 [루틴 시작]

#### 기술 설계
- **파일 위치**: `app/routine/voice/page.tsx`
- **상태 관리**: 
  - `voiceGuideEnabled`: boolean (기본값: true)
- **사용 컴포넌트**: 
  - `AppLayout`
  - `ToggleSwitch`
  - `CTAContainer`
  - `Button`
- **기능**: 
  - 토글 변경 시 `setVoiceGuideEnabled` 호출
  - 버튼 클릭 시 `/routine/play`로 이동

---

### 2.4 루틴 진행 화면 (`/routine/play`)

#### UI 레이아웃
- **상단**: 
  - 현재 단계명 (예: "에센스 단계")
  - 단계 번호 표시 (예: "2 / 5")
- **진행 상태 시각화**: 점(dot) 인디케이터 (완료, 현재 단계 구분)
- **중앙**: 
  - 현재 명상 문구 (전환 시 페이드 효과 가능)
  - 추가 마음챙김 단계: "잠시 더 머물러요" 제목 및 시간 표시
- **하단**: 
  - 마지막 단계: [끝내기] 버튼
  - 진행 중: [일시중지]/[재개] 버튼 및 [중단하기] 버튼 (나란히 배치)
  - 추가 마음챙김 단계에서도 일시중지/재개 및 중단하기 버튼 표시

**추가 마음챙김 단계 (extra_mindfulness)**
- **조건**: finish1 단계 완료 후, 감정 상태에 따라 표시
  - neutral (기분 3): 30초
  - bad (기분 1-2): 60초
  - good (기분 4-5): 표시 안 됨
- **UI**: 
  - 제목: "잠시 더 머물러요"
  - 설명: "{N}초 동안 지금의 감각과 호흡을 이어갑니다."
  - 자동으로 finish2로 전환

**개발용 옵션 (dev=1 파라미터 시만 노출)**
- DEV 버튼: [다음 단계로], [루틴 완료], [중단]
- 화면 우측 하단에 고정 노출
- 우측 상단에 현재 설정 상태 표시 (음성 가이드, BGM)

#### 기술 설계
- **파일 위치**: 
  - `app/routine/play/page.tsx`
  - `app/routine/play/RoutinePlayContent.tsx`
- **상태 관리**: 
  - 로컬 상태: `currentStepIndex`, `phase` ('finish1_audio' | 'extra_mindfulness' | 'finish2')
  - 전역 상태: `emotionLevel`, `bgmId`, `routineMode`, `selectedSteps`, `voiceGuideEnabled`
- **사용 컴포넌트**: 
  - `AppLayout`
  - `StepHeader`
  - `ProgressIndicator`
  - `MeditationText`
  - `AudioManager`
  - `CTAContainer`
  - `Button`
- **기능**: 
  - Supabase에서 음성 가이드 및 BGM 데이터 로드
  - 단계별 자동 진행 (음성 재생 + 침묵 시간)
  - BGM 루프 재생
  - 음성 가이드 재생 (선택적)
  - 일시중지/재개 기능
  - 중단 기능 (확인 다이얼로그)
- **시간 설정**: 
  - intro1 오디오 지연: 2초
  - 음성 off 기본 대기: 3초
  - 자율 모드 지속 시간: 5초
  - 추가 마음챙김 시간: 감정 상태에 따라 30초/60초/0초

---

### 2.5 감정 변화 기록 화면 (`/result/emotion`)

#### UI 레이아웃
- **상단**: 질문 "지금 기분은 어떤가요?"
- **서브텍스트**: "이전: N점" 표시
- **중앙**: 이모지 기반 감정 점수 선택 (1~5), 라벨 포함
- **하단**: CTA 버튼 [결과 보기]
- **에러 처리**: 미선택 시 경고 표시 및 버튼 비활성화

#### 기술 설계
- **파일 위치**: `app/result/emotion/page.tsx`
- **상태 관리**: 
  - `afterEmotion`: 루틴 후 감정 점수 (1~5)
  - `beforeEmotion`: 루틴 전 감정 점수 (이전 값 표시용)
- **사용 컴포넌트**: 
  - `AppLayout`
  - `EmotionSelector`
  - `CTAContainer`
  - `Button`
- **기능**: 
  - 이전 감정 점수 표시
  - 감정 점수 선택 후 `/result/summary`로 이동

---

### 2.6 결과 요약 화면 (`/result/summary`)

#### UI 레이아웃
- **상단**: 제목 "오늘의 루틴 요약"

**섹션 1: 감정 변화**
- 숫자 비교 (예: 3 → 5), 그래픽 시각화 컴포넌트 사용

**섹션 2: 만족도 선택**
- 질문: "이번 루틴에 만족하셨나요?"
- 이모지 또는 점수(1~5) UI
- 에러 시 경고 텍스트

**섹션 3: 재사용 의향 선택**
- 질문: "다시 사용하시겠어요?"
- Yes/No 토글 또는 버튼
- 미선택 시 경고

- **하단**: CTA 버튼 [완료]
  - 모든 입력 완료 시 활성화

**중단(aborted) 세션 처리**
- URL 파라미터 `?aborted=1`에 따라 문구 또는 처리 변경

#### 기술 설계
- **파일 위치**: 
  - `app/result/summary/page.tsx`
  - `app/result/summary/SummaryContent.tsx`
- **상태 관리**: 
  - `beforeEmotion`: 루틴 전 감정 점수
  - `afterEmotion`: 루틴 후 감정 점수
  - `satisfaction`: 만족도 점수 (1~5)
  - `reuseIntention`: 재사용 의향 (boolean)
- **사용 컴포넌트**: 
  - `AppLayout`
  - `SectionBlock`
  - `SectionHeader`
  - `EmotionComparison`
  - `SatisfactionSelector`
  - `ReuseIntentionSelector`
  - `CTAContainer`
  - `Button`
- **기능**: 
  - 감정 변화 시각화
  - 만족도 및 재사용 의향 입력
  - 세션 데이터 서버 저장
  - 완료 시 `/thank-you`로 이동

---

### 2.7 감사 화면 (`/thank-you`)

#### UI 레이아웃
- **중앙**:
  - 원형 이미지
  - 메인 텍스트: "체험해주셔서 감사합니다"
  - 서브 문구: "매일 조금씩, 나에게 집중하는 순간을..."
- **하단 버튼 1**: [처음으로] → 인트로 이동
- **하단 버튼 2**: [더 알아보기] → 현재는 placeholder, 추후 연결 예정

#### 기술 설계
- **파일 위치**: `app/thank-you/page.tsx`
- **사용 컴포넌트**: 
  - `AppLayout`
  - `CTAContainer`
  - `Button`
- **기능**: 
  - 세션 상태 초기화
  - 인트로 화면으로 이동

---

## 3. 공통 레이아웃과 UI 컴포넌트

### 3.1 레이아웃 컴포넌트

#### 3.1.1 AppLayout
- **목적**: 모바일 웹 최적화 레이아웃
- **파일 위치**: `components/AppLayout.tsx`
- **Props**:
  - `children`: React.ReactNode
- **기능**:
  - 모바일 뷰포트 설정 (min-h-[100svh])
  - 최대 너비 제한 (max-w-md, 약 448px)
  - 중앙 정렬 (mx-auto)
  - 배경색 설정 (외부: gray-50, 내부: white)
- **사용 위치**: 모든 페이지의 루트 레이아웃

#### 3.1.2 CTAContainer
- **목적**: 하단 고정 CTA 버튼 컨테이너
- **파일 위치**: `components/CTAContainer.tsx`
- **Props**:
  - `children`: React.ReactNode
- **기능**:
  - 화면 하단에 고정 위치 (fixed)
  - 상단 테두리 표시
  - 최대 너비 제한 (max-w-md)
  - 패딩 관리
- **사용 위치**: 모든 페이지의 하단 버튼 영역

#### 3.1.3 SectionBlock
- **목적**: 섹션별 콘텐츠 그룹핑
- **파일 위치**: `components/SectionBlock.tsx`
- **Props**:
  - `children`: React.ReactNode
  - `className`: string (선택사항)
- **기능**:
  - 섹션 간 간격 관리 (space-y-4)
- **사용 위치**: 루틴 설정 화면, 결과 요약 화면의 각 섹션

#### 3.1.4 SectionHeader
- **목적**: 섹션 제목 및 설명 표시
- **파일 위치**: `components/SectionHeader.tsx`
- **Props**:
  - `title`: string
  - `description`: string (선택사항)
- **기능**:
  - 섹션 제목 표시
  - 선택적 설명 문구 표시
  - 하단 테두리 표시
- **사용 위치**: SectionBlock 내부에서 사용

---

### 3.2 UI 컴포넌트

#### 3.2.1 Button
- **목적**: 주요 액션 버튼
- **파일 위치**: `components/Button.tsx`
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

#### 3.2.2 EmotionSelector
- **목적**: 감정 점수 선택 (1~5)
- **파일 위치**: `components/EmotionSelector.tsx`
- **Props**:
  - `value`: number | null
  - `onChange`: (value: number) => void
  - `showLabels`: boolean (점수별 의미 표시)
- **사용 위치**: 
  - 루틴 설정 화면 (섹션 1)
  - 감정 변화 기록 화면
- **UI 형태**: 이모지 또는 원형 버튼 5개

#### 3.2.3 BGMCard
- **목적**: BGM 선택 카드
- **파일 위치**: `components/BGMCard.tsx`
- **Props**:
  - `id`: string
  - `name`: string
  - `description`: string
  - `imageUrl`: string | null
  - `selected`: boolean
  - `onSelect`: (id: string | null) => void
- **사용 위치**: 루틴 설정 화면 (섹션 2)
- **UI 형태**: 카드 형태, 선택 시 하이라이트

#### 3.2.4 BGMCardList
- **목적**: BGM 카드 리스트 컨테이너
- **파일 위치**: `components/BGMCardList.tsx`
- **Props**:
  - `bgms`: BGM[]
  - `selectedId`: string | null
  - `onSelect`: (id: string | null) => void
- **사용 위치**: 루틴 설정 화면 (섹션 2)

#### 3.2.5 SkincareStepToggle
- **목적**: 스킨케어 단계 개별 토글
- **파일 위치**: `components/SkincareStepToggle.tsx`
- **Props**:
  - `step`: 'toner' | 'essence' | 'cream'
  - `label`: string
  - `checked`: boolean
  - `onToggle`: (step: string, checked: boolean) => void
- **사용 위치**: 루틴 설정 화면 (섹션 4)

#### 3.2.6 SkincareStepSelector
- **목적**: 스킨케어 단계 선택 그룹
- **파일 위치**: `components/SkincareStepSelector.tsx`
- **Props**:
  - `selectedSteps`: string[]
  - `onChange`: (steps: string[]) => void
- **사용 위치**: 루틴 설정 화면 (섹션 4)
- **기능**: 최소 1개 이상 선택 검증

#### 3.2.7 RoutineModeSelector
- **목적**: 루틴 모드 선택 (기본 / 단계별 가이드)
- **파일 위치**: `components/RoutineModeSelector.tsx`
- **Props**:
  - `value`: 'basic' | 'detailed'
  - `onChange`: (value: 'basic' | 'detailed') => void
- **사용 위치**: 루틴 설정 화면 (섹션 3)
- **UI 형태**: 세그먼트 컨트롤 형태의 버튼 2개, 선택된 모드에 대한 설명 표시

#### 3.2.8 ToggleSwitch
- **목적**: On/Off 토글 스위치
- **파일 위치**: `components/ToggleSwitch.tsx`
- **Props**:
  - `value`: boolean
  - `onChange`: (value: boolean) => void
  - `label`: string (선택사항)
  - `size`: 'sm' | 'md' | 'lg'
  - `ariaLabel`: string (선택사항)
- **사용 위치**: 음성 가이드 설정 화면
- **특징**: 큰 크기, 터치 친화적, ON/OFF 텍스트 표시

#### 3.2.9 Toggle
- **목적**: On/Off 토글 버튼 (대체 컴포넌트)
- **파일 위치**: `components/Toggle.tsx`
- **Props**:
  - `value`: boolean
  - `onChange`: (value: boolean) => void
  - `label`: string (선택사항)
  - `size`: 'sm' | 'md' | 'lg'
- **사용 위치**: 현재 미사용 (ToggleSwitch 사용)

#### 3.2.10 ProgressIndicator
- **목적**: 단계 진행 상태 시각화
- **파일 위치**: `components/ProgressIndicator.tsx`
- **Props**:
  - `steps`: string[]
  - `currentStep`: number
  - `completedSteps`: number[]
  - `variant`: 'bar' | 'dots'
- **사용 위치**: 루틴 진행 화면
- **UI 형태**: 진행 바 또는 점(dot) 인디케이터

#### 3.2.11 MeditationText
- **목적**: 명상 문장 표시
- **파일 위치**: `components/MeditationText.tsx`
- **Props**:
  - `text`: string
  - `animate`: boolean (페이드 효과)
- **사용 위치**: 루틴 진행 화면 (중앙 영역)
- **특징**: 중앙 정렬, 큰 폰트, 페이드 전환 효과

#### 3.2.12 StepHeader
- **목적**: 현재 단계명 표시
- **파일 위치**: `components/StepHeader.tsx`
- **Props**:
  - `stepName`: string
  - `stepNumber`: number
  - `totalSteps`: number
- **사용 위치**: 루틴 진행 화면 (상단 영역)

#### 3.2.13 SatisfactionSelector
- **목적**: 만족도 점수 선택 (1~5)
- **파일 위치**: `components/SatisfactionSelector.tsx`
- **Props**:
  - `value`: number | null
  - `onChange`: (value: number) => void
- **사용 위치**: 결과 요약 화면
- **UI 형태**: EmotionSelector와 동일한 패턴

#### 3.2.14 ReuseIntentionSelector
- **목적**: 재사용 의향 선택 (Yes/No)
- **파일 위치**: `components/ReuseIntentionSelector.tsx`
- **Props**:
  - `value`: boolean | null
  - `onChange`: (value: boolean) => void
- **사용 위치**: 결과 요약 화면
- **UI 형태**: Yes/No 버튼 또는 토글

#### 3.2.15 EmotionComparison
- **목적**: 감정 변화 요약 표시
- **파일 위치**: `components/EmotionComparison.tsx`
- **Props**:
  - `beforeScore`: number
  - `afterScore`: number
  - `variant`: 'number' | 'graph' | 'emoji'
- **사용 위치**: 결과 요약 화면
- **기능**: 변화량 계산 및 강조 표시

---

### 3.3 오디오 관련 컴포넌트

#### 3.3.1 AudioManager
- **목적**: BGM 및 음성 가이드 오디오 재생 관리
- **파일 위치**: `components/AudioManager.tsx`
- **Props**:
  - `bgmUrl`: string | undefined
  - `voiceUrl`: string | undefined
  - `playVoice`: boolean (기본값: false)
  - `onError`: (error: Error) => void (선택사항)
  - `onVoiceEnded`: () => void (선택사항)
- **Ref 메서드** (useImperativeHandle):
  - `play()`: BGM 및 음성 가이드 재생
  - `pause()`: 오디오 일시정지
  - `isPlaying`: boolean (재생 중 여부)
- **사용 위치**: 루틴 진행 화면 (`app/routine/play/RoutinePlayContent.tsx`)
- **특징**:
  - BGM은 루프 재생
  - 음성 가이드는 재생 완료 시 `onVoiceEnded` 콜백 호출
  - 이미 재생 중인 경우 `currentTime`을 리셋하지 않음 (반복 방지)

---

## 4. 전역 상태 관리

### 4.1 세션 상태 (Session State)

#### 4.1.1 실제 구현된 세션 상태 구조 (Zustand Store)
**파일 위치**: `stores/sessionStore.ts`

```typescript
{
  // 루틴 설정 관련
  emotionLevel: number | null;        // 감정 점수 (1~5) - setup 화면에서 선택
  bgmId: string | null;               // 선택된 BGM ID (null = 'none'으로 변환됨)
  routineMode: 'basic' | 'detailed';  // 루틴 모드 (기본값: 'basic')
  selectedSteps: string[];            // 선택된 단계 배열 ['toner', 'essence', 'cream']
  voiceGuideEnabled: boolean;         // 음성 가이드 사용 여부 (기본값: true)
  
  // 감정 관련
  beforeEmotion: number | null;        // 루틴 전 감정 점수 (1~5)
  afterEmotion: number | null;         // 루틴 후 감정 점수 (1~5)
  
  // 피드백 관련
  satisfaction: number | null;         // 만족도 점수 (1~5)
  reuseIntention: boolean | null;      // 재사용 의향 (true/false)
  
  // Actions
  setEmotionLevel: (score: number | null) => void
  setBgmId: (id: string | null) => void
  setRoutineMode: (mode: 'basic' | 'detailed') => void
  setSelectedSteps: (steps: string[]) => void
  setVoiceGuideEnabled: (enabled: boolean) => void
  setBeforeEmotion: (score: number | null) => void
  setAfterEmotion: (score: number | null) => void
  setSatisfaction: (score: number | null) => void
  setReuseIntention: (intention: boolean | null) => void
  resetSession: () => void
}
```

**참고**: 
- 세션 상태는 Zustand의 `persist` 미들웨어를 사용하여 localStorage에 저장됨
- 세션 ID, 생성 시간 등은 현재 클라이언트 측에서 관리하지 않음 (서버 연동 시 추가 예정)
- 루틴 진행 상태(currentStepIndex 등)는 각 페이지 컴포넌트의 로컬 상태로 관리됨

---

### 4.2 상태 관리 전략

#### 4.2.1 전역 상태 관리 라이브러리
- **사용**: Zustand
- **이유**: 
  - 가벼운 상태 관리
  - TypeScript 지원
  - 세션 데이터 중심의 단순한 상태 구조
  - `persist` 미들웨어로 localStorage 자동 저장

#### 4.2.2 상태 분리 전략
- **세션 상태**: 전역 상태 (Zustand Store)
- **UI 상태**: 로컬 상태 (각 컴포넌트 내부)
- **오디오 상태**: 로컬 상태 (AudioManager 컴포넌트 내부)
- **마스터 데이터**: 서버에서 가져와서 컴포넌트 로컬 상태에 저장

#### 4.2.3 상태 초기화
- 세션 시작 시: 세션 상태 초기화
- 세션 완료 시: 세션 상태 유지 (결과 화면 표시용)
- 인트로 화면 복귀 시: 세션 상태 초기화

---

## 5. 추가 고려사항

### 5.1 라우팅 보호
- 루틴 진행 중 뒤로가기 방지 (선택사항)
- 세션 없이 루틴 진행 화면 접근 시 리다이렉트

### 5.2 데이터 영속성
- 세션 데이터는 서버에 저장
- 로컬 스토리지에 임시 저장 (네트워크 오류 대비)

### 5.3 성능 최적화
- 오디오 파일 프리로딩 (선택사항)
- 이미지 최적화
- 코드 스플리팅 (페이지별)

### 5.4 접근성
- 키보드 네비게이션 지원
- 스크린 리더 지원
- 색상 대비 준수
