# 근현대 동아시아 탄소 에너지 레짐 — 무순 통합 인터랙티브 지도

무순(撫順)을 중심으로 **석탄(탄소)의 노동·생산·유통 전 과정**을 하나의 지도 위에 겹쳐 보는 인터랙티브 GIS 데모입니다. 노동 유입, 탄광 생산(경영유형), 석탄 유통(수출), 철도망·버퍼 분석의 **네 레이어를 자유롭게 중첩**하고 **연도축**을 따라 흐름을 관찰할 수 있습니다.

> 서강대학교 디지털역사연구소

![status](https://img.shields.io/badge/type-self--contained%20HTML-blue) ![offline](https://img.shields.io/badge/offline-double--click-green) ![engine](https://img.shields.io/badge/engine-MapLibre%20%2B%20deck.gl-orange)

---

## ✨ 특징

- **4개 중첩 레이어** (배타적 탭 아님 — 체크박스로 자유 조합)
  - 🟡 **노동** — 산동·화북 등 → 무순 인구 유입 (1916–1921, 명)
  - 🔵 **생산** — 만주 전역 탄광 83개소, 경영유형(官辦·官辦試·商辦·私採)별 색, 클릭 시 지명·연도·성/현 팝업
  - 🩷 **유통** — 무순 → 조선·일본·화북·남중국·동남아·대만·연해주 석탄 수출 (1908–1919, ton)
  - ⬛ **철도망** — 4개 간선(경봉·안봉·동청·남만주) + 역 + 버퍼 50/100/150/200km 독립 토글
- **연도 슬라이더 + 재생 애니메이션** — 흐름 3종(노동·유통·탄광 누적)에 시간축 적용
- **하단 차트 도크** — 활성 레이어에 따라 목적지별/출발지별 통계 + 버퍼 반경별 경영유형 포함비율 라인차트
- **레이어별 내러티브 프레임** — "이 데이터가 무슨 주장을 증명하는가"
- **완전 자기완결형 단일 HTML** — 라이브러리·데이터 전부 인라인, 인터넷 없이 더블클릭 구동
- **오프라인 폴백** — 배경지도(Carto) 로드 실패 시 내장 해안선으로 자동 대체, 데이터 레이어는 정상 작동
- **정적/PDF 대응** — 첫 프레임과 모든 토글이 즉시 렌더되어 캡처·인쇄에서도 핵심이 보임

## 🚀 사용법

배포본을 그냥 엽니다:

```
source/carbon_regime_integrated.html  ← 더블클릭
```

- **인터넷 O**: Carto positron 배경지도 위에 데이터 표시
- **인터넷 X**: 내장 해안선 배경으로 자동 전환(좌상단 안내), 데이터·인터랙션 그대로

## 🔧 재빌드

결과물은 `build/`의 템플릿과 자산으로부터 생성됩니다.

```bash
cd build
node build.js        # → source/carbon_regime_integrated.html 생성
```

`build/`에는 앱 템플릿(`app_template.html`), 빌드 스크립트(`build.js`), 추출 GeoJSON, 해안선, 인라인용 라이브러리(`vendor/`)가 들어 있습니다. 자산을 처음부터 다시 만드는 절차는 [`SPEC.md`](SPEC.md) 참고.

## 📁 구조

```
source/carbon_regime_integrated.html   최종 산출물 (자기완결형)
source/*.csv, *.html                   원본 데이터·지도
build/                                  재빌드 자산 + build.js
SPEC.md                                 복원용 기술명세서
README.md                              이 문서
```

## 🗂 데이터 출처

- **무순 석탄 수출/노동 유입 통계** — 연구소 정리 자료 (CSV)
- **만주 탄광·철도·역·버퍼 GIS** — 연구소 정리 GeoJSON (경영유형·개발연도 포함)
- **해안선(오프라인 폴백)** — [Natural Earth](https://www.naturalearthdata.com/) 50m land (public domain), 동아시아로 클립·단순화
- **배경지도** — © [CARTO](https://carto.com/) positron, © OpenStreetMap contributors

## 🛠 기술 스택

[MapLibre GL JS](https://maplibre.org/) 3.6.2 · [deck.gl](https://deck.gl/) 8.9.36 · [Chart.js](https://www.chartjs.org/) 4.4.1 — 모두 단일 HTML에 인라인.

## 📄 라이선스 / 크레딧

- 코드: 서강대학교 디지털역사연구소.
- 지도/데이터 라이브러리는 각 프로젝트 라이선스(MIT/BSD 등)를 따릅니다.
- 배경지도·해안선은 각 제공처(CARTO/OSM, Natural Earth) 표기를 유지하세요.

---

*자세한 아키텍처·데이터 스키마·복원 절차는 [SPEC.md](SPEC.md)에 정리되어 있습니다.*
