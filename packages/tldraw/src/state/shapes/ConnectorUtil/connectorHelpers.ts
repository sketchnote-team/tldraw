import { Utils } from '@tldraw/core'
import { intersectCircleCircle, intersectCircleLineSegment } from '@tldraw/intersect'
import Vec from '@tldraw/vec'
import getStroke from 'perfect-freehand'
import { EASINGS } from '~constants'
import { getShapeStyle } from '../shared/shape-styles'
import type { ArrowShape, Decoration, ShapeStyles } from '~types'
import { TLDR } from '../../TLDR'

export function renderFreehandArrowShaft(
  id: string,
  style: ShapeStyles,
  points: number[][],
  decorationStart: Decoration | undefined,
  decorationEnd: Decoration | undefined
) {
  const getRandom = Utils.rng(id)
  const strokeWidth = getShapeStyle(style).strokeWidth
  // const startPoint = decorationStart ? Vec.nudge(start, mid1, strokeWidth) : start
  // const mid1Point = decorationEnd ? Vec.nudge(mid1, mid2, strokeWidth) : mid1
  // const mid2Point = decorationEnd ? Vec.nudge(mid2, end, strokeWidth) : mid2
  // const endPoint = decorationEnd ? Vec.nudge(end, mid2, strokeWidth) : end
  const stroke = getStroke(points, {
    size: strokeWidth,
    thinning: 0.618 + getRandom() * 0.2,
    easing: EASINGS.easeOutQuad,
    simulatePressure: true,
    streamline: 0,
    last: true,
  })
  return getSvgPathFromStrokeS(stroke)
}

function getSvgPathFromStrokeS(points: number[][], closed = true): string {
  const TRIM_NUMBERS = /(\s?[A-Z]?,?-?[0-9]*\.[0-9]{0,2})(([0-9]|e|-)*)/g

  if (!points.length) {
    return ''
  }

  const max = points.length - 1

  return points
    .reduce(
      (acc, point, i, arr) => {
        if (i === max) {
          if (closed) acc.push('Z')
        } else acc.push(point, Vec.med(point, arr[i + 1]))
        return acc
      },
      ['M', points[0], 'S']
    )
    .join(' ')
    .replaceAll(TRIM_NUMBERS, '$1')
}


export function getStraightArrowHeadPoints(A: number[], B: number[], r: number) {
  const ints = intersectCircleLineSegment(A, r, A, B).points
  if (!ints) {
    TLDR.warn('Could not find an intersection for the arrow head.')
    return { left: A, right: A }
  }
  const int = ints[0]
  const left = int ? Vec.rotWith(int, A, Math.PI / 6) : A
  const right = int ? Vec.rotWith(int, A, -Math.PI / 6) : A
  return { left, right }
}


export function getStraightArrowHeadPath(A: number[], B: number[], r: number) {
  const { left, right } = getStraightArrowHeadPoints(A, B, r)
  return `M ${left} L ${A} ${right}`
}

export function getCursorPath(
  style: ShapeStyles,
  start: number[],
  end: number[],
  decorationStart: Decoration | undefined,
  decorationEnd: Decoration | undefined
) {
  const { strokeWidth } = getShapeStyle(style, false)
  const arrowDist = Vec.dist(start, end)
  const arrowHeadLength = Math.min(arrowDist / 3, strokeWidth * 8)
  const path: (string | number)[] = []

    path.push(`M ${start} L ${end}`)
    if (decorationStart) {
      path.push(getStraightArrowHeadPath(start, end, arrowHeadLength))
    }
    if (decorationEnd) {
      path.push(getStraightArrowHeadPath(end, start, arrowHeadLength))
    }
  return path.join(' ')
}


export function isAngleBetween(a: number, b: number, c: number): boolean {
  if (c === a || c === b) return true
  const PI2 = Math.PI * 2
  const AB = (b - a + PI2) % PI2
  const AC = (c - a + PI2) % PI2
  return AB <= Math.PI !== AC > AB
}

export function getConnectorPath(
  style: ShapeStyles,
  start: number[],
  end: number[],
  decorationStart: Decoration | undefined,
  decorationEnd: Decoration | undefined
) {
  const { strokeWidth } = getShapeStyle(style, false)
  const arrowDist = Vec.dist(start, end)
  const arrowHeadLength = Math.min(arrowDist / 3, strokeWidth * 8)
  const path: (string | number)[] = []
  
    path.push(`M ${start} L ${end}`)
    if (decorationStart) {
      path.push(getStraightArrowHeadPath(start, end, arrowHeadLength))
    }
    if (decorationEnd) {
      path.push(getStraightArrowHeadPath(end, start, arrowHeadLength))
    }
  
  return path.join(' ')
}

export function getConnectorPath2(
  id:string,
  style:ShapeStyles,
  start:number[],
  end:number[],
  decorationStart:Decoration|undefined,
  decorationEnd:Decoration|undefined,
  startConnector:number[] | undefined = undefined,
  endConnector:number[] | undefined = undefined
){

  // if (startConnector && Vec.isEqual(startConnector, [0,0]))
    startConnector = undefined
  // if (endConnector && Vec.isEqual(endConnector, [0,0]))
    endConnector = undefined


  const arrowDisp = Vec.sub(start, end)
  const horizontalConnector:boolean = Math.abs(arrowDisp[0]) > Math.abs(arrowDisp[1]) 
 

  let centerValue
  let point1 = Vec.mul(Vec.add(start, end), .5)
  let point2 = Vec.mul(Vec.add(start, end), .5)


  // if(horizontalConnector){
  //   if( Math.abs(start[1] -  end[1]) > 20){
  //     centerValue = (start[0] + end[0])/2
  //     if(startConnector)
  //       point1 = [centerValue, startConnector[1]]
  //     else
  //       point1 = [centerValue, start[1]]
      
  //     if(endConnector)
  //       point2 = [centerValue, endConnector[1]]
  //     else
  //       point2 = [centerValue, end[1]]
  //   }

  // }else{
  //   if(Math.abs(start[0] -  end[0]) > 20){
  //     centerValue = (start[1] + end[1])/2
  //     if(startConnector)
  //       point1 = [startConnector[0], centerValue]
  //     else
  //       point1 = [start[0], centerValue]
        
  //     if(endConnector)
  //       point2 = [endConnector[0], centerValue]
  //     else
  //       point2 = [end[0], centerValue]
  //   }
  // }

  if(horizontalConnector){
    if( Math.abs(start[1] -  end[1]) > 20){
      centerValue = (start[0] + end[0])/2
      if(startConnector)
        point1 = [startConnector[0], start[1]]
      else
        point1 = [centerValue, start[1]]
      
      if(endConnector)
        point2 = [endConnector[0],  end[1]]
      else
        point2 = [centerValue, end[1]]
    }

  }else{
    if(Math.abs(start[0] -  end[0]) > 20){
      centerValue = (start[1] + end[1])/2
      if(startConnector)
        point1 = [start[0], startConnector[1]]
      else
        point1 = [start[0], centerValue]
        
      if(endConnector)
        point2 = [end[0], endConnector[1]]
    else
        point2 = [end[0], centerValue]
    }
  }

  let points = [start, point1, point2, end]
  // if( startConnector && endConnector)
  //   points = [start,startConnector,  point1, point2, endConnector, end]
  // else if(startConnector)
  //   points = [start,startConnector,  point1, point2, end]
  // else if(endConnector)
  //   points = [start, point1, point2, endConnector, end]
    
  const path = renderFreehandArrowShaft(id, style, points , decorationStart, decorationEnd) 
    

    
    return path
}

 