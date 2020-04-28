import * as R from "react"
import * as RDOM from "react-dom"
import * as rn from "../native-deps"

/**
 * # React hooks
 */

export {
  useContext,
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react"

export const useCtx = R.useContext
export const useCb = R.useCallback

/**
 * # React web only hooks 
 */

export const useFocus = 
  createPseudoHook({events: ["focus", "blur"],}) as 
  (<T>(ref: R.MutableRefObject<T>) => boolean)
  
export const useHover = 
  createPseudoHook({events: ["mouseenter", "mouseleave"]}) as
  (<T>(ref: R.MutableRefObject<T>) => boolean)
  
function createPseudoHook
  <T>({events}: {events: string[]}): (ref: R.MutableRefObject<T>) => any {
  return (ref) => {
    if (rn.Platform.OS !== "web") {
      return false}
  
    const [isActive, setActive] = R.useState(false)

    R.useEffect(
      () => {
        const [eventIn, eventOut] = events

        const node = getNode(ref)
        if (!node) {
          return}

        const resolve = value => {
          setActive(value)}

        const onStart = resolve.bind(this, true)
        const onEnd = resolve.bind(this, false)

        node.addEventListener(eventIn, onStart)
        node.addEventListener(eventOut, onEnd)

        // Special case for useActive to respond when the user drags out 
        // of the view and releases.
        if (eventOut === "mouseup") {
          document.addEventListener(eventOut, onEnd, false)}
        return () => {
          document.removeEventListener(eventOut, onEnd, false)
          node.removeEventListener(eventIn, onStart)
          node.removeEventListener(eventOut, onEnd)
        }
      }, 
      [ref && ref.current])

    return isActive}}

function getNode(ref) {
  try {
    let node = getNativeNode(ref)
    if (node) node = RDOM.findDOMNode(node)
    return node}
  catch (error) {
    console.error("Couldn't find node", error, {ref})
    return null}}

function getNativeNode(ref) {
  try {
    let node = ref && (ref.current || ref)
    if (node && node.getNode && node.getNode()) node = node.getNode()
    if (node && node._touchableNode) node = node._touchableNode
    if (node && node._node) node = node._node
    return node} 
  catch (error) {
    console.error("Failed to find node", error, {ref})
    return null}}

