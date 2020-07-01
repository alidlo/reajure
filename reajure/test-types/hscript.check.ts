import {h, Element} from "../src/primitives/hscript"
import * as r from "react"
import * as rn from "react-native"

// == h renderer typings ==
;(() => {
  h.r(rn.Text, "Foo")
  h.r(rn.Text, {style: [{fontSize: 12}]}, "Foo")
  h.r(rn.View, null, h.r(rn.Text, "Foo"))
  
  // -- not allowed 
  // h.r(rn.Text, "Bar", "Foo")
  // h.r(rn.Text, {style: [{foo: 12}]}, "Foo")
  // h.r(rn.Text, {invalid: []}, "Foo")
})

// == h element typings ==
;(() => {
  h.el("div", {style: {}})
  h.el("div", {style: {}}, h.r("p", "Foo"))
})

// == h factory typings ==
;(() => {
  const txt = h<{}, string>((p) => h.r(rn.Text, p.children))
  const vw = h<{style: any[]}, Element>((p) => h.r(rn.View, p.children))

  vw(txt("Foo"))
  vw({style: []}, txt("Foo"))

  // == not allowed  ==
  
  // - invalid prop passed on render 
  // vw({invalid: []}, txt("Foo"))
  
  // - nonexistent prop passed
  // h<{msg: string}>((p) => h.r(rn.Text, p.message))

  // - invalid child types
  // txt({}, vw("Foo"))
  // vw("Foo", txt("Foo"))
})

// == h wrapper typings ==
;(() => {
  const vw = h.wrap(rn.View)
  const txt = h.wrap(rn.Text)

  vw(txt("Foo"))
  vw({style: [{flex: 1}]}, txt("Foo"))
  vw(txt("A"), txt("B"), txt("C"))

  h(() => vw({ref: r.useRef(null)}))

  // == not allowed == 

  // - invalid props passed on render 
  // vw({invalid: []}, txt("Foo"))

  // -- todo: fix typings
  // vw("Foo", txt("Foo"))
})
