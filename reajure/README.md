#  Reajure

Reajure is a component library built on top of [React Native Web](https://github.com/necolas/react-native-web).

# Usage 

## Styling Components

Reajure provides a style factory `createStyleSheet` that, in the same spirit of [tachyons](https://github.com/tachyons-css/tachyons), uses shorthands to make style templating more expressive.

Example:

```js
import {createStyleSheet} from "reajure"

const sh = createStyleSheet()

sh("flx1", "aiC", "jcC")
// => ReactNative.StyleSheet.create({flex: 1, alignItems: "center", justifyContent: "center"})
```

The pattern the stylesheet shorthands follow is we take first letter of each word,
join them into a single one, lowercasing the style key and capitalizing the style value.

Ex.
- `flex: 1` becomes `"flx1"`
- `justify-content: align-center` becomes `jcAC` 

In situations were there are various alternatives for a value, we append a number to the name.

Ex.
- `margin` can be `m0`, `m1`, etc.
- `borderWidth` can be `bw0`, `bw1`, etc.
- `fontSize` can be `fs1`, `fs2`, etc.

When a naming pattern conflicts, we make the best compromise:

- `padding` is `p` so `position: absolute` is `posA`.


## Composing Components

Reajure provides a component factory `createComponents` for creating your primitives components with desired options.

Example:

```js
import {createComponents} from "@reajure/native"

const c = createComponents(sh, {txt: {style: ["fs2"]}})

c.vw(c.txt("Hello!"))
// => <View><Text>Hello!<Text></View>
```

Along with bindings for the primitive components React Native provides out of the box (e.g View, Text), we also provide the compound components we consider indispensable to application development (e.g. Card, Label).

Similar to styles, components use shorthands for their names. We try to take the first, middle, and last consonants of the respective components full name.

Ex.
- `vw` for View.
- `btn` for Button.
- `lbl` for Label.

