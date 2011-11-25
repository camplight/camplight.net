#!/bin/bash
# example: 
# /projects/camplight.net$ ./scripts/deploy-prod.sh <user>@<server>:<path>
target=$1
me=`dirname $0`
rsync -axvzco --exclude-from=$me/deploy-prod.exclude $me/../ $target