#/shell/bash

# getImageColors 'https://upload.wikimedia.org/wikipedia/commons/a/a1/AmstradCPC_palette.png' cpc 32
# creates a cpc.txt with 32 colors from the download picture

# ! uses gawk (berw install gawk) & imagemagick (brew install imagemagick)

curl "$1" > "$2.png" &&
convert "$2.png" -colors $3 -depth 8 -format '%c' histogram:info:- \
    | sort --reverse --numeric-sort \
    | gawk 'match ($0, /^ *[0-9]+: \([^)]+\) (#[0-9A-F]+) .+$/, a) { print a[1] }' \
    | awk '{print tolower($0)}' \
    | tee "$2-palette.txt" \
    | while read colour; do convert -size 20x20 "xc:$colour" +depth miff:-; done \
    | montage - -geometry +0+0 "$2-palette.png"
