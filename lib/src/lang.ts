/**
 * Ensure an array of items.
 * Can also be used for creating a new array.
 */
export function arr<T>(v?: T | T[]): T[] {
  if (!v) return []
  return Array.isArray(v) ? v.slice() : [v]}

/**
 * Reduce an object key value pairs.
 * 
 * Passes callback to every key-value pair in an object.
 */
export function reduceKv
  <T extends Object = {}>(o: object, 
                          cb: (acc: T, k: string, v: any, i: number) => any,
                          initial: any = {}): T {
  return Object.keys(o).reduce(
    (acc, k, i) => cb(acc, k, o[k], i), 
    initial)}

/**
 * Get first truthy value in an array.
 * 
 * Passes callback to every item in an array, returning first truthy value. 
 * (This is unlike Javascript's `some` method, which returns only a boolean.)
 */
export function some<T>(arr: T[], 
                        cb: (v: T) => any = v => v) {
  for (let i = 0; i < arr.length; i++) {
    const result = cb(arr[i])
    if (result) return result}
  return false}
