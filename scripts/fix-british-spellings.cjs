const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../src/colornames.csv');
let csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n');

// Patterns from tests/british-spelling.test.js
const americanToBritishPatterns = [
    [/\b(\w*)(arb|arm|behavi|col|enam|endeav|fav|ferv|flav|glam|harb|hon|hum|lab|neighb|od|parl|rum|sav|splend|val|vap|vig)or(ed|ing|y|ful|less|able|er|ist|hood|ite|al|ly|s)?\b/gi, '$1$2our$3'],
    [/\b(\w*)(agon|appet|apolog|author|capital|caramel|categor|character|colon|critic|crystall|emphas|energ|equal|fantas|fertil|final|fossil|legal|maxim|memor|mesmer|minim|mobil|modern|normal|optim|organ|paraly|popular|priorit|real|recogn|stabil|standard|summar|symbol|synchron|tantal|terror|util|vandal|vapor|visual|vulcan)iz(e|ed|es|ing|er|ation|able)\b/gi, '$1$2is$3'],
    [/\b(calib|cent|epicent|fib|goit|lit|lust|meag|met|nit|och|reconnoit|sab|scept|sepulch|somb|spect|theat|tit)er\b/gi, '$1re'],
    [/\b(maneuver)\b/gi, 'manoeuvre'],
    [/\b(mit)er\b/gi, '$1re'],
    [/\b(def|off|pret|lic)ense\b/gi, '$1ence'],
    [/\b(anal|catal|dial|monol|prol)og\b/gi, '$1ogue'],
    [/\b(\w*)(bevel|cancel|carol|channel|fuel|label|level|model|panel|signal|travel)(ed|ing)\b/gi, '$1$2l$3'],
    [/\bgray(\w*)\b/gi, 'grey$1'],
    [/\b(A|a)irplane(\w*)\b/g, '$1eroplane$2'],
    [/\b(A|a)lmanac\b/g, '$1lmanack'],
    [/\b(A|a)rcheolog(\w*)\b/g, '$1rchaeolog$2'],
    [/\b(A|a)rtifact(\w*)\b/g, '$1rtefact$2'],
    [/\b(B|b)ougainvillea\b/g, '$1ougainvillaea'],
    [/\b(C|c)heckered\b/g, '$1hequered'],
    [/\b(C|c)hili\b/g, '$1hilli'],
    [/\b(C|c)himera\b/g, '$1himaera'],
    [/\b(C|c)ozy\b/g, '$1osy'],
    [/\b(D|d)isk\b/g, '$1isc'],
    [/\b(D|d)onut(\w*)\b/g, '$1oughnut$2'],
    [/\b(D|d)raft(\w*)\b/g, '$1raught$2'],
    [/\b(E|e)on\b/g, '$1eon'],
    [/\b(G|g)riffin\b/g, '$1ryphon'],
    [/\b(H|h)emoglobin\b/g, '$1aemoglobin'],
    [/\b(H|h)omeopath(\w*)\b/g, '$1omoeopath$2'],
    [/\b(J|j)ewelry\b/g, '$1ewellery'],
    [/\b(M|m)arvelous\b/g, '$1arvellous'],
    [/\b(M|m)edieval\b/g, '$1ediaeval'],
    [/\b(M|m)old(y|er)?\b/g, '$1ould$2'],
    [/\b(M|m)ustache\b/g, '$1oustache'],
    [/\b(P|p)ajamas\b/g, '$1yjamas'],
    [/\b(P|p)low(\w*)\b/g, '$1lough$2'],
    [/\b(M|m)olt(?!en)(\w*)\b/g, '$1oult$2'],
    [/\b(S|s)keptic(\w*)\b/g, '$1ceptic$2'],
    [/\b(S|s)molder(\w*)\b/g, '$1moulder$2'],
    [/\b(S|s)ulfur(\w*)\b/g, '$1ulphur$2'],
    [/\b(T|t)ranquility\b/g, '$1ranquillity'],
    [/\b(W|w)ool(en|y)\b/g, '$1ooll$2'],
    [/\b(Y|y)ogurt\b/g, '$1oghurt'],
    [/\b(A|a)luminum\b/g, '$1luminium'],
    [/\b(A|a)ging\b/g, '$1geing'],
];

// Load allowlist
const allowlist = require('../tests/british-spelling-allowlist.json').map(w => w.toLowerCase());
const allowlistSet = new Set(allowlist);

let fixedCount = 0;

const newLines = lines.map(line => {
    if (!line.trim()) return line;
    const parts = line.split(',');
    if (parts.length < 2) return line;

    let name = parts[0]; // Format: name,hex,good name
    const originalName = name;

    if (allowlistSet.has(name.toLowerCase())) return line;

    for (const [pattern, replacement] of americanToBritishPatterns) {
        if (name.match(pattern)) {
            // console.log(`Match: ${name} with ${pattern}`);
            name = name.replace(pattern, replacement);
        }
    }

    if (name !== originalName) {
        fixedCount++;
        console.log(`Fixed: "${originalName}" -> "${name}"`);
        parts[0] = name;
        return parts.join(',');
    }
    return line;
});

fs.writeFileSync(csvPath, newLines.join('\n'));
console.log(`Fixed ${fixedCount} spellings.`);
