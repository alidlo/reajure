import {forwardRef} from "react"
import {h} from "react-hype"
import * as rn from "../native-deps"
import * as r from "../react"
import * as l from "../lang"
import * as sh from "../styles/stylesheet"

// ## Component Factory

type Options = {vw:  ViewOptions,
                txt: TextOptions,
                btn: ButtonOptions,
                lnk: AnchorOptions,
                ipt: InputOptions}
                
const defaultOpts = {vw: {},
                     txt: {},
                     btn: {},
                     lnk: {},
                     ipt: {}}

/**
 * Create component `c` kit.
 * Accepts stylesheet `sh` and component `opts`.
*/
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
        
export type ViewOptions = {style?: sh.DynamicStyle}

function createView(sh: sh.Stylesheet, 
                    opts: ViewOptions) {
  const vw = h.wrap(rn.View)
  return h.fwd((p, ref) => {
    const style = sh.all(sh.useStyle(opts.style), 
                         sh.useStyle(p.style))
    return vw({...p, ref, style}, 
              p.children)})}

// ### Text Component
  
export type TextOptions = {style?: sh.DynamicStyle}
type TextChildren = string | string[]

function createText(sh: sh.Stylesheet, 
                    opts: TextOptions) {
  const txt = h.wrap(rn.Text)
  return h.fwd((p, ref) => {
    const style = sh.all(sh.useStyle(opts.style), 
                         sh.useStyle(p.style))
    return txt({...p, ref, style}, 
               p.children)})}
                               
// ### Button Component 

export type ButtonOptions = {style?:     sh.DynamicStyle,
                             textStyle?: sh.DynamicStyle}
  
type ButtonProps = {onPress?:    rn.Touchable["props"]["onPress"]
                    style?:      sh.DynamicStyle,
                    textStyle?:  sh.DynamicStyle}
  
function createButton(sh: sh.Stylesheet, 
                      opts: ButtonOptions,
                      {txt}: {txt: ReturnType<typeof createView>}) {
  const tch = h.wrap(rn.Touchable)
  return h<ButtonProps, TextChildren>(
    (p) => {
      const 
        ref       = r.useRef(),
        hvr       = r.useHover(ref),
        style     = sh.all(sh.useStyle(opts.style), 
                           sh.useStyle(p.style)),
        textStyle = sh.all(sh.useStyle(opts.textStyle), 
                           sh.useStyle(p.textStyle))
      return tch({ref,
                  style,
                  onPress: p.onPress}, 
                 txt({style: textStyle}, p.children))})}
          
// ### Label Component

export type LabelProps = {style?: sh.DynamicStyle,
                          textStyle?: sh.DynamicStyle}
        
function createLabel(sh: sh.Stylesheet,
                     {vw, txt}: {vw: ReturnType<typeof createView>,
                                 txt: ReturnType<typeof createText>}) {
  return h<LabelProps, TextChildren>(p => {
    const style = sh.useStyle(p.style),
          textStyle = sh.useStyle(p.textStyle)
    return vw({style},
              txt({style: textStyle}, p.children))})}
      
// ### Link Component

export type AnchorOptions = {style?: sh.TextStyle}

export type AnchorProps = {style?: sh.DynamicStyle,
                           href: string}
  
function createAnchor(sh: sh.Stylesheet, 
                      opts: AnchorOptions, 
                      {txt}: {txt: ReturnType<typeof createText>}) {
  return h<AnchorProps, string>(
    forwardRef((p, ref) => {
      const style = sh.all(sh.useStyle(opts.style), 
                           sh.useStyle(p.style))
      return txt({ref,
                  style,
                  accessibilityRole: "link",
                  href: p.href,
                  onPress: () => rn.Linking.openURL(p.href)},
                 p.children)}))}
         
// ### Input Component 
         
export type InputOptions = {style?: any, // sh.ViewStyle,
                            textStyle: sh.TextStyle}

export type InputProps = Omit<rn.TextInput["props"], "style" | "children"> & 
                         {style?: sh.DynamicStyle,
                          textStyle?: sh.DynamicStyle}

function createInput(sh: sh.Stylesheet, 
                     opts: InputOptions, 
                     {vw}: {vw: ReturnType<typeof createView>}) {
  const txtIpt = h.wrap(rn.TextInput)
  return h<InputProps, undefined>(p => {
    const ref = r.useRef(),
          [focus, setFocus] = r.useState(false),
          hover             = r.useHover(ref),
          conds             = {hover, focus},
          style             = sh.all(sh.useStyle(opts.style, conds),
                                     sh.useStyle(p.style, conds)),
          textStyle         = sh.all(sh.useStyle(opts.textStyle, conds),
                                     sh.useStyle(p.textStyle, conds)),
          onFocus = (e) => {
            setFocus(true)
            p.onFocus && p.onFocus(e)},
          onBlur = (e) => {
            setFocus(false)
            p.onBlur && p.onBlur(e)}
    return vw({ref, style},
              txtIpt({...p, 
                      onFocus,
                      onBlur,
                      style: textStyle}))})}
