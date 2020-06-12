import {StyleSheet} from "react-native"
import * as r from "react"
import * as rn from "../../impl/native-deps"
import * as l from "../../impl/lang"
import {useDimensions} from "../vdom"
import {NativeStyles, 
        Style, 
        ViewStyle,
        TextStyle,
        createTextStyles, 
        createViewStyle} from "./factories"

export {ViewStyle, TextStyle}
export type StylesheetFactory = typeof StyleSheet["create"]
export type CustomStyle<Key extends string> = {[k in Key]: NativeStyles}

export type CondStyleObjValue
  <CondKey extends string = string> = Record<CondKey, Style | Record<string, Style>>

export type CondStyleObj
  <CondKey extends string = string,
   CondObj = CondStyleObjValue<CondKey>> = CondObj

export type CondStyleFn
  <CondKey extends string = string> = (args: Record<CondKey, boolean>) => Style

export type CondStyleValue
  <CondKey extends string = string,
   CondObj = CondStyleObjValue<CondKey>> = CondObj | CondStyleFn<CondKey> 

export type DynamicStyleValue 
  <CondKey extends string = string,
   CondObj = CondStyleObjValue<CondKey>> = [Style/*static style, required,*/, 
                                            CondStyleValue<CondKey, CondObj>]

export type DynamicStyle
  <CondKey extends string = string,
   CondObj = CondStyleObjValue<CondKey>> = Style | DynamicStyleValue<CondKey, CondObj>

export type Stylesheet = ReturnType<typeof createStyleSheet>

export type Breakpoint = "sm" | "md" | "lg" | "xl"

export type Options = {rem?: number,
                       breakpoints?: Record<Breakpoint, number>}
                     
export const defaultOpts = {rem: 16, 
                            breakpoints: {sm: 640,
                                          md: 768, 
                                          lg: 1024,
                                          xl: 1280}}

/**
 * Creates stylesheet `sh` for generating rnw styles. 
 */
export function createStyleSheet(_opts?: Options) {
  const opts = {...defaultOpts, ..._opts}
  const shf: StylesheetFactory = rn.StyleSheet.create 

  const styles = {view: createViewStyle(shf, opts.rem),
                  text: createTextStyles(shf, opts.rem)}

  /** Create View and Text styles. */
  function sh(...vs: Style[]) { 
    return vs.map(v => ensureStyle(v, styles.view, styles.text))}

  /** Flatten styles, intended to be used when composing style arrays in props. */
  sh.all = (...vs: Style[]): NativeStyles[] => { 
    return vs.reduce<NativeStyles[]>(
      (acc, v) => acc.concat(Array.isArray(v) ? sh(...v) : [sh(v)]), 
      [])}
  
  /** Create RN View styles. */
  sh.vw = (...vs: ViewStyle[]): NativeStyles[] => { 
    return vs.reduce<NativeStyles[]>(
      (acc, v) => acc.concat(Array.isArray(v) ? sh.vw(...v) : ensureStyle(v, styles.view)), 
      [])}

  /** Create RN Text styles. */
  sh.txt = (...vs: TextStyle[]): NativeStyles[] => { 
    return vs.reduce<NativeStyles[]>(
      (acc, v) => acc.concat(Array.isArray(v) ? sh.txt(...v) : ensureStyle(v, styles.text)), 
      [])}
  
  /**
   * Create dynamic style `ds` with given `props`.
   * 
   * Accepts 2D style array where first index is static styles and second index is dynamic styles. 
   * Dynamic styles can be object of style conditions (i.e. `sm` or `hover`) resolved based on `props`
   * or a style function that gets called with `props`. 
   * i.e. [["h1"], {lg: ["h2"]}] 
   * 
   * Conditional styles `cs` must be second index, if no static styles are needed just pass empty array. 
   * i.e. [[], {hover: ["h1"]}]
   * 
   * Styles conditions are returned in order they were inserted into their condition object. 
   * i.e. {hover, focus} -> [hoverStyle, focusStyle] 
   */
  sh.useStyle = <K extends string = string>(
    ds: DynamicStyle<K, Record<K, Style> & {media?: Record<Breakpoint, Style>}>, 
    conds: Record<K, boolean> = {} as any
  ): Style => {
    // todo: bundled media into useStyle. oops.
    const bps = useActiveBreakpoints(opts.breakpoints)
    if (!ds || !isDynamicStyle(ds)) return (ds as Style) || []
    else if (!(isStaticStyle(ds[0]) && (!ds[1] || isDynamicStyleCond(ds[1])))) {
      throw Error("Invalid style hook declaration.")}
    const [style, condStyles] = ds as DynamicStyleValue,
          // x = console.log({style, condStyles}),
          dynamicStyles       = typeof condStyles === "function" 
            ? l.arr(condStyles(conds))
            : l.reduceKv(
              (acc: Style[], k, v) => {
                // console.log({k, conds: conds[k]})
                if (k === "media") return acc.concat(getBreakpointStyles(bps, v))
                else if (conds[k]) return acc.concat(v)
                else if (conds[k] !== undefined) return acc
                else throw Error(`Style hook condition "${k}" not found.`)}, 
                  condStyles as CondStyleObj<K>, 
              [])
    return [...l.arr(style), ...dynamicStyles] as Style
    // return r.useMemo(
    //   () => {
    //     console.log({conds})
    //     if (!ds || !isDynamicStyle(ds)) return (ds as Style) || []
    //     else if (!(isStaticStyle(ds[0]) && (!ds[1] || isDynamicStyleCond(ds[1])))) {
    //       throw Error("Invalid style hook declaration.")}
    //     const [style, condStyles] = ds as DynamicStyleValue,
    //           x = console.log({style, condStyles}),
    //           dynamicStyles       = typeof condStyles === "function" 
    //             ? l.arr(condStyles(conds))
    //             : l.reduceKv(
    //               (acc: Style[], k, v) => {
    //                 console.log({k, conds: conds[k]})
    //                 if (k === "media") return acc.concat(getBreakpointStyles(bps, v))
    //                 else if (conds[k]) return acc.concat(v)
    //                 else if (conds[k] !== undefined) return acc
    //                 else throw Error(`Style hook condition "${k}" not found.`)}, 
    //               condStyles as CondStyleObj<K>, 
    //               [])
    //     return [...l.arr(style), ...dynamicStyles] as Style},
    //   // Only recompute if largest breakpoint width changed.
    //   // todo: memo cond inputs
    //   [bps[bps.length - 1], ...Object.values(conds)])
  }
  return sh}

/**
 * Gets list active mobile-first breakpoints, ordered from smallest to largest. 
 * i.e. ["sm", "md"]
 */ 
function useActiveBreakpoints(bpr: Record<Breakpoint, number>) {
  const dims = useDimensions()
  return r.useMemo(
    () => l.some(["xl", "lg", "md", "sm"], 
                 (k, i, arr) => dims.window.width >= bpr[k] && arr.slice(i, arr.length).reverse()) ||[],
    [dims.window.width])}

/**
 * Extracts styles of active breakpoints `bps` from style conditions `sc`.
 * Returned styles are ordered as per breakpoint array. 
*/
function getBreakpointStyles(bps: Breakpoint[], sc) {
  return bps.reduce((acc, k) => !sc[k] ? acc : acc.concat(sc[k]),
                    [])}

/** Ensure value `v` is valid style; if it's a key must exist in given `objs`. */
function ensureStyle(v: string | object | boolean, ...objs: object[]) {
  // If style is falsy or an object (in RNW object styles are returned as numbers) we return as is.
  if (!v || typeof v === "object" || typeof v === "boolean" || typeof v === "number") return v 
  const kv = l.some(objs, o => o[v])
  if (!kv) throw Error(`Stylesheet key "${v}" does not exist`)
  return kv}

function isStaticStyle(v) { /** Check whether value `v` *could* be a valid static style declaration. */
  return typeof v !== "object" || Array.isArray(v)}

function isDynamicStyle(v) { /** Check whether value `v` is dynamic style declaration. */
  return Array.isArray(v) && Array.isArray(v[0]) && v.length <= 2}

function isDynamicStyleCond(v) { /** Check whether value `v` is valid dynamic style argument. */
  return typeof v !== "object" || typeof v !== "function"} 

