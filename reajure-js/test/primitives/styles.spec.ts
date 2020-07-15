import {createStyleSheet} from "../../src/primitives/styles"
import {renderHook as rh} from "@testing-library/react-hooks"
import {Style} from "./styles/factories"

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
    it("uses static style", () => {
      const {result} = rh(() => sh.useStyle(["m1"],{}))
      expect(result.current).toEqual(["m1"])})

    it("uses dynamic style condition", () => {
      const {result} = rh(() => sh.useStyle([["m1"], {x: ["m2"]}], {x: true}))
      expect(result.current).toEqual(["m1", "m2"])})
      
    it("uses nested dynamic style condition", () => {
      const {result} = rh(() => sh.useStyle([["m1"], {nested: {x: ["m2"], y: ["m3"]}}], {nested: {y: true}}))
      expect(result.current).toEqual(["m1", "m3"])})
        
    it("updates object style", () => {
      const {result, rerender} = rh((props) => sh.useStyle(props.style), {initialProps: {style: {margin: 0}}})
      expect(result.current).toEqual({margin: 0})
      rerender({style: {margin: 4}})
      expect(result.current).toEqual({margin: 4}) 
    })
        
    it("updates key style", () => {
      const {result, rerender} = rh((props) => sh.useStyle(props.style), {initialProps: {style: ["fs1"] as Style}})
      expect(result.current).toEqual(["fs1"])
      rerender({style: ["fs2"]})
      expect(result.current).toEqual(["fs2"]) 
    })
  })
  // describe("sh.useMediaStyle", () => {
  // it("uses nested dynamic style condition", () => {
  //   expect(sh.useMediaStyle([["m1"], {media: {lg: ["m2"]}}], {media: {lg: true}}))
  //     .toEqual(["m1", "m2"])})
})
