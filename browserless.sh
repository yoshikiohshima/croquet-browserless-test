#!/bin/sh
# The script takes a specified puppeteer script whose file name is given as the second
# argument massage it if necessary, and sends the requst to run it the number of times
# specified as the third argument with the API key given as the first argument.

usage()
{
    echo "Usage: ./browserless.sh key_file_name script_name.js number"
}

if [[ -z "$3" || ! -f $1  || ! -f $2 || ! "$2" == *".js" ]]; then
    usage
    exit 1
fi

KEY=`cat $1| xargs`
B=`basename $2 .js`

if [ ! -f ${B}.min.js -o $2 -nt ${B}.min.js ]; then
    npx rollup $2 --config rollup.config.js --file ${B}.min.js
fi
JS=`cat ${B}.min.js`

CODE="{"'"code":''"'${JS}'"'',"context":{}}'""

COUNT=$3
if [[ "$COUNT" == "" ]]
then
    COUNT=1
fi

START=1
for (( i=$START; i<=$COUNT; i++ ))
do
  curl -X POST \
    "https://chrome.browserless.io/function?TOKEN=${KEY}" \
   -H 'Content-Type: application/json' \
   -d "${CODE}" &
done
