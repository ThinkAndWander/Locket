# Locket

A cozy slice-of-life adventure where you find the meaning of life by living.

## Compilation instructions for programmers

See License.md for source code usage rights.

This is written in
[TypeScript](https://www.typescriptlang.org/), which requires
[node & npm](https://www.npmjs.com/get-npm). Install those first. You can build this with ([Git Bash](https://gitforwindows.org/)) in a Bash-enabled terminal by running:

```
git clone https://github.com/ThinkAndWander/Locket.git
cd Locket
npm install
npm run build
```

[ESLint](https://eslint.org/) is enabled in this project for linting. If you use VSCode, go to Extensions and search ESLint to install it for inline support.

## Typescript patterns

- Avoid `any` and `unknown`. Comment why if used
- Avoid classes or functions in types, for easy de/serialization and typesafety. Deserialize to `Partial<T>`
- Specify a return type for functions
- Prefer `const enum`
- In types, comment what the default value should be and only meaningful comments/ Prefer `/** multline */`
- Use _underscore to indicate private variables (even outside of classes)