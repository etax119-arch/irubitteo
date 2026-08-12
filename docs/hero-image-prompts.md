# 랜딩 히어로 배경 이미지 프롬프트 (gpt-image-2)

> 대상 파일: `public/images/hero-bg.png`
> 사용처: `app/_components/HeroSection.tsx`

## 왜 지금 이미지가 "가을"로 읽히는가

현재 `hero-bg.png`는 앰버/골든 **단색 캐스트**(석양 역광 + 갈색빛 보케)입니다.
색상환에서 오렌지~브라운만 쓰고 한색(초록·블루) 대비가 0에 가까워서, 뇌가 자동으로 "늦가을 오후"로 해석합니다.
따뜻하지만 **정적**입니다. → 생동감을 만들려면 아래 3가지 중 하나 이상이 필요합니다.

| 레버 | 방법 |
|------|------|
| **색 대비** | 오렌지 단색 → 신록 그린/클리어 블루를 넣고 오렌지는 "액센트"로만 |
| **광원 온도** | 석양(2700K) → 아침 자연광(5600K). 골든아워를 버리는 것이 핵심 |
| **움직임** | 완전 정지된 보케 → 빛의 흐름, 사람의 동세, 흔들리는 잎 |

---

## 5개 프롬프트의 구성 전략

브랜드 톤을 바꾸지 않는 **안전한 안**부터, 인상을 크게 바꾸는 **과감한 안**까지 스펙트럼으로 배치했습니다.
클라이언트에게 1번부터 순서대로 보여주고 반응을 보는 걸 추천합니다.

| # | 방향 | 바뀌는 것 | 리스크 | 추천도 |
|---|------|-----------|--------|--------|
| 1 | **신록의 창가** | 계절만 교체 (구도 동일) | 낮음 | ★ 1순위 |
| 2 | **밝은 실내 일터** | 장소를 "일터"로 구체화 | 낮음 | ★ 2순위 |
| 3 | **추상 라이트** | 사진 → 추상 그래픽 | 낮음 (계절감 0) | 안전빵 |
| 4 | **사람과 동세** | 사람·움직임 추가 | 중간 (표현 주의) | 감성 최대 |
| 5 | **아침 출근길** | 실내 → 야외 | 중간 | 서비스 맥락 직결 |

---

## 공통 규칙 (모든 프롬프트에 이미 포함되어 있음)

- 좌측 55%는 **비워두기** (텍스트 오버레이 영역)
- 시각적 초점은 **오른쪽 1/3**
- 하이키(밝은 노출), 아이보리 `#FDFBF7`로 자연스럽게 연결
- 오렌지 `#DF8F4B`는 **작은 하이라이트로만**
- 텍스트·로고·워터마크 없음
- 사이즈: **1536 x 1024 (landscape)**

---

## 1. 신록의 창가 — 계절만 교체 ★ 1순위

> 지금 이미지와 구도·분위기를 그대로 유지하고 계절만 늦가을 → 초여름으로 바꿉니다.
> 클라이언트가 기존 시안을 승인했던 이유(부드러움, 따뜻함)를 잃지 않으면서 가을 느낌만 제거하는 가장 안전한 안입니다.

```
A high-key, airy photograph looking toward a large window on a bright late-spring morning. Fresh translucent young green leaves are backlit by clear morning sunlight, with soft round bokeh scattered across the upper right corner. Shot on a 85mm lens at f/1.4, extremely shallow depth of field, everything gently out of focus.

Composition: the left 55% of the frame is an almost empty, softly blurred wash of bright ivory light with no detail — clean negative space reserved for text. All visual interest (leaves, window frame, bokeh) is concentrated in the right third of the frame and fades out toward the center.

Color palette: ivory white (#FDFBF7), fresh leaf green, a faint hint of clear sky blue, and only small warm orange (#DF8F4B) sparkles inside the bokeh highlights. Cool-neutral white balance around 5600K — crisp morning daylight, NOT golden hour.

Mood: refreshing, alive, optimistic, breathing. Very bright and low contrast overall.

Avoid: amber or golden overall color cast, sunset light, dried or yellowed leaves, brown and sepia tones, heavy vignette, any text or logo.
```

---

## 2. 밝은 실내 일터 — 장소를 구체화 ★ 2순위

> 서비스가 "장애인 근로자의 일터"이므로, 배경이 실제 일터를 은은하게 암시하면 메시지 정합성이 올라갑니다.
> 초점을 극단적으로 날려서 특정 회사·특정 직무로 보이지 않게 합니다.

```
A bright, modern, inclusive workplace interior photographed in extremely soft focus. Light oak desks, white walls, healthy green potted plants, and a wide window with a sheer white curtain flooding the room with clean daylight. Shot on a 50mm lens at f/1.4 — nothing is sharply readable, the whole scene reads as a gentle impression of a friendly workplace. No people, no faces, no readable objects, no screens with content.

Composition: the left 55% of the frame is an open, nearly empty wash of bright daylight and pale wall with no detail — clean negative space reserved for text. The desks, plants and window sit in the right third and dissolve softly toward the center.

Color palette: ivory white (#FDFBF7), pale warm wood, fresh plant green, soft daylight blue in the shadows, with small warm orange (#DF8F4B) accents only as tiny highlights. Neutral daylight white balance around 5600K.

Mood: open, clean, welcoming, quietly energetic. High-key exposure, gentle contrast.

Avoid: golden hour or amber cast, warm tungsten lighting, dark corners, cluttered desks, corporate stock-photo stiffness, any text or logo.
```

---

## 3. 추상 라이트 — 계절감 자체를 제거 (안전빵)

> "가을 같다"는 피드백을 근본적으로 없애는 방법은 계절을 읽을 단서를 아예 없애는 것입니다.
> 사명(이루빛터 = 빛)과도 직결되고, 텍스트 가독성이 가장 확실하게 확보됩니다.

```
An abstract, minimal light-and-gradient background for a website hero section. Soft overlapping rays of light passing through frosted glass, with delicate prismatic refraction and a few gentle lens-flare orbs. Smooth, dreamy, completely non-photographic subject matter — pure light, no objects, no scenery, no seasonal cues.

Composition: the left 55% of the frame is a clean, almost flat ivory-white gradient with no structure — reserved for text overlay. The light rays, prism colors and flare orbs bloom in the right third and dissolve gradually toward the center.

Color palette: ivory white (#FDFBF7) base, luminous warm orange (#DF8F4B) as the main accent, supported by fresh mint green and soft aqua blue so the image never reads as a single warm cast. Very bright, high-key, low contrast.

Mood: radiant, uplifting, modern, weightless — light spreading outward.

Avoid: dark backgrounds, neon or cyberpunk look, heavy saturation, geometric hard edges, brown or sepia tones, any text or logo.
```

---

## 4. 사람과 동세 — 생동감 최대치 (표현 주의)

> "생동감"을 사람의 움직임으로 해석한 안입니다. 감성 임팩트가 가장 크지만,
> 장애인 근로자를 다루는 서비스이므로 **AI가 만든 사람 얼굴은 반드시 피해야 합니다**.
> 실루엣·역광·아웃포커스로만 인기척을 남기도록 프롬프트를 잡았습니다.

```
A bright, warm workplace scene photographed with very shallow depth of field and slight motion blur, capturing the feeling of people working together. Only soft, unrecognizable backlit silhouettes and gentle movement — no visible faces, no identifiable individuals, no sharp figures. Clean daylight pours in from a large window behind them, creating a luminous rim of light around the blurred shapes.

Composition: the left 55% of the frame is an empty, bright, softly glowing wash with no detail — clean negative space reserved for text. The blurred figures and window light occupy the right third of the frame.

Color palette: ivory white (#FDFBF7), clean daylight white, cool blue-grey in the soft shadows, fresh green from plants in the background, and warm orange (#DF8F4B) only as small rim-light highlights. Neutral daylight white balance around 5600K.

Mood: alive, in motion, collaborative, hopeful. High-key exposure, airy, never heavy.

Avoid: recognizable faces, sharp human features, golden hour or amber cast, sunset light, brown or sepia tones, dramatic shadows, any text or logo.
```

---

## 5. 아침 출근길 — 서비스 맥락 직결

> 두르비터의 핵심 기능이 "출퇴근 관리"이므로, 아침의 출근길 풍경은 메시지와 가장 직접적으로 맞물립니다.
> 실내 → 야외로 바뀌면서 인상이 꽤 달라지므로 클라이언트 취향을 확인한 뒤 제안하는 것을 권합니다.

```
A fresh early-morning outdoor scene: a tree-lined city walkway on a clear day, photographed with a long lens at f/2 so the whole scene melts into soft bokeh. Young green leaves catch crisp morning sunlight, dew glistens, and the sky is a clean pale blue-white. A sense of a new day beginning, of people about to head to work — but no visible people or vehicles in focus.

Composition: the left 55% of the frame is an open, bright, nearly empty wash of pale sky and haze with no detail — clean negative space reserved for text. Trees, sunlit foliage and sparkling bokeh sit in the right third and fade toward the center.

Color palette: ivory white (#FDFBF7), fresh leaf green, clean pale sky blue, with small warm orange (#DF8F4B) glints where sunlight breaks through the leaves. Crisp morning white balance around 5600K.

Mood: fresh, energizing, the start of something — clean morning air.

Avoid: golden hour or sunset light, amber overall cast, autumn foliage, orange or red leaves, brown and sepia tones, crowds, cars in focus, any text or logo.
```

---

## 생성 후 체크리스트

1. **왼쪽 55%가 충분히 밝고 비어 있는가** — 어두우면 `text-gray-900` 헤드라인이 안 읽힙니다.
2. **오렌지 CTA 버튼(`#DF8F4B`)이 배경에 묻히지 않는가** — 배경 오른쪽이 같은 오렌지면 버튼이 사라집니다.
3. **한색(초록/블루)이 최소한 살짝은 보이는가** — 이게 없으면 다시 "가을"로 읽힙니다.
4. 파일 교체: `public/images/hero-bg.png` (현재 1.5MB → **WebP로 변환 권장**, LCP 이미지입니다)

### 결과가 아직 부족할 때 덧붙일 문장

| 원하는 방향 | 프롬프트에 추가 |
|------------|----------------|
| 더 생동감 있게 | `Increase color vibrancy and add more cool green and blue tones to contrast the warm accents.` |
| 더 밝게 | `Raise the exposure — bright high-key image, almost overexposed on the left side.` |
| 왼쪽이 지저분할 때 | `The left half must be completely empty and featureless — a smooth ivory gradient only.` |
| 여전히 가을 같을 때 | `Strictly no amber, gold, brown, tan, or sepia tones anywhere in the image.` |
