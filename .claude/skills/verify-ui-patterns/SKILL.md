---
name: verify-ui-patterns
description: Raw HTML 요소 대신 공용 UI 컴포넌트 사용을 검증합니다. UI 컴포넌트 변경, 새 페이지 추가, 폼 구현 후 사용.
disable-model-invocation: true
---

# UI 컴포넌트 사용 패턴 검증

## 목적

`components/ui/`에 정의된 공용 UI 컴포넌트 대신 raw HTML 요소를 사용하는 패턴을 탐지합니다:

1. **Raw `<input>` 사용** — `<Input />` 컴포넌트 대신 `<input` 직접 사용
2. **Raw `<textarea>` 사용** — `<Textarea />` 컴포넌트 대신 `<textarea` 직접 사용
3. **Raw `<input type="checkbox">` 사용** — `<Checkbox />` 컴포넌트 대신 체크박스 직접 사용
4. **브라우저 네이티브 다이얼로그** — `confirm()`, `alert()` 직접 호출 (Modal / Toast 사용 강제)
5. **Raw styled `<button>` 사용** — `<Button />` / `<IconButton />` 대신 className이 있는 `<button` 직접 사용

## 실행 시점

- 새로운 페이지나 폼 UI를 구현한 후
- UI 컴포넌트를 수정하거나 추가한 후
- 기존 페이지를 리팩토링한 후
- PR 전 UI 패턴 준수 확인 시

## Related Files

| File | Purpose |
|------|---------|
| `components/ui/Input.tsx` | 텍스트 입력 컴포넌트 |
| `components/ui/Textarea.tsx` | 여러 줄 입력 컴포넌트 |
| `components/ui/Checkbox.tsx` | 체크박스 컴포넌트 |
| `components/ui/Button.tsx` | 버튼 컴포넌트 |
| `components/ui/IconButton.tsx` | 아이콘 버튼 컴포넌트 |
| `components/ui/Modal.tsx` | 모달 다이얼로그 컴포넌트 |
| `components/ui/Toast.tsx` | 토스트 알림 컴포넌트 |

## 워크플로우

### Step 1: Raw `<input>` 사용 탐지

**검사:** `app/` 내에서 `<input` 태그를 직접 사용하는 코드를 탐지합니다.

**도구:** Grep

```
pattern: "<input"
glob: "app/**/*.tsx"
output_mode: "content"
```

**결과 필터링:** 다음은 위반이 아닙니다 (수동 확인):
- `type="file"` — 파일 업로드는 네이티브 기능 필수
- `type="hidden"` — 숨김 필드는 대체 불가
- `type="radio"` — 대응 컴포넌트 없음
- `type="range"` — 대응 컴포넌트 없음
- `type="color"` — 대응 컴포넌트 없음

**PASS 기준:** 위 예외를 제외한 매칭 0건
**FAIL 기준:** `type="text"`, `type="password"`, `type="email"`, `type="number"`, `type="tel"`, `type="search"`, `type="url"` 또는 type 미지정 `<input`이 존재

**수정 방법:** `<input>`을 `@/components/ui/Input`의 `<Input />` 컴포넌트로 교체합니다.

### Step 2: Raw `<textarea>` 사용 탐지

**검사:** `app/` 내에서 `<textarea` 태그를 직접 사용하는 코드를 탐지합니다.

**도구:** Grep

```
pattern: "<textarea"
glob: "app/**/*.tsx"
output_mode: "content"
```

**PASS 기준:** 매칭 0건
**FAIL 기준:** `<textarea` 사용이 존재

**수정 방법:** `<textarea>`를 `@/components/ui/Textarea`의 `<Textarea />` 컴포넌트로 교체합니다.

### Step 3: Raw `<input type="checkbox">` 사용 탐지

**검사:** `app/` 내에서 `type="checkbox"` 입력을 직접 사용하는 코드를 탐지합니다.

**도구:** Grep

```
pattern: "type=\"checkbox\""
glob: "app/**/*.tsx"
output_mode: "content"
```

**PASS 기준:** 매칭 0건
**FAIL 기준:** `type="checkbox"` 사용이 존재

**수정 방법:** `<input type="checkbox">`를 `@/components/ui/Checkbox`의 `<Checkbox />` 컴포넌트로 교체합니다.

### Step 4: 브라우저 네이티브 다이얼로그 사용 탐지

**검사:** `app/` 내에서 `confirm(`, `alert(` 함수를 직접 호출하는 코드를 탐지합니다.

**도구:** Grep (2회)

```
pattern: "confirm\("
glob: "app/**/*.tsx"
output_mode: "content"
```

```
pattern: "alert\("
glob: "app/**/*.tsx"
output_mode: "content"
```

**결과 필터링:** 다음은 위반이 아닙니다 (수동 확인):
- 문자열 리터럴 내의 `confirm`, `alert` (예: 에러 메시지 텍스트)
- 변수/함수 이름의 일부 (예: `confirmModal`, `alertMessage`)

**PASS 기준:** 실제 `window.confirm()` / `window.alert()` 호출 0건
**FAIL 기준:** 브라우저 네이티브 다이얼로그 직접 호출이 존재

**수정 방법:**
- `confirm()` → `<Modal />` 컴포넌트로 확인 다이얼로그 구현
- `alert()` → `useToast()` 훅으로 토스트 알림 구현

### Step 5: Raw styled `<button>` 사용 탐지

**검사:** `app/` 내에서 `className`이 적용된 `<button` 태그를 직접 사용하는 코드를 탐지합니다.

**도구:** Grep

```
pattern: "<button[^>]*className"
glob: "app/**/*.tsx"
output_mode: "content"
```

**PASS 기준:** 매칭 0건
**FAIL 기준:** `className`이 있는 `<button` 사용이 존재

**수정 방법:** styled `<button>`을 `@/components/ui/Button`의 `<Button />` 또는 `@/components/ui/IconButton`의 `<IconButton />` 컴포넌트로 교체합니다.

## Output Format

```markdown
## verify-ui-patterns 검증 결과

| # | 검사 항목 | 결과 | 상세 |
|---|----------|------|------|
| 1 | Raw `<input>` 사용 | PASS/FAIL | N건 발견 (예외 제외) 또는 위반 없음 |
| 2 | Raw `<textarea>` 사용 | PASS/FAIL | N건 발견 또는 위반 없음 |
| 3 | Raw checkbox 사용 | PASS/FAIL | N건 발견 또는 위반 없음 |
| 4 | 네이티브 다이얼로그 | PASS/FAIL | confirm() N건, alert() N건 또는 위반 없음 |
| 5 | Raw styled `<button>` | PASS/FAIL | N건 발견 또는 위반 없음 |
```

## 예외사항

다음은 **위반이 아닙니다**:

1. **`components/ui/` 내 파일** — 컴포넌트 정의 자체이므로 raw HTML 요소 사용이 정상적임
2. **`app/playground/` 내 파일** — 개발용 테스트 페이지이므로 모든 패턴 면제
3. **`type="file"`, `type="hidden"` 입력** — 네이티브 기능이 필수이며 대체 컴포넌트가 불필요
4. **`type="radio"`, `type="range"`, `type="color"` 입력** — 대응하는 공용 컴포넌트가 없으므로 네이티브 사용이 허용됨
5. **`className` 없는 `<button>`** — 스타일이 적용되지 않은 버튼은 의도적인 네이티브 사용일 수 있음
6. **변수/함수 이름의 `confirm`, `alert`** — `confirmModal`, `alertMessage` 등 이름의 일부로 사용되는 경우는 네이티브 다이얼로그 호출이 아님
