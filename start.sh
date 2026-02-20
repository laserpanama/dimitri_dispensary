#!/bin/sh
echo 'Running migrations...'
pnpm drizzle-kit migrate
echo 'Starting server...'
node dist/index.js