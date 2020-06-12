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

export {Style, ViewStyle, TextStyle}
export type StylesheetFactory = typeof StyleSheet["create"]
export type CustomStyle<Key extends string> = {[k in Key]: NativeStyles}

type CondStyleInput
  <InputKey extends string = string> = Record<InputKey, boolean | Record<string, boolean>>

type CondStyleObjVal
  <CondKey extends string = string> = Record<CondKey, Style | Record<CondKey, Style>>

type CondStyleObj
  <CondKey extends string = string,
   CondObj = CondStyleObjVal<CondKey>> = CondObj

type CondStyleFn
  <CondKey extends string = string> = (args: CondStyleInput<CondKey>) => Style

type CondStyleVal
  <CondKey extends string = string,
   CondObj = CondStyleObjVal<CondKey>> = CondObj | CondStyleFn<CondKey> 

type DynamicStyleVal 
  <CondKey extends string = string,
   CondObj = CondStyleObjVal<CondKey>> = [Style/*static style, required,*/, 
                                          CondStyleVal<CondKey, CondObj>]

export type DynamicStyle
  <CondKey extends string = string,
   CondObj = CondStyleObjVal<CondKey>> = Style | DynamicStyleVal<CondKey, CondObj>

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
 * Creates stylesheet `sh` for generating styles. 
 * note: The exposed name is 'StyleSheet`, as two words, since that's how its named in React Native.
 */
export function createStyleSheet(_opts?: Options) {
  const opts = {...defaultOpts, ..._opts}
  const shf: StylesheetFactory = rn.StyleSheet.create 

  const styles = {view: createViewStyle(shf, opts.rem),
                  text: createTextStyles(shf, opts.rem)}

  /** 
   * Create View and Text stylesheets. 
   * */
  function sh(...vs: Style[]) { 
    return vs.map(v => ensureStyle(v, styles.view, styles.text))}

  /* Flatten styles, intended for composing style arrays. */
  sh.all = (...vs: Style[]): NativeStyles[] => {
    return vs.reduce<NativeStyles[]>(
      (acc, v) => acc.concat(Array.isArray(v) ? sh(...v) : [sh(v)]), 
      [])}
  
  /* Typed View styles. */ 
  sh.vw = (...vs: ViewStyle[]): NativeStyles[] => { 
    return vs.reduce<NativeStyles[]>(
      (acc, v) => acc.concat(Array.isArray(v) ? sh.vw(...v) : ensureStyle(v, styles.view)), 
      [])}

  /* Typed Text styles. */
  sh.txt = (...vs: TextStyle[]): NativeStyles[] => {
    return vs.reduce<NativeStyles[]>(
      (acc, v) => acc.concat(Array.isArray(v) ? sh.txt(...v) : ensureStyle(v, styles.text)), 
      [])}
  
  /**
   * Use list active breakpoints, ordered from smallest to largest (i.e. mobile-first). 
   * By default uses breakpoint record `bpr` passed to StyleSheet factory options.
   * i.e. ["sm", "md"]
   **/ 
  sh.useActiveBreakpoints = (bpr: Record<Breakpoint, number> = opts.breakpoints) => {
    const dims = useDimensions()
    return r.useMemo(
      () => l.some(["xl", "lg", "md", "sm"], 
                   (k, i, arr) => dims.window.width >= bpr[k] && arr.slice(i, arr.length).reverse()) ||[],
      [dims.window.width])}

  /**
   * Use dynamic style `ds` with given conditions `conds`.
   * 
   * Style can be a one of: 
   * 1) 1D array of static styles, e.g. ["flx1"]. 
   * 2) 2D array of static and dynamic styles, e.g. [["flx1"] {hover: ["bw1"]}]
   *    If no static styles are necessary, pass empty array, e.g. [[], {hover: ["bw1"]}]
   * 
   * Dynamic style `conds` can be one of:  
   * 1) a boolean, e.g. {hover: true})
   * 2) a map of booleans, e.g. {media: {lg: true}}
   * 
   * Styles conditions are returned in order received.
   * e.g. {hover, focus} -> [hoverStyle, focusStyle] 
   * fyi: JS maps are ordered as long as keys are non-numbers. 
   */
  sh.useStyle = 
    <K extends string = string,
     CondStyleVal = CondStyleObjVal<K>>(
      ds: DynamicStyle<K, CondStyleVal>, 
      conds: CondStyleInput<K> = {} as CondStyleInput<K>,
      memoInputs: typeof flattenStyleCondVals = flattenStyleCondVals
    ): Style => {
      console.log({conds, memos:  memoInputs(conds)})
      return r.useMemo(
        () => { 
          if (!ds || !isDynamicStyle(ds)) return (ds as Style) || []
          else if (!(isStaticStyle(ds[0]) && (!ds[1] || isDynamicStyleCond(ds[1])))) {
            throw Error("Invalid style hook declaration.")}
          const [staticStyle, condStyles] = ds as DynamicStyleVal,
                activeStyles       = typeof condStyles === "function" 
                  ? l.arr(condStyles(conds))
                  : l.reduceKv(
                    (acc: Style[], k, v) => {
                      const cond = conds[k]
                      if (cond) return acc.concat(typeof cond == "object" ? extractCondStyles(cond, v) : v)
                      else if (cond !== undefined) return acc
                      else throw Error(`Style hook condition "${k}" not found.`)}, 
                    [],
                    condStyles as CondStyleObj<K>)
          return [...l.arr(staticStyle), ...activeStyles] as Style
        }, 
        memoInputs(conds))
    }

  /**
   * Use styles with `media` condition included in `conds`.
   * See #sh.useStyles for usage details.
   */
  sh.useMediaStyle = <K extends string = string>(
    ds: DynamicStyle<K, Record<K, Style> & {media?: Record<Breakpoint, Style>}>, 
    conds: CondStyleInput<K> = {} as CondStyleInput<K>
  ) => {
    const bps = sh.useActiveBreakpoints()
    return sh.useStyle(ds, 
                       {media: bps.reduce((acc, k) => ({...acc, [k]: true})),
                        ...conds},
                       ({media, ...inputs}) => {
                         // Only recompute if largest breakpoint width changed
                         // (Media map keys are ordered in order they were created from breakpoint list.)
                         return [Object.keys(media)[bps.length - 1],
                                 ...flattenStyleCondVals(inputs)]})}

  return sh}


/* Extracts nested style `condStyles` based on active conditions `conds`. */
function extractCondStyles(conds: CondStyleInput, condStyles: CondStyleObj) {
  return l.reduceKv(
    (acc, k, v) => conds[k] ? acc.concat(l.arr(v)) : acc,
    [],
    condStyles)}

function flattenStyleCondVals(conds: CondStyleInput): any[] {
  return l.reduceKv(
    (acc: any[], _, v) => acc.concat(typeof v === "object" ? Object.values(v) : [v]),
    [],
    conds)}

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

