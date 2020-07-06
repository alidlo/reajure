import {h} from "../../src/primitives/hscript"
import * as r from "react"
import * as rn from "react-native"
import * as t from "@testing-library/react-native"

const text = "Hello world!"

describe("h", () => {
  it("renders component", () => {
    const w = t.render(h.r<rn.TextProps, any>(rn.Text, null, text))
    expect(w.getByText(text)).toBeTruthy()})})

describe("h.wrap", () => {
  it("renders component", () => {
    const w = t.render(h.wrap(rn.Text)(text))
    expect(w.getByText(text)).toBeTruthy()})})

describe("h.r", () => {
  describe("prop variations", () => {
    it("renders (Component)", () => {
      expect(h.r(rn.View)).toEqual(r.createElement(rn.View))})
      
    it("renders (Component, Props<null>, Child<string>)", () => {
      const w = t.render(h.r(rn.Text, null, text))
      expect(w.getByText(text)).toBeTruthy()})
  
    it("renders (Component, Child<string>)", () => {
      const w = t.render(h.r(rn.Text, text))
      expect(w.getByText(text)).toBeTruthy()})
  
    it("renders (Component, Child<element>))", () => {
      const w = t.render(h.r(rn.View, h.r(rn.Text, text)))
      expect(w.getByText(text)).toBeTruthy()})
      
    it("renders (Component, Child<any>, Child<any>)", () => {
      const w = t.render(h.r<{}, any>(rn.View, h.r(rn.Text, "First part."), h.r(rn.Text, "Second part.")))
      expect(w.getByText("First part.")).toBeTruthy()
      expect(w.getByText("Second part.")).toBeTruthy()})})  

  it("filters out empty children object", () => {
    expect(t.render(h.r(rn.Text, {children: text}, {} as  any))).toBeTruthy()})})
