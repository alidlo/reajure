import * as r from "react"
import {h, createComponents, createStyleSheet} from "reajure"


const sh = createStyleSheet()

const c = createComponents(sh, {
  txt: {style: ["fs2"]},
  ipt: {style: [["flx1", "p1", "bw1", "br1"], {hover: [{borderColor: "#ccc"}]}]},
  btn: {style: [["flxdR", "aiC", "jcC", "bw1", "br1"], {hover: [{borderColor: "#ccc"}]}]}
})
  
export {r, h, c, sh}
