import fs from "fs/promises";
import path from "node:path";

// Environment Setup
const dirname = `${path.dirname(new URL(import.meta.url).pathname)}`.replace(`/scripts`,` `).trim();
const colornamesJsonFile = path.join(dirname, "dist", "colornames.json");
const colorsData = JSON.parse(await fs.readFile(colornamesJsonFile, "utf-8"));
const outputDirectory = path.join(dirname, "dist", "colors");
await fs.mkdir(outputDirectory, { recursive: true });
// 

const totalColors = colorsData.length;
const totalFragments = Math.ceil((totalColors / 20));
// Manifest Construction
const manifest = {};
manifest.meta = {
    "name": "LiOS Colors Data",
    "version": "1.0.0",
    "totalColors": totalColors,
    "fragmentSize": 20,
    "totalFragments": totalFragments
};
// 
// ColorData Fragments
manifest.fragments = {};
const manifestPath = path.join(outputDirectory, "manifest.json");
let startingIndex = 0;
let endingIndex = 20;
for (let i = 1; i <= totalFragments; i++){
    const fragment = `fragment-${i}.json`;
    const fragmentData = colorsData.slice(startingIndex, endingIndex);
    const fragmentFile = path.join(outputDirectory, fragment);

    console.log(`Please Wait: Writing ${fragment}`);

    await fs.writeFile(fragmentFile, JSON.stringify(fragmentData, null, 2), "utf-8");

    startingIndex += 20;
    endingIndex += 20;
    if (i === totalFragments && endingIndex > totalColors) {
        let x = endingIndex - totalColors;
        let y = endingIndex - x;
        endingIndex = y;
    };
    manifest.fragments[i] = {
        "file": `${fragment}`,
        "range": [startingIndex + 1, endingIndex]
    };
};
console.warn("Please Wait: Writing manifest.json\n");
console.log(`Wrote manifest for:\n Total Colors: ${totalColors}\n Fragments size : ${20}\n Total Fragments: ${totalFragments}\n`);
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
// 