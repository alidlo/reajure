import {c} from "../src"

export default {title: "Base Components"}

export const text = () => c.txt("Some simple text")

export const label = () => c.lbl("I am a label.")

export const input = () => c.ipt({placeholder: "Input"},)

export const button = () => c.btn("Press me!")
