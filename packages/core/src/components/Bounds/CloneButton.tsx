import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useTLContext } from '~hooks'
import type { TLBounds } from '~types'


const ROTATIONS = {
  right: 0,
  bottomRight: 45,
  bottom: 90,
  bottomLeft: 135,
  left: 180,
  topLeft: 225,
  top: 270,
  topRight: 315,
}

export interface CloneButtonProps {
  bounds: TLBounds
  targetSize: number
  size: number
  side: 'top' | 'right' | 'bottom' | 'left' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
}

export const CloneButton = observer<CloneButtonProps>(function CloneButton({
  bounds,
  side,
  targetSize,
  size,
}: CloneButtonProps) {

  const s = targetSize * 2
  const h = targetSize / 2
  const x = {
    left: -s,
    topLeft: -s,
    bottomLeft: -s,
    right: bounds.width,
    topRight: bounds.width,
    bottomRight: bounds.width,
    top: bounds.width / 2 - s -h/2,
    bottom: bounds.width / 2 + h,
  }[side]

  const y = {
    left: bounds.height / 2 + h,
    right: bounds.height / 2 - s,
    top: -s * 2,
    topLeft: -s,
    topRight: -s,
    bottom: bounds.height,
    bottomLeft: bounds.height,
    bottomRight: bounds.height,
  }[side]

  const { callbacks, inputs } = useTLContext()

  const handleClick = React.useCallback(
    (e: React.PointerEvent<SVGGElement>) => {
      e.stopPropagation()
      const info = inputs.pointerDown(e, side)
      callbacks.onShapeClone?.(info, e)
    },
    [callbacks.onShapeClone]
  )

  return (
    <g  className="tl-clone-target" transform={`translate(${x}, ${y})`} aria-label="clone button" >
      <rect className="tl-transparent" width={targetSize * 2} height={targetSize * 2} />
      <g
        className="tl-clone-button-target"
        onPointerDown={handleClick}
        transform={`translate(${targetSize}, ${targetSize}) rotate(${ROTATIONS[side]})`}
      >
        <circle className="tl-transparent" r={targetSize} />
        <path
          className=""
          style={{transform:`scale(1.5)`}}
          d={`M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z`}
          strokeLinejoin="round"
        />
      </g>
    </g>
  )
})
