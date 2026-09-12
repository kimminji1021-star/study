# JD기업교육 상담 랜딩 + 관리자

성인 직무·커리어 교육 상담 신청을 받는 원페이지 랜딩과, 접수 건을 응대·관리하는 관리자 페이지입니다.
[BRD](../../BRD_온라인교육_랜딩페이지.md) / [PRD](../../PRD_온라인교육_랜딩페이지.md) 기준으로 구현했고, 디자인은 `JD기업교육 랜딩페이지.dc.html` 시안을 따릅니다.

- **앱**: Next.js 16 (App Router) · React 19 · Tailwind CSS v4
- **DB**: 로컬 Supabase(Docker)의 Postgres, Prisma로 스키마·쿼리 관리
- **인증**: Supabase Auth 이메일 로그인 + `admin_users` 등재 확인

## 사전 준비

- Node.js 20 이상, pnpm
- Docker Desktop 실행 중

## 최초 셋업

```bash
pnpm install

# 1. 로컬 Supabase 스택 기동 (Postgres/Auth/Studio)
pnpm supabase:start

# 2. 출력된 anon key / service_role key 를 .env 에 채운다
cp .env.example .env

# 3. 스키마 반영
pnpm db:migrate

# 4. 관리자 계정 생성
pnpm admin:create admin@example.com 'your-password' '이수진'

# 5. 샘플 상담 신청 (선택)
pnpm db:seed

# 6. 개발 서버
pnpm dev
```

- 랜딩: http://localhost:3000
- 관리자: http://localhost:3000/admin
- Supabase Studio: http://127.0.0.1:55323

키를 다시 확인하려면 `pnpm supabase:status`, 스택을 내리려면 `pnpm supabase:stop`.

> Supabase 기본 포트(54321~54324)는 Windows의 Hyper-V 예약 구간(54261–54360)과 겹쳐 바인딩에 실패합니다.
> 그래서 `supabase/config.toml` 의 포트를 553xx 대로 옮겨 두었습니다.

## 구조

| 경로 | 역할 |
| --- | --- |
| `src/lib/site-content.ts` | 랜딩 카피·커리큘럼·강사·FAQ. 발주사 콘텐츠가 오면 여기부터 교체 (BRD C2) |
| `src/lib/consultation-schema.ts` | 폼 검증 규칙·상태값·라벨·전화번호 포맷. 클라이언트/서버 공용 |
| `src/lib/consultation-query.ts` | 목록·건수·CSV가 공유하는 필터 조건 |
| `src/app/api/consultations/route.ts` | 상담 접수 API (중복 차단·허니팟) |
| `src/app/admin/` | 목록·상세·상태 변경·메모·논리 삭제 |
| `src/app/api/admin/consultations/export/` | 현재 필터 조건 CSV 내보내기 |
| `src/lib/supabase/session.ts` | 세션 갱신 + `/admin` 접근 차단 (`src/proxy.ts` 에서 호출) |
| `prisma/schema.prisma` | `consultation_requests`, `consultation_history`, `admin_users` |

## 상담 상태값 (PRD 6.4)

`NEW(접수) → IN_PROGRESS(연락중) → NO_ANSWER(부재중) / DONE(상담완료) → CONVERTED(등록) / HOLD(보류) / CLOSED(종료)`

상태를 바꾸면 `consultation_history` 에 변경 전/후와 변경자가 함께 기록됩니다.

## 접근 제어

- `src/proxy.ts`(Next 16의 미들웨어 대체 규약)는 **로그인 여부만** 확인합니다.
- 실제 권한은 서버 액션의 `requireAdmin()` 이 `admin_users` 등재 여부로 판단합니다.
- 세 테이블 모두 RLS가 켜져 있고 정책이 없습니다. Supabase anon/authenticated 키로는 읽을 수 없고, Prisma 직결로만 접근합니다.

## 구현된 PRD 항목

랜딩 F-L-01~F-L-10, 폼 F-F-01~F-F-08, 관리자 F-A-01·02·04~17.
검수 기준은 AC-01~AC-06, AC-08~AC-11 을 로컬에서 확인했습니다.

## 아직 안 된 것

| 항목 | 메모 |
| --- | --- |
| GA4 실제 연동 | `src/lib/analytics.ts` 가 `window.gtag` 호출만 하고 있습니다. 측정 ID를 받아 스크립트를 심어야 이벤트가 실제로 전송됩니다 (PRD 9.1) |
| 엑셀(xlsx) | 현재는 CSV(UTF-8 BOM)로 내보냅니다. Excel에서 바로 열리지만 진짜 xlsx가 필요하면 별도 라이브러리가 필요합니다 (F-A-12) |
| F-A-03 로그인 시도 제한 | 클라이언트 측 5회 제한만 있습니다. 서버 측 차단은 Supabase Auth 설정으로 보강해야 합니다 |
| 후기 슬라이더 (F-L-06) | 그리드로 처리했습니다. 모바일 스와이프는 미구현 |
| AC-07 인앱 브라우저 테스트 | 카카오톡·인스타그램 인앱 브라우저 검증은 실기기에서 해야 합니다 |
| AC-12 LCP 측정 | Hero 이미지가 아직 플레이스홀더라 실측 전입니다 |
| 실제 콘텐츠 | 성과 수치·후기·강사 정보·사업자 정보가 모두 시안용 예시입니다 |
| 개인정보 문안 | 발주사 개인정보처리방침과 일치시켜야 합니다 (PRD 5.4 / OI-1) |
