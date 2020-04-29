import {h, createComponents, createStylesheet} from "./core"

const sh = createStylesheet()
const c = createComponents(sh)

c.lbl({textStyle: sh.txt("fs2")}, "wow")
c.lbl({textStyle: sh("fs2")}, "wow")

export {h, c, sh}
