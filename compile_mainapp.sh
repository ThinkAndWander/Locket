#!/bin/bash
set -e

# Compile app/main.ts into build/app/main.js and dependencies
npx tsc

# copy the story to the website build
# We need to reference story.md, but I want to work with a pure .md file for all the compatibility benefits
# and copying it manually is annoying, and you can't import it without a whole server. So instead, just create
# the simplest wrapper around it all.
echo "export const mainStory = \`" > "app/story.md.ts"
cat "story.md" >> "app/story.md.ts"
echo "\`" >> "app/story.md.ts"

# Combine build/app/main.js and dependencies into website/mainapp.js
npx rollup build/app/main.js \
	--file website/mainapp.js \
	--format iife \
	--output.name mainapp \
	--context exports \
	--sourcemap \
	--plugin rollup-plugin-sourcemaps \
	--plugin @rollup/plugin-node-resolve

# Minify website/mainapp.js into website/mainapp.min.js
npx terser \
	website/mainapp.js \
	--source-map "content='website/mainapp.js.map',url=mainapp.min.js.map" \
	-o website/mainapp.min.js \
	--compress \
	--define OFFLINE=false \
	--mangle \
	--mangle-props regex="/^_.+/;"