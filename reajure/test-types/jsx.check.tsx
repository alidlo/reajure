import React from "react"
import {createStyleSheet, createJsxComponents} from "../src/jsx"

const sh = createStyleSheet()
const {View, Text} = createJsxComponents(sh)

export const MyComponent = () => (
  <>
    {/* --invalid prop */}
    {/* <View foo="bar" /> */}
  
    <View style={["mt1"]}>
      <Text>Hello</Text>
    </View>
  </>
)


