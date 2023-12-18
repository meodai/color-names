const child_process = require("child_process");
const readline = require("readline");

function cmd(c) {
  const stdout = child_process.execSync(c);
  return stdout.toString().trim();
}

// Print the list of colors added/removed/changed by date.
// Pretty inefficient due to the many git commands (optimized for clarity)
async function main() {

  // Grab the list of all git commits
  const allCommits = cmd("git log --pretty=format:%h").split("\n").filter(Boolean);

  // The data, one element for each commit (date)
  const dat = [];

  for (const commit of allCommits) {

    // Figure out what changed in that particular commit
    const diff = cmd(`git show ${commit} -- ./src/colornames.csv`)
      .split("\n").filter(Boolean);

    // Grab the date for said commit
    const dt = cmd(`git show -s ${commit} --format=%ci`);

    // The list of color modified (indexed by hex value) with "op" (+/-/~)
    const modified = {};

    for(const line of diff) {
      const res = line.match(/^((?<op>(\+|-)))(?<name>[^,]+),(?<hex>[^,]+)/)
      if(!res) { continue; }
      const name = res.groups?.name;
      const hex = res.groups?.hex;
      var op = res.groups?.op;

      // If a value already introduced with a different op, then it's
      // a modification
      if(modified[hex] && modified[hex].op !== op) { op = "~" }

      modified[hex] = { hex, name, op };
    }

    // Partition by added/removed/changed

    const added = Object.values(modified)
      .filter(x => x.op === "+")
      .map(({name, hex}) => ({ name, hex }));

    const removed = Object.values(modified)
      .filter(x => x.op === "-")
      .map(({name, hex}) => ({ name, hex }));

    const changed = Object.values(modified)
      .filter(x => x.op === "~")
      .map(({name, hex}) => ({ name, hex }));

    // Add the day
    dat.push({ date: dt, added, removed, changed });
  }

  console.log(JSON.stringify(dat));
}

main()
