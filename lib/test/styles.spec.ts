import {createStylesheet} from "../styles"

const sh = createStylesheet()

describe("l:some", () => {
  it("gets stylesheet key value", () => {
    expect(sh("flx1")).toEqual([{flex: 1}])})
  
  it("throws error if style does not exist", () => {
    expect(() => sh("foo" as any))
      .toThrow("Stylesheet key \"foo\" does not exist")})})
