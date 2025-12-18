# Vercel 배포 가이드

## 개요
이 가이드는 GitHub 리포지토리를 Vercel에 연결하여 Next.js App Router 프로젝트를 배포하는 방법을 설명합니다.

## 배포 전략
- **Production 배포**: `main` 브랜치에 푸시 시 자동 배포
- **Preview 배포**: PR 생성 또는 다른 브랜치에 푸시 시 자동 Preview 배포

---

## 1단계: Vercel 계정 준비

### 1.1 Vercel 계정 생성
1. [Vercel 공식 사이트](https://vercel.com) 접속
2. "Sign Up" 클릭
3. GitHub 계정으로 로그인 (권장) 또는 이메일로 가입

### 1.2 GitHub 연동
- GitHub 계정으로 로그인하면 자동으로 연동됩니다
- 필요 시 Vercel 대시보드에서 GitHub 권한 설정 확인

---

## 2단계: 프로젝트 배포 설정

### 2.1 새 프로젝트 추가
1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. GitHub 리포지토리 목록에서 프로젝트 선택
3. 또는 "Import Git Repository"에서 리포지토리 URL 입력

### 2.2 프로젝트 설정

#### Framework Preset
- **Framework Preset**: `Next.js` (자동 감지됨)

#### Root Directory
- **Root Directory**: `./` (프로젝트 루트)
- 서브디렉토리에 프로젝트가 있는 경우 해당 경로 지정

#### Build and Output Settings
- **Build Command**: `npm run build` (기본값, 변경 불필요)
- **Output Directory**: `.next` (기본값, 변경 불필요)
- **Install Command**: `npm install` (기본값, 변경 불필요)

#### Environment Variables
- 이 단계에서는 건너뛰고, 3단계에서 상세 설정

---

## 3단계: 환경변수 설정

### 3.1 환경변수 목록

현재 프로젝트에서 필요한 환경변수 (Supabase 사용 시):

```bash
# Supabase 설정 (추후 구현 시 필요)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 기타 환경변수 (필요 시 추가)
# NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 3.2 환경변수 추가 방법

#### Vercel 대시보드에서 추가
1. 프로젝트 설정 페이지로 이동
2. **"Environment Variables"** 탭 클릭
3. 각 환경변수 추가:
   - **Key**: 환경변수 이름 (예: `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: 환경변수 값
   - **Environment**: 
     - Production: `main` 브랜치 배포 시 사용
     - Preview: PR/브랜치 배포 시 사용
     - Development: 로컬 개발 시 사용 (선택사항)

#### 환경별 설정 예시
```
NEXT_PUBLIC_SUPABASE_URL
├── Production: https://your-project.supabase.co
├── Preview: https://your-project.supabase.co (동일 또는 별도 프로젝트)
└── Development: http://localhost:54321 (로컬 Supabase)

NEXT_PUBLIC_SUPABASE_ANON_KEY
├── Production: [Production 키]
├── Preview: [Preview 키 또는 동일]
└── Development: [로컬 개발 키]
```

### 3.3 환경변수 확인
- 모든 환경변수는 **Production**, **Preview**, **Development**에 각각 설정 가능
- Preview 환경에서는 Production과 동일한 값 사용 또는 별도 테스트 환경 구성 가능

---

## 4단계: 브랜치별 배포 설정

### 4.1 Production 배포 (main 브랜치)
1. 프로젝트 설정 → **"Git"** 탭
2. **Production Branch**: `main` (기본값)
3. `main` 브랜치에 푸시하면 자동으로 Production 배포

### 4.2 Preview 배포 (PR/브랜치)
1. 프로젝트 설정 → **"Git"** 탭
2. **Preview Deployments**: 활성화 확인
3. PR 생성 또는 `main`이 아닌 브랜치에 푸시 시 자동 Preview 배포

### 4.3 배포 트리거
- **Production**: `main` 브랜치에 직접 푸시 또는 PR 머지
- **Preview**: 
  - PR 생성 시
  - `main`이 아닌 브랜치에 푸시 시
  - PR 업데이트 시 (재배포)

---

## 5단계: 배포 확인

### 5.1 첫 배포
1. **"Deploy"** 버튼 클릭
2. 배포 진행 상황 확인 (보통 1-3분 소요)
3. 배포 완료 후 제공되는 URL 확인:
   - Production: `https://your-project.vercel.app`
   - Preview: `https://your-project-git-branch-name.vercel.app`

### 5.2 배포 로그 확인
1. Vercel 대시보드 → **"Deployments"** 탭
2. 각 배포의 상세 로그 확인
3. 빌드 오류가 있는 경우 로그에서 확인 가능

### 5.3 도메인 설정 (선택사항)
1. 프로젝트 설정 → **"Domains"** 탭
2. 커스텀 도메인 추가 가능
3. DNS 설정 안내에 따라 도메인 연결

---

## 6단계: 자동 배포 테스트

### 6.1 Production 배포 테스트
```bash
# main 브랜치로 전환
git checkout main

# 변경사항 커밋 및 푸시
git add .
git commit -m "test: production deployment"
git push origin main
```
- Vercel 대시보드에서 자동 배포 시작 확인
- 배포 완료 후 Production URL에서 변경사항 확인

### 6.2 Preview 배포 테스트
```bash
# 새 브랜치 생성
git checkout -b test-preview-deploy

# 변경사항 커밋 및 푸시
git add .
git commit -m "test: preview deployment"
git push origin test-preview-deploy

# GitHub에서 PR 생성
```
- Vercel 대시보드에서 Preview 배포 시작 확인
- PR에 Preview URL이 자동으로 댓글로 추가됨

---

## 7단계: 배포 설정 최적화 (선택사항)

### 7.1 Build 설정 최적화
`next.config.js`에 추가 설정 (필요 시):

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 이미지 최적화 설정
  images: {
    formats: ['image/webp'],
    domains: [], // 외부 이미지 도메인 추가 시
  },
  // 환경변수 검증
  env: {
    // 클라이언트에서 접근 가능한 환경변수만 NEXT_PUBLIC_ 접두사 사용
  },
}

module.exports = nextConfig
```

### 7.2 Vercel 설정 파일 (vercel.json)
프로젝트 루트에 `vercel.json` 생성 (필요 시):

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["icn1"] // 한국 리전 (선택사항)
}
```

---

## 8단계: 문제 해결

### 8.1 빌드 실패
- **원인**: TypeScript 오류, 의존성 문제, 환경변수 누락
- **해결**: 
  1. 로컬에서 `npm run build` 실행하여 오류 확인
  2. Vercel 배포 로그에서 상세 오류 메시지 확인
  3. 환경변수 설정 확인

### 8.2 이미지 로드 실패
- **원인**: `public` 폴더 경로 문제
- **해결**: 
  - 이미지 경로가 `/images/...`로 시작하는지 확인
  - `public` 폴더가 프로젝트 루트에 있는지 확인

### 8.3 환경변수 미적용
- **원인**: 환경변수 이름 오타, 환경 선택 오류
- **해결**:
  1. 환경변수 이름 확인 (`NEXT_PUBLIC_` 접두사 확인)
  2. Production/Preview 환경별 설정 확인
  3. 배포 후 재배포 필요 (환경변수 변경 시)

---

## 환경변수 체크리스트

### 현재 프로젝트 (Supabase 미구현 상태)
- ✅ **필수 환경변수 없음** (현재 UI만 구현된 상태)

### 향후 Supabase 연동 시 필요
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (서버 사이드 전용, 클라이언트에 노출 금지)

### 환경변수 명명 규칙
- **클라이언트 접근 가능**: `NEXT_PUBLIC_` 접두사 필수
- **서버 전용**: `NEXT_PUBLIC_` 접두사 없음 (보안)

---

## 배포 워크플로우 요약

```
1. GitHub에 코드 푸시
   ↓
2. Vercel이 자동으로 감지
   ↓
3. 빌드 시작 (npm install → npm run build)
   ↓
4. 배포 완료
   ↓
5. URL 제공 (Production 또는 Preview)
```

---

## 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Vercel 환경변수 설정](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 주의사항

1. **환경변수 보안**
   - 민감한 키는 절대 코드에 커밋하지 않기
   - `NEXT_PUBLIC_` 접두사가 있는 변수는 클라이언트 번들에 포함됨

2. **빌드 시간**
   - 첫 배포는 의존성 설치로 인해 시간이 더 걸릴 수 있음
   - 이후 배포는 캐시를 활용하여 더 빠름

3. **Preview 배포 제한**
   - 무료 플랜: 월 100회 Preview 배포 제한
   - Production 배포는 무제한

4. **자동 배포 비활성화**
   - 필요 시 프로젝트 설정에서 특정 브랜치의 자동 배포 비활성화 가능

