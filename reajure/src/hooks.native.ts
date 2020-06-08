import {useCallback} from "react"

// ## React hooks

export {
  useContext,
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react"

export const useCb = useCallback

// ## React web only hook mocks

export const useFocus = () => {}
export const useHover = () => {}
