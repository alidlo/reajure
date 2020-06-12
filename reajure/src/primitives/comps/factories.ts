import * as r from "react"
import {h} from "react-hype"
import * as rn from "../../impl/native-deps"
import * as sh from "../styles"
import * as vd from "../vdom"

// 3. move breakpoint of of useStyle.
// ## View Component 
        
export type ViewOptions = {style?: sh.DynamicStyle}

export function createView(sh: sh.Stylesheet, 
                           opts: ViewOptions) {
  const vw = h.wrap(rn.View)
  return h.fwd((p, ref) => {
    const style = sh.all(sh.useStyle(opts.style), 
                         sh.useStyle(p.style))
    return vw({...p, ref, style}, 
              p.children)})}

// ## Text Component
  
export type TextOptions = Omit<rn.Text["props"], "style" | "children"> &  
                          {style?: sh.DynamicStyle}
type TextChildren = string | string[]

export function createText(sh: sh.Stylesheet, 
                           opts: TextOptions) {
  const txt = h.wrap(rn.Text)
  return h.fwd((p, ref) => {
    const style = sh.all(sh.useStyle(opts.style), 
                         sh.useStyle(p.style))
    return txt({...p, ref, style}, 
               p.children)})}

// ## Label Component
               
export type LabelProps = Omit<rn.View["props"], "style" | "children"> &  
                         {style?: sh.DynamicStyle,
                          textStyle?: sh.DynamicStyle}
                
export function createLabel(sh: sh.Stylesheet,
                            {vw, txt}: {vw: ReturnType<typeof createView>,
                                        txt: ReturnType<typeof createText>}) {
  return h<LabelProps, TextChildren>(p => {
    const style = sh.useStyle(p.style),
          textStyle = sh.useStyle(p.textStyle)
    return vw({...p, style},
              txt({style: textStyle}, p.children))})}
      
// ## Button Component 
              
export type ButtonOptions = {style?:     sh.DynamicStyle,
                             textStyle?: sh.DynamicStyle}

export type ButtonProps = Omit<rn.TouchableWithoutFeedback["props"], "style" | "children"> &  
                          {style?:      sh.DynamicStyle,
                           textStyle?:  sh.DynamicStyle}
          
export function createButton(sh: sh.Stylesheet, 
                             opts: ButtonOptions,
                             {vw, txt}: {vw: ReturnType<typeof createView>,
                                         txt: ReturnType<typeof createText>}) {
  const tch = h.wrap(rn.Touchable)
  return h<ButtonProps, TextChildren>(p => {
    const 
      ref               = r.useRef(),
      [focus, setFocus] = r.useState(false),
      [press, setPress] = r.useState(false),
      hover             = vd.useHover(ref),
      conds             = {hover, focus, press},
      style             = sh.all(sh.useStyle(opts.style, conds), 
                                 sh.useStyle(p.style, conds)),
      textStyle         = sh.all(sh.useStyle(opts.textStyle, conds), 
                                 sh.useStyle(p.textStyle, conds)),
      onFocus = (e) => {
        setFocus(true)
        p.onFocus && p.onFocus(e)},
      onBlur = (e) => {
        setFocus(false)
        p.onBlur && p.onBlur(e)},
      onPressIn = (e) => {
        setPress(true)},
      onPressOut = (e) => {
        setPress(false)}
    return tch({onPress: p.onPress,
                onPressIn,
                onPressOut,
                onFocus,
                onBlur}, 
               vw({ref, 
                   style},
                  txt({style: textStyle}, p.children)))})}

// ## Link Component

export type LinkOptions = {style?: sh.TextStyle}

export type LinkProps = {style?: sh.DynamicStyle,
                         href: string}
  
export function createLink(sh: sh.Stylesheet, 
                           opts: LinkOptions, 
                           {txt}: {txt: ReturnType<typeof createText>}) {
  return h<LinkProps, string>(
    r.forwardRef((p, ref) => {
      const style = sh.all(sh.useStyle(opts.style), 
                           sh.useStyle(p.style))
      return txt({ref,
                  style,
                  accessibilityRole: "link",
                  href: p.href,
                  onPress: () => rn.Linking.openURL(p.href)},
                 p.children)}))}
         
// ## Input Component 
         
export type InputOptions = {style?: sh.DynamicStyle,
                            textStyle?: sh.DynamicStyle}

export type InputProps = Omit<rn.TextInput["props"], "style" | "children"> & 
                         {style?: sh.DynamicStyle,
                          textStyle?: sh.DynamicStyle}

export function createInput(sh: sh.Stylesheet, 
                            opts: InputOptions, 
                            {vw}: {vw: ReturnType<typeof createView>}) {
  const txtIpt = h.wrap(rn.TextInput)
  return h<InputProps, undefined>(p => {
    const ref        = r.useRef(),
          [focus, setFocus] = r.useState(false),
          hover      = vd.useHover(ref),
          conds      = {hover, focus},
          style      = sh.all(sh.useStyle(opts.style, conds),
                              sh.useStyle(p.style, conds)),
          textStyle  = sh.all(sh.useStyle(opts.textStyle, conds),
                              sh.useStyle(p.textStyle, conds)),
          onFocus = (e) => {
            setFocus(true)
            p.onFocus && p.onFocus(e)},
          onBlur = (e) => {
            setFocus(false)
            p.onBlur && p.onBlur(e)}
    console.log("input!!")
    console.log(style)
    return vw({ref, style},
              txtIpt({...p, 
                      onFocus,
                      onBlur,
                      style: textStyle}))})}
