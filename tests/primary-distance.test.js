import { describe, test } from "vitest";

import protectedTargetsRaw from "./protected-targets.json";
import allowlist from "./primary-distance-allowlist.json";
import { csvTestData } from "./csv-test-data.js";
import { buildFailureMessage } from "./_utils/report.js";
import { deltaEOKLabHex, normalizeHex } from "./_utils/oklab.js";

const THRESHOLD = 0.005; // Strict: keeps entries away from protected targets.
const MAX_ROWS = 60;

const pad = (value, width) => String(value).padEnd(width);

const formatTable = (rows) => {
	const columns = ["line", "name", "hex", "closest", "closestHex", "ΔE(OKLab)"];

	const widths = {
		line: Math.max(columns[0].length, ...rows.map((r) => String(r.lineNumber).length)),
		name: Math.max(columns[1].length, ...rows.map((r) => r.name.length)),
		hex: Math.max(columns[2].length, ...rows.map((r) => r.hex.length)),
		closest: Math.max(columns[3].length, ...rows.map((r) => r.closest.name.length)),
		closestHex: Math.max(columns[4].length, ...rows.map((r) => r.closest.hex.length)),
		dE: Math.max(columns[5].length, ...rows.map((r) => r.distance.toFixed(6).length)),
	};

	const header =
		pad(columns[0], widths.line) +
		"  " +
		pad(columns[1], widths.name) +
		"  " +
		pad(columns[2], widths.hex) +
		"  " +
		pad(columns[3], widths.closest) +
		"  " +
		pad(columns[4], widths.closestHex) +
		"  " +
		pad(columns[5], widths.dE);

	const divider =
		pad("-".repeat(columns[0].length), widths.line) +
		"  " +
		pad("-".repeat(columns[1].length), widths.name) +
		"  " +
		pad("-".repeat(columns[2].length), widths.hex) +
		"  " +
		pad("-".repeat(columns[3].length), widths.closest) +
		"  " +
		pad("-".repeat(columns[4].length), widths.closestHex) +
		"  " +
		pad("-".repeat(columns[5].length), widths.dE);

	const lines = rows.map((r) =>
		pad(r.lineNumber, widths.line) +
			"  " +
			pad(r.name, widths.name) +
			"  " +
			pad(r.hex, widths.hex) +
			"  " +
			pad(r.closest.name, widths.closest) +
			"  " +
			pad(r.closest.hex, widths.closestHex) +
			"  " +
			r.distance.toFixed(6),
	);

	return [header, divider, ...lines].join("\n");
};

const normalizeTargets = (targets) => {
	if (!Array.isArray(targets)) {
		throw new Error("protected-targets.json must be an array");
	}

	return targets.map((t) => {
		if (!t || typeof t !== "object") {
			throw new Error("protected-targets.json entries must be objects");
		}

		if (typeof t.name !== "string" || t.name.trim().length === 0) {
			throw new Error("protected-targets.json entries must have a non-empty name");
		}

		if (typeof t.hex !== "string") {
			throw new Error("protected-targets.json entries must have a hex string");
		}

		return {
			name: t.name.trim(),
			hex: normalizeHex(t.hex),
		};
	});
};

describe("Primary proximity", () => {
	test("No colors are nearly identical to protected primary colors (OKLab)", () => {
		csvTestData.load();
		const data = csvTestData.lines
			.map((line, idx) => {
				if (!line.trim()) return null;

				const firstComma = line.indexOf(",");
				const secondComma = firstComma === -1 ? -1 : line.indexOf(",", firstComma + 1);
				if (firstComma === -1 || secondComma === -1) return null;

				const colorName = line.slice(0, firstComma);
				const hexValue = line.slice(firstComma + 1, secondComma);

				return {
					lineNumber: idx + 2, // +1 for header, +1 for 0-based idx
					colorName,
					hexValue,
				};
			})
			.filter(Boolean);

		const protectedTargets = normalizeTargets(protectedTargetsRaw);
		const protectedHexSet = new Set(protectedTargets.map((t) => t.hex));
		const allowedNames = new Set(
			(Array.isArray(allowlist) ? allowlist : []).map((n) => String(n)),
		);

		const violations = [];

		for (const row of data) {
			const name = row.colorName;
			const hex = normalizeHex(row.hexValue);

			// Allowlisted names are explicit exceptions.
			if (allowedNames.has(name)) {
				continue;
			}

			// The protected targets themselves are allowed to exist.
			if (protectedHexSet.has(hex)) {
				continue;
			}

			let closest = protectedTargets[0];
			let minDistance = deltaEOKLabHex(hex, closest.hex);

			for (let i = 1; i < protectedTargets.length; i += 1) {
				const t = protectedTargets[i];
				const d = deltaEOKLabHex(hex, t.hex);
				if (d < minDistance) {
					minDistance = d;
					closest = t;
				}
			}

			if (minDistance < THRESHOLD) {
				violations.push({
					lineNumber: row.lineNumber,
					name,
					hex,
					closest,
					distance: minDistance,
				});
			}
		}

		if (violations.length > 0) {
			violations.sort((a, b) => a.distance - b.distance);

			const shown = violations.slice(0, MAX_ROWS);
			const table = formatTable(shown);

			const details = [
				`Threshold: ΔE(OKLab) < ${THRESHOLD}`,
				"",
				...table.split("\n"),
				"",
				violations.length > MAX_ROWS
					? `...and ${violations.length - MAX_ROWS} more`
					: null,
			].filter(Boolean);

			throw new Error(
				buildFailureMessage({
					title: "Found {n} {items} too close to protected primary colors (OKLab)",
					offenders: [],
					offenderLabel: "color",
					details,
					tips: [
						"Adjust the hex value to be clearly distinct.",
						"If intentional, add the color name to tests/primary-distance-allowlist.json.",
					],
					count: violations.length,
				})
			);
		}
	});
});
