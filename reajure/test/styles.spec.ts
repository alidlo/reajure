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

    it("resolves dynamic style condition", () => {
      const {result} = rh(() => sh.useStyle([["m1"], {hover: ["m2"]}], {hover: true}))
      expect(result.current).toEqual(["m1", "m2"])})
            
    it.only("throws error if condition is not found", () => {
      const {result} = rh(() => sh.useStyle([["h1"], {hover: ["h2"]}], {} as any))
      expect(() => result.current).toThrow("Style hook condition \"hover\" not found.")})
  })})
