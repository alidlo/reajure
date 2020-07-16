import {h} from "../../src/primitives/hscript"
import {createStyleSheet} from "../../src/primitives/styles"
import {createComponents} from "../../src/primitives/comps"
import * as r from "react"
import * as t from "@testing-library/react-native"

const sh = createStyleSheet()
const c = createComponents(sh)

describe("text", () => {
  it("passes ref without errors", async() => {
    const w = t.render(h.r(() => {
      const ref = r.useRef(null)
      return c.txt({ref}, "text")
    }))
    expect(w.baseElement).toBeTruthy()})})

describe("view", () => {
  it("passes ref without errors", async() => {
    const w = t.render(h.r(() => {
      const ref = r.useRef(null)
      return c.vw({ref}, c.txt("text"))
    }))
    expect(w.baseElement).toBeTruthy()})})
         
describe("label", () => {
  it("renders view and text styles", () => {
    const w = t.render(c.lbl({style: ["flx1"], textStyle: ["fs3"]}, "text"))
    expect(w.baseElement).toHaveStyle([{flex: 1}])
    expect(w.getByText("text")).toHaveStyle([{fontSize: 20}])
  })})
