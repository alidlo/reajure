import * as r from "react"
import {h} from "react-hype"
import {createComponents, createStyleSheet} from "reajure"

const sh = createStyleSheet()

const c = createComponents(sh, {
  txt: {style: ["fs2"]},
  ipt: {style: ["flx1", "p1", "bw1", "br1"]},
  btn: {style: ["flxdR", "aiC", "jcC", "bw1", "br1"]}
})
  
export {r, h, c, sh}
