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

## Typescript patterns

Don't use `any` or `unknown` if avoidable; comment why if you do use them.
When deserializing JSON, wrap the type in Partial<T>.

Code defensively against runtime bugs, not programmers. Well-placed comments suffice. Prefer `/** multiline */` comments for intellisense.

**For ease of use**
1. Use constants instead of enums for maximum intercompatibility in Typescript. This sacrifices negligible speed gains of enums or const enums to favor readability when serialized to JSON and avoid ordinal issues or having to set every value to a number.
```
const myEnum = {
    myValue: "myValue" // same exact spelling
}
```

2. Use types with static functions to create instances, instead of classes. For several reasons:
- Potential runtime errors due to passing functions outside the class but not using captures or .bind
- Potential runtime errors as Typescript allows object literals to count even though they don't have the inherited members
- Better Typescript coverage with basic types than with classes. Fewer sticky situations.

Programmers are smart, so we can overcome encapsulation. Comment "this is private" or "this is auto-computed data" as applicable, and use static functions to 

Use static functions to create the types if you want to control their shape.
Programmers are smart, we can overcome encapsulation by just commenting "this is private", "this is computed/derived data", etc. There is no need to try guarding against it otherwise.