# 기술명세서 — 근현대 동아시아 탄소 에너지 레짐 통합 지도
### `carbon_regime_integrated.html` 복원·재구성 명세 (single source of truth)

> 이 문서 하나만 있으면 결과물 `carbon_regime_integrated.html`을 처음부터 다시 만들 수 있습니다.
> 원본 소스 4파일(2 HTML + 2 CSV)과 인터넷만 있으면 됩니다.

---

## 0. 프로젝트 개요

- **소속/맥락**: 서강대학교 디지털역사연구소. 한국연구재단 인문사회연구소지원사업. 발표평가 2026-07-23.
- **연구주제**: 근현대 동아시아 **탄소(=석탄) 에너지 레짐**.
- **이 산출물의 목적**: 데모/샘플. 두 가지를 증명한다.
  - (a) 탄소=석탄의 **노동·생산·유통 전 과정**을 초국가적으로 규명.
  - (b) 연구소의 **디지털 역량(GIS 공간분석)**.
- **핵심 요구**: 무순(撫順)을 중심에 둔 **단일 지도** + **독립 토글·중첩 가능한 4개 레이어**(노동/생산/유통/철도망) + 흐름 3종에 연도축.
- **배타적 탭이 아니라 중첩 가능한 체크박스 레이어**여야 함 (예: 철도망+노동 동시 ON → 공간 상관 관찰).

---

## 1. 파일 구조

```
Claude_1/
├─ source/
│  ├─ carbon_regime_integrated.html   ← 최종 산출물 (2.9MB, 자기완결형 단일 파일)
│  ├─ fushun_combined_timelapse_map.html      (베이스 엔진 원본, MapLibre+deck.gl)
│  ├─ coalmine_map_and_buffer_chart_combined.html (탄광·철도·버퍼 원본, Leaflet)
│  ├─ fushun_raw_data-001-260408.csv          (유통 데이터)
│  ├─ fushun_labor-001-260413.csv             (노동 데이터)
│  └─ index.html                              (별개 지도 — 통합 대상 아님, 제외)
├─ build/
│  ├─ app_template.html      (앱 HTML/CSS/JS 템플릿 + 주입 토큰)
│  ├─ build.js               (자산 주입 빌드 스크립트)
│  ├─ coalmine_geojson.json  (coalmine HTML에서 추출한 GeoJSON, 235KB)
│  ├─ coastline_ea.json      (오프라인 폴백용 동아시아 해안선, 62KB)
│  └─ vendor/                (인라인용 라이브러리 원본)
│     ├─ maplibre-gl.js / maplibre-gl.css   (3.6.2)
│     ├─ deck.gl.min.js                      (8.9.36)
│     └─ chart.umd.min.js                    (4.4.1)
├─ SPEC.md   (이 문서)
└─ README.md (GitHub용)
```

**재빌드**: `cd build && node build.js` → `source/carbon_regime_integrated.html` 생성.

---

## 2. 소스 데이터 명세

### 2.1 유통 — `fushun_raw_data-001-260408.csv` (84행)
무순 → 7개 지역 석탄 수출, **1908–1919**, 단위 **ton**.

| 컬럼 | 예시 |
|---|---|
| id, source_country(=fushun), source_latitude, source_longitude | 41.8805, 123.9563 |
| target_country | chosun / japan / south_china / north_china / southeast-asia / taiwan / vladivostok |
| target_latitude, target_longitude, year, time, amount(ton), note, linestring | |

7개 목적지 좌표·라벨 매핑:
- chosun 서울(37.567,126.978) · japan 도쿄(35.687,139.753) · south_china 상하이(31.229,121.476)
- north_china 베이징(39.917,116.397) · southeast-asia 싱가포르(1.297,103.848) · taiwan 타이베이(25.040,121.519) · vladivostok 블라디보스토크(43.115,131.886)

### 2.2 노동 — `fushun_labor-001-260413.csv` (36행)
6개 도시 → 무순 노동/인구 유입, **1916–1921**, 단위 **명(pop)**.

| 컬럼 | 값 |
|---|---|
| id, source_city | Qingdao/Jinzhou/Lingyuan/Chaoyang/Tianjin/Shanhaiguan |
| source_lat/lng, target_city(=Fushun), target_lat/lng(41.8797,123.95728), pop, year | |

도시 한글: Qingdao 칭다오 · Jinzhou 진저우 · Lingyuan 링위안 · Chaoyang 차오양 · Tianjin 톈진 · Shanhaiguan 산해관.

두 CSV는 **원본 fushun HTML에 이미 base64로 인라인**돼 있음(`EMBEDDED_CSV_B64`, `EMBEDDED_LABOR_CSV_B64`). build.js가 여기서 그대로 추출해 재인라인함.

### 2.3 생산·철도 — `window.__EMBEDDED_GEOJSON__` (coalmine HTML 내장)
`coalmine_map_and_buffer_chart_combined.html` 안에 `window.__EMBEDDED_GEOJSON__ = JSON.parse("...")` 형태로 인라인. 7개 키:

| 키 | 개수 | 지오메트리 | 비고 |
|---|---|---|---|
| `coalmine` | 83 | Point | 탄광. `type_admin_eng`(official/official_test/commercial/private), `year_dev_start`(1865–1912), `year_dev_end`, `name_mine_past`(한자), `name_mine_current`, `province`, `county` |
| `railway` | 33 | LineString | 4개 간선. `railroad_name`(京奉鐵道/安奉鐵道/東清鐵道/南滿洲鐵道), `year_dev_start/end`(1894–1911), 역명 |
| `stations` | 33 | Point | 철도역 |
| `buffer50/100/150/200` | 각 33 | MultiPolygon | **역 기준 반경 버퍼가 사전계산되어 인라인** (turf 재계산 불필요) |

**중요**: 버퍼는 이미 계산돼 있으므로 turf.js 불필요. 원본 coalmine의 turf는 폴백 경로일 뿐. 통합본에서 turf·Leaflet 완전 제거.

탄광 경영유형 매핑: official 官辦 · official_test 官辦(試) [데이터상 official_trial과 동의어] · commercial 商辦 · private 私採.
철도 한글: 京奉 경봉 · 安奉 안봉 · 東清 동청 · 南滿洲 남만주.

---

## 3. 아키텍처

### 3.1 엔진
- **MapLibre GL JS**(지도) + **deck.gl** `MapboxOverlay` **2개**(`overlay`=본체 레이어, `labelOverlay`=텍스트 라벨), 둘 다 `interleaved:false`.
- 베이스맵: 온라인 Carto positron (`https://basemaps.cartocdn.com/gl/positron-gl-style/style.json`).
- 차트: Chart.js.
- 원본 fushun 엔진(MapLibre+deck.gl 구조)을 기반으로, coalmine의 탄광·철도·버퍼를 **Leaflet→deck.gl로 재구현 이식**.

### 3.2 핵심 리팩터: 배타적 모드 → 중첩 레이어 레지스트리
원본 fushun은 `currentMode`("export"↔"labor") 배타 스위치로 데이터·슬라이더·차트·범례·카메라를 통째 교체. 이를 **독립 불리언 레지스트리**로 전환:

```js
state.layers  = { production:true, distribution:true, railway:true, labor:false };
state.buffers = { 50:false, 100:false, 150:true, 200:false };
state.year = 1917;  // YEAR_MIN=1908, YEAR_MAX=1921 (두 CSV 연도범위 합집합)
```

### 3.3 렌더 파이프라인 (RAF 비의존 즉시 렌더가 핵심)
```
composeLayers(flowT)  // 켜진 레이어 빌더 결과를 draw-order로 concat
  → 순서: railway(bottom) → production → distribution → labor(top)
renderFrame(flowT)    // overlay.setProps({layers:main}); labelOverlay.setProps({layers:labels})
requestRender()       // = renderFrame(0), 정적 1회 렌더
tick()                // renderFrame(실시간 flowT); requestAnimationFrame(tick) — 입자 애니메이션
```
- **boot에서 `renderFrame(0)`을 직접(동기) 호출** → RAF와 무관하게 첫 프레임 즉시 표시.
- **모든 상태변경(레이어 체크박스/버퍼 토글/연도 변경)에서 `requestRender()` 호출** → 백그라운드 탭·정적/PDF에서도 즉시 반영.
- `tick()`은 화면이 보일 때만 RAF로 입자 흐름을 애니메이션. (숨김 탭에선 RAF 정지되지만 정적 화면은 renderFrame(0)로 이미 그려짐 — 이 설계가 필수.)
- `nudgeDeck()`: boot·폴백·리사이즈 직후 `map.resize()+map.triggerRepaint()`를 [0,60,180,420,900,1600]ms 버스트로 호출 → 정적 베이스맵에서 deck 캔버스 크기·뷰포트 동기화(안 하면 deck 캔버스가 300×150에 고정되어 지도와 어긋남).

---

## 4. 4개 레이어 상세 (data → deck 레이어)

### 4.1 노동 (labor) · 앰버
- 원본 fushun labor 로직 재사용. `state.year`로 필터, `pop>0`만.
- `ArcLayer`(great-circle, 색=laborHeatRGBA, 폭=pop비례 1.1~5.5px) + 무순 허브 `ScatterplotLayer`(연도 유입합계 크기) + 출발지 `ScatterplotLayer` + 호 위 이동 입자 `ScatterplotLayer` + 라벨(허브+도시).

### 4.2 생산 (production) · 경영유형 4색
- `ScatterplotLayer`, 데이터=탄광 중 `year_dev_start <= state.year`(누적) 필터 → 연도축에 연결.
- radius 6px, 진한 외곽선([15,23,42]), fill=경영유형색. `pickable` 툴팁(지명/경영/성·현/개발연도).

### 4.3 유통 (distribution) · 핫핑크
- 원본 fushun export 로직 재사용. `state.year` 필터, `amount>0`.
- `ArcLayer`(핫핑크 heat) + 목적지 버블 `ScatterplotLayer`(수출량 크기) + 이동 입자 + 라벨(7목적지).

### 4.4 철도망 (railway) · 노선 4색 + 버퍼
- 버퍼: `state.buffers[km]` on인 반경마다 `GeoJsonLayer`(사전계산 MultiPolygon, 회색 반투명 fill α≈0.05+km/50*0.014, 상한 0.2).
- 노선: `PathLayer`(curveLineCoords로 완만히 곡선화, 노선별 색, 2.6px).
- 역: `ScatterplotLayer`(radius 4, fill [254,243,199], stroke [28,25,23]).
- 라벨: 노선 4개(가장 긴 세그먼트 중점).

### 4.5 색상표
| 대상 | 색 |
|---|---|
| 유통 heat | white → hot pink [255,28,145] |
| 노동 heat | white → dark yellow [214,158,0] |
| 탄광 official/official_test/commercial/private | #0000ff / #43CBFF / #fafad2 / #ffd700 |
| 철도 京奉/安奉/東清/南滿洲 | #ef4444 / #eab308 / #3b82f6 / #22c55e |

---

## 5. 수학·유틸 (원본 fushun에서 이식, 그대로 유지)

- `amountWeight(a,max)` = log1p(a)/log1p(max) (선형이 눌리지 않게).
- `amountHeatRGBA(a,max,α)` = white↔hotpink 보간.
- `laborHeatRGBA(pop,maxYear,α)` = white↔darkyellow, `t=pow(min(1,pop/globalMaxPop),0.48)`.
- `greatCirclePath(p0,p1,n)` = 구면 보간 대권 경로(호·입자 경로). `interpolateAlongPath(path,t)` = 경로상 위치.
- `hash01(str)` = FNV 해시 → 입자 위상 `_phase`(호마다 시작점 분산).
- `curveLineCoords(coords)` = 2차 베지어 완만 곡선(bulge 0.045, 세그먼트당 18스텝) — 철도선.
- 입자 주기: 유통 6400ms, 노동 5200ms. 재생 간격 1300ms(연도 자동증가).

---

## 6. 차트 도크 (하단, 활성 레이어별 조건부 표시)

- **유통 ON** → 막대(목적지별 ton) + 도넛 + 연도별 총수출 막대(선택연도 강조). `updateFlowCharts()`가 연도 변경 시 갱신.
- **노동 ON** → 막대(출발지별 명) + 도넛 + 연도별 총유입 막대.
- **철도망 ON** → **버퍼 반경별 경영유형 포함비율 정적 라인차트**. coalmine에서 이식, **데이터 하드코딩**(런타임 계산 아님):
  - official [25,25,25,42,58] · official_trial [8,33,50,50,50] · commercial [14,54,82,89,11] · private [26,55,65,77,23]
  - x축: 50/100/150/200km 이내 + 200km 초과. 어두운 plot 배경(cream 색 가시성 위해). `chartPlotDarkBg` 플러그인 이식.
- 패널이 숨김→표시 전환 시 `chart.resize()`.

---

## 7. 오프라인 전략 (발표장 인터넷 불확실 대비)

**세 단계 의존성 모두 처리:**

1. **라이브러리(치명적)**: maplibre·deck.gl·chart.js를 **HTML에 전부 인라인** → CDN 없이 더블클릭 구동. (원본은 CDN `<script src>`라 오프라인 시 지도 자체가 안 뜸.)
2. **배경지도(경미)**: Carto는 온라인 유지. 실패(에러 이벤트 또는 4.5s 타임아웃) 시 `map.setStyle(fallbackStyle())`로 **내장 해안선 GeoJSON**(background+fill+line)으로 자동 대체. deck 데이터 레이어는 빈 캔버스 위에서도 정상. 좌상단에 "오프라인 모드" 안내.
3. **정적 첫 프레임**: `renderFrame(0)` 동기 호출 → RAF 정지(숨김탭)·PDF에서도 핵심이 보임.

폴백 감지: `map.on('error')`에서 style/tile/glyph/network 관련 메시지 or `!navigator.onLine`이면 `goOffline()`. 안전망으로 4.5s 후 `!isStyleLoaded()`면 폴백.

---

## 8. 빌드 파이프라인

`build/app_template.html`(앱 전체)에 주입 토큰을 두고 `build/build.js`가 자산을 문자열 치환(split/join, `$` 특수치환 회피)으로 삽입:

| 토큰 | 주입물 |
|---|---|
| `/*__MAPLIBRE_CSS__*/` | maplibre-gl.css (raw, `<style>` 내부) |
| `/*__MAPLIBRE_JS__*/` `/*__DECK_JS__*/` `/*__CHART_JS__*/` | 각 라이브러리 JS (raw, `<script>` 내부; `</script`→`<\/script` 안전치환) |
| `"__COALMINE_GEOJSON_STR__"` | `JSON.stringify(coalmine_geojson.json 문자열)` → `JSON.parse("...")` 대상 |
| `"__COASTLINE_STR__"` | `JSON.stringify(coastline_ea.json 문자열)` |
| `__CSV_EXPORT_B64__` `__CSV_LABOR_B64__` | 원본 fushun HTML에서 정규식 추출한 base64 |

출력: `source/carbon_regime_integrated.html`. 잔여 토큰 있으면 빌드 실패시킴.

---

## 9. 자산 재생성 (build/ 폴더가 없어도 복원 가능)

### 9.1 라이브러리 다운로드
```bash
curl -sSL -o vendor/maplibre-gl.js   https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js
curl -sSL -o vendor/maplibre-gl.css  https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css
curl -sSL -o vendor/deck.gl.min.js   https://unpkg.com/deck.gl@8.9.36/dist.min.js
curl -sSL -o vendor/chart.umd.min.js https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js
```

### 9.2 coalmine GeoJSON 추출 (coalmine HTML → coalmine_geojson.json)
```js
const fs=require("fs");
const html=fs.readFileSync("source/coalmine_map_and_buffer_chart_combined.html","utf8");
const i=html.indexOf("__EMBEDDED_GEOJSON__");
const sEnd=html.indexOf("</script>", i);
let js=html.slice(html.indexOf("JSON.parse(",i)+11, sEnd).trim();
js=js.slice(0, js.lastIndexOf('")')+1);       // 내부 문자열 리터럴
const obj=JSON.parse(JSON.parse(js));          // 문자열→GeoJSON
fs.writeFileSync("build/coalmine_geojson.json", JSON.stringify(obj));
```

### 9.3 해안선 생성 (Natural Earth 50m → coastline_ea.json)
```bash
curl -sSL -o ne_land_50m.json https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_land.geojson
```
```js
// 동아시아 창으로 클립 + Douglas-Peucker 단순화 + 소형 섬 제거 + 좌표 3자리 반올림
const fs=require("fs");
const src=JSON.parse(fs.readFileSync("ne_land_50m.json","utf8"));
const BB={minx:95,miny:-12,maxx:150,maxy:56};   // 싱가포르~블라디보스토크~일본 포함
function bbox(r){let a=1e9,b=1e9,c=-1e9,d=-1e9;for(const p of r){if(p[0]<a)a=p[0];if(p[0]>c)c=p[0];if(p[1]<b)b=p[1];if(p[1]>d)d=p[1];}return[a,b,c,d];}
function hits(bb){return !(bb[2]<BB.minx||bb[0]>BB.maxx||bb[3]<BB.miny||bb[1]>BB.maxy);}
function perp(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy;if(!L)return Math.hypot(p[0]-a[0],p[1]-a[1]);let t=((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L;t=Math.max(0,Math.min(1,t));return Math.hypot(p[0]-(a[0]+t*dx),p[1]-(a[1]+t*dy));}
function dp(pts,tol){if(pts.length<3)return pts;let idx=-1,mx=0;for(let i=1;i<pts.length-1;i++){const d=perp(pts[i],pts[0],pts[pts.length-1]);if(d>mx){mx=d;idx=i;}}return mx>tol?dp(pts.slice(0,idx+1),tol).slice(0,-1).concat(dp(pts.slice(idx),tol)):[pts[0],pts[pts.length-1]];}
const rnd=p=>[Math.round(p[0]*1000)/1000,Math.round(p[1]*1000)/1000];
const TOL=0.11, out=[];
function handle(poly){for(const r of poly){const bb=bbox(r);if(!hits(bb))continue;if((bb[2]-bb[0])*(bb[3]-bb[1])<0.12)continue;const s=dp(r,TOL).map(rnd);if(s.length>=4)out.push([s]);}}
for(const f of src.features){const g=f.geometry;if(!g)continue;if(g.type==="Polygon")handle(g.coordinates);else if(g.type==="MultiPolygon")g.coordinates.forEach(handle);}
fs.writeFileSync("build/coastline_ea.json",JSON.stringify({type:"FeatureCollection",features:out.map(r=>({type:"Feature",properties:{},geometry:{type:"Polygon",coordinates:r}}))}));
// 결과: 91 rings / 3444 vertices / ~62KB
```

### 9.4 CSV base64
`source/fushun_combined_timelapse_map.html`의 `var EMBEDDED_CSV_B64="..."`, `var EMBEDDED_LABOR_CSV_B64="..."` 를 그대로 사용(build.js가 정규식으로 추출). 원 CSV에서 새로 만들려면 UTF-8 바이트를 base64 인코딩(BOM 포함 원본 유지).

---

## 10. 주요 설계 결정 & 근거

1. **배타적 모드 → 중첩 체크박스 레이어**: 요구의 핵심. 레이어 레지스트리 + composeLayers concat.
2. **Leaflet/turf 제거, deck.gl 단일 엔진**: 버퍼가 사전계산돼 있어 turf 불필요; 엔진 일원화로 중첩·성능·오프라인 유리.
3. **라이브러리 전량 인라인(단일 파일 ~2.9MB)**: "하나의 자기완결형 HTML + 오프라인 더블클릭" 요구 충족.
4. **Carto 온라인 + 해안선 오프라인 폴백**: 사용자 승인. 배경만 온라인, 데이터·엔진은 오프라인.
5. **RAF 비의존 즉시 렌더(renderFrame(0))**: 백그라운드 탭·정적/PDF 대비. (검증 중 미리보기 탭이 hidden→RAF 정지로 빈 화면이 되던 문제를 이 설계로 해결.)
6. **탄광=누적(year_dev_start≤연도)**: 생산을 연도축의 "3번째 흐름"으로 연결.
7. **기본 상태**: production+distribution+railway ON, labor OFF, buffer 150 ON, year 1917, view center[124.6,38.6]/zoom3.95/pitch24/bearing-14 → 정적 스크린샷만으로 핵심 서사가 보이게.
8. **경영유형·철도 색은 원본 semantic 유지**(범례·버퍼차트 일관성), 밝은 배경 가시성은 진한 외곽선으로 보완.
9. **index.html 제외**: "청말 만주 광산 개발(1855~1911)"은 별개 Leaflet 지도, 통합 범위 밖.

---

## 11. 검증 결과 (완료)

데이터 파싱(탄광83/철도33/역33/수출84/노동36), 좌표 투영(무순→캔버스 내부), Carto 로드, 오프라인 폴백, **4레이어 중첩·버퍼 독립토글·연도전환 즉시반영**, 콘솔 무에러까지 프로그램적으로 확인. deck 레이어 데이터 부착 확인(예: buf-150=33, prod-mines=83, dist-arc=5@1917, labor-*=6@1919).

**환경 한계**: 미리보기 도구가 연속 애니메이션 WebGL을 스크린샷 캡처 못 함(파일 문제 아님). 최종 육안 확인은 실제 브라우저 더블클릭.

---

## 12. 알려진 제약 / 향후 과제

- 버퍼차트 비율은 **정적 하드코딩**(원본과 동일). 런타임 point-in-polygon 계산으로 동적화 가능(사전계산 버퍼 + 탄광점으로).
- 탄광 라벨은 툴팁만(상시 라벨 83개는 과밀). 필요 시 zoom 임계 상시라벨 추가 가능.
- 해안선은 저해상도 폴백용(온라인엔 Carto에 가려짐). 정밀 오프라인 필요 시 벡터/래스터 타일 번들 검토.
- 완전 오프라인에서 지명 라벨 없음(폴백 스타일에 glyphs 미포함) — deck 텍스트 라벨은 유지됨.
