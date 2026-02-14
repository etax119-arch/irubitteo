---
name: verify-imports
description: Import 경로 규칙을 검증합니다. app/ 내부 파일, 라우트 간 참조, barrel export 등의 import 패턴 변경 후 사용.
disable-model-invocation: true
---

# Import 경로 규칙 검증

## 목적

프로젝트의 import 경로 규칙 준수를 검증합니다:

1. **Barrel export 금지** — `index.ts`/`index.tsx` 파일을 통한 re-export 금지
2. **절대 경로 사용** — `app/` 내부에서 외부 폴더(`lib/`, `hooks/`, `components/`, `types/`) import 시 `@/` 절대 경로 사용
3. **라우트 간 cross-import 금지** — `app/admin/`, `app/company/`, `app/employee/` 간 상호 참조 금지
4. **외부 폴더 간 절대 경로** — `app/` 외부 파일(`lib/`, `hooks/`, `components/`)에서 다른 외부 폴더 import 시 `@/` 사용

## 실행 시점

- 새로운 import 문을 추가하거나 파일을 이동한 후
- 새로운 컴포넌트, 훅, 유틸리티 파일을 생성한 후
- 리팩토링으로 파일 구조가 변경된 후
- PR 전 코드 규칙 준수 확인 시

## Related Files

| File | Purpose |
|------|---------|
| `tsconfig.json` | `@/*` 경로 alias 설정 |
| `CLAUDE.md` | Import 경로 규칙 정의 (Import Paths, Naming Rules 섹션) |
| `app/**/*.ts`, `app/**/*.tsx` | 검사 대상: app 내부 파일 |
| `lib/**/*.ts` | 검사 대상: 유틸리티 파일 |
| `hooks/**/*.ts` | 검사 대상: 공용 훅 파일 |
| `components/**/*.tsx` | 검사 대상: 공용 컴포넌트 |
| `types/**/*.ts` | 검사 대상: 타입 정의 파일 |

## 워크플로우

### Step 1: Barrel export 금지 확인

**검사:** `index.ts` 또는 `index.tsx` 파일이 존재하지 않아야 합니다.

**도구:** Glob

```
pattern: "**/index.ts"
pattern: "**/index.tsx"
```

`node_modules/`, `.next/` 디렉토리는 제외합니다.

**PASS 기준:** `index.ts`/`index.tsx` 파일이 0개
**FAIL 기준:** `index.ts`/`index.tsx` 파일이 1개 이상 존재

**수정 방법:** barrel export 파일을 삭제하고, import하는 곳에서 직접 파일 경로로 변경합니다.

### Step 2: app/ 내부에서 외부 폴더 import 시 절대 경로 확인

**검사:** `app/` 하위 파일에서 `lib/`, `hooks/`, `components/`, `types/` 폴더의 파일을 import할 때 `@/` 절대 경로를 사용해야 합니다.

**도구:** Grep

```
# 상대 경로로 외부 최상위 폴더를 참조하는 import 탐지
# /(lib|hooks|components|types)/ 패턴으로 _hooks/, _components/ 제외
pattern: "from '\\.\\./.*/(?:lib|hooks|components|types)/"
glob: "app/**/*.{ts,tsx}"
```

**PASS 기준:** 매칭 결과 0건
**FAIL 기준:** 상대 경로(`../`)로 외부 폴더를 참조하는 import가 있음

**수정 방법:** `from '../../../lib/api/client'` → `from '@/lib/api/client'`

### Step 3: 라우트 간 cross-import 금지 확인

**검사:** `app/admin/`, `app/company/`, `app/employee/` 간에 서로의 내부 파일을 import하지 않아야 합니다.

**도구:** Grep (3회 실행)

```
# admin에서 company/employee 참조
pattern: "from '.*app/(company|employee)/"
path: "app/admin/"

# company에서 admin/employee 참조
pattern: "from '.*app/(admin|employee)/"
path: "app/company/"

# employee에서 admin/company 참조
pattern: "from '.*app/(admin|company)/"
path: "app/employee/"
```

**PASS 기준:** 3개 검색 모두 매칭 0건
**FAIL 기준:** 다른 라우트 폴더의 파일을 참조하는 import가 있음

**수정 방법:** 공유가 필요한 코드는 `@/components/`, `@/hooks/`, `@/lib/` 등 공용 폴더로 승격합니다.

### Step 4: app/ 외부 파일 간 import 시 절대 경로 확인

**검사:** `lib/`, `hooks/`, `components/` 폴더의 파일에서 다른 최상위 폴더를 import할 때 `@/` 절대 경로를 사용해야 합니다.

**도구:** Grep (3회 실행)

```
# hooks/ 에서 lib/, components/, types/ 참조 시 상대 경로 사용 여부
pattern: "from '\\.\\./.*(?:lib|components|types)/"
path: "hooks/"

# lib/ 에서 hooks/, components/, types/ 참조 시 상대 경로 사용 여부
pattern: "from '\\.\\./.*(?:hooks|components|types)/"
path: "lib/"

# components/ 에서 lib/, hooks/, types/ 참조 시 상대 경로 사용 여부
pattern: "from '\\.\\./.*(?:lib|hooks|types)/"
path: "components/"
```

**PASS 기준:** 3개 검색 모두 매칭 0건
**FAIL 기준:** 상대 경로로 다른 최상위 폴더를 참조하는 import가 있음

**수정 방법:** `from '../lib/cn'` → `from '@/lib/cn'`

## Output Format

```markdown
## verify-imports 검증 결과

| # | 검사 항목 | 결과 | 상세 |
|---|----------|------|------|
| 1 | Barrel export 금지 | PASS/FAIL | 발견된 파일 수 |
| 2 | app→외부 절대경로 | PASS/FAIL | 위반 파일:라인 |
| 3 | 라우트 간 cross-import | PASS/FAIL | 위반 파일:라인 |
| 4 | 외부 폴더 간 절대경로 | PASS/FAIL | 위반 파일:라인 |
```

## 예외사항

다음은 **위반이 아닙니다**:

1. **같은 라우트 폴더 내 상대 경로** — `app/admin/_components/`에서 `../_hooks/`로의 상대 경로 import는 같은 라우트 내이므로 허용
2. **같은 최상위 폴더 내 상대 경로** — `lib/api/client.ts`에서 `../query/keys.ts`로의 import는 같은 `lib/` 폴더 내이므로 허용
3. **node_modules import** — 외부 패키지 import (`from 'react'`, `from 'next/link'` 등)는 검사 대상 아님
4. **next.config.ts, eslint.config.mjs 등 루트 설정 파일** — 프로젝트 루트의 설정 파일은 일반적인 import 규칙 적용 대상이 아님
5. **`app/` 내 `page.tsx`, `layout.tsx`에서 같은 라우트의 `_components/`, `_hooks/` import** — 상대 경로 `./_components/...` 사용은 올바른 패턴
