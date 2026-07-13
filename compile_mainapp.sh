#!/bin/bash
set -e

# Copy the story to the website build so story.md can keep its MD file extension for ease-of-use.
echo "export const mainStory = \`" > "app/story.md.ts"
cat "story.md" >> "app/story.md.ts"
echo "\`" >> "app/story.md.ts"

# Compile app/main.ts into build/app/main.js and dependencies
npx tsc

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