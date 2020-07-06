#  Reajure (alpha)

Reajure's aim is to make Javascript/React UI application development more expressive.

Built on top of [React Native Web](https://github.com/necolas/react-native-web), Reajure provides a cross-platform component toolkit focused on functionality not styling, and with shorthands for all exported components and styles to minimize the boilerplate necessary for UI development.

The core [reajure-js](https://github.com/alidlo/reajure/tree/master/reajure) library is written in Typescript:

```js
const app = h<{msg: string}>(p => (
  c.vw({style: ["flx1"]}, 
    c.lbl({style: ["mb2"]}, p.msg),
    c.lnk({href: "/docs"}, "Go to docs."))))

app({msg: "Welcome to Reajure.js!"})
```

To use Reajure in Clojurescript, [reajure-cljs](https://github.com/alidlo/reajure/tree/master/reajure-cljs) has interop utilities that you can use with any Clojurescript React wrapper.

```cljs
(defnc app [{:keys [msg]}]
 [:vw 
  {:style [:flx1]}
  [:lbl {:style [:mb2]} msg]
  [:lnk [:href "/docs"] "Open Docs."]])

(app {:msg "Welcome to Reajure.cljs!"})
```

## Usage 

*Note*: This project is still very experimental so unless you're willing to dig into code I wouldn't recommend using it near-term for anything serious. On a similar note, the project is being optimized for ideal API, not yet for performance (we'll improve that as we run into limitations that make UI sluggish).

See the desired project's README for documentation.

## Demo 

The [demo](https://github.com/alidlo/reajure/tree/master/demo) shows Reajure in a simple Todo application.



