import {createStylesheet} from "../src/styles"

const sh = createStylesheet()

describe("sh", () => {
  it("gets stylesheet key value", () => {
    expect(sh("flx1")).toEqual([{flex: 1}])})
  
  it("throws error if style does not exist", () => {
    expect(() => sh("foo" as any))
      .toThrow("Stylesheet key \"foo\" does not exist")})
    
  describe("sh.useStyle", () => {
    it("resolves dynamic style condition", () => {
      expect(sh.useStyle([["h1"], {lg: ["h2"]}], {lg: true}))
        .toEqual(["h1", "h2"])})

    it("throws error if condition is not found", () => {
      expect(() => sh.useStyle([["h1"], {lg: ["h2"]}], {}))
        .toThrow("Dynamic style condition not found.")})
    
  })})
