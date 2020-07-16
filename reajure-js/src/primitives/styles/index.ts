import {StyleSheet} from "react-native"
import * as rn from "../../impl/native-deps"
import {createTextStyles, 
        createViewStyle} from "./factories"
import type {NativeStyles, 
             Style, 
             ViewStyle,
             TextStyle} from "./factories"
import {createStyleHook,
        createMediaStyleHook,
        createActiveBreakpointsHook} from "./hooks"
import type {Breakpoint,
             DynamicStyle} from "./hooks"
import {createStyleFlattener, getPrimitiveStyle} from "./utilities"

export type {Breakpoint, DynamicStyle, Style, ViewStyle, TextStyle}

export type StylesheetFactory = typeof StyleSheet["create"]
export type Stylesheet = ReturnType<typeof createStyleSheet>

export type Options = {rem?: number,
                       breakpoints?: Record<Breakpoint, number>}
                     
export const defaultOpts = {rem: 16, 
                            breakpoints: {sm: 640,
                                          md: 768, 
                                          lg: 1024,
                                          xl: 1280}}

/**
 * Creates stylesheet `sh` for generating styles. 
 */
export function createStyleSheet(_opts?: Options) {
  const opts = {...defaultOpts, ..._opts},
        shf: StylesheetFactory = rn.StyleSheet.create,
        viewStyles = createViewStyle(shf, opts.rem),
        textStyles = createTextStyles(shf, opts.rem),
        styles = {...viewStyles, ...textStyles}
  function sh(...xs: Style[]) {return xs.map(x => getPrimitiveStyle(x, styles))}
  sh.all = createStyleFlattener(styles)
  sh.vw = createStyleFlattener<ViewStyle, NativeStyles>(viewStyles)
  sh.txt = createStyleFlattener<TextStyle, NativeStyles>(textStyles)
  sh.useActiveBreakpoints = createActiveBreakpointsHook(opts.breakpoints)
  sh.useStyle = createStyleHook()
  sh.useMediaStyle = createMediaStyleHook({useStyle: sh.useStyle, useActiveBreakpoints: sh.useActiveBreakpoints})
  return sh}
