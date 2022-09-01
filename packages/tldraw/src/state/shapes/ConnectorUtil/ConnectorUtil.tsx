import * as React from 'react'
import { Utils, TLBounds, SVGContainer } from '@tldraw/core'
import { Vec } from '@tldraw/vec'
import { defaultStyle } from '../shared/shape-styles'
import { ConnectorShape, TransformInfo, Decoration, TDShapeType, DashStyle, TDMeta } from '~types'
import { TDShapeUtil } from '../TDShapeUtil'
import {
  intersectArcBounds,
  intersectLineSegmentBounds,
  intersectLineSegmentLineSegment,
} from '@tldraw/intersect'
import { GHOSTED_OPACITY } from '~constants'
import {
  getConnectorPath2,
} from './connectorHelpers'
import { styled } from '~styles'
import { TextLabel, getFontStyle, getShapeStyle } from '../shared'
import { getTextLabelSize } from '../shared/getTextSize'
import { ConnectorArrow } from './components/ConnectorArrow'
import { LabelMask } from '../shared/LabelMask'

type T = ConnectorShape
type E = HTMLDivElement

export class ConnectorUtil extends TDShapeUtil<T, E> {
  type = TDShapeType.Connector as const

  hideBounds = true

  canEdit = true

  pathCache = new WeakMap<T, string>()

  getShape = (props: Partial<T>): T => {
    return {
      id: 'id',
      type: TDShapeType.Connector,
      name: 'Connector',
      parentId: 'page',
      childIndex: 1,
      point: [0, 0],
      rotation: 0,
      bend: 0,
      handles: {
        start: {
          id: 'start',
          index: 0,
          point: [0, 0],
          canBind: true,
          ...props.handles?.start,
        },
        end: {
          id: 'end',
          index: 1,
          point: [1, 1],
          canBind: true,
          ...props.handles?.end,
        }

      },
      decorations: props.decorations ?? {
        end: Decoration.Arrow,
      },
      style: {
        ...defaultStyle,
        isFilled: false,
        ...props.style,
      },
      label: '',
      labelPoint: [0.5, 0.5],
      ...props,
    }
  }

  Component = TDShapeUtil.Component<T, E, TDMeta>(
    ({ shape, isEditing, isGhost, meta, events, onShapeChange, onShapeBlur }, ref) => {
      const {
        id,
        label = '',
        // handles: { start, end, startConnector, endConnector },
        handles: { start, end },

        decorations = {},
        style,
      } = shape

      const font = getFontStyle(style)
      const styles = getShapeStyle(style, meta.isDarkMode)
      const labelSize = label || isEditing ? getTextLabelSize(label, font) : [0, 0]
      const bounds = this.getBounds(shape)
      const dist = React.useMemo(() => {
        const { start, end } = shape.handles
        return Vec.dist(start.point, end.point)
      }, [shape.handles])
      const scale = Math.max(
        0.5,
        Math.min(1, Math.max(dist / (labelSize[1] + 128), dist / (labelSize[0] + 128)))
      )
      const offset = React.useMemo(() => {
        const bounds = this.getBounds(shape)
        const offset = 
        [bounds.width / 2, bounds.height / 2]
        return offset
      }, [shape, scale])
      const handleLabelChange = React.useCallback(
        (label: string) => {
          onShapeChange?.({ id, label })
        },
        [onShapeChange]
      )
      return (
        <FullWrapper ref={ref} {...events}>
          <TextLabel
            font={font}
            text={label}
            color={styles.stroke}
            offsetX={offset[0]}
            offsetY={offset[1]}
            scale={scale}
            isEditing={isEditing}
            onChange={handleLabelChange}
            onBlur={onShapeBlur}
          />
          <SVGContainer id={shape.id + '_svg'}>
            <defs>
              <mask id={shape.id + '_clip'}>
                <rect
                  x={-100}
                  y={-100}
                  width={bounds.width + 200}
                  height={bounds.height + 200}
                  fill="white"
                />
                <rect
                  x={bounds.width / 2 - (labelSize[0] / 2) * scale + offset[0]}
                  y={bounds.height / 2 - (labelSize[1] / 2) * scale + offset[1]}
                  width={labelSize[0] * scale}
                  height={labelSize[1] * scale}
                  rx={4 * scale}
                  ry={4 * scale}
                  fill="black"
                  opacity={1}
                />
              </mask>
            </defs>
            <g
              pointerEvents="none"
              opacity={isGhost ? GHOSTED_OPACITY : 1}
              mask={label || isEditing ? `url(#${shape.id}_clip)` : ``}
            >
              <ConnectorArrow
                id={id}
                style={style}
                start={start.point}
                end={end.point}
                decorationStart={decorations?.start}
                decorationEnd={decorations?.end}
                isDraw={style.dash === DashStyle.Draw}
                isDarkMode={meta.isDarkMode}
              />
            </g>
          </SVGContainer>
        </FullWrapper>
      )
    }
  )

  Indicator = TDShapeUtil.Indicator<ConnectorShape>(({ shape, bounds }) => {
    const {
      style,
      decorations,
      label,
      handles: { start, end },
    } = shape
    const font = getFontStyle(style)
    const labelSize = label ? getTextLabelSize(label, font) : [0, 0]
    const dist = React.useMemo(() => {
      const { start, end } = shape.handles
      return Vec.dist(start.point, end.point)
    }, [shape.handles])
    const scale = Math.max(
      0.5,
      Math.min(1, Math.max(dist / (labelSize[1] + 128), dist / (labelSize[0] + 128)))
    )
    const offset = React.useMemo(() => {
      const bounds = this.getBounds(shape)
      const offset = [bounds.width / 2, bounds.height / 2]
      return offset
    }, [shape, scale])
    return (
      <>
        <LabelMask
          id={shape.id}
          scale={scale}
          offset={offset}
          bounds={bounds}
          labelSize={labelSize}
        />
        <path
          d={getConnectorPath2(
            shape.id,
            style,
            start.point,
            end.point,
            decorations?.start,
            decorations?.end
          )}
          mask={label ? `url(#${shape.id}_clip)` : ``}
        />
        {label && (
          <rect
            x={bounds.width / 2 - (labelSize[0] / 2) * scale + offset[0]}
            y={bounds.height / 2 - (labelSize[1] / 2) * scale + offset[1]}
            width={labelSize[0] * scale}
            height={labelSize[1] * scale}
            rx={4 * scale}
            ry={4 * scale}
            fill="transparent"
          />
        )}
      </>
    )
  })

  getBounds = (shape: T) => {
    const bounds = Utils.getFromCache(this.boundsCache, shape, () => {
      const {
        handles: { start, end },
      } = shape
      return Utils.getBoundsFromPoints([start.point,  end.point])
    })
    return Utils.translateBounds(bounds, shape.point)
  }

  getRotatedBounds = (shape: T) => {
    const {
      handles: { start, end },
    } = shape
    let points = [start.point, end.point]
    const { minX, minY, maxX, maxY } = Utils.getBoundsFromPoints(points)
    if (shape.rotation !== 0) {
      points = points.map((pt) =>
        Vec.rotWith(pt, [(minX + maxX) / 2, (minY + maxY) / 2], shape.rotation || 0)
      )
    }

    return Utils.translateBounds(Utils.getBoundsFromPoints(points), shape.point)
  }

  getCenter = (shape: T) => {
    const { start, end } = shape.handles
    return Vec.add(shape.point, Vec.med(start.point, end.point))
  }

  shouldRender = (prev: T, next: T) => {
    return (
      next.decorations !== prev.decorations ||
      next.handles !== prev.handles ||
      next.style !== prev.style ||
      next.label !== prev.label
    )
  }

  hitTestPoint = (shape: T, point: number[]): boolean => {
    const {
      handles: { start, end },
    } = shape
    const pt = Vec.sub(point, shape.point)
    const points = [start.point,end.point]
    for (let i = 1; i < points.length; i++) {
      if (Vec.distanceToLineSegment(points[i - 1], points[i], pt) < 1) {
        return true
      }
    }
    return false
  }

  hitTestLineSegment = (shape: T, A: number[], B: number[]): boolean => {
    const {
      handles: { start, end },
    } = shape
    const ptA = Vec.sub(A, shape.point)
    const ptB = Vec.sub(B, shape.point)
    const points = [start.point, end.point]
    for (let i = 1; i < points.length; i++) {
      if (intersectLineSegmentLineSegment(points[i - 1], points[i], ptA, ptB).didIntersect) {
        return true
      }
    }
    return false
  }

  hitTestBounds = (shape: T, bounds: TLBounds) => {
    const { start, end } = shape.handles
    const sp = Vec.add(shape.point, start.point)
    const ep = Vec.add(shape.point, end.point)
    if (Utils.pointInBounds(sp, bounds) || Utils.pointInBounds(ep, bounds)) {
      return true
    }
    
    return intersectLineSegmentBounds(sp, ep, bounds).length > 0
   
}


  transform = (
    shape: T,
    bounds: TLBounds,
    { initialShape, scaleX, scaleY }: TransformInfo<T>
  ): Partial<T> => {
    const initialShapeBounds = this.getBounds(initialShape)
    const handles: (keyof T['handles'])[] = ['start', 'end']
    const nextHandles = { ...initialShape.handles }
    handles.forEach((handle) => {
      const [x, y] = nextHandles[handle].point
      const nw = x / initialShapeBounds.width
      const nh = y / initialShapeBounds.height
      nextHandles[handle] = {
        ...nextHandles[handle],
        point: [
          bounds.width * (scaleX < 0 ? 1 - nw : nw),
          bounds.height * (scaleY < 0 ? 1 - nh : nh),
        ],
      }
    })

    return {
      point: Vec.toFixed([bounds.minX, bounds.minY]),
      handles: nextHandles,
    }
  }

  onDoubleClickHandle = (shape: T, handle: Partial<T['handles']>): Partial<T> | void => {
    switch (handle) {

      case 'start': {
        return {
          decorations: {
            ...shape.decorations,
            start: shape.decorations?.start ? undefined : Decoration.Arrow,
          },
        }
      }
      case 'end': {
        return {
          decorations: {
            ...shape.decorations,
            end: shape.decorations?.end ? undefined : Decoration.Arrow,
          },
        }
      }
    }

    return this
  }

  onHandleChange = (shape: T, handles: Partial<T['handles']>): Partial<T> | void => {
    let nextHandles = Utils.deepMerge<ConnectorShape['handles']>(shape.handles, handles)
    nextHandles = Utils.deepMerge(nextHandles, {
      start: {
        point: Vec.toFixed(nextHandles.start.point),
      },
      end: {
        point: Vec.toFixed(nextHandles.end.point),
      },
      // endConnector: {
      //   point: [0,0],
      // },
      // startConnector: {
      //   point: [0,0],
      // },
    })
    // This will produce NaN values
    if (Vec.isEqual(nextHandles.start.point, nextHandles.end.point)) return
   
    const nextShape = {
      point: shape.point,

      handles: {
        ...nextHandles,
      },
    }
    // Zero out the handles to prevent handles with negative points. If a handle's x or y
    // is below zero, we need to move the shape left or up to make it zero.
    const topLeft = shape.point
    
    const nextBounds = this.getBounds({ ...nextShape } as ConnectorShape)
    const offset = Vec.sub([nextBounds.minX, nextBounds.minY], topLeft)
    if (!Vec.isEqual(offset, [0, 0])) {
      Object.values(nextShape.handles).forEach((handle) => {
        handle.point = Vec.toFixed(Vec.sub(handle.point, offset))
      })
      nextShape.point = Vec.toFixed(Vec.add(nextShape.point, offset))
      if (Vec.isEqual(nextShape.point, [0, 0])) {
        throw Error('here!')
      }
    }
    return nextShape
  }
}

const FullWrapper = styled('div', { width: '100%', height: '100%' })