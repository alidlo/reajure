import {forwardRef} from "react"
import {h} from "react-hype"
import * as rn from "../native-deps"
import * as r from "../react"
import * as l from "../lang"
import * as sh from "../styles/stylesheet"

// ## Component Factory

type Options = {vw: ViewOptions,
                txt: TextOptions,
                btn: ButtonOptions,
                lnk: AnchorOptions,
                ipt: InputOptions}
                
const defaultOpts = {vw: {},
                     txt: {},
                     btn: {},
                     lnk: {},
                     ipt: {}}

export function createComponents(sh: sh.Stylesheet, 
                                 _opts?: Options) {
  const opts = {...(defaultOpts || {}), ..._opts}

  const vw  = createView(sh, opts.vw),
        txt = createText(sh, opts.txt),
        btn = createButton(sh, opts.btn, {txt}),
        lbl = createLabel(sh, {vw, txt}),
        ipt = createInput(sh, opts.ipt, {vw}),
        a   = createAnchor(sh, opts.lnk, {txt})
  return {vw, txt, btn, lbl, ipt, a}}
        
// ### View Component 
        
export type ViewOptions = {style?: sh.ViewStyle}

function createView(sh: sh.Stylesheet, 
                    opts: ButtonOptions) {
  const vw = h.wrap(rn.View)
  return h.fwd((p, ref) => vw({...p, ref, style: sh.all(opts.style, p.style)}, 
                              p.children))}

const s = h(p => {
  const style = sh.useStyle(p)

  return null as any
})

// ### Text Component
  
export type TextOptions = {style?: sh.TextStyle}
type TextChildren = string | string[]

function createText(sh: sh.Stylesheet, 
                    opts: TextOptions) {
  const txt = h.wrap(rn.Text)
  return h.fwd((p, ref) => txt({...p, ref, style: sh.all(opts.style, p.style)}, 
                               p.children))}
                               
// ### Button Component 

export type ButtonOptions = {style?: sh.ViewStyle,
  textStyle?: sh.TextStyle,
  hoverStyle?: sh.ViewStyle}
  
  type ButtonProps = {onPress?: rn.Touchable["props"]["onPress"]
  style?: sh.ViewStyle,
  textStyle?: sh.TextStyle,
  hoverStyle?: sh.ViewStyle}
  
function createButton(sh: sh.Stylesheet, 
                      opts: ButtonOptions,
                      {txt}: {txt: ReturnType<typeof createView>}) {
  const tch = h.wrap(rn.Touchable)
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
        
function createLabel(sh: sh.Stylesheet,
                     {vw, txt}: {vw: ReturnType<typeof createView>,
                                 txt: ReturnType<typeof createText>}) {
  return h<LabelProps, TextChildren>(p => {
    return vw(
      {style: sh.vw(p.style)},
      txt({style: sh.txt(p.textStyle)}, p.children))})}
      
// ### Link Component

export type AnchorOptions = {style?: sh.TextStyle}

export type AnchorProps = {style?: sh.TextStyle,
                           href: string}
  
function createAnchor(sh: sh.Stylesheet, 
                      opts: AnchorOptions, 
                      {txt}: {txt: ReturnType<typeof createText>}) {
  return h<AnchorProps, string>(
    forwardRef((p, ref) => {
      return txt(
        {ref,
         accessibilityRole: "link",
         style: sh.txt(opts.style, p.style),
         onPress: () => rn.Linking.openURL(p.href),
         ...{href: p.href} as any /*untyped*/},
        p.children)}))}
         
// ### Input Component 
         
export type InputOptions = {style?: sh.ViewStyle,
                            textStyle: sh.TextStyle,
                            focusStyle?: sh.ViewStyle,
                            hoverStyle?: sh.ViewStyle}

export type InputProps = Omit<rn.TextInput["props"], "children"> & 
                         {style?: sh.ViewStyle,
                          textStyle?: sh.TextStyle,
                          focusStyle?: sh.ViewStyle,
                          hoverStyle?: sh.ViewStyle}

function createInput(sh: sh.Stylesheet, 
                     opts: InputOptions, 
                     {vw}: {vw: ReturnType<typeof createView>}) {
  const txtIpt = h.wrap(rn.TextInput)
  return h<InputProps, undefined>(p => {
    const ref = r.useRef(),
          [fcs, setFocus] = r.useState(false),
          hvr = r.useHover(ref),
          style = sh.vw(opts.style, 
                        p.style, 
                        ...l.arr(hvr && [opts.hoverStyle, p.hoverStyle]),
                        ...l.arr(fcs && [opts.focusStyle, p.focusStyle])),
          onFocus = (e) => {
            setFocus(true)
            p.onFocus && p.onFocus(e)},
          onBlur = (e) => {
            setFocus(false)
            p.onBlur && p.onBlur(e)}
    return vw(
      {ref, style},
      txtIpt({...p, 
              onFocus,
              onBlur,
              style: sh.all(opts.textStyle, p.textStyle)}))})}
