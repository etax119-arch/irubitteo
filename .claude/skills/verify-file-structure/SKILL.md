---
name: verify-file-structure
description: 파일 배치 및 명명 규칙을 검증합니다. 새 파일 생성, 파일 이동, 디렉토리 구조 변경 후 사용.
disable-model-invocation: true
---

# 파일 배치/명명 규칙 검증

## 목적

프로젝트의 파일 배치 및 명명 규칙 준수를 검증합니다:

1. **컴포넌트 배치** — `app/` 내 컴포넌트가 `_components/` 디렉토리에 위치하는지 확인
2. **훅 배치** — `app/` 내 훅이 `_hooks/` 디렉토리에 위치하는지 확인
3. **명명 규칙** — 컴포넌트 PascalCase, 훅 useCamelCase, 타입 camelCase 확인
4. **`_` 접두사 규칙** — `app/` 외부에 `_` 접두사 디렉토리가 없는지 확인

## 실행 시점

- 새로운 컴포넌트, 훅, 타입 파일을 생성한 후
- 파일을 다른 디렉토리로 이동한 후
- 새로운 라우트 디렉토리를 추가한 후
- 디렉토리 구조를 리팩토링한 후

## Related Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | 명명 규칙 및 폴더 구조 정의 (Naming Rules, Folder Structure Convention) |
| `app/**/*.tsx` | 검사 대상: app 내부 컴포넌트/페이지 |
| `app/**/*.ts` | 검사 대상: app 내부 훅/유틸리티 |
| `components/**/*.tsx` | 검사 대상: 공용 컴포넌트 |
| `hooks/*.ts` | 검사 대상: 공용 훅 |
| `types/*.ts` | 검사 대상: 타입 정의 |

## 워크플로우

### Step 1: app/ 내 컴포넌트가 _components/에 위치하는지 확인

**검사:** `app/` 하위에서 PascalCase로 시작하는 `.tsx` 파일은 `_components/` 디렉토리 또는 `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` 같은 Next.js 특수 파일이어야 합니다.

**도구:** Glob + Read

```
# app/ 내 모든 .tsx 파일 탐색
pattern: "app/**/*.tsx"
```

결과에서 다음을 필터링합니다:
- `_components/` 디렉토리 내 파일 → 올바른 배치, 건너뜀
- Next.js 특수 파일 (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `template.tsx`) → 건너뜀
- 위에 해당하지 않는 PascalCase `.tsx` 파일 → FAIL

**PASS 기준:** 모든 컴포넌트 파일이 `_components/` 내에 위치
**FAIL 기준:** `app/admin/MyComponent.tsx`처럼 `_components/` 밖에 컴포넌트 파일이 있음

**수정 방법:** 컴포넌트 파일을 해당 라우트의 `_components/` 디렉토리로 이동합니다.

### Step 2: app/ 내 훅이 _hooks/에 위치하는지 확인

**검사:** `app/` 하위에서 `use`로 시작하는 `.ts` 파일은 `_hooks/` 디렉토리에 위치해야 합니다.

**도구:** Glob

```
# app/ 내 use*.ts 파일 중 _hooks/ 외부에 있는 것 탐색
pattern: "app/**/use*.ts"
```

결과에서 `_hooks/` 디렉토리 내 파일을 제외하고, 나머지가 있으면 FAIL입니다.

**PASS 기준:** 모든 `use*.ts` 파일이 `_hooks/` 내에 위치
**FAIL 기준:** `app/admin/useMyHook.ts`처럼 `_hooks/` 밖에 훅 파일이 있음

**수정 방법:** 훅 파일을 해당 라우트의 `_hooks/` 디렉토리로 이동합니다.

### Step 3: 명명 규칙 확인

**검사 3a:** 컴포넌트 파일 명명 — PascalCase.tsx

**도구:** Glob (2회 실행)

```
# app/_components/ 내 파일명 확인
pattern: "app/**/_components/*.tsx"

# components/ 내 파일명 확인
pattern: "components/**/*.tsx"
```

결과의 파일명이 PascalCase(`^[A-Z][a-zA-Z0-9]*\.tsx$`)인지 확인합니다.

**검사 3b:** 훅 파일 명명 — useCamelCase.ts

**도구:** Glob (2회 실행)

```
# app/_hooks/ 내 파일명 확인
pattern: "app/**/_hooks/*.ts"

# hooks/ 내 파일명 확인
pattern: "hooks/*.ts"
```

결과의 파일명이 `use`로 시작하는 camelCase(`^use[A-Z][a-zA-Z0-9]*\.ts$`)인지 확인합니다.

**검사 3c:** 타입 파일 명명 — camelCase.ts

**도구:** Glob

```
pattern: "types/*.ts"
```

결과의 파일명이 camelCase(`^[a-z][a-zA-Z0-9]*\.ts$`)인지 확인합니다.

**PASS 기준:** 모든 파일이 명명 규칙을 준수
**FAIL 기준:** `button.tsx` (컴포넌트인데 소문자), `UseAuth.ts` (훅인데 대문자 시작), `Employee.ts` (타입인데 PascalCase)

**수정 방법:** 파일명을 올바른 케이스로 변경합니다.

### Step 4: app/ 외부에 _ 접두사 디렉토리 없는지 확인

**검사:** `app/` 외부의 디렉토리에는 `_` 접두사를 사용하지 않아야 합니다. (`_` 접두사는 `app/` 내부에서만 사용하는 Next.js 규칙)

**도구:** Bash

```bash
# app/ 외부의 _ 접두사 디렉토리 탐색
find . -type d -name '_*' \
  -not -path './app/*' \
  -not -path './node_modules/*' \
  -not -path './.next/*' \
  -not -path './.claude/*' \
  -not -path './.git/*'
```

**PASS 기준:** 결과 0건
**FAIL 기준:** `components/_utils/`처럼 app 외부에 `_` 접두사 디렉토리가 있음

**수정 방법:** `_` 접두사를 제거하거나 `app/` 내부로 이동합니다.

## Output Format

```markdown
## verify-file-structure 검증 결과

| # | 검사 항목 | 결과 | 상세 |
|---|----------|------|------|
| 1 | 컴포넌트 _components/ 배치 | PASS/FAIL | 잘못 배치된 파일 N개 |
| 2 | 훅 _hooks/ 배치 | PASS/FAIL | 잘못 배치된 파일 N개 |
| 3a | 컴포넌트 PascalCase | PASS/FAIL | 위반 파일 N개 |
| 3b | 훅 useCamelCase | PASS/FAIL | 위반 파일 N개 |
| 3c | 타입 camelCase | PASS/FAIL | 위반 파일 N개 |
| 4 | _ 접두사 app 외부 금지 | PASS/FAIL | 위반 디렉토리 N개 |
```

## 예외사항

다음은 **위반이 아닙니다**:

1. **Next.js 특수 파일** — `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `template.tsx`는 Next.js App Router 규칙에 따라 `_components/` 밖에 있어야 함
2. **`app/` 내부의 `_utils/` 디렉토리** — `_components/`, `_hooks/` 외에 `_utils/` 디렉토리도 `app/` 내에서 허용 (예: `app/company/_utils/`)
3. **`components/ui/` 디렉토리** — 공용 UI 프리미티브 폴더로, `app/` 외부이므로 `_` 접두사 없이 사용
4. **`lib/query/QueryProvider.tsx`** — `lib/` 내 `.tsx` 파일이지만 Provider 컴포넌트로서 예외적 허용
5. **`globals.css`, `favicon.ico` 등 비-코드 파일** — `app/` 내에 있지만 `.ts`/`.tsx` 파일이 아닌 정적 자산은 검사 대상 아님
