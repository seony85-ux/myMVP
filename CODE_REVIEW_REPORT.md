# 전체 프로젝트 코드 점검 보고서

## 📋 개요
전체 프로젝트에 대한 종합적인 코드 품질 점검 결과입니다.

---

## 🔴 [오류] - 즉시 수정 필요

### 1. **오디오 이벤트 리스너 제거 로직 오류**
**위치**: `components/AudioManager.tsx:51-53, 80-81`

**문제**:
```typescript
bgmAudio.removeEventListener('error', () => {})
bgmAudio.removeEventListener('play', () => {})
bgmAudio.removeEventListener('pause', () => {})
```

**설명**: `removeEventListener`에 빈 함수 `() => {}`를 전달하면, 실제 등록된 함수와 다른 참조이므로 이벤트 리스너가 제거되지 않습니다. 메모리 누수 및 중복 이벤트 발생 가능성이 있습니다.

**수정 방법**: 원본 함수 참조를 저장하고 같은 참조로 제거해야 합니다.

---

### 2. **useEffect 의존성 배열 누락**
**위치**: `app/routine/play/RoutinePlayContent.tsx:494`

**문제**: `voiceGuideEnabled`가 useEffect 내부에서 사용되지만 의존성 배열에 포함되지 않음

**설명**: 
```typescript
// 494번째 줄 useEffect
}, [currentStepIndex, isAborted, isPaused, isLastStep, routineSteps])
// voiceGuideEnabled 누락!
```

`voiceGuideEnabled`가 변경되어도 effect가 재실행되지 않아 음성 on/off 전환이 즉시 반영되지 않을 수 있습니다.

---

### 3. **dev 모드 쿼리 파라미터 남아있음**
**위치**: `app/routine/voice/page.tsx:18`

**문제**:
```typescript
router.push('/routine/play?dev=1')
```

**설명**: dev 모드 관련 코드는 제거되었지만, voice 페이지에서 여전히 `?dev=1` 쿼리 파라미터를 전달하고 있습니다. 불필요한 파라미터입니다.

**수정**: `router.push('/routine/play')`로 변경

---

## 🟡 [경고] - 수정 권장

### 4. **불필요한 useMemo 의존성**
**위치**: `app/routine/play/RoutinePlayContent.tsx:308`

**문제**: `stepUiNames`의 useMemo에서 `selectedSteps`가 의존성 배열에 있지만, 실제로는 `routineMode`에 의해서만 결정됨

**설명**: `selectedSteps`를 의존성에 포함할 필요가 있지만, 현재 로직상 `routineMode`만으로 충분합니다. 다만 현재 코드는 정상 작동하므로 경고 수준입니다.

---

### 5. **Next.js Image 컴포넌트 미사용**
**위치**: 
- `app/intro/page.tsx:34`
- `app/thank-you/page.tsx:32`
- `components/BGMCard.tsx:39`

**문제**: `<img>` 태그를 사용하고 있음

**설명**: Next.js의 `<Image>` 컴포넌트를 사용하면 자동 최적화가 가능합니다. 성능 개선을 위해 변경 권장합니다.

---

### 6. **intro1 지연 로직의 의존성 누락**
**위치**: `app/routine/play/RoutinePlayContent.tsx:440-467`

**문제**: intro1 2초 지연 로직에서 `voiceGuideEnabled`가 의존성 배열에 없음

**설명**: `voiceGuideEnabled` 상태 변경 시 effect가 재실행되지 않을 수 있습니다. 하지만 현재 로직에서는 `currentStepIndex` 변경 시 재실행되므로 큰 문제는 없습니다.

---

### 7. **Supabase 클라이언트 환경변수 검증 부족**
**위치**: `utils/supabase/client.ts:6`

**문제**: `SUPABASE_SERVICE_ROLE_KEY`가 없어도 에러를 던지지 않음

**설명**: API 라우트에서 `supabaseAdmin`을 사용하므로, 서비스 역할 키가 없으면 API가 실패합니다. 런타임 에러보다는 빌드/초기화 시점에 검증하는 것이 좋습니다.

---

## 💡 [개선 제안] - 선택적 개선

### 8. **타입 안전성 개선**
**위치**: `app/routine/play/RoutinePlayContent.tsx`

**문제**: `RoutineStep`, `VoiceGuideData`, `BgmData` 인터페이스가 파일 내부에 정의됨

**제안**: 공통 타입은 `types/` 디렉토리로 분리하여 재사용성을 높이는 것이 좋습니다.

---

### 9. **오디오 재생 로직의 타이밍 이슈 가능성**
**위치**: `app/routine/play/RoutinePlayContent.tsx:432-467`

**문제**: intro1의 2초 지연과 음성 off 타이머가 동시에 실행될 때 타이밍 이슈 가능성

**설명**: intro1이고 음성 off일 때:
- 2초 후 `play()` 호출
- 동시에 3초 + silenceAfter 후 다음 단계로 진행

이 경우 play()가 호출되기 전에 다음 단계로 넘어갈 수 있습니다. 하지만 실제로는 intro1의 silenceAfter가 0이므로 문제없을 수 있습니다.

**제안**: 로직 검증 및 테스트 권장

---

### 10. **환경변수 문서화**
**위치**: 프로젝트 루트

**문제**: `.env.example` 파일이 없음

**제안**: 필요한 환경변수를 명시하는 `.env.example` 파일 생성 권장:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

### 11. **Supabase 마이그레이션 파일 검증**
**위치**: `supabase/migrations/`

**확인 사항**:
- ✅ 기본키, 외래키 제약조건 정상
- ✅ NOT NULL 제약조건 적절히 사용
- ✅ 인덱스 생성 적절
- ⚠️ `voice_guides` 테이블에 `step_id` UNIQUE 제약조건 없음

**설명**: `step_id`는 유니크해야 할 가능성이 높지만, 현재 중복을 허용합니다. 비즈니스 로직상 문제가 없다면 괜찮지만, 데이터 무결성을 위해 UNIQUE 제약조건 추가를 검토해볼 수 있습니다.

---

### 12. **API 에러 처리 개선**
**위치**: `app/api/**/route.ts`

**현재 상태**: 기본적인 에러 처리는 잘 되어 있음

**제안**: 
- 클라이언트에서 API 호출 실패 시 사용자에게 명확한 메시지 표시
- 재시도 로직 추가 검토

---

## ✅ 정상 동작 확인

### 상태 관리 (Zustand)
- ✅ `sessionStore.ts`: 모든 상태와 액션이 올바르게 정의됨
- ✅ persist 미들웨어 정상 사용
- ✅ 타입 정의 완전함

### API 경로
- ✅ `/api/voice-guides`: 정상 구현
- ✅ `/api/bgms`: 정상 구현
- ✅ `/api/sessions`: 정상 구현
- ✅ 클라이언트에서 올바르게 호출됨

### 컴포넌트 구조
- ✅ Props 전달 관계 정상
- ✅ Import 연결 관계 유효
- ✅ TypeScript 타입 정의 적절

### Supabase 설정
- ✅ 클라이언트 설정 정상
- ✅ 환경변수 사용 방식 일관성 있음
- ✅ API 라우트에서 supabaseAdmin 올바르게 사용

---

## 📊 페이지별 요약

### `/intro` (인트로 페이지)
- ✅ 정상 동작
- ⚠️ Image 컴포넌트 사용 권장

### `/routine/setup` (루틴 설정)
- ✅ 정상 동작
- ✅ Zustand 상태 관리 정상

### `/routine/voice` (음성 가이드 설정)
- 🔴 dev 쿼리 파라미터 제거 필요

### `/routine/play` (루틴 재생)
- ✅ 정상 동작
- 🔴 useEffect 의존성 배열 수정 필요
- ⚠️ useMemo 의존성 경고 (기능상 문제없음)

### `/result/emotion` (감정 입력)
- ✅ 정상 동작

### `/result/summary` (요약)
- ✅ 정상 동작
- ✅ 세션 저장 로직 정상

### `/thank-you` (감사 페이지)
- ✅ 정상 동작
- ⚠️ Image 컴포넌트 사용 권장

---

## 🔧 우선순위별 수정 권장사항

### 높음 (즉시 수정)
1. AudioManager.tsx의 removeEventListener 수정
2. useEffect 의존성 배열에 voiceGuideEnabled 추가
3. voice 페이지의 dev 쿼리 파라미터 제거

### 중간 (가까운 시일 내 수정)
4. Next.js Image 컴포넌트로 변경
5. 환경변수 문서화 (.env.example)

### 낮음 (선택적 개선)
6. 타입 정의 분리
7. 오디오 재생 로직 테스트 강화
8. step_id UNIQUE 제약조건 검토

---

## 📝 결론

전체적으로 코드 품질은 양호하며, 주요 기능은 정상 작동합니다. 다만 몇 가지 즉시 수정이 필요한 오류가 있습니다:
- 오디오 이벤트 리스너 메모리 누수 문제
- useEffect 의존성 배열 누락
- 남아있는 dev 모드 관련 코드

이러한 문제들을 수정하면 프로덕션 배포에 적합한 상태가 됩니다.

