import { Utils } from '@tldraw/core'
import Vec from '@tldraw/vec'
import * as React from 'react'
import { getShapeStyle } from '~state/shapes/shared'
import type { Decoration, ShapeStyles } from '~types'
import { getStraightArrowHeadPoints, renderFreehandArrowShaft } from '../connectorHelpers'
import { Arrowhead } from './ArrowHead'

interface ArrowSvgProps {
  id: string
  style: ShapeStyles
  start: number[]
  end: number[]
  decorationStart: Decoration | undefined
  decorationEnd: Decoration | undefined
  isDarkMode: boolean
  isDraw: boolean
}

export const ConnectorArrow = React.memo(function StraightArrow({
  id,
  style,
  start,
  end,
  decorationStart,
  decorationEnd,
  isDraw,
  isDarkMode,
}: ArrowSvgProps) {
  const arrowDist = Vec.dist(start, end)
  if (arrowDist < 2) return null

  const arrowDisp = Vec.sub(start, end)
  const horizontalConnector:boolean = Math.abs(arrowDisp[0]) > Math.abs(arrowDisp[1]) 

  let centerValue
  let point1
  let point2

  if(horizontalConnector){
    centerValue = (start[0] + end[0])/2
    point1 = [centerValue, start[1]]
    point2 = [centerValue, end[1]]

  }else{
    centerValue = (start[1] + end[1])/2
    point1 = [start[0], centerValue]
    point2 = [end[0], centerValue]
  }

  const styles = getShapeStyle(style, isDarkMode)
  const { strokeWidth } = styles
  const sw = 1 + strokeWidth * 1.618
  // Path between start and end points
  const path = isDraw
    ? renderFreehandArrowShaft(id, style, start, point1, decorationStart, decorationEnd)
    : 'M' + Vec.toFixed(start) + 'L' + Vec.toFixed(point1)
  const path1 = isDraw
    ? renderFreehandArrowShaft(id, style, point1, point2, decorationStart, decorationEnd)
    : 'M' + Vec.toFixed(point1) + 'L' + Vec.toFixed(point2)
  const path2 = isDraw
    ? renderFreehandArrowShaft(id, style, point2, end, decorationStart, decorationEnd)
    : 'M' + Vec.toFixed(point2) + 'L' + Vec.toFixed(end)
  const { strokeDasharray, strokeDashoffset } = Utils.getPerfectDashProps(
    arrowDist,
    strokeWidth * 1.618,
    style.dash,
    2,
    false
  )
  // Arrowheads
  const arrowHeadLength = Math.min(arrowDist / 3, strokeWidth * 8)
  const startArrowHead = decorationStart
    ? getStraightArrowHeadPoints(start, point1, arrowHeadLength)
    : null
  const endArrowHead = decorationEnd
    ? getStraightArrowHeadPoints(end, point2, arrowHeadLength)
    : null
  return (
    <>
      <path className="tl-stroke-hitarea" d={path} />
      <path
        d={path}
        fill={styles.stroke}
        stroke={styles.stroke}
        strokeWidth={isDraw ? sw / 2 : sw}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        strokeLinejoin="round"
        pointerEvents="stroke"
      />
       <path className="tl-stroke-hitarea" d={path1} />
      <path
        d={path1}
        fill={styles.stroke}
        stroke={styles.stroke}
        strokeWidth={isDraw ? sw / 2 : sw}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        strokeLinejoin="round"
        pointerEvents="stroke"
      />
       <path className="tl-stroke-hitarea" d={path2} />
      <path
        d={path2}
        fill={styles.stroke}
        stroke={styles.stroke}
        strokeWidth={isDraw ? sw / 2 : sw}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        strokeLinejoin="round"
        pointerEvents="stroke"
      />
      {startArrowHead && (
        <Arrowhead
          left={startArrowHead.left}
          middle={start}
          right={startArrowHead.right}
          stroke={styles.stroke}
          strokeWidth={sw}
        />
      )}
      {endArrowHead && (
        <Arrowhead
          left={endArrowHead.left}
          middle={end}
          right={endArrowHead.right}
          stroke={styles.stroke}
          strokeWidth={sw}
        />
      )}
    </>
  )
})
