import * as l from "../lib"


describe("l:some", () => {
  it("boolean: returns first true value", () => {
    expect(l.some([false, true, false])).toBe(true)})

  it("object: returns first truthy value", () => {
    expect(l.some([false, null, {}])).toEqual({})})})
