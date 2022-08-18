import * as React from 'react'
import { Utils, SVGContainer } from '@tldraw/core'
import { SectionShape, DashStyle, TDShapeType, TDMeta } from '~types'
import { GHOSTED_OPACITY, LABEL_POINT } from '~constants'
import { TDShapeUtil } from '../TDShapeUtil'
import {
  defaultSectionStyle,
  getBoundsRectangle,
  transformRectangle,
  getFontStyle,
  transformSingleRectangle,
  getSectionShapeStyle,
} from '~state/shapes/shared'
import { getRectangleIndicatorPathTDSnapshot } from './rectangleHelpers'
import { DrawRectangle } from './components/DrawRectangle'
import { DashedRectangle } from './components/DashedRectangle'
import { BindingIndicator } from './components/BindingIndicator'
import { styled } from '~styles'
import { SectionHeader } from './components/SectionHeader'

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
        style: defaultSectionStyle,
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
      const { id, size, style,  labelPoint = LABEL_POINT, label = 'section' } = shape
      const font = getFontStyle(style)
     
      
      const styles = getSectionShapeStyle(style, meta.isDarkMode)
      const Component = style.dash === DashStyle.Draw ? DrawRectangle : DashedRectangle
      const handleLabelChange = React.useCallback(
        (label: string) => onShapeChange?.({ id, label }),
        [onShapeChange]
      )

      return (
        <FullWrapper ref={ref} {...events}>
          <SectionButton  {...events} >
            <SectionHeader
              isEditing={isEditing}
              onChange={handleLabelChange}
              onBlur={onShapeBlur}
              font={font}
              text={label}
              color={styles.stroke}
              offsetX={(labelPoint[0] - 0.5) * bounds.width}
              offsetY={(labelPoint[1] - 0.5) * bounds.height}
            />
          </SectionButton>
       
          
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

    const styles = getSectionShapeStyle(style, false)
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
const SectionButton = styled('div', {position:"absolute", fontFamily:"Graphik Web", top:"42px", left:"30%", zIndex:"99", pointerEvents:"all", cursor:"pointer"})
