#!/bin/sh
if [ "$RUN_SETUP" = "true" ]; then
  /usr/local/bin/setup
fi
exec "$@"