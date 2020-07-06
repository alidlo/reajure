import * as r from "react"
import * as rn from "../../impl/native-deps"

export * from "./common"

// ## Web only hooks

export const useFocus = 
  createWebHook({events: ["focus", "blur"],}) as (<T>(ref: r.MutableRefObject<T>) => boolean)
  
export const useHover = 
  createWebHook({events: ["mouseenter", "mouseleave"]}) as (<T>(ref: r.MutableRefObject<T>) => boolean)
  
function createWebHook({events}: {events: string[]}): (ref: r.MutableRefObject<HTMLElement>) => any {
  return (ref) => {
    if (rn.Platform.OS !== "web") {
      return false}
  
    const [isActive, setActive] = r.useState(false)

    r.useEffect(
      () => {
        const [eventIn, eventOut] = events

        if (!ref.current) {
          return}

        const resolve = value => {
          setActive(value)}

        const onStart = resolve.bind(this, true)
        const onEnd = resolve.bind(this, false)

        ref.current.addEventListener(eventIn, onStart)
        ref.current.addEventListener(eventOut, onEnd)

        // Special case for useActive to respond when the user drags out 
        // of the view and releases.
        if (eventOut === "mouseup") {
          document.addEventListener(eventOut, onEnd, false)}
        return () => {
          document.removeEventListener(eventOut, onEnd, false)
          ref.current.removeEventListener(eventIn, onStart)
          ref.current.removeEventListener(eventOut, onEnd)
        }
      }, 
      [ref && ref.current])

    return isActive}}



