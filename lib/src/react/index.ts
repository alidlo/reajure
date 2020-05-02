import * as R from "react"
import * as rn from "../native-deps"

export * from "./hooks"

type Dimensions = {window: rn.ScaledSize, 
                   screen: rn.ScaledSize};

export function useDimensions(): Dimensions {
  const [dims, setDimensions] = R.useState<Dimensions>({
    window: rn.Dimensions.get("window"),
    screen: rn.Dimensions.get("screen")})

  const onChange = ({window, screen}) => {
    setDimensions({window, screen})}

  R.useEffect(
    () => {
      rn.Dimensions.addEventListener("change", onChange)
      return () => rn.Dimensions.removeEventListener("change", onChange)}, 
    [])

  return dims}
