/**
 * Jsx variation of component factory.
 */
import {createComponents} from "./primitives/comps"
import {createStyleSheet} from "./primitives/styles"
import type {ViewProps, 
             TextProps,
             LabelProps,
             ButtonProps} from "../src/primitives/comps/factories"

export {createStyleSheet}
export function createJsxComponents(...opts: Parameters<typeof createComponents>) {
  const c = createComponents(...opts)
  return {
    View: c.vw as React.ComponentType<ViewProps>,
    Text: c.txt as React.ComponentType<TextProps>,
    Label: c.lbl as React.ComponentType<LabelProps>, 
    Button: c.lbl as React.ComponentType<ButtonProps>, 
  } 
}

