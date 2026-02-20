#!/bin/sh
echo 'Running database migrations...'
pnpm drizzle-kit migrate
echo 'Starting server...'
node dist/index.js