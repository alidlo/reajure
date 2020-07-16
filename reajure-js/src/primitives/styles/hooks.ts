import * as r from "react"
import * as l from "../../impl/lang"
import {useDimensions} from "../vdom"
import type {Style} from "./factories"

type CondStyleInput
  <InputKey extends string = string> = Record<InputKey, boolean | Record<string, boolean>>

type CondStyleObjVal
  <CondKey extends string = string> = Record<CondKey, Style | Record<CondKey, Style>>

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

export type Breakpoint = "sm" | "md" | "lg" | "xl"

export type Options = {rem?: number,
                       breakpoints?: Record<Breakpoint, number>}

                          
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
export function createStyleHook() {
  return function useStyle
  <K extends string = string,
   V = CondStyleVal<K>>(ds: DynamicStyle<K, V>, 
                        conds: CondStyleInput<K> = {} as CondStyleInput<K>,
                        memoInputs: typeof getMemoizeStyleInputs = getMemoizeStyleInputs): Style { 
    return r.useMemo(
      () => { 
        if (!ds || !isDynamicStyle(ds)) {
          return (ds as Style) || []}
        else if (!(isStaticStyle(ds[0]) && (!ds[1] || isDynamicStyleCond(ds[1])))) {
          throw Error("Invalid style hook declaration.")}
        const [staticStyle, condStyles] = ds as DynamicStyleVal,
              activeStyles       = typeof condStyles === "function" 
                ? l.arr(condStyles(conds))
                : l.reduceKv(
                  (acc: Style[], k, cond) => { 
                    if (!cond) return acc 
                    const x = condStyles[k]
                    return acc.concat(l.arr(extractCondStyle(cond, x)))}, 
                  [],
                  conds)
        return [...l.arr(staticStyle), ...activeStyles] as Style},
      memoInputs(ds, conds))}}

/**
 * Hook similar to useStyles but with `media` query conditions included in `conds` options.
 */
export function createMediaStyleHook(opts: {useActiveBreakpoints: ReturnType<typeof createActiveBreakpointsHook>,
                                            useStyle: ReturnType<typeof createStyleHook>}) {
  return function useMediaStyle
    <K extends string = string>(ds: DynamicStyle<K, Record<K, Style> & {media?: Record<Breakpoint, Style>}>, 
                                conds: CondStyleInput<K> = {} as CondStyleInput<K>) {
    const bps = opts.useActiveBreakpoints()
    return opts.useStyle(
      ds, 
      {media: bps.reduce((acc, k) => ({...acc, [k]: true})),
       ...conds},
      (ds, {media, ...inputs}) => {
        // Only recompute if largest breakpoint width changed
        // (Media map keys are ordered in order they were created from breakpoint list.)
        return [Object.keys(media)[bps.length - 1],
                ...getMemoizeStyleInputs(ds, inputs)]})}}
              
/**
 * Hook to use list active breakpoints, ordered from smallest to largest (i.e. mobile-first). 
 * By default uses breakpoint record `bpr` passed to StyleSheet factory options.
 * i.e. ["sm", "md"]
 **/ 
export function createActiveBreakpointsHook(bpr: Record<Breakpoint, number>) {
  return function useActiveBreakpoints() {
    const dims = useDimensions()
    return r.useMemo(
      () => l.some(["xl", "lg", "md", "sm"], 
                   (k, i, arr) => dims.window.width >= bpr[k] && arr.slice(i, arr.length).reverse()) ||[],
      [dims.window.width])}}


/* Extracts possible nested style `condStyles` based on active conditions `conds`. */
function extractCondStyle(cond: boolean | CondStyleInput, condStyles: CondStyleVal<any, any>) {
  if (typeof cond === "boolean" || (Array.isArray(cond) || typeof cond !== "object")) return condStyles
  return l.reduceKv(
    (acc, k, v) => {
      // nested obj might be actual style object, e.g. [[], [{hover: {:background "blue"}}]]
      // since nested style condition values are booleans we treat any object values here as styles.
      if (typeof v === "object") return acc.concat(l.arr(v))
      return v ? acc.concat(l.arr(condStyles[k])) : acc},
    [],
    cond)}

/**
 * Gets memo inputs for dynamic styles `ds` and conditions `conds`.
 * Note: Only recomputing styles if their length changed. 
 * This works well enough for shorthand styles (e.g. ["m2", "p1"]) but not objects (revisit if/when its an issue).
 */
function getMemoizeStyleInputs(ds: DynamicStyle<string, any>, conds: CondStyleInput): any[] {
  const getStaticStyleValues = (x) => isDynamicStyle(x) ? getStaticStyleValues(x[0]) : Object.values(x)
  const condsInputs = l.reduceKv((acc: any[], _, v) => acc.concat(typeof v === "object" ? Object.values(v) : [v]),
                                 [],
                                 conds)
  return !Array.isArray(ds) ? [ds/*obj style*/, ...condsInputs] : [...getStaticStyleValues(ds), ...condsInputs]}


function isStaticStyle(v) { /** Check whether value `v` *could* be a valid static style declaration. */
  return typeof v !== "object" || Array.isArray(v)}

function isDynamicStyle(v) { /** Check whether value `v` is dynamic style declaration. */
  return Array.isArray(v) && Array.isArray(v[0]) && v.length <= 2}

function isDynamicStyleCond(v) { /** Check whether value `v` is valid dynamic style argument. */
  return typeof v !== "object" || typeof v !== "function"} 
