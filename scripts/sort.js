const fs = require("fs"),
	path = require("path");

let list = fs.readFileSync(path.normalize(`${__dirname}/../src/colornames.csv`), "utf8").split("\n")
const topLine = list.shift();
list.sort((a, b) => a.split(",")[0].localeCompare(b.split(",")[0], "en", { sensitivity: "base" }))
list.unshift(topLine);
fs.writeFileSync(path.normalize(`${__dirname}/../src/colornames.csv`), list.join("\n"), "utf8");