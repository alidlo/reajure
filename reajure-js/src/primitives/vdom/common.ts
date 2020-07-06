import * as r from "react"
import * as rn from "../../impl/native-deps"

type Dimensions = {window: rn.ScaledSize, 
                   screen: rn.ScaledSize};

export function useDimensions(): Dimensions {
  const [dims, setDimensions] = r.useState<Dimensions>({
    window: rn.Dimensions.get("window"),
    screen: rn.Dimensions.get("screen")})

  const onChange = ({window, screen}) => {
    setDimensions({window, screen})}

  r.useEffect(
    () => {
      rn.Dimensions.addEventListener("change", onChange)
      return () => rn.Dimensions.removeEventListener("change", onChange)}, 
    [])

  return dims}
