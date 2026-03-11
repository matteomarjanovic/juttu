#!/bin/sh
set -e
export ORIGIN="${ORIGIN:-https://${PUBLIC_HOSTNAME}}"
exec node build
