// OKLab conversion + ΔE (Euclidean) helpers.
// No external dependencies; used by tests.

const clamp01 = (value) => Math.min(1, Math.max(0, value));

const srgb8ToLinear = (u8) => {
	const v = clamp01(u8 / 255);
	return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

const parseHexToRgb = (hex) => {
	if (typeof hex !== "string") {
		throw new TypeError(`Expected hex string, got ${typeof hex}`);
	}

	const raw = hex.trim().toLowerCase();
	const normalized = raw.startsWith("#") ? raw.slice(1) : raw;

	if (!/^[0-9a-f]{6}$/.test(normalized)) {
		throw new Error(`Invalid hex color: ${hex}`);
	}

	const r = Number.parseInt(normalized.slice(0, 2), 16);
	const g = Number.parseInt(normalized.slice(2, 4), 16);
	const b = Number.parseInt(normalized.slice(4, 6), 16);

	return { r, g, b };
};

// OKLab: https://bottosson.github.io/posts/oklab/
const rgbToOklab = ({ r, g, b }) => {
	const rl = srgb8ToLinear(r);
	const gl = srgb8ToLinear(g);
	const bl = srgb8ToLinear(b);

	// linear sRGB -> LMS
	const l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
	const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
	const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;

	const l_ = Math.cbrt(l);
	const m_ = Math.cbrt(m);
	const s_ = Math.cbrt(s);

	return {
		L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
		a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
		b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
	};
};

const hexToOklab = (hex) => rgbToOklab(parseHexToRgb(hex));

const deltaEOKLab = (ok1, ok2) => {
	const dL = ok1.L - ok2.L;
	const da = ok1.a - ok2.a;
	const db = ok1.b - ok2.b;
	return Math.sqrt(dL * dL + da * da + db * db);
};

const deltaEOKLabHex = (hex1, hex2) => {
	return deltaEOKLab(hexToOklab(hex1), hexToOklab(hex2));
};

const normalizeHex = (hex) => {
	const { r, g, b } = parseHexToRgb(hex);
	return (
		"#" +
		r.toString(16).padStart(2, "0") +
		g.toString(16).padStart(2, "0") +
		b.toString(16).padStart(2, "0")
	);
};

export {
	deltaEOKLab,
	deltaEOKLabHex,
	hexToOklab,
	normalizeHex,
	parseHexToRgb,
	rgbToOklab,
	srgb8ToLinear,
};
