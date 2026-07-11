const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const SRC = "C:/Users/littl/Desktop/Claude_1/source";
const OUT = path.join(SRC, "carbon_regime_integrated.html");

function read(p) { return fs.readFileSync(p, "utf8"); }
// Prevent premature </script> from breaking inline blocks
function safeJs(s) { return s.split("</script").join("<\\/script"); }
function replaceOnce(hay, token, val) {
  const i = hay.indexOf(token);
  if (i < 0) throw new Error("token not found: " + token);
  return hay.slice(0, i) + val + hay.slice(i + token.length);
}

let tpl = read(path.join(DIR, "app_template.html"));

// 1. libraries
tpl = replaceOnce(tpl, "/*__MAPLIBRE_CSS__*/", read(path.join(DIR, "vendor/maplibre-gl.css")));
tpl = replaceOnce(tpl, "/*__MAPLIBRE_JS__*/", safeJs(read(path.join(DIR, "vendor/maplibre-gl.js"))));
tpl = replaceOnce(tpl, "/*__DECK_JS__*/", safeJs(read(path.join(DIR, "vendor/deck.gl.min.js"))));
tpl = replaceOnce(tpl, "/*__CHART_JS__*/", safeJs(read(path.join(DIR, "vendor/chart.umd.min.js"))));

// 2. geojson + coastline -> injected as JS string literals for JSON.parse(...)
const coalStr = read(path.join(DIR, "coalmine_geojson.json"));   // already minified JSON text
const coastStr = read(path.join(DIR, "coastline_ea.json"));
tpl = replaceOnce(tpl, '"__COALMINE_GEOJSON_STR__"', JSON.stringify(coalStr));
tpl = replaceOnce(tpl, '"__COASTLINE_STR__"', JSON.stringify(coastStr));

// 3. CSV base64 (extract verbatim from the original fushun HTML)
const fushun = read(path.join(SRC, "fushun_combined_timelapse_map.html"));
function extractB64(varName) {
  const re = new RegExp('var\\s+' + varName + '\\s*=\\s*"([^"]+)"');
  const m = fushun.match(re);
  if (!m) throw new Error("could not extract " + varName);
  return m[1];
}
tpl = replaceOnce(tpl, "__CSV_EXPORT_B64__", extractB64("EMBEDDED_CSV_B64"));
tpl = replaceOnce(tpl, "__CSV_LABOR_B64__", extractB64("EMBEDDED_LABOR_CSV_B64"));

// sanity: no tokens left
["__MAPLIBRE_CSS__","__MAPLIBRE_JS__","__DECK_JS__","__CHART_JS__",
 "__COALMINE_GEOJSON_STR__","__COASTLINE_STR__","__CSV_EXPORT_B64__","__CSV_LABOR_B64__"]
 .forEach(t => { if (tpl.indexOf(t) >= 0) throw new Error("leftover token: " + t); });

fs.writeFileSync(OUT, tpl);
console.log("WROTE", OUT);
console.log("size:", (fs.statSync(OUT).size/1024/1024).toFixed(2), "MB");
