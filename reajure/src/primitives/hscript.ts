import * as r from "react"

// # Hyperscript (h) factory
// Let's you render React components as function calls.  

// Handling element prop typings ourselves so using ReactElement<any>,
// hard to coerce typings otherwise since default typings are tailored for JSX.
export type Element = r.ReactElement<any>

// We provide our own child type rather than use a ReactNode since 
// ReactNode accepts an empty object as a child which messes with typings.
type Child = Element | string | number | boolean | undefined
export type Children = Child | Child[]

export type Props<P extends object = {[k:string]: any}> = null | (P & {children?: Children})
  
export type StaticProps = {[k:string]: any}
export type PropsWChildren<P, Ch> = P & {children?: Ch}

export type Comp /* Any Component */
  <PCh extends Props> = JsxComp<PCh> | HComp<PCh>

export type JsxComp /* External "jsx" component */
  <PCh extends Props> = r.ComponentType<PCh>

export type HComp /** Hyperscript component */
  <P   extends Props, 
   Ch  extends Children = P["children"] | Children,
   PCh = PropsWChildren<P, Ch>> = (a1?: PCh | Ch, ...a2: Ch[]) => any
  & {displayName?: string}
  
export type HFn /** Hyperscript component function declaration, e.g. h(() => ,,,) */
  <PCh extends Props,
   Ref extends r.Ref<any> = r.Ref<any>> = (p: PCh, 
                                           ref?: Ref) => Element

/*Ident, short for identity, is our identifier for component types. 
  While React's `createElement` factory accepts strings as 
  component types (i.e. "div") , we only accept component functions 
  since that improves typescript support for our `h` factory, 
  allowing us to mix and match `props` and `children` arguments.*/
export type Ident<PCh extends Props> = Comp<PCh>

type DomTag = string 

// expose helper for dealing with dom elements
// until we figure out better way to support them with h renderer
export type HtmlProps<T = HTMLElement> = Props<React.HTMLProps<T>>

// If props are not present we pass null rather than an empty object since 
// that lets React optimize rendering.
const defaultProps = null

/**
 * Convert function into renderable component.
 * 
 * ex: 
 *  const comp = h(props => <p>{props.msg}</p>)
 *  comp({ msg: "Hello" })
 */
export function h
  <P   extends Props, 
   Ch  extends Children = P["children"] | Children,
   SP  = StaticProps,
   PCh = PropsWChildren<P, Ch>>(fn: HFn<PCh>, 
                                sp?: SP): HComp<P, Ch, PCh> {
  // note: component name must be capitalized for react refresh (https://github.com/facebook/react/issues/17142)
  const HFnComp = (...args: [PCh | Ch, ...Ch[]]) => h.r<P, Ch, PCh>(fn as any, ...args)
  if (sp) Object.keys(sp).forEach(k => HFnComp[k] = sp[k])
  return HFnComp}

/**
 * Render a component.
 * Accepts: (type, [props | children], [...children])
 * Note: to render html elements use [h.el].
 * 
 * ex. h.r(Text, "Hello")
 */
h.r = function render
 <P   extends Props, 
  Ch  extends Children = P["children"] | Children, 
  PCh = PropsWChildren<P, Ch>>(a1: Ident<PCh> | PCh | Ch, 
                               a2?: PCh | Ch, 
                               ...a3: Ch[]): Element {
  if (a2 === undefined && a3.length == 0) {
    return render(a1 as Ident<null>, defaultProps)}
  else if (a2 && isChildren(a2)) {
    return render(a1 as Ident<null>, defaultProps, a2 as Ch, ...a3)}
  else {
    // There's a weird case where an empty object is passed as children by react renderers
    // We'll just filter it if it appears since [h] factory does not allow object children anyways.
    if (a3.length === 1 && isEmptyObj(a3[0])) return r.createElement(a1 as JsxComp<PCh>, a2 as PCh) 
    return r.createElement(a1 as JsxComp<PCh>, a2 as PCh, ...a3)}}

/**
 * Create [h] component with forwarded ref.
 */
h.fwd = function withForwardRef
  <P   extends Props, 
   Ch  extends Children = P["children"] | Children,
   SP  = StaticProps,
   PCh = PropsWChildren<P, Ch>>(fn: HFn<PCh>, 
                                sp?: SP): HComp<PCh> {
  //todo fwd components need names; here we need name of `fn`. 
  return h(appendDisplayName("Reajure/h.fwd", r.forwardRef(fn) as any/*coerce*/), sp)}


/**
 * Render an element by its `tag` name. 
 * If you're using typescript use this method rather than [h.r] for rendering elements
 * for improved HTML prop typings ([h.r] is typings are tailored for custom components).
 * 
 * Accepts same optional props and children arguments as in [h.r].
 * 
 * ex. h.el("div")
 */
h.el = function renderElement
  <P = HtmlProps,
   Ch  extends Children = Children, 
   PCh = PropsWChildren<P, Ch>>(tag: DomTag,
                                pch?: PCh | Ch, 
                                ch?: Ch) {
  return h.r<P>(tag, pch as any, ch)}

/**
 * Coerce JSX component `C` into a function, or "wrap" it.
 * 
 * Allows you to render a JSX component via function call while preserving typings
 * and avoiding type errors caused by distinct component types.
 * 
 * ex. const comp = h.wrap(JsxComp)
 * comp()
 */
h.wrap = function coerceExternalCompTypings
 <ExternalComp extends r.ComponentType<any>,
  P            extends Props = r.ComponentProps<ExternalComp>,
  Ch           extends Children = P["children"] | Children,
  // Even though we're not forwarding ref for external components
  // we'll include an optional ref prop in typings.
  Ref          extends r.Ref<ExternalComp> = r.Ref<ExternalComp>, 
  PChRf = PropsWChildren<P, Ch> & 
          {ref?: Ref}>(C: ExternalComp): HComp<PChRf, Ch> {
  // todo creating lots of wrapping.
  return h.fwd(appendDisplayName("Reajure/h.wrap", (p, ref) => r.createElement(C, {...p, ref})))
  // return h<P, Ch, {}, PChRf>(r.forwardRef((p, ref) => r.createElement(C, {...p, ref})) as any)
}

function appendDisplayName(s: string, comp: HComp<any>) {
  (comp as any).displayName = `${s}__${(comp as any).displayName || "Anonymous"}`
  return comp
}

function isChildren(v) { /* Check whether value `v` is valid React children type. */
  return typeof v === "string" || typeof v === "number" || Array.isArray(v) || r.isValidElement(v)}

function isEmptyObj(v) { /* Check if value `v` is an object without any key-value pairs. */
  return typeof v === "object" && Object.keys(v).length === 0}

