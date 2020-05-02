import {createStylesheet} from "../src/styles"

const sh = createStylesheet()

describe("sh", () => {
  it("gets stylesheet key value", () => {
    expect(sh("flx1")).toEqual([{flex: 1}])})
  
  it("throws error if style does not exist", () => {
    expect(() => sh("foo" as any))
      .toThrow("Stylesheet key \"foo\" does not exist")})
    
  describe("sh.useStyle", () => {
    it("resolves only static style", () => {
      expect(sh.useStyle(["m1"],{}))
        .toEqual(["m1"])})

    it("resolves dynamic style condition", () => {
      expect(sh.useStyle([["m1"], {lg: ["m2"]}], {lg: true}))
        .toEqual(["m1", "m2"])})

    it("throws error if condition is not found", () => {
      expect(() => sh.useStyle([["h1"], {lg: ["h2"]}], {}))
        .toThrow("Style hook condition not found.")})
  })})
