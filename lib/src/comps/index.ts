import {h} from "react-hype"
import * as rn from "../native-deps"
import * as r from "../react"
import * as l from "../lang"
import * as sh from "../styles/stylesheet"

// ### React native components

const vw = h.wrap(rn.View)

type TextChildren = string | string[]
const txt = h.wrap(rn.Text)

export type TouchProps = rn.Touchable["props"]
export type TouchChildren  = TouchProps["children"]
const tch = h.wrap(rn.Touchable)

export type TextInputProps = rn.TextInput["props"]
const txtIpt = h.wrap(rn.TextInput)

// ## Component Factory

type Options = {btn: ButtonOptions,
                lnk: LinkOptions,
                ipt: InputOptions}

const defaultOptions = {btn: {},
                        lnk: {},
                        ipt: {}}

export function createComponents(sh: sh.Stylesheet, 
                                 opts: Options = defaultOptions){
  return {vw,
          txt,
          btn: createButton(sh, opts.btn),
          lbl: createLabel(sh),
          lnk: createLink(sh, opts.lnk),
          ipt: createInput(sh, opts.ipt)}}
  

// ### Button Component 

export type ButtonOptions = {style?: sh.ViewStyle,
                             textStyle?: sh.TextStyle,
                             hoverStyle?: sh.ViewStyle}
          
type ButtonProps = {onPress?: TouchProps["onPress"]
                    style?: sh.ViewStyle,
                    textStyle?: sh.TextStyle,
                    hoverStyle?: sh.ViewStyle}
          
function createButton(sh: sh.Stylesheet, 
                      opts: ButtonOptions) {
  return h<ButtonProps, TextChildren>(
    (p) => {
      const 
        ref       = r.useRef(),
        hvr       = r.useHover(ref),
        style     = sh.vw(opts.style, 
                          p.style, 
                          ...l.arr(hvr && [opts.hoverStyle, p.hoverStyle])),
        textStyle = sh.txt(opts.textStyle, 
                           p.textStyle)
      return tch(
        {ref,
         onPress: p.onPress, 
         style}, 
        txt({style: textStyle}, p.children))})}


// ### Label Component

export type LabelProps = {style?: sh.ViewStyle,
                          textStyle?: sh.TextStyle}
        
function createLabel(sh: sh.Stylesheet) {
  return h<LabelProps, TextChildren>(p => {
    return vw(
      {style: sh.vw(p.style)},
      txt({style: sh.txt(p.textStyle)}, p.children))})}
        
// ### Link Component

export type LinkOptions = {style?: sh.TextStyle}

export type LinkProps = {style?: sh.TextStyle,
                         href: string}

function createLink(sh: sh.Stylesheet, opts: LinkOptions) {
  return h<LinkProps, string>(
    (p, ref) => {
      return txt(
        {ref,
         accessibilityRole: "link",
         style: sh.txt(opts.style, p.style),
         onPress: () => rn.Linking.openURL(p.href),
         ...{href: p.href} as any /*untyped*/},
        p.children)},
    true)}

// ### Input Component 
 

export type InputOptions = {style?: sh.ViewStyle,
                            focusStyle?: sh.ViewStyle,
                            hoverStyle?: sh.ViewStyle}
      
export type InputProps = TextInputProps & {style?: sh.ViewStyle,
                                           focusStyle?: sh.ViewStyle,
                                           hoverStyle?: sh.ViewStyle
                                           children?: TextChildren}
      
function createInput(sh: sh.Stylesheet, opts: InputOptions) {
  return h<InputProps, TextChildren>((p, _ref) => {
    const ref = r.useRef(),
          [focus, setFocus] = r.useState(false),
          hvr = r.useHover(ref),
          style = sh.vw(opts.style, 
                        p.style, 
                        ...l.arr(hvr && [opts.hoverStyle, p.hoverStyle]),
                        ...l.arr(focus && [opts.focusStyle, p.focusStyle])),
          onFocus = (e) => {
            setFocus(true)
            p.onFocus && p.onFocus(e)},
          onBlur = (e) => {
            setFocus(false)
            p.onBlur && p.onBlur(e)}
    const textStyle = {}
    return vw(
      {ref, style},
      txtIpt({...p, 
              onFocus,
              onBlur,
              style: textStyle}, 
             p.children))})}
