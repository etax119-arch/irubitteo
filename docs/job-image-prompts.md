# 직무 카드 일러스트 프롬프트 (gpt-image-2)

`RecommendedJobsSection`의 직무 카드 아이콘(`public/images/jobs/job-*.png`)을 생성할 때 쓰는 프롬프트입니다.
기존 12장(`job-1.png` ~ `job-12.png`)과 **같은 스타일**로 이어 붙이는 것이 목적입니다.

> 배경 이미지 프롬프트는 [`hero-image-prompts.md`](hero-image-prompts.md) 참고.

---

## 현재 필요한 이미지

| 카드 | `id` | 서브 텍스트 | 상태 |
|------|------|-------------|------|
| 미술 | `art` | 달력 제작, 삽화 그림 | ❌ 미생성 (lucide `Paintbrush` 아이콘으로 임시 대체) |
| 홍보물 제작 | `promo-goods` | 홍보 물품 제작 업무 | ❌ 미생성 (lucide `Gift` 아이콘으로 임시 대체) |

생성 후 `public/images/jobs/`에 저장하고 `app/_components/RecommendedJobsSection.tsx`의 해당 항목에
`image`, `imageAlt` 필드만 추가하면 아이콘 대신 렌더됩니다.

```ts
{ id: 'art', title: '미술', example: '달력 제작, 삽화 그림', icon: Paintbrush,
  image: '/images/jobs/job-6.png', imageAlt: '미술 일러스트 — 달력과 붓' },
```

> 파일명은 비어 있는 `job-6.png`(구 번역), `job-12.png`(구 회계) 자리를 재사용하면 됩니다. 기존 파일은 덮어쓰세요.

---

## 공통 스타일 규칙 (모든 프롬프트에 이미 포함되어 있음)

- **플랫 벡터 일러스트** — 외곽선 없음, 그라디언트 없음, 그림자 없음, 단색 면으로만 구성
- 배경은 따뜻한 아이보리 `#FDFBF7` 단색으로 꽉 채움 (투명 배경 ❌)
- 팔레트는 4색으로 제한: 오렌지 `#DF8F4B` / 크림 `#F2E3CC` / 웜브라운 `#8A6A4B` / 아이보리 `#FDFBF7`
- 오브젝트는 **1~2개**만, 화면 정중앙에 배치
- ⚠️ **원형 크롭 안전영역** — 카드에서 `rounded-full`로 잘려 나가므로, 오브젝트는 정사각형에 내접하는 **원 안에** 들어와야 하고 사방 여백을 15% 이상 둡니다. 네 모서리는 배경만 남깁니다.
- 살짝 기울인 대각선 배치로 생동감 (기존 `job-4` 확성기 / `job-10` 팔레트와 동일한 리듬)
- 텍스트·숫자·로고·워터마크 없음
- 사이즈: **1024 x 1024 (square)** 로 생성 후 256px로 리사이즈

---

## 1. 미술 — 달력 + 삽화

> 서브 텍스트가 "달력 제작, 삽화 그림"이므로 **달력 + 그림 도구**를 한 화면에 담습니다.
> 기존 `job-10`(디자인 = 팔레트+붓)과 겹치지 않도록, 붓은 보조로 두고 **달력을 주인공**으로 잡습니다.

```
A flat vector illustration of a standing desk calendar with a small hand-painted picture on its page, and a paintbrush resting diagonally across it.

Style: minimal flat design, solid fills only, no outlines, no gradients, no drop shadows, no texture. Simple geometric shapes with softly rounded corners. Childlike warmth but clean and professional, like a modern app icon.

Subject: an open easel-style calendar seen from the front. The calendar page shows a tiny simple painted scene — two rounded hills and a round sun — drawn in flat shapes, with no numbers, no letters and no grid lines. A single paintbrush with a warm brown wooden handle and an orange ferrule lies diagonally from the lower left toward the upper right, its tip touching the calendar page.

Composition: one centered cluster on a plain background, occupying about 70% of the frame. Generous empty margins on all four sides — the entire subject fits inside a circle inscribed in the square, and all four corners are empty background. Slight diagonal tilt for liveliness.

Color palette: exactly four colors — warm ivory background (#FDFBF7), cream (#F2E3CC) for the calendar page, warm orange (#DF8F4B) as the main accent, and warm brown (#8A6A4B) for the darkest shapes. Orange is used for the largest accent area, brown only for small details.

Avoid: outlines, strokes, black lines, gradients, shadows, 3D, glossy highlights, realistic rendering, photographic detail, any text, numbers, letters, calendar grid, logos, watermarks, human hands, transparent background, cool colors, gray, blue.
```

---

## 2. 홍보물 제작 — 에코백 + 텀블러

> "홍보 물품 제작 업무" = 굿즈 제작. 기존 `job-4`(홍보 마케팅 = 확성기)와 구분되도록
> **실물 굿즈**를 보여줍니다.

```
A flat vector illustration of promotional merchandise: a canvas tote bag standing next to a tumbler cup.

Style: minimal flat design, solid fills only, no outlines, no gradients, no drop shadows, no texture. Simple geometric shapes with softly rounded corners. Clean modern app-icon look.

Subject: a cream-colored tote bag with two rounded handles, standing upright and facing the viewer, with a simple abstract mark printed on it — a single filled circle with a small rounded ray shape beside it, purely geometric, absolutely no letters or numbers. A slightly shorter orange tumbler with a brown lid stands overlapping the right side of the bag, slightly in front.

Composition: one centered cluster of two objects on a plain background, occupying about 70% of the frame. Generous empty margins on all four sides — the entire subject fits inside a circle inscribed in the square, and all four corners are empty background. The two objects overlap gently so they read as one silhouette.

Color palette: exactly four colors — warm ivory background (#FDFBF7), cream (#F2E3CC) for the tote bag, warm orange (#DF8F4B) for the tumbler and the printed mark, and warm brown (#8A6A4B) for the lid and handles.

Avoid: outlines, strokes, black lines, gradients, shadows, 3D, glossy highlights, realistic rendering, photographic detail, any text, letters, numbers, brand logos, watermarks, human hands, transparent background, cool colors, gray, blue.
```

---

## 생성 후 체크리스트

- [ ] 배경이 **투명이 아니라** 아이보리 단색인가 (투명이면 카드 원형 안이 흰색으로 뜸)
- [ ] 오브젝트가 원 안에 들어오는가 — 정사각형을 원형으로 크롭했을 때 잘리는 부분이 없는지 확인
- [ ] 외곽선·그림자·그라디언트가 섞이지 않았는가 (기존 12장은 전부 완전 플랫)
- [ ] 글자·숫자가 섞여 들어가지 않았는가 (달력·굿즈는 특히 잘 생김)
- [ ] 기존 `job-4`, `job-10`과 나란히 놓았을 때 채도·명도가 튀지 않는가
- [ ] 256 x 256 정사각형으로 리사이즈했는가

### 결과가 아직 부족할 때 덧붙일 문장

| 증상 | 덧붙일 문장 |
|------|-------------|
| 외곽선이 생김 | `Absolutely no outlines or strokes of any kind — shapes are defined only by flat color fills touching each other.` |
| 입체감·그림자가 생김 | `Completely flat, zero depth. No shading, no shadow, no highlight, no gradient. Every shape is one single solid color.` |
| 글자가 들어감 | `The illustration must contain zero written characters — no letters, no numbers, no symbols resembling text, in any language.` |
| 색이 탁하거나 어두움 | `Bright, high-key, low-contrast. The ivory background is very light and the overall image feels airy and soft.` |
| 오브젝트가 너무 큼 | `Zoom out. The subject occupies only 65% of the frame with wide empty margins on all sides.` |

---

## 새 직무 카드를 추가할 때 (템플릿)

아래 `{ }` 부분만 바꿔서 쓰면 기존 12장과 톤이 맞습니다.

```
A flat vector illustration of {오브젝트 1~2개, 예: a magnifying glass over a bar chart}.

Style: minimal flat design, solid fills only, no outlines, no gradients, no drop shadows, no texture. Simple geometric shapes with softly rounded corners. Clean modern app-icon look.

Composition: one centered cluster on a plain background, occupying about 70% of the frame. Generous empty margins on all four sides — the entire subject fits inside a circle inscribed in the square, and all four corners are empty background. Slight diagonal tilt for liveliness.

Color palette: exactly four colors — warm ivory background (#FDFBF7), cream (#F2E3CC), warm orange (#DF8F4B) as the main accent, and warm brown (#8A6A4B) for the darkest shapes.

Avoid: outlines, strokes, black lines, gradients, shadows, 3D, glossy highlights, realistic rendering, photographic detail, any text, letters, numbers, logos, watermarks, human hands, transparent background, cool colors, gray, blue.
```
