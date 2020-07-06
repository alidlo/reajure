// Note: Some bundlers (i.e. Closure Compiler) don't perform tree-shaking on node_modules
// so we're specific with the web imports to avoid bringing in RNW's 300kb bundle on all users.
export {default as Platform}   from "react-native-web/dist/exports/Platform"
export {default as Dimensions} from "react-native-web/dist/exports/Dimensions"
export {default as StyleSheet} from "react-native-web/dist/exports/StyleSheet"
export {default as View}       from "react-native-web/dist/exports/View"
export {default as Pressable}  from "react-native-web/dist/exports/Pressable"
export {default as Text}       from "react-native-web/dist/exports/Text"
export {default as TextInput}  from "react-native-web/dist/exports/TextInput"
export {default as  Linking}   from "react-native-web/dist/exports/Linking"
