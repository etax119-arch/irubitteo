---
name: codex-review
description: Claude의 구현 계획을 OpenAI Codex CLI로 외부 리뷰합니다.
disable-model-invocation: true
argument-hint: "[선택사항: 플랜 파일 경로]"
---

# Codex CLI 외부 리뷰

Claude 플랜모드에서 작성한 구현 계획을 OpenAI Codex CLI로 리뷰합니다.

## 워크플로우

아래 7단계를 순서대로 실행하세요.

### Step 1 — 플랜 파일 결정

- **인수가 있으면**: 해당 경로를 플랜 파일로 사용
- **인수가 없으면**: Bash로 최신 플랜 파일 탐색

```bash
ls -t ~/.claude/plans/*.md 2>/dev/null | head -1
```

- 결과가 비어있으면 사용자에게 안내 후 **종료**:

> 플랜 파일을 찾을 수 없습니다. 먼저 계획 모드에서 플랜을 작성하거나, 파일 경로를 인수로 지정하세요.
> 예: `/codex-review ~/.claude/plans/my-plan.md`

### Step 2 — Codex CLI 존재 확인

Bash로 확인:

```bash
/opt/homebrew/bin/codex --version
```

실패 시 안내 후 **종료**:

> Codex CLI가 설치되어 있지 않습니다. 아래 명령어로 설치하세요:
> ```
> npm install -g @openai/codex
> ```
> 설치 후 `codex login`으로 인증을 완료하세요.

### Step 3 — 플랜 파일 읽기

Read 도구로 플랜 파일 내용을 확인합니다.

- 비어있으면 "플랜 파일이 비어있습니다." 안내 후 **종료**
- **200줄 초과 시**: 처음 200줄만 사용하고 사용자에게 잘림을 알립니다:

> 플랜이 200줄을 초과하여 처음 200줄만 리뷰에 전달합니다.

### Step 4 — Codex exec 실행

Bash로 실행 (timeout: 120초):

```bash
/opt/homebrew/bin/codex exec \
  -s read-only \
  -C /Users/hyson/irubitteo/irubitteo \
  --ephemeral \
  -o /tmp/codex-review-output.md \
  "다음 구현 계획을 검토해줘. 오버엔지니어링 하지 마.

$(cat <PLAN_FILE_PATH>)"
```

- `<PLAN_FILE_PATH>`를 Step 1에서 결정한 실제 경로로 대체
- `-s read-only`: 읽기 전용 샌드박스 (코드 수정 불가, 안전)
- `-C`: 프로젝트 디렉토리 (Codex가 코드베이스 참조 가능)
- `--ephemeral`: 세션 미저장
- `-o`: 결과를 임시 파일로 출력

**에러 처리:**
- 타임아웃 시: "Codex 실행이 120초를 초과했습니다. 네트워크 상태를 확인하거나 플랜을 줄여서 다시 시도하세요."
- 인증 에러 (exit code ≠ 0, 출력에 "auth" 또는 "token" 포함): "`codex login`으로 인증을 갱신하세요."
- 기타 에러: 에러 메시지를 그대로 표시

### Step 5 — 결과 읽기

Read 도구로 `/tmp/codex-review-output.md`를 읽습니다.

- 파일이 없거나 비어있으면: "Codex 실행 결과를 가져오지 못했습니다. Step 4의 에러를 확인하세요."

### Step 6 — 리뷰 결과 표시

읽은 내용을 아래 형식으로 표시:

```
## Codex 리뷰 결과

<Codex 출력 내용>

---

**다음 단계:**
- 피드백을 반영하여 계획을 수정하려면 수정 사항을 알려주세요
- 피드백을 무시하고 현재 계획대로 진행하려면 "진행해줘"라고 입력하세요
- 다른 플랜을 리뷰하려면 `/codex-review <파일경로>`를 실행하세요
```

### Step 7 — 임시 파일 정리

Bash로 정리:

```bash
rm -f /tmp/codex-review-output.md
```
