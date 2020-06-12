import {createStyleSheet} from "../src/primitives/styles"
import {renderHook as rh} from "@testing-library/react-hooks"

const sh = createStyleSheet()

describe("stylesheet", () => {
  describe("sh", () => {
    it("gets stylesheet key value", () => {
      expect(sh("flx1")).toEqual([{flex: 1}])})
    
    it("throws error if style does not exist", () => {
      expect(() => sh("foo" as any))
        .toThrow("Stylesheet key \"foo\" does not exist")})
  })
    
  describe("sh.useStyle", () => {
    it("resolves only static style", () => {
      const {result} = rh(() => sh.useStyle(["m1"],{}))
      expect(result.current).toEqual(["m1"])})

    it("resolves active style condition", () => {
      const {result} = rh(() => sh.useStyle([["m1"], {x: ["m2"]}], {x: true}))
      expect(result.current).toEqual(["m1", "m2"])})

    it("resolves active, nested style condition", () => {
      const {result} = rh(() => sh.useStyle([["m1"], {nested: {x: ["m2"], y: ["m3"]}}], {nested: {y: true}}))
      expect(result.current).toEqual(["m1", "m3"])})
            
    it("throws error if condition is not found", () => {
      const {result} = rh(() => sh.useStyle([["h1"], {x: ["h2"]}], {} as any))
      expect(() => result.current).toThrow("Style hook condition \"x\" not found.")})})
    
  // describe("sh.useMediaStyle", () => {
  // it("resolves nested dynamic style condition", () => {
  //   expect(sh.useMediaStyle([["m1"], {media: {lg: ["m2"]}}], {media: {lg: true}}))
  //     .toEqual(["m1", "m2"])})
  // })
})
