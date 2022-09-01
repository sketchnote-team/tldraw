import { Utils } from '@tldraw/core'
import Vec from '@tldraw/vec'
import * as React from 'react'
import { getShapeStyle } from '~state/shapes/shared'
import type { Decoration, ShapeStyles } from '~types'
import { getConnectorPath2, getStraightArrowHeadPoints, renderFreehandArrowShaft } from '../connectorHelpers'
import { Arrowhead } from './ArrowHead'

interface ConnectorSVGProps {
  id: string
  style: ShapeStyles
  start: number[]
  end: number[]
  decorationStart: Decoration | undefined
  decorationEnd: Decoration | undefined
  isDarkMode: boolean
  isDraw: boolean
  startConnector: number[]| undefined
  endConnector: number[]| undefined
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
  startConnector = undefined,
  endConnector = undefined
}: ConnectorSVGProps) {
  const arrowDist = Vec.dist(start, end)
  if (arrowDist < 2) return null

  

  const styles = getShapeStyle(style, isDarkMode)
  const { strokeWidth } = styles
  const sw = 1 + strokeWidth * 1.618
  // Path between start and end points
  
  const path =  getConnectorPath2(
    id,
    style,
    start,
    end,
    decorationStart,
    decorationEnd,
    startConnector,
    endConnector
  )

  const { strokeDasharray, strokeDashoffset } = Utils.getPerfectDashProps(
    arrowDist,
    strokeWidth * 1.618,
    style.dash,
    2,
    false
  )
  // Arrowheads

  const arrowDisp = Vec.sub(start, end)
  const horizontalConnector:boolean = Math.abs(arrowDisp[0]) > Math.abs(arrowDisp[1]) 

  let centerValue
  let point1 = Vec.mul(Vec.add(start, end), .5)
  let point2 = Vec.mul(Vec.add(start, end), .5)


  if(horizontalConnector){
    if( Math.abs(start[1] -  end[1]) > 20){
      centerValue = (start[0] + end[0])/2
      // if(startConnector)
      //   point1 = [centerValue, startConnector[1]]
      // else
        point1 = [centerValue, start[1]]
      
      // if(endConnector)
      //   point2 = [centerValue, endConnector[1]]
      // else
        point2 = [centerValue, end[1]]
    }

  }else{
    if(Math.abs(start[0] -  end[0]) > 20){
      centerValue = (start[1] + end[1])/2
      // if(startConnector)
      //   point1 = [startConnector[0], centerValue]
      // else
        point1 = [start[0], centerValue]
        
      // if(endConnector)
      //   point2 = [endConnector[0], centerValue]
      // else
        point2 = [end[0], centerValue]
    }
  }

  // let arrowpoint1 = point1
  // let arrowpoint2 = point2
  // if(startConnector)
  //   arrowpoint1 = startConnector
  // if(endConnector)
  //   arrowpoint2 = endConnector

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
        strokeLinejoin="bevel"
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