import {StyleSheet,
        ViewStyle as RnViewStyle, 
        TextStyle as RnTextStyle} from "react-native"
import * as l from "../lib"
import * as rn from "../native-deps"

export type StylesheetFactory = typeof StyleSheet["create"]

export type NativeViewStyles = RnViewStyle 
export type NativeTextStyles = RnTextStyle
export type NativeStyles = NativeViewStyles | NativeTextStyles

export type CustomStyle<Key extends string> = {[k in Key]: NativeStyles}

/**
 * Stylesheet factory
 */

export type StyleKey = (ViewStyleKey | TextStyleKey)
export type Styles = (ViewStyles | TextStyles)

export type Style = 
  (StyleKey | Styles | NativeStyles | boolean)

export type ViewStyle = 
  (ViewStyleKey | ViewStyles | NativeViewStyles | boolean)

export type TextStyle = 
  (TextStyleKey | TextStyles | NativeTextStyles | boolean)

export type Stylesheet = 
  {(...vs: Style[]): NativeStyles[]
   vw:  (...vs: ViewStyle[]) => NativeStyles[]
   txt: (...vs: TextStyle[]) => NativeStyles[]}

type Options = {rem: number}

export const defaultOptions = {rem: 16}

export function createStylesheet(opts: Options = defaultOptions): Stylesheet {
  const shf: StylesheetFactory = rn.StyleSheet.create 

  const styles = {
    view: createViewStyle(shf, opts),
    text: createTextStyles(shf, opts)}

  function sh(...vs: Style[]): NativeStyles[] { 
    return vs.map(v => ensureObjOrKv(v, styles.view, styles.text))}

  sh.vw = (...vs: ViewStyle[]): NativeStyles[] => {
    return vs.map(v => ensureObjOrKv(v, styles.view))}

  sh.txt = (...vs: TextStyle[]): NativeStyles[] => {
    return vs.map(v => ensureObjOrKv(v, styles.text))}

  return sh}

// styles can either be a key and we get their stylesheet value 
// or they can be a style object and we return it as it is.
function ensureObjOrKv(v: string | object | boolean, ...objs: object[]) {
  if (!v || typeof v === "object" || typeof v === "boolean") return v 
  const kv = l.some(objs, o => o[v])
  if (!kv) throw Error(`Stylesheet key "${v}" does not exist`)
  return kv}

/**
 * View stylesheet factory
 */

export type ViewStyleKey = (FlexStyleKey | 
                            PositionStyleKey |
                            DimensionStyleKey |
                            SpacingStyleKey | 
                            BorderStyleKey | 
                            OpacityStyleKey)

export type ViewStyles = (FlexStyles | 
                          PositionStyles |
                          DimensionStyles |
                          SpacingStyles | 
                          BorderStyles | 
                          OpacityStyles)

export function createViewStyle(shf: StylesheetFactory, 
                                opts: Options): ViewStyles {
  const flexStyles   = createFlexStyles(shf),
        posStyles    = createPositionStyles(shf, opts.rem),
        dimStyles    = createDimensionStyles(shf, opts.rem),
        spaceStyles  = createSpacingStyles(shf, opts.rem),
        borderStyles = createBorderStyles(shf, opts.rem),
        opacStyles   = createOpacityStyles(shf)
  return {...flexStyles,
          ...posStyles,
          ...dimStyles,
          ...spaceStyles,
          ...borderStyles,
          ...opacStyles}}

/**
 * Text stylesheet factory
 */

export type TextStyleKey = (FontStyleKey)

export type TextStyles = (FontStyles)

export function createTextStyles(shf: StylesheetFactory, 
                                 opts: Options): TextStyles {
  const fontStyles = createFontStyles(shf, opts.rem)
  return {...fontStyles}}

/**
 * View and Text stylesheet modules
 */

/* Flex styles (view only) */

type FlexStyleKey =
  ("flx1" | "flxg1" | "flxdC" | "flxdR" | "flxdRR" | "flxdCR" | "flxW" |
   "aiFS" | "aiC" | "aiFE" | "aisFS" | "aisC" | "aisFE" | "aisS" |
   "jcFS" | "jcFE" | "jcC" | "jcSB" | "jcSA")

type FlexStyles = CustomStyle<FlexStyleKey>

function createFlexStyles(shf: StylesheetFactory) {
  return shf<FlexStyles>({
    flx1:    {flex: 1},
    flxg1:   {flexGrow: 1},
    flxdC:   {flexDirection: "column"},
    flxdR:   {flexDirection: "row"},
    flxdRR:  {flexDirection: "row-reverse"},
    flxdCR:  {flexDirection: "column-reverse"},
    flxW:    {flexWrap: "wrap"},
    aiFS:    {alignItems: "flex-start"},
    aiC:     {alignItems: "center"},
    aiFE:    {alignItems: "flex-end"},
    aisFS:   {alignSelf: "flex-start"},
    aisC:    {alignSelf: "center"},
    aisFE:   {alignSelf: "flex-end"},
    aisS:    {alignSelf: "stretch"},
    jcFS:    {justifyContent: "flex-start"},
    jcFE:    {justifyContent: "flex-end"},
    jcC:     {justifyContent: "center"},
    jcSB:    {justifyContent: "space-between"},
    jcSA:    {justifyContent: "space-around"}})} 

/* Position styles (view only) */


type PositionStyleKey = ("posA" | "posA0" | 
                          "tp0" | "tp1" | "tp2" | 
                          "rt0" | "rt1" | "rt2" |
                          "bt0" | "bt1" | "bt2" |
                          "lt0" | "lt1" | "lt2")

type PositionStyles = CustomStyle<PositionStyleKey>

function createPositionStyles(shf: StylesheetFactory, rem: number) {
  const nth = [1, 2].map(n => n * rem)
  return shf<PositionStyles>({
    posA:   {position: "absolute"},
    posA0:  {position: "absolute",
             top: 0,
             bottom: 0,
             right: 0,
             left: 0},
    tp0: 	  {top: 0},
    tp1: 	  {top: nth[0]},
    tp2: 	  {top: nth[1]},
    rt0: 	  {right: 0},
    rt1: 	  {right: nth[0]},
    rt2: 	  {right: nth[1]},
    bt0: 	  {bottom: 0},
    bt1: 	  {bottom: nth[0]},
    bt2: 	  {bottom: nth[1]},
    lt0: 	  {left: 0},
    lt1: 	  {left: nth[0]},
    lt2: 	  {left: nth[1]}})}


/* Dimension styles (view only) */

type DimensionStyleKey = ("h1"   | "h2"   | "h3"   | "h4"   | "h5" |
                        "mxh1" | "mxh2" |"mxh3"  |"mxh4"  | "mxh5" |
                        "mnh1" | "mnh2" | "mnh3" | "mnh4" | "mnh5" |
                        "w1"   | "w2"   | "w3"   | "w4"   | "w5" |
                        "mxw1" | "mxw2" | "mxw3" | "mxw4" | "mxw5" |
                        "mnw1" | "mnw2" | "mnw3" | "mnw4" | "mnw5")

type DimensionStyles = CustomStyle<DimensionStyleKey>
    
function createDimensionStyles(shf: StylesheetFactory, rem: number) {
  const nth = [1, 2, 4, 8, 16].map(n => n * rem)
  return shf<DimensionStyles>({
    /* heights */

    h1: {height: nth[0]},
    h2: {height: nth[1]},
    h3: {height: nth[2]},
    h4: {height: nth[3]},
    h5: {height: nth[4]},
    
    mxh1: {maxHeight: nth[0]},
    mxh2: {maxHeight: nth[1]},
    mxh3: {maxHeight: nth[2]},
    mxh4: {maxHeight: nth[3]},
    mxh5: {maxHeight: nth[4]},
    
    mnh1: {minHeight: nth[0]},
    mnh2: {minHeight: nth[1]},
    mnh3: {minHeight: nth[2]},
    mnh4: {minHeight: nth[3]},
    mnh5: {minHeight: nth[4]},
    

    /* widths */

    w1: {width: nth[0]},
    w2: {width: nth[1]},
    w3: {width: nth[2]},
    w4: {width: nth[3]},
    w5: {width: nth[4]},
    
    mxw1: {maxWidth: nth[0]},
    mxw2: {maxWidth: nth[1]},
    mxw3: {maxWidth: nth[2]},
    mxw4: {maxWidth: nth[3]},
    mxw5: {maxWidth: nth[4]},
    
    mnw1: {minWidth: nth[0]},
    mnw2: {minWidth: nth[1]},
    mnw3: {minWidth: nth[2]},
    mnw4: {minWidth: nth[3]},
    mnw5: {minWidth: nth[4]}})}

/* Spacing styles (view only) */

type SpacingStyleKey = ("m0"  | "m1"  | "m2"  | "m3"  | "m4"  | "m5"  |
                        "mh0" | "mh1" | "mh2" | "mh3" | "mh4" | "mh5" |
                        "mv0" | "mv1" | "mv2" | "mv3" | "mv4" | "mv5" |
                        "mt0" | "mt1" | "mt2" | "mt3" | "mt4" | "mt5" |
                        "mr0" | "mr1" | "mr2" | "mr3" | "mr4" | "mr5" |
                        "mb0" | "mb1" | "mb2" | "mb3" | "mb4" | "mb5" |
                        "ml0" | "ml1" | "ml2" | "ml3" | "ml4" | "ml5" |
                        "p0"  | "p1"  | "p2"  | "p3"  | "p4"  | "p5"  |
                        "ph0" | "ph1" | "ph2" | "ph3" | "ph4" | "ph5" |
                        "pv0" | "pv1" | "pv2" | "pv3" | "pv4" | "pv5" |
                        "pt0" | "pt1" | "pt2" | "pt3" | "pt4" | "pt5" |
                        "pr0" | "pr1" | "pr2" | "pr3" | "pr4" | "pr5" |
                        "pb0" | "pb1" | "pb2" | "pb3" | "pb4" | "pb5" |
                        "pl0" | "pl1" | "pl2" | "pl3" | "pl4" | "pl5")

type SpacingStyles = CustomStyle<SpacingStyleKey>

function createSpacingStyles(shf: StylesheetFactory, rem: number) {
  const nth = [0.25, 0.5, 1, 2, 4, 8].map(n => n * rem)
  return shf<SpacingStyles>({
    m0: {margin: 0},
    m1: {margin: nth[0]},
    m2: {margin: nth[1]},
    m3: {margin: nth[2]},
    m4: {margin: nth[3]},
    m5: {margin: nth[4]},
  
    mh0: {marginHorizontal: 0},
    mh1: {marginHorizontal: nth[0]},
    mh2: {marginHorizontal: nth[1]},
    mh3: {marginHorizontal: nth[2]},
    mh4: {marginHorizontal: nth[3]},
    mh5: {marginHorizontal: nth[4]},

    mv0: {marginVertical: 0},
    mv1: {marginVertical: nth[0]},
    mv2: {marginVertical: nth[1]},
    mv3: {marginVertical: nth[2]},
    mv4: {marginVertical: nth[3]},
    mv5: {marginVertical: nth[4]},
    
    mt0: {marginTop: 0},
    mt1: {marginTop: nth[0]},
    mt2: {marginTop: nth[1]},
    mt3: {marginTop: nth[2]},
    mt4: {marginTop: nth[3]},
    mt5: {marginTop: nth[4]},

    mr0: {marginRight: 0},
    mr1: {marginRight: nth[0]},
    mr2: {marginRight: nth[1]},
    mr3: {marginRight: nth[2]},
    mr4: {marginRight: nth[3]},
    mr5: {marginRight: nth[4]},
    
    mb0: {marginBottom: 0},
    mb1: {marginBottom: nth[0]},
    mb2: {marginBottom: nth[1]},
    mb3: {marginBottom: nth[2]},
    mb4: {marginBottom: nth[3]},
    mb5: {marginBottom: nth[4]},

    ml0: {marginLeft: 0},
    ml1: {marginLeft: nth[0]},
    ml2: {marginLeft: nth[1]},
    ml3: {marginLeft: nth[2]},
    ml4: {marginLeft: nth[3]},
    ml5: {marginLeft: nth[4]},
    p0: {padding: 0},
    p1: {padding: nth[0]},
    p2: {padding: nth[1]},
    p3: {padding: nth[2]},
    p4: {padding: nth[3]},
    p5: {padding: nth[4]},
  
    ph0: {paddingHorizontal: 0},
    ph1: {paddingHorizontal: nth[0]},
    ph2: {paddingHorizontal: nth[1]},
    ph3: {paddingHorizontal: nth[2]},
    ph4: {paddingHorizontal: nth[3]},
    ph5: {paddingHorizontal: nth[4]},

    pv0: {paddingVertical: 0},
    pv1: {paddingVertical: nth[0]},
    pv2: {paddingVertical: nth[1]},
    pv3: {paddingVertical: nth[2]},
    pv4: {paddingVertical: nth[3]},
    pv5: {paddingVertical: nth[4]},
    
    pt0: {paddingTop: 0},
    pt1: {paddingTop: nth[0]},
    pt2: {paddingTop: nth[1]},
    pt3: {paddingTop: nth[2]},
    pt4: {paddingTop: nth[3]},
    pt5: {paddingTop: nth[4]},

    pr0: {paddingRight: 0},
    pr1: {paddingRight: nth[0]},
    pr2: {paddingRight: nth[1]},
    pr3: {paddingRight: nth[2]},
    pr4: {paddingRight: nth[3]},
    pr5: {paddingRight: nth[4]},
    
    pb0: {paddingBottom: 0},
    pb1: {paddingBottom: nth[0]},
    pb2: {paddingBottom: nth[1]},
    pb3: {paddingBottom: nth[2]},
    pb4: {paddingBottom: nth[3]},
    pb5: {paddingBottom: nth[4]},

    pl0: {paddingHorizontal: 0},
    pl1: {paddingHorizontal: nth[0]},
    pl2: {paddingHorizontal: nth[1]},
    pl3: {paddingHorizontal: nth[2]},
    pl4: {paddingHorizontal: nth[3]},
    pl5: {paddingHorizontal: nth[4]}})}


/* Border styles (view only) */

type BorderStyleKey  = ("bw0" | "bw1" | 
                         // 'bwT' | 'bwB' | 'bwR' | 'bwL' | 
                        "br0" | "br1" | "br2" | "br3" | "br4" | "br5" |
                        "brT0" | "brL0" | "brB0" | "brR0")
type BorderStyles = CustomStyle<BorderStyleKey>

function createBorderStyles(style: StylesheetFactory, rem: number) {
  const nth = [0.125, 0.25, 0.5, 1, 2].map(n => n * rem)
  return style<BorderStyles>({
    bw0:   {borderWidth: 1},
    bw1:   {borderWidth: 1},
    // bwT1:  {borderTopWidth: 1},
    // bwR1:  {borderRightWidth: 1},
    // bwB1:  {borderBottomWidth: 1},
    // bwL1:  {borderLeftWidth: 1},
    br0:  {borderRadius: 0},
    br1:  {borderRadius: nth[0]},
    br2:  {borderRadius: nth[1]},
    br3:  {borderRadius: nth[2]},
    br4:  {borderRadius: nth[3]},
    br5:  {borderRadius: nth[4]},
    brT0: {borderTopLeftRadius: 0,
           borderTopRightRadius: 0},
    brL0: {borderTopRightRadius: 0,
           borderBottomRightRadius: 0},
    brB0: {borderBottomLeftRadius: 0,
           borderBottomRightRadius: 0},
    brR0: {borderTopLeftRadius: 0,
           borderBottomLeftRadius: 0}})}

/* Opacity Styles */

type OpacityStyleKey = ("o100" | "o90" | "o80" | "o70" | "o60" | "o50" | 
                         "o40"  | "o30" | "o20" | "o10" | "o05" | "o025")

type OpacityStyles = CustomStyle<OpacityStyleKey>

function createOpacityStyles(shf: StylesheetFactory) {
  return shf<OpacityStyles>({
    o100: {opacity: 1},
    o90:  {opacity: 0.9},
    o80:  {opacity: 0.8},
    o70:  {opacity: 0.7},
    o60:  {opacity: 0.6},
    o50:  {opacity: 0.5},
    o40:  {opacity: 0.4},
    o30:  {opacity: 0.3},
    o20:  {opacity: 0.2},
    o10:  {opacity: 0.1},
    o05:  {opacity: 0.05},
    o025: {opacity: 0.025}})}


/* Font styles (text only) */

type FontStyleKey = 
  ("fs1"  | "fs2"  | "fs3"  | "fs4" | "fs5" | "fs6" | "fs7" | "fs8" |
   "fsI"  | "fwN"  | "fwB"  |
   "fw1"  | "fw2"  | "fw3"  | "fw4" | "fw5" | "fw6" | "fw7" | "fw8" | "fw9" |
   "taL"  | "taC"  | "taR"  | "taJ" | 
   "tdN"  | "tdLT" | "tdTU" | "tdU")
  
type FontStyles = CustomStyle<FontStyleKey>

function createFontStyles(shf: StylesheetFactory, rem: number) {
  const nth = [0.875, 1, 1.25, 1.5, 2.125, 2.75, 5, 6].map(n => n * rem)
  return shf<FontStyles>({
    fs1:  {fontSize: nth[0]},
    fs2:  {fontSize: nth[1]},
    fs3:  {fontSize: nth[2]},
    fs4:  {fontSize: nth[3]},
    fs5:  {fontSize: nth[4]},
    fs6:  {fontSize: nth[5]},
    fs7:  {fontSize: nth[6]},
    fs8:  {fontSize: nth[7]},
    fsI:  {fontStyle: "italic"},
    fwN:  {fontWeight: "normal"},
    fwB:  {fontWeight: "bold"},
    fw1:  {fontWeight: "100"},
    fw2:  {fontWeight: "200"},
    fw3:  {fontWeight: "300"},
    fw4:  {fontWeight: "400"},
    fw5:  {fontWeight: "500"},
    fw6:  {fontWeight: "600"},
    fw7:  {fontWeight: "700"},
    fw8:  {fontWeight: "800"},
    fw9:  {fontWeight: "900"},
    taL:  {textAlign: "left"},
    taC:  {textAlign: "center"},
    taR:  {textAlign: "right"},
    taJ:  {textAlign: "justify"},
    tdN:  {textDecorationLine: "none"},
    tdLT: {textDecorationLine: "line-through"},
    tdU:  {textDecorationLine: "underline"},
    tdTU: {textDecorationLine: "underline line-through"}})}
