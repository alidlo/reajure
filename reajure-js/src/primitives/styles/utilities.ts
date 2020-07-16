import type {NativeStyles, 
             Style} from "./factories"
  
/**
 * Create factory for flattening+mapping style values to their respective primitives.
 * Any key shorthands (e.g. "fs1") are mapped to their `styles` value; other style primitives are left as is.
 */
export function createStyleFlattener<In = Style, Out = NativeStyles>(styles: object) {
  return function mapStyles(...xs: In[]): Out[] { 
    return xs.reduce<Out[]>(
      (acc, x) => acc.concat(Array.isArray(x) ? mapStyles(...x) : [getPrimitiveStyle(x, styles)]), 
      [])}}

/** 
 * Ensure value `x` is valid style. 
 * If it's a key must exist in given `styles` object. 
 * */
export function getPrimitiveStyle(x: Style | object | boolean, styles: object) {
  // If style is falsy or an object (in RNW object styles are returned as numbers) we return as is.
  if (!x || typeof x === "object" || typeof x === "boolean" || typeof x === "number") return x
  const kv = styles[x]
  if (!kv) throw Error(`Stylesheet key "${x}" does not exist`)
  return kv}
