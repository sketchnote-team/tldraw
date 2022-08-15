import * as React from 'react'
import { Utils, SVGContainer } from '@tldraw/core'
import { SectionShape, DashStyle, TDShapeType, TDMeta } from '~types'
import { GHOSTED_OPACITY, LABEL_POINT } from '~constants'
import { TDShapeUtil } from '../TDShapeUtil'
import {
  defaultStyle,
  getShapeStyle,
  getBoundsRectangle,
  transformRectangle,
  getFontStyle,
  transformSingleRectangle,
} from '~state/shapes/shared'
import { TextLabel } from '../shared/TextLabel'
import { getRectangleIndicatorPathTDSnapshot } from './rectangleHelpers'
import { DrawRectangle } from './components/DrawRectangle'
import { DashedRectangle } from './components/DashedRectangle'
import { BindingIndicator } from './components/BindingIndicator'
import { styled } from '~styles'

type T = SectionShape
type E = HTMLDivElement

export class SectionUtil extends TDShapeUtil<T, E> {
  type = TDShapeType.Section as const

  canBind = true

  canClone = true

  canEdit = true

  children:string[] = []

  getShape = (props: Partial<T>): T => {
    return Utils.deepMerge<T>(
      {
        id: 'id',
        type: TDShapeType.Section,
        name: 'Section',
        parentId: 'page',
        childIndex: 1,
        point: [0, 0],
        size: [1, 1],
        rotation: 0,
        style: defaultStyle,
        label: '',
        children: []
      },
      props
    )
  }

  Component = TDShapeUtil.Component<T, E, TDMeta>(
    (
      {
        shape,
        isEditing,
        isBinding,
        isSelected,
        isGhost,
        meta,
        bounds,
        events,
        onShapeBlur,
        onShapeChange,
      },
      ref
    ) => {
      const { id, size, style, label = '', labelPoint = LABEL_POINT } = shape
      const font = getFontStyle(style)
      const styles = getShapeStyle(style, meta.isDarkMode)
      const Component = style.dash === DashStyle.Draw ? DrawRectangle : DashedRectangle
      const handleLabelChange = React.useCallback(
        (label: string) => onShapeChange?.({ id, label }),
        [onShapeChange]
      )
      return (
        <FullWrapper ref={ref} {...events}>
          <div style={{position:"absolute", top:"30px", left:"20%", zIndex:"9999"}}>
            <button>Section</button>
          </div>
          
          <SVGContainer id={shape.id + '_svg'} opacity={isGhost ? GHOSTED_OPACITY : 1}>
            {isBinding && <BindingIndicator strokeWidth={styles.strokeWidth} size={size} />}
            <Component
              id={id}
              style={style}
              size={size}
              isSelected={isSelected}
              isDarkMode={meta.isDarkMode}
            />
          </SVGContainer>
        </FullWrapper>
      )
    }
  )

  Indicator = TDShapeUtil.Indicator<T>(({ shape }) => {
    const { id, style, size } = shape

    const styles = getShapeStyle(style, false)
    const sw = styles.strokeWidth

    if (style.dash === DashStyle.Draw) {
      return <path d={getRectangleIndicatorPathTDSnapshot(id, style, size)} />
    }

    return (
      <rect
        x={sw}
        y={sw}
        rx={1}
        ry={1}
        width={Math.max(1, size[0] - sw * 2)}
        height={Math.max(1, size[1] - sw * 2)}
      />
    )
  })

  getBounds = (shape: T) => {
    return getBoundsRectangle(shape, this.boundsCache)
  }

  shouldRender = (prev: T, next: T) => {
    return next.size !== prev.size || next.style !== prev.style || next.label !== prev.label
  }

  transform = transformRectangle

  transformSingle = transformSingleRectangle

  setChildren = (children:string[]) => {
    this.children = children
  } 
}

const FullWrapper = styled('div', { width: '100%', height: '100%', position:'relative' })
