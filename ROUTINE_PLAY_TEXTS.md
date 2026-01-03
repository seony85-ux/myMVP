# 루틴 실행 화면 텍스트 정리

## 📋 모든 출력 텍스트 및 출력 조건

---

## 1. 로딩 상태 텍스트

### 텍스트
**"데이터를 불러오는 중..."**

### 출력 위치
- 화면 중앙

### 출력 조건
```typescript
if (isLoadingVoiceGuides || isLoadingBgms)
```
- `isLoadingVoiceGuides === true` 또는
- `isLoadingBgms === true`일 때

### 스타일
- `text-gray-600`

---

## 2. 에러 상태 텍스트

### 텍스트 1
**"음성 가이드 데이터를 불러올 수 없습니다."**

### 출력 위치
- 화면 중앙

### 출력 조건
```typescript
if (routineSteps.length === 0)
```
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
- Detailed 모드: `'시작'`, `'토너'`, `'에센스'`, `'크림'`, `'마무리'` (selectedSteps에 따라 동적)

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
stepUiNames = ['시작', ...selectedSteps에 따른 단계명들, '마무리']
- currentStepIndex 0-1 → '시작'
- currentStepIndex 2+ → selectedSteps에 따른 단계명
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

### 출력 텍스트 (STEP_TEXTS)

#### 시작 단계
1. **"지금 이 순간, 나에게 집중해보세요."**
   - 조건: `step.id === 'intro1'`

2. **"천천히 숨을 들이쉬고 내쉬어보세요."**
   - 조건: `step.id === 'intro2'`

#### 토너 단계
3. **"지금 이 순간, 토너에 집중해보세요."**
   - 조건: `step.id === 'toner1'`

4. **"토너를 부드럽게 펴발라주세요."**
   - 조건: `step.id === 'toner2'`

#### 에센스 단계
5. **"지금 이 순간, 에센스에 집중해보세요."**
   - 조건: `step.id === 'essence1'`

6. **"에센스를 가볍게 두드려 흡수시켜주세요."**
   - 조건: `step.id === 'essence2'`

#### 크림 단계
7. **"지금 이 순간, 크림에 집중해보세요."**
   - 조건: `step.id === 'cream1'`

8. **"크림을 부드럽게 마사지하며 발라주세요."**
   - 조건: `step.id === 'cream2'`

#### 마무리 단계
9. **"오늘 하루도 수고하셨어요."**
   - 조건: `step.id === 'finish1'`

10. **"당신의 피부가 건강하게 빛나기를 바랍니다."**
    - 조건: `step.id === 'finish2'`

#### 자율 모드 (Basic 모드 전용)
11. **"자유롭게 스킨케어를 진행해보세요."**
    - 조건: `step.id === 'autonomous'` (Basic 모드에서만 나타남)

### 출력 위치
- 화면 중앙 (메인 콘텐츠 영역)

### 출력 조건
- 정상 상태일 때 항상 표시
- `currentStep.text` 값에 따라 동적으로 변경
- `displayText = currentStep.text`

### 출력 순서 (Basic 모드)
1. intro1 → "지금 이 순간, 나에게 집중해보세요."
2. intro2 → "천천히 숨을 들이쉬고 내쉬어보세요."
3. autonomous → "자유롭게 스킨케어를 진행해보세요."
4. finish1 → "오늘 하루도 수고하셨어요."
5. finish2 → "당신의 피부가 건강하게 빛나기를 바랍니다."

### 출력 순서 (Detailed 모드)
- 시작: intro1, intro2
- 선택된 단계들 (각 2개씩): toner1, toner2 / essence1, essence2 / cream1, cream2
- 마무리: finish1, finish2

### 스타일
- `text-xl sm:text-2xl text-gray-800 leading-relaxed font-medium`

---

## 5. 하단 버튼 영역

### 버튼 1: 끝내기

**텍스트:** **"끝내기"**

**출력 조건:**
```typescript
if (isLastStep)
```
- `currentStepIndex >= routineSteps.length - 1` (마지막 단계일 때)

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
if (!isLastStep)
```
- 마지막 단계가 아닐 때 항상 표시

**동작:**
- 클릭 시 `window.confirm('정말 루틴을 중단하시겠어요?')` 확인 다이얼로그 표시
- 확인 시 `/result/summary?aborted=1`로 이동

**스타일:**
- `variant="danger"` (빨간색)
- `size="lg"`
- `className="flex-1"`

---

## 6. 확인 다이얼로그 (브라우저 기본)

### 텍스트
**"정말 루틴을 중단하시겠어요?"**

### 출력 조건
```typescript
const confirmed = window.confirm('정말 루틴을 중단하시겠어요?')
```
- "중단하기" 버튼 클릭 시

### 동작
- 확인: 루틴 중단 및 `/result/summary?aborted=1`로 이동
- 취소: 다이얼로그 닫기 및 루틴 계속 진행

---

## 7. ProgressIndicator (시각적 표시, 텍스트 없음)

### 출력 조건
- 항상 표시 (정상 상태일 때)

### 기능
- 현재 단계, 완료된 단계를 점(dot)으로 표시
- `aria-label`에 텍스트 포함 (스크린 리더용):
  - `"{step} 완료"` (완료된 단계)
  - `"{step} 진행 중"` (현재 단계)
  - `"{step} 대기"` (아직 도달하지 않은 단계)

---

## 📊 텍스트 출력 조건 요약표

| 텍스트 | 출력 위치 | 출력 조건 | 항목 수 |
|--------|----------|----------|---------|
| "데이터를 불러오는 중..." | 중앙 | 로딩 중 | 1 |
| "음성 가이드 데이터를 불러올 수 없습니다." | 중앙 | 데이터 없음 | 1 |
| "다시 시작하기" | 중앙 (버튼) | 데이터 없음 | 1 |
| 단계명 (제목) | 상단 | 항상 | 3-5개 (모드별) |
| "{stepNumber} / {totalSteps}" | 상단 (부제) | 항상 | 1 |
| 명상 문장 | 중앙 | 항상 | 11개 (단계별) |
| "끝내기" | 하단 (버튼) | 마지막 단계 | 1 |
| "재개" | 하단 (버튼) | 일시중지 중 | 1 |
| "일시중지" | 하단 (버튼) | 진행 중 | 1 |
| "중단하기" | 하단 (버튼) | 진행 중 | 1 |
| "정말 루틴을 중단하시겠어요?" | 다이얼로그 | 중단 버튼 클릭 | 1 |

---

## 📝 참고사항

### 동적 텍스트
- **단계명**: `routineMode`와 `selectedSteps`에 따라 동적으로 생성됨
- **명상 문장**: `currentStepIndex`에 따라 `STEP_TEXTS`에서 선택됨
- **단계 번호**: `uiStepIndex`에 따라 계산됨

### 조건부 표시
- 버튼은 `isLastStep` 상태에 따라 "끝내기" 또는 "일시중지/재개 + 중단하기"로 전환
- 일시중지/재개 버튼은 `isPaused` 상태에 따라 전환

### 하드코딩된 텍스트
- 모든 명상 문장은 `STEP_TEXTS` 객체에 하드코딩
- 자율 모드 텍스트는 `AUTONOMOUS_TEXT` 상수로 정의
- UI 단계명은 코드에서 동적으로 생성

