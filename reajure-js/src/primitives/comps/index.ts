import * as sh from "../styles"
import {createView,
        createTouch,
        createText,
        createLabel,
        createInput,
        createButton,
        createLink} from "./factories"
import type {ViewOptions,
             TouchOptions,
             TextOptions,
             ButtonOptions,
             LinkOptions,
             InputOptions} from "./factories"

type Options = {vw?:  ViewOptions,
                tch?: TouchOptions,
                txt?: TextOptions,
                btn?: ButtonOptions,
                lnk?: LinkOptions,
                ipt?: InputOptions}
                
const defaultOpts = {vw: {},
                     tch: {},
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

  const vw   = createView(sh, opts.vw),
        tch  = createTouch(sh, opts.tch),
        txt  = createText(sh, opts.txt),
        lbl  = createLabel(sh, {vw, txt}),
        ipt  = createInput(sh, opts.ipt, {vw}),
        btn  = createButton(sh, opts.btn, {vw, tch, txt}),
        lnk  = createLink(sh, opts.lnk, {txt})
  return {vw, tch, txt, btn, lbl, ipt, lnk}}
