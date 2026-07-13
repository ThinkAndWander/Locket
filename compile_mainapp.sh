#!/bin/bash
set -e

# Copy the story to the website build so story.md can keep its MD file extension.
# Do this first so it gets picked up with compilation
cp -f "story.md" "app/story.md.ts" # copy and overwrite from source
sed -i 's/`/\\`/g' "app/story.md.ts" # escape backticks so the user can type them plainly
sed -i -z 's/^/export const mainStory = \`/' "app/story.md.ts" # prepend a name so it can be accessed
echo "\`" >> "app/story.md.ts" # append the last backtick making it an exported string literal

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