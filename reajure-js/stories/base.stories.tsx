import {createComponents, createStyleSheet} from "../src"

const sh = createStyleSheet()
const c = createComponents(sh)

export default {title: "Base Components"}

export const text = () => c.txt("Some text")

export const label = () => c.lbl("Some label.")

export const input = () => c.ipt({style: [["bw1", {borderColor: "transparent"}],
                                          {media: {sm: {backgroundColor: "blue"},
                                                   lg: {backgroundColor: "green"}},
                                           hover: {borderColor: "#ccc"}}],
                                  placeholder: "Input"},)

export const button = () => c.btn("Press me!")
