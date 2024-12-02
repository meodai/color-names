# git log --follow -pU0 --date=iso -- src/colornames.csv | grep '^+[^+]\|^Date'
git log --follow -pU0 --date=iso -- src/colornames.csv | awk '/^Date:/ { date = $2 } /^+[^+]/ { print date "," substr($0,2) }'
