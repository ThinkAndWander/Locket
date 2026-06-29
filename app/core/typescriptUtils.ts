/** Enables typechecking on property names for usage with Omit<T, "name">. You must type the name, but it's checked.
 * It's an unfortunate but negligible side effect that this has to exist in runtime.
 * Usage: Omit<myType, nameof<myType>('existingProperty') */
export const nameof = <T>(name: Extract<keyof T, string>): string => name;