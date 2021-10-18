/* eslint-disable */
export default function colorGenerator(planetCharacters) {
  // h: min - 20 (orange), max - 120 (blue)
  // s: min - 20 (white+color), max - 80
  // https://www.rapidtables.com/web/color/RGB_Color.html

  const colorPalitre = {
    h: 0,
    s: 70,
    v: 80
  };

  // h20 and 273 < t < 373,15 K - clouds: true
  // h20 percecnt for cloudsSeed

  const priority = {
    r: 0,
    g: 0,
    b: 0
  };
  let color = 0;

  Object.entries(planetCharacters).forEach(character => {
    const [characterKey, characterVal] = character;
    // console.log(color, characterVal);

    if (["co2", "o2", "nh3"].includes(characterKey)) {
      color += color === 0 ? 1 - characterVal * 1.3 : characterVal;
    } else if (["ch4", "h20", 'he'].includes(characterKey)) {
      color += characterVal;
    }
  });

  // console.log(planetCharacters);
  const h = 20 + color * (120 - 20);
  // console.log('color', color, h)
  return HSVtoRGB(h, colorPalitre.s, colorPalitre.v);
}

function HSVtoRGB(h = 0, s = 0, v = 0) {
  if (h >= 360) h = 359;
  if (s > 100) s = 100;
  if (v > 100) v = 100;
  s /= 100.0;
  v /= 100.0;
  const C = v * s;
  const hh = h / 60.0;
  const X = C * (1.0 - Math.abs((hh % 2) - 1.0));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hh >= 0 && hh < 1) {
    r = C;
    g = X;
  } else if (hh >= 1 && hh < 2) {
    r = X;
    g = C;
  } else if (hh >= 2 && hh < 3) {
    g = C;
    b = X;
  } else if (hh >= 3 && hh < 4) {
    g = X;
    b = C;
  } else if (hh >= 4 && hh < 5) {
    r = X;
    b = C;
  } else {
    r = C;
    b = X;
  }
  const m = v - C;
  r += m;
  g += m;
  b += m;
  r *= 255.0;
  g *= 255.0;
  b *= 255.0;
  r = Math.round(r) / 100;
  g = Math.round(g) / 100;
  b = Math.round(b) / 100;
  return [r, g, b];
}
