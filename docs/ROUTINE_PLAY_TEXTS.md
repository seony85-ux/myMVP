# 루틴 실행 화면 텍스트 및 시간 설정 정리

> **관련 문서**: 
> - 프런트엔드 설계: [frontend-design.md](./frontend-design.md)
> - UI/UX 가이드: [wireframeguide2.md](./wireframeguide2.md)
> - 프로젝트 요구사항: [PRD2.md](./PRD2.md)

## 📋 모든 출력 텍스트 및 출력 조건

---

## 1. 로딩 상태 텍스트

### 텍스트
**"데이터를 불러오는 중..."**

### 파일 위치
- `app/routine/play/RoutinePlayContent.tsx` (711번 줄)

### 코드
```typescript
if (isLoadingVoiceGuides || isLoadingBgms) {
  return (
    <AppLayout>
      <div className="flex flex-col min-h-[100svh] items-center justify-center">
        <p className="text-gray-600">데이터를 불러오는 중...</p>
      </div>
    </AppLayout>
  )
}
```

### 출력 조건
- `isLoadingVoiceGuides === true` 또는
- `isLoadingBgms === true`일 때

### 스타일
- `text-gray-600`

---

## 2. 에러 상태 텍스트

### 텍스트 1
**"음성 가이드 데이터를 불러올 수 없습니다."**

### 파일 위치
- `app/routine/play/RoutinePlayContent.tsx` (722번 줄)

### 코드
```typescript
if (routineSteps.length === 0) {
  return (
    <AppLayout>
      <div className="flex flex-col min-h-[100svh] items-center justify-center">
        <p className="text-gray-600">음성 가이드 데이터를 불러올 수 없습니다.</p>
        <Button
          onClick={() => router.push('/routine/setup')}
          variant="primary"
          size="lg"
          className="mt-4"
        >
          다시 시작하기
        </Button>
      </div>
    </AppLayout>
  )
}
```

### 출력 조건
- `routineSteps` 배열이 비어있을 때 (음성 가이드 데이터 로드 실패 또는 데이터 없음)

### 스타일
- `text-gray-600`

### 텍스트 2 (같은 화면)
**"다시 시작하기"** (버튼)

### 출력 조건
- 위 에러 상태와 동일한 조건
- 버튼 클릭 시 `/routine/setup`으로 이동

---

## 3. 상단 헤더 영역 (StepHeader)

### 텍스트 1: 단계명 (제목)
**출력되는 값:**
- Basic 모드: `'시작'`, `'자율'`, `'마무리'`
- Detailed 모드: `'시작'`, `'토너'`, `'에센스'`, `'크림'`, `'마무리'` (selectedSteps에 따라 동적, 항상 고정 순서)

### 파일 위치
- `app/routine/play/RoutinePlayContent.tsx` (318-345번 줄)

### 코드
```typescript
const stepUiNames = useMemo(() => {
  if (routineMode === 'basic') {
    return ['시작', '자율', '마무리']
  } else {
    // detailed 모드: 항상 (토너, 에센스, 크림) 순서로 표시하되, 선택된 것만 포함
    const stepLabels: Record<string, string> = {
      'toner': '토너',
      'essence': '에센스',
      'cream': '크림',
    }
    
    // 고정된 순서: 토너, 에센스, 크림
    const fixedOrder: string[] = ['toner', 'essence', 'cream']
    
    // 항상 시작과 마무리 포함
    const names: string[] = ['시작']
    
    // fixedOrder 순서대로 선택된 단계만 추가
    fixedOrder.forEach((step) => {
      if (selectedSteps.includes(step) && stepLabels[step]) {
        names.push(stepLabels[step])
      }
    })
    
    names.push('마무리')
    return names
  }
}, [routineMode, selectedSteps])
```

### 출력 위치
- 화면 상단 중앙 (큰 제목)

### 출력 조건
- 항상 표시 (정상 상태일 때)
- `currentStepName` 값에 따라 동적으로 변경

### 계산 로직
```typescript
// Basic 모드
stepUiNames = ['시작', '자율', '마무리']
- currentStepIndex 0-1 → '시작'
- currentStepIndex 2 → '자율'
- currentStepIndex 3-4 → '마무리'

// Detailed 모드
stepUiNames = ['시작', ...선택된단계명들(고정순서), '마무리']
- currentStepIndex 0-1 → '시작'
- currentStepIndex 2+ → selectedSteps에 따른 단계명 (항상 토너, 에센스, 크림 순서)
- 마지막 2개 → '마무리'
```

### 스타일
- `text-2xl sm:text-3xl font-bold text-gray-900`

### 텍스트 2: 단계 번호
**"{stepNumber} / {totalSteps}"**

### 출력 조건
```typescript
{stepNumber && totalSteps && (
  <p>{stepNumber} / {totalSteps}</p>
)}
```
- `stepNumber`와 `totalSteps`가 모두 존재할 때

### 예시
- `"1 / 3"` (Basic 모드)
- `"2 / 5"` (Detailed 모드, selectedSteps가 3개인 경우)

### 스타일
- `text-sm text-gray-500 mt-2`

---

## 4. 중앙 명상 문장 (MeditationText)

### 출력 텍스트

#### 시작 단계

**1. intro1 - 감정 상태에 따라 동적**
- **파일 위치**: `constants/emotionUXCopy.ts` (17-31번 줄)
- **코드**:
```typescript
export const emotionUXCopy: Record<EmotionState, {
  startMessage: string
  endMessage: string
  extraMindfulnessSeconds: number
}> = {
  neutral: {
    startMessage: '지금 이 순간, 나에게 집중해보세요.',
    endMessage: '오늘 하루도 수고하셨어요.',
    extraMindfulnessSeconds: 30,
  },
  bad: {
    startMessage: '임시 문구',
    endMessage: '임시 문구',
    extraMindfulnessSeconds: 60,
  },
  good: {
    startMessage: '임시 문구',
    endMessage: '임시 문구',
    extraMindfulnessSeconds: 0,
  },
}
```
- **출력 값**:
  - neutral (기분 3): `'지금 이 순간, 나에게 집중해보세요.'`
  - bad (기분 1-2): `'임시 문구'`
  - good (기분 4-5): `'임시 문구'`
- **조건**: `step.id === 'intro1'` + `emotionState`에 따라 결정

**2. intro2**
- **파일 위치**: `app/routine/play/RoutinePlayContent.tsx` (47번 줄)
- **코드**:
```typescript
const STEP_TEXTS_BASE: Record<string, string> = {
  intro2: '천천히 숨을 들이쉬고 내쉬어보세요.',
  // ...
}
```
- **텍스트**: `"천천히 숨을 들이쉬고 내쉬어보세요."`
- **조건**: `step.id === 'intro2'`

#### 토너 단계

**3. toner1**
- **파일 위치**: `app/routine/play/RoutinePlayContent.tsx` (48번 줄)
- **코드**:
```typescript
const STEP_TEXTS_BASE: Record<string, string> = {
  toner1: '지금 이 순간, 토너에 집중해보세요.',
  // ...
}
```
- **텍스트**: `"지금 이 순간, 토너에 집중해보세요."`
- **조건**: `step.id === 'toner1'`

**4. toner2**
- **파일 위치**: `app/routine/play/RoutinePlayContent.tsx` (49번 줄)
- **코드**:
```typescript
const STEP_TEXTS_BASE: Record<string, string> = {
  toner2: '토너를 부드럽게 펴발라주세요.',
  // ...
}
```
- **텍스트**: `"토너를 부드럽게 펴발라주세요."`
- **조건**: `step.id === 'toner2'`

#### 에센스 단계

**5. essence1**
- **파일 위치**: `app/routine/play/RoutinePlayContent.tsx` (50번 줄)
- **코드**:
```typescript
const STEP_TEXTS_BASE: Record<string, string> = {
  essence1: '지금 이 순간, 에센스에 집중해보세요.',
  // ...
}
```
- **텍스트**: `"지금 이 순간, 에센스에 집중해보세요."`
- **조건**: `step.id === 'essence1'`

**6. essence2**
- **파일 위치**: `app/routine/play/RoutinePlayContent.tsx` (51번 줄)
- **코드**:
```typescript
const STEP_TEXTS_BASE: Record<string, string> = {
  essence2: '에센스를 가볍게 두드려 흡수시켜주세요.',
  // ...
}
```
- **텍스트**: `"에센스를 가볍게 두드려 흡수시켜주세요."`
- **조건**: `step.id === 'essence2'`

#### 크림 단계

**7. cream1**
- **파일 위치**: `app/routine/play/RoutinePlayContent.tsx` (52번 줄)
- **코드**:
```typescript
const STEP_TEXTS_BASE: Record<string, string> = {
  cream1: '지금 이 순간, 크림에 집중해보세요.',
  // ...
}
```
- **텍스트**: `"지금 이 순간, 크림에 집중해보세요."`
- **조건**: `step.id === 'cream1'`

**8. cream2**
- **파일 위치**: `app/routine/play/RoutinePlayContent.tsx` (53번 줄)
- **코드**:
```typescript
const STEP_TEXTS_BASE: Record<string, string> = {
  cream2: '크림을 부드럽게 마사지하며 발라주세요.',
  // ...
}
```
- **텍스트**: `"크림을 부드럽게 마사지하며 발라주세요."`
- **조건**: `step.id === 'cream2'`

#### 마무리 단계

**9. finish1 - 감정 상태에 따라 동적**
- **파일 위치**: `constants/emotionUXCopy.ts` (17-31번 줄)
- **코드**: (위 intro1과 동일한 파일 참조)
- **출력 값**:
  - neutral (기분 3): `'오늘 하루도 수고하셨어요.'`
  - bad (기분 1-2): `'임시 문구'`
  - good (기분 4-5): `'임시 문구'`
- **조건**: `step.id === 'finish1'` + `emotionState`에 따라 결정

**10. finish2**
- **파일 위치**: `app/routine/play/RoutinePlayContent.tsx` (54번 줄)
- **코드**:
```typescript
const STEP_TEXTS_BASE: Record<string, string> = {
  finish2: '당신의 피부가 건강하게 빛나기를 바랍니다.',
  // ...
}
```
- **텍스트**: `"당신의 피부가 건강하게 빛나기를 바랍니다."`
- **조건**: `step.id === 'finish2'`

#### 자율 모드 (Basic 모드 전용)

**11. autonomous**
- **파일 위치**: `app/routine/play/RoutinePlayContent.tsx` (58번 줄)
- **코드**:
```typescript
const AUTONOMOUS_TEXT = '자유롭게 스킨케어를 진행해보세요.'
```
- **텍스트**: `"자유롭게 스킨케어를 진행해보세요."`
- **조건**: `step.id === 'autonomous'` (Basic 모드에서만 나타남)

### 출력 위치
- 화면 중앙 (메인 콘텐츠 영역)

### 출력 조건
- 정상 상태일 때 항상 표시
- `currentStep.text` 값에 따라 동적으로 변경
- `displayText = currentStep.text`

### 출력 순서 (Basic 모드)
1. intro1 → `emotionUXCopy[emotionState].startMessage`
2. intro2 → "천천히 숨을 들이쉬고 내쉬어보세요."
3. autonomous → "자유롭게 스킨케어를 진행해보세요."
4. finish1 → `emotionUXCopy[emotionState].endMessage`
5. finish2 → "당신의 피부가 건강하게 빛나기를 바랍니다."

### 출력 순서 (Detailed 모드)
- 시작: intro1, intro2
- 선택된 단계들 (각 2개씩, 항상 토너→에센스→크림 순서): toner1, toner2 / essence1, essence2 / cream1, cream2
- 마무리: finish1, finish2

### 스타일
- `text-xl sm:text-2xl text-gray-800 leading-relaxed font-medium`

---

## 5. 추가 마음챙김 UI (extra_mindfulness phase)

### 텍스트 1: 제목
**"잠시 더 머물러요"**

### 파일 위치
- `app/routine/play/RoutinePlayContent.tsx` (769번 줄)

### 코드
```typescript
{phase === 'extra_mindfulness' ? (
  <div className="flex flex-col items-center justify-center text-center space-y-4">
    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
      잠시 더 머물러요
    </h2>
    <p className="text-base sm:text-lg text-gray-600 max-w-md">
      {ux.extraMindfulnessSeconds}초 동안 지금의 감각과 호흡을 이어갑니다.
    </p>
  </div>
) : (
  <MeditationText text={displayText} animate={false} />
)}
```

### 출력 조건
- `phase === 'extra_mindfulness'`일 때
- `finish1` 오디오 + `silenceAfter`가 모두 끝난 후
- `ux.extraMindfulnessSeconds > 0`일 때만 표시

### 스타일
- `text-2xl sm:text-3xl font-semibold text-gray-900`

### 텍스트 2: 설명
**"{extraMindfulnessSeconds}초 동안 지금의 감각과 호흡을 이어갑니다."**

### 파일 위치
- `app/routine/play/RoutinePlayContent.tsx` (772번 줄)

### 동적 값
- `ux.extraMindfulnessSeconds` 값에 따라 변경
- **파일 위치**: `constants/emotionUXCopy.ts` (20, 25, 30번 줄)
- **값**:
  - neutral: `30` (30초)
  - bad: `60` (60초)
  - good: `0` (0초, 이 경우 UI가 표시되지 않음)

### 출력 조건
- `phase === 'extra_mindfulness'`일 때
- `ux.extraMindfulnessSeconds > 0`일 때만 표시

### 스타일
- `text-base sm:text-lg text-gray-600 max-w-md`

---

## 6. 하단 버튼 영역

### 버튼 1: 끝내기

**텍스트:** **"끝내기"**

**출력 조건:**
```typescript
if (isLastStep && phase !== 'extra_mindfulness')
```
- `currentStepIndex >= routineSteps.length - 1` (마지막 단계일 때)
- `phase !== 'extra_mindfulness'` (추가 마음챙김 단계가 아닐 때)

**동작:**
- 클릭 시 `/result/emotion`으로 이동

**스타일:**
- `variant="primary"` (파란색)
- `size="lg"`
- `fullWidth`

---

### 버튼 2: 재개

**텍스트:** **"재개"**

**출력 조건:**
```typescript
if (isPaused && !isLastStep)
```
- `isPaused === true`이고
- 마지막 단계가 아닐 때
- `extra_mindfulness` phase에서도 표시됨

**동작:**
- 클릭 시 `setIsPaused(false)` 및 오디오 재생

**스타일:**
- `variant="primary"` (파란색)
- `size="lg"`
- `className="flex-1"`

---

### 버튼 3: 일시중지

**텍스트:** **"일시중지"**

**출력 조건:**
```typescript
if (!isPaused && !isLastStep)
```
- `isPaused === false`이고
- 마지막 단계가 아닐 때
- `extra_mindfulness` phase에서도 표시됨

**동작:**
- 클릭 시 `setIsPaused(true)` 및 오디오 일시정지

**스타일:**
- `variant="secondary"` (회색)
- `size="lg"`
- `className="flex-1"`

---

### 버튼 4: 중단하기

**텍스트:** **"중단하기"**

**출력 조건:**
```typescript
if (!isLastStep || phase === 'extra_mindfulness')
```
- 마지막 단계가 아니거나
- `extra_mindfulness` phase일 때 항상 표시

**동작:**
- 클릭 시 `window.confirm('정말 루틴을 중단하시겠어요?')` 확인 다이얼로그 표시
- 확인 시 `/result/summary?aborted=1`로 이동

**스타일:**
- `variant="danger"` (빨간색)
- `size="lg"`
- `className="flex-1"`

---

## 7. 확인 다이얼로그 (브라우저 기본)

### 텍스트
**"정말 루틴을 중단하시겠어요?"**

### 파일 위치
- `app/routine/play/RoutinePlayContent.tsx` (439번 줄)

### 코드
```typescript
const handleStop = useCallback(() => {
  const confirmed = window.confirm('정말 루틴을 중단하시겠어요?')
  // ...
}, [router])
```

### 출력 조건
- "중단하기" 버튼 클릭 시

### 동작
- 확인: 루틴 중단 및 `/result/summary?aborted=1`로 이동
- 취소: 다이얼로그 닫기 및 루틴 계속 진행

---

## 8. ProgressIndicator (시각적 표시, 텍스트 없음)

### 출력 조건
- 항상 표시 (정상 상태일 때)

### 기능
- 현재 단계, 완료된 단계를 점(dot)으로 표시
- `aria-label`에 텍스트 포함 (스크린 리더용):
  - `"{step} 완료"` (완료된 단계)
  - `"{step} 진행 중"` (현재 단계)
  - `"{step} 대기"` (아직 도달하지 않은 단계)

---

## 9. 하드코딩된 시간 설정

### 9-1. 자율 모드 지속 시간 (AUTONOMOUS_DURATION)

**파일 위치**: `app/routine/play/RoutinePlayContent.tsx` (63번 줄)

**코드**:
```typescript
// 자율 모드 시간 설정 (밀리초 단위)
// ⚙️ 시간 설정 위치: 아래 AUTONOMOUS_DURATION 값을 변경하세요
// 예: 5000 = 5초, 60000 = 1분, 120000 = 2분
const AUTONOMOUS_DURATION = 5000 // 테스트용: 5초
```

**값**: `5000` (밀리초) = **5초**

**사용 위치**:
- `app/routine/play/RoutinePlayContent.tsx` (231번 줄): 자율 단계의 `silenceAfter` 값
- `app/routine/play/RoutinePlayContent.tsx` (658번 줄): 자율 모드 자동 진행 타이머

---

### 9-2. intro1 오디오 지연 시간

**파일 위치**: `app/routine/play/RoutinePlayContent.tsx` (613번 줄)

**코드**:
```typescript
if (step.id === 'intro1') {
  const playTimer = setTimeout(() => {
    // 2초 지연 후 음성 가이드와 BGM을 함께 재생
    audioManagerRef.current?.play()
  }, 2000)
  timers.push(playTimer)
}
```

**값**: `2000` (밀리초) = **2초**

**용도**: intro1 단계에서 오디오 재생 전 대기 시간

---

### 9-3. 음성 off 시 기본 대기 시간

**파일 위치**: `app/routine/play/RoutinePlayContent.tsx` (623번 줄)

**코드**:
```typescript
if (!voiceGuideEnabled) {
  // 음성 off일 때는 기본 대기 시간(3초) + 침묵 시간 후 다음 단계로 진행
  const waitTime = 3000 + (step.silenceAfter || 0)
  const waitTimer = setTimeout(() => {
    // ...
  }, waitTime)
}
```

**값**: `3000` (밀리초) = **3초**

**용도**: 음성 가이드가 꺼져 있을 때 각 단계의 최소 표시 시간

---

### 9-4. audio_url 없는 단계의 자동 진행 시간

**파일 위치**: `app/routine/play/RoutinePlayContent.tsx` (670번 줄)

**코드**:
```typescript
// 그 외의 경우 (audio_url이 없는 다른 단계) 1초 후 다음 단계로
const timer = setTimeout(() => {
  if (routineSteps.length > 0 && currentStepIndex < routineSteps.length - 1) {
    setCurrentStepIndex((prev) => prev + 1)
  }
}, 1000) // 1초 후 다음 단계로
```

**값**: `1000` (밀리초) = **1초**

**용도**: audio_url이 없는 단계에서 자동으로 다음 단계로 진행하는 시간

---

### 9-5. 추가 마음챙김 시간 (extraMindfulnessSeconds)

**파일 위치**: `constants/emotionUXCopy.ts` (20, 25, 30번 줄)

**코드**:
```typescript
export const emotionUXCopy: Record<EmotionState, {
  startMessage: string
  endMessage: string
  extraMindfulnessSeconds: number
}> = {
  neutral: {
    extraMindfulnessSeconds: 30, // 30초
  },
  bad: {
    extraMindfulnessSeconds: 60, // 60초
  },
  good: {
    extraMindfulnessSeconds: 0, // 0초 (표시 안 됨)
  },
}
```

**값**:
- neutral (기분 3): `30` (30초)
- bad (기분 1-2): `60` (60초)
- good (기분 4-5): `0` (0초, UI가 표시되지 않음)

**사용 위치**:
- `app/routine/play/RoutinePlayContent.tsx` (559번 줄): `extra_mindfulness` phase 타이머
- `app/routine/play/RoutinePlayContent.tsx` (772번 줄): UI에 표시되는 텍스트

---

## 📊 텍스트 출력 조건 요약표

| 텍스트 | 출력 위치 | 출력 조건 | 파일 위치 | 항목 수 |
|--------|----------|----------|----------|---------|
| "데이터를 불러오는 중..." | 중앙 | 로딩 중 | RoutinePlayContent.tsx:711 | 1 |
| "음성 가이드 데이터를 불러올 수 없습니다." | 중앙 | 데이터 없음 | RoutinePlayContent.tsx:722 | 1 |
| "다시 시작하기" | 중앙 (버튼) | 데이터 없음 | RoutinePlayContent.tsx:724 | 1 |
| 단계명 (제목) | 상단 | 항상 | RoutinePlayContent.tsx:318-345 | 3-5개 (모드별) |
| "{stepNumber} / {totalSteps}" | 상단 (부제) | 항상 | StepHeader 컴포넌트 | 1 |
| 명상 문장 (intro1) | 중앙 | 항상 | emotionUXCopy.ts:18,23,28 | 3개 (감정별) |
| 명상 문장 (intro2) | 중앙 | 항상 | RoutinePlayContent.tsx:47 | 1 |
| 명상 문장 (toner1-2) | 중앙 | 항상 | RoutinePlayContent.tsx:48-49 | 2 |
| 명상 문장 (essence1-2) | 중앙 | 항상 | RoutinePlayContent.tsx:50-51 | 2 |
| 명상 문장 (cream1-2) | 중앙 | 항상 | RoutinePlayContent.tsx:52-53 | 2 |
| 명상 문장 (finish1) | 중앙 | 항상 | emotionUXCopy.ts:19,24,29 | 3개 (감정별) |
| 명상 문장 (finish2) | 중앙 | 항상 | RoutinePlayContent.tsx:54 | 1 |
| "자유롭게 스킨케어를 진행해보세요." | 중앙 | Basic 모드 | RoutinePlayContent.tsx:58 | 1 |
| "잠시 더 머물러요" | 중앙 | extra_mindfulness | RoutinePlayContent.tsx:769 | 1 |
| "{N}초 동안 지금의 감각과 호흡을 이어갑니다." | 중앙 | extra_mindfulness | RoutinePlayContent.tsx:772 | 1 |
| "끝내기" | 하단 (버튼) | 마지막 단계 | RoutinePlayContent.tsx | 1 |
| "재개" | 하단 (버튼) | 일시중지 중 | RoutinePlayContent.tsx | 1 |
| "일시중지" | 하단 (버튼) | 진행 중 | RoutinePlayContent.tsx | 1 |
| "중단하기" | 하단 (버튼) | 진행 중 | RoutinePlayContent.tsx | 1 |
| "정말 루틴을 중단하시겠어요?" | 다이얼로그 | 중단 버튼 클릭 | RoutinePlayContent.tsx:439 | 1 |

---

## 📊 시간 설정 요약표

| 시간 항목 | 값 | 단위 | 파일 위치 | 사용 위치 |
|----------|-----|------|----------|----------|
| 자율 모드 지속 시간 | 5000 | 밀리초 (5초) | RoutinePlayContent.tsx:63 | RoutinePlayContent.tsx:231,658 |
| intro1 오디오 지연 | 2000 | 밀리초 (2초) | RoutinePlayContent.tsx:613 | RoutinePlayContent.tsx:613 |
| 음성 off 기본 대기 | 3000 | 밀리초 (3초) | RoutinePlayContent.tsx:623 | RoutinePlayContent.tsx:623 |
| audio_url 없음 자동 진행 | 1000 | 밀리초 (1초) | RoutinePlayContent.tsx:670 | RoutinePlayContent.tsx:670 |
| 추가 마음챙김 (neutral) | 30 | 초 | emotionUXCopy.ts:20 | RoutinePlayContent.tsx:559,772 |
| 추가 마음챙김 (bad) | 60 | 초 | emotionUXCopy.ts:25 | RoutinePlayContent.tsx:559,772 |
| 추가 마음챙김 (good) | 0 | 초 | emotionUXCopy.ts:30 | RoutinePlayContent.tsx:559,772 |

---

## 📝 참고사항

### 동적 텍스트
- **단계명**: `routineMode`와 `selectedSteps`에 따라 동적으로 생성됨 (항상 고정 순서: 토너→에센스→크림)
- **명상 문장**: `currentStepIndex`에 따라 `STEP_TEXTS_BASE` 또는 `emotionUXCopy`에서 선택됨
- **단계 번호**: `uiStepIndex`에 따라 계산됨
- **intro1/finish1**: `emotionState`에 따라 `emotionUXCopy.ts`에서 동적으로 결정됨

### 조건부 표시
- 버튼은 `isLastStep` 상태와 `phase`에 따라 "끝내기" 또는 "일시중지/재개 + 중단하기"로 전환
- 일시중지/재개 버튼은 `isPaused` 상태에 따라 전환
- `extra_mindfulness` phase에서도 일시중지/재개 및 중단하기 버튼이 표시됨

### 하드코딩된 텍스트 위치
- **STEP_TEXTS_BASE**: `app/routine/play/RoutinePlayContent.tsx` (45-55번 줄)
  - intro1과 finish1은 제외됨 (emotionUXCopy.ts에서 관리)
- **emotionUXCopy**: `constants/emotionUXCopy.ts` (전체 파일)
  - intro1과 finish1의 감정별 텍스트 및 추가 마음챙김 시간
- **AUTONOMOUS_TEXT**: `app/routine/play/RoutinePlayContent.tsx` (58번 줄)
- **UI 단계명**: `app/routine/play/RoutinePlayContent.tsx` (318-345번 줄)에서 동적으로 생성

### 하드코딩된 시간 위치
- 모든 시간 값은 위의 "하드코딩된 시간 설정" 섹션에 상세히 정리됨
- 자율 모드 시간은 `AUTONOMOUS_DURATION` 상수로 관리
- 추가 마음챙김 시간은 `emotionUXCopy.ts`의 `extraMindfulnessSeconds`로 관리
