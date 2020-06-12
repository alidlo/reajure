import * as sh from "../styles"
import {ViewOptions,
        TextOptions,
        ButtonOptions,
        LinkOptions,
        InputOptions,
        createView,
        createText,
        createLabel,
        createInput,
        createButton,
        createLink} from "./factories"

type Options = {vw?:  ViewOptions,
                txt?: TextOptions,
                btn?: ButtonOptions,
                lnk?: LinkOptions,
                ipt?: InputOptions}
                
const defaultOpts = {vw: {},
                     txt: {},
                     btn: {},
                     lnk: {},
                     ipt: {}}

/**
 * Create components using given stylesheet `sh` and `opts`.
*/
export function createComponents(sh: sh.Stylesheet, 
                                 _opts?: Options) {
  const opts = {...defaultOpts, ...(_opts || {})} as Options

  const vw  = createView(sh, opts.vw),
        txt = createText(sh, opts.txt),
        lbl = createLabel(sh, {vw, txt}),
        ipt = createInput(sh, opts.ipt, {vw}),
        btn = createButton(sh, opts.btn, {vw, txt}),
        lnk   = createLink(sh, opts.lnk, {txt})
  return {vw, txt, btn, lbl, ipt, lnk}}
