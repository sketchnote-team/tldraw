import { Utils } from '@tldraw/core'
import { intersectCircleCircle, intersectCircleLineSegment } from '@tldraw/intersect'
import Vec from '@tldraw/vec'
import getStroke from 'perfect-freehand'
import { EASINGS } from '~constants'
import { getShapeStyle } from '../shared/shape-styles'
import type { ArrowShape, Decoration, ShapeStyles } from '~types'
import { TLDR } from '../../TLDR'

export function getArrowArcPath(start: number[], end: number[], circle: number[], bend: number) {
  return [
    'M',
    start[0],
    start[1],
    'A',
    circle[2],
    circle[2],
    0,
    0,
    bend < 0 ? 0 : 1,
    end[0],
    end[1],
  ].join(' ')
}

export function getBendPoint(handles: ArrowShape['handles'], bend: number) {
  const { start, end } = handles

  const dist = Vec.dist(start.point, end.point)

  const midPoint = Vec.med(start.point, end.point)

  const bendDist = (dist / 2) * bend

  const u = Vec.uni(Vec.vec(start.point, end.point))

  const point = Vec.toFixed(
    Math.abs(bendDist) < 10 ? midPoint : Vec.add(midPoint, Vec.mul(Vec.per(u), bendDist))
  )

  return point
}

export function renderFreehandArrowShaft(
  id: string,
  style: ShapeStyles,
  start: number[],
  mid1: number[],
  mid2: number[],
  end: number[],
  decorationStart: Decoration | undefined,
  decorationEnd: Decoration | undefined
) {
  const getRandom = Utils.rng(id)
  const strokeWidth = getShapeStyle(style).strokeWidth
  const startPoint = decorationStart ? Vec.nudge(start, mid1, strokeWidth) : start
  const mid1Point = decorationEnd ? Vec.nudge(mid1, mid2, strokeWidth) : mid1
  const mid2Point = decorationEnd ? Vec.nudge(mid2, end, strokeWidth) : mid2
  const endPoint = decorationEnd ? Vec.nudge(end, mid2, strokeWidth) : end
  const stroke = getStroke([startPoint,mid1Point, mid2Point, endPoint], {
    size: strokeWidth,
    thinning: 0.618 + getRandom() * 0.2,
    easing: EASINGS.easeOutQuad,
    simulatePressure: true,
    streamline: 0,
    last: true,
  })
  return Utils.getSvgPathFromStroke(stroke)
}



export function renderCurvedFreehandArrowShaft(
  id: string,
  style: ShapeStyles,
  start: number[],
  end: number[],
  decorationStart: Decoration | undefined,
  decorationEnd: Decoration | undefined,
  center: number[],
  radius: number,
  length: number,
  easing: (t: number) => number
) {
  const getRandom = Utils.rng(id)
  const strokeWidth = getShapeStyle(style).strokeWidth
  const startPoint = decorationStart ? Vec.rotWith(start, center, strokeWidth / length) : start
  const endPoint = decorationEnd ? Vec.rotWith(end, center, -(strokeWidth / length)) : end
  const startAngle = Vec.angle(center, startPoint)
  const endAngle = Vec.angle(center, endPoint)
  const points: number[][] = []
  const count = 8 + Math.floor((Math.abs(length) / 20) * 1 + getRandom() / 2)
  for (let i = 0; i < count; i++) {
    const t = easing(i / count)
    const angle = Utils.lerpAngles(startAngle, endAngle, t)
    points.push(Vec.toFixed(Vec.nudgeAtAngle(center, angle, radius)))
  }
  const stroke = getStroke([startPoint, ...points, endPoint], {
    size: 1 + strokeWidth,
    thinning: 0.618 + getRandom() * 0.2,
    easing: EASINGS.easeOutQuad,
    simulatePressure: false,
    streamline: 0,
    last: true,
  })
  return Utils.getSvgPathFromStroke(stroke)
}

export function getCtp(start: number[], bend: number[], end: number[]) {
  return Utils.circleFromThreePoints(start, end, bend)
}

export function getCurvedArrowHeadPoints(
  A: number[],
  r1: number,
  C: number[],
  r2: number,
  sweep: boolean
) {
  const ints = intersectCircleCircle(A, r1 * 0.618, C, r2).points
  if (!ints) {
    TLDR.warn('Could not find an intersection for the arrow head.')
    return { left: A, right: A }
  }
  const int = sweep ? ints[0] : ints[1]
  const left = int ? Vec.nudge(Vec.rotWith(int, A, Math.PI / 6), A, r1 * -0.382) : A
  const right = int ? Vec.nudge(Vec.rotWith(int, A, -Math.PI / 6), A, r1 * -0.382) : A
  return { left, right }
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

export function getCurvedArrowHeadPath(
  A: number[],
  r1: number,
  C: number[],
  r2: number,
  sweep: boolean
) {
  const { left, right } = getCurvedArrowHeadPoints(A, r1, C, r2, sweep)
  return `M ${left} L ${A} ${right}`
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

export function getArcPoints(start: number[], bend: number[], end: number[]) {
  if (Vec.dist2(bend, Vec.med(start, end)) <= 4) return [start, end]
  // The arc is curved; calculate twenty points along the arc
  const points: number[][] = []
  const circle = getCtp(start, bend, end)
  const center = [circle[0], circle[1]]
  const radius = circle[2]
  const startAngle = Vec.angle(center, start)
  const endAngle = Vec.angle(center, end)
  for (let i = 1 / 20; i < 1; i += 1 / 20) {
    const angle = Utils.lerpAngles(startAngle, endAngle, i)
    points.push(Vec.nudgeAtAngle(center, angle, radius))
  }
  return points
}

export function isAngleBetween(a: number, b: number, c: number): boolean {
  if (c === a || c === b) return true
  const PI2 = Math.PI * 2
  const AB = (b - a + PI2) % PI2
  const AC = (c - a + PI2) % PI2
  return AB <= Math.PI !== AC > AB
}

export function getArcLength(C: number[], r: number, A: number[], B: number[]): number {
  const sweep = Utils.getSweep(C, A, B)
  return r * (2 * Math.PI) * (sweep / (2 * Math.PI))
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
  
  console.log(start, end)
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
  decorationEnd:Decoration|undefined
){

  const arrowDisp = Vec.sub(start, end)
  const horizontalConnector:boolean = Math.abs(arrowDisp[0]) > Math.abs(arrowDisp[1]) 
  const positiveConnectorX:boolean = arrowDisp[0] < 0
  const positiveConnectorY:boolean = arrowDisp[1] < 0
  console.log('positiveConnectorX', positiveConnectorX);
  console.log('positiveConnectorY', positiveConnectorY);
  

  let centerValue
  let point1 = Vec.mul(Vec.add(start, end), .5)
  let point2 = Vec.mul(Vec.add(start, end), .5)

  if(horizontalConnector){
    if( Math.abs(start[1] -  end[1]) > 20){
      centerValue = (start[0] + end[0])/2
      point1 = [centerValue, start[1]]
      point2 = [centerValue, end[1]]
    }

  }else{
    if(Math.abs(start[0] -  end[0]) > 20){
      centerValue = (start[1] + end[1])/2
      point1 = [start[0], centerValue]
      point2 = [end[0], centerValue]
    }
  }

  const path = renderFreehandArrowShaft(id, style, start, point1, point2, end, decorationStart, decorationEnd) 
    

    
    return roundPathCorners(path, 20, false)
}

 

function roundPathCorners(pathString, radius, useFractionalRadius) {
  function moveTowardsLength(movingPoint, targetPoint, amount) {
    let width = (targetPoint.x - movingPoint.x);
    let height = (targetPoint.y - movingPoint.y);
    
    let distance = Math.sqrt(width*width + height*height);
    
    return moveTowardsFractional(movingPoint, targetPoint, Math.min(1, amount / distance));
  }
  function moveTowardsFractional(movingPoint, targetPoint, fraction) {
    return {
      x: movingPoint.x + (targetPoint.x - movingPoint.x)*fraction,
      y: movingPoint.y + (targetPoint.y - movingPoint.y)*fraction
    };
  }
  
  // Adjusts the ending position of a command
  function adjustCommand(cmd, newPoint) {
    if (cmd.length > 2) {
      cmd[cmd.length - 2] = newPoint.x;
      cmd[cmd.length - 1] = newPoint.y;
    }
  }
  
  // Gives an {x, y} object for a command's ending position
  function pointForCommand(cmd) {
    return {
      x: parseFloat(cmd[cmd.length - 2]),
      y: parseFloat(cmd[cmd.length - 1]),
    };
  }
  
  // Split apart the path, handing concatonated letters and numbers
  let pathParts = pathString
    .split(/[,\s]/)
    .reduce(function(parts, part){
      let match = part.match("([a-zA-Z])(.+)");
      if (match) {
        parts.push(match[1]);
        parts.push(match[2]);
      } else {
        parts.push(part);
      }
      
      return parts;
    }, []);
  
  // Group the commands with their arguments for easier handling
  let commands = pathParts.reduce(function(commands, part) {
    if (parseFloat(part) == part && commands.length) {
      commands[commands.length - 1].push(part);
    } else {
      commands.push([part]);
    }
    
    return commands;
  }, []);
  
  // The resulting commands, also grouped
  let resultCommands = [];
  
  if (commands.length > 1) {
    let startPoint = pointForCommand(commands[0]);
    
    // Handle the close path case with a "virtual" closing line
    let virtualCloseLine = null;
    if (commands[commands.length - 1][0] == "Z" && commands[0].length > 2) {
      virtualCloseLine = ["L", startPoint.x, startPoint.y];
      commands[commands.length - 1] = virtualCloseLine;
    }
    
    // We always use the first command (but it may be mutated)
    resultCommands.push(commands[0]);
    
    for (let cmdIndex=1; cmdIndex < commands.length; cmdIndex++) {
      let prevCmd = resultCommands[resultCommands.length - 1];
      
      let curCmd = commands[cmdIndex];
      
      // Handle closing case
      let nextCmd = (curCmd == virtualCloseLine)
        ? commands[1]
        : commands[cmdIndex + 1];
      
      // Nasty logic to decide if this path is a candidite.
      if (nextCmd && prevCmd && (prevCmd.length > 2) && curCmd[0] == "L" && nextCmd.length > 2 && nextCmd[0] == "L") {
        // Calc the points we're dealing with
        let prevPoint = pointForCommand(prevCmd);
        let curPoint = pointForCommand(curCmd);
        let nextPoint = pointForCommand(nextCmd);
        
        // The start and end of the cuve are just our point moved towards the previous and next points, respectivly
        let curveStart, curveEnd;
        
        if (useFractionalRadius) {
          curveStart = moveTowardsFractional(curPoint, prevCmd.origPoint || prevPoint, radius);
          curveEnd = moveTowardsFractional(curPoint, nextCmd.origPoint || nextPoint, radius);
        } else {
          curveStart = moveTowardsLength(curPoint, prevPoint, radius);
          curveEnd = moveTowardsLength(curPoint, nextPoint, radius);
        }
        
        // Adjust the current command and add it
        adjustCommand(curCmd, curveStart);
        curCmd.origPoint = curPoint;
        resultCommands.push(curCmd);
        
        // The curve control points are halfway between the start/end of the curve and
        // the original point
        let startControl = moveTowardsFractional(curveStart, curPoint, .5);
        let endControl = moveTowardsFractional(curPoint, curveEnd, .5);
  
        // Create the curve 
        let curveCmd = ["C", startControl.x, startControl.y, endControl.x, endControl.y, curveEnd.x, curveEnd.y];
        // Save the original point for fractional calculations
        curveCmd.origPoint = curPoint;
        resultCommands.push(curveCmd);
      } else {
        // Pass through commands that don't qualify
        resultCommands.push(curCmd);
      }
    }
    
    // Fix up the starting point and restore the close path if the path was orignally closed
    if (virtualCloseLine) {
      let newStartPoint = pointForCommand(resultCommands[resultCommands.length-1]);
      resultCommands.push(["Z"]);
      adjustCommand(resultCommands[0], newStartPoint);
    }
  } else {
    resultCommands = commands;
  }
  
  return resultCommands.reduce(function(str, c){ return str + c.join(" ") + " "; }, "");
}