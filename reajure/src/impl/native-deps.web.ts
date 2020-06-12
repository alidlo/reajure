// Note: Some bundlers (i.e. Closure Compiler) don't perform tree-shaking on node_modules
// so we're specific with the web imports to avoid bringing in RNW's 300kb bundle on all users.
export {default as AppRegistry} from "react-native-web/dist/cjs/exports/AppRegistry"
export {default as Platform} from "react-native-web/dist/cjs/exports/Platform"
export {default as Dimensions} from "react-native-web/dist/cjs/exports/Dimensions"
export {default as StyleSheet} from "react-native-web/dist/cjs/exports/StyleSheet"
export {default as View} from "react-native-web/dist/cjs/exports/View"
export {default as Text} from "react-native-web/dist/cjs/exports/Text"
export {default as TextInput} from "react-native-web/dist/cjs/exports/TextInput"
export {default as  Linking} from "react-native-web/dist/cjs/exports/Linking"

// TODO: RNGH must transpile its code before we can use it in web with cljs.
export {default as Touchable} from "react-native-web/dist/cjs/exports/TouchableWithoutFeedback"
// export {BaseButton as Touchable} from "react-native-gesture-handler"

