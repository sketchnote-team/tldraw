import * as React from 'react'
import { Utils, HTMLContainer, TLBounds } from '@tldraw/core'
import { FileShape, TDMeta, TDShapeType, TransformInfo } from '~types'
import { defaultTextStyle, getBoundsRectangle } from '../shared'
import { TDShapeUtil } from '../TDShapeUtil'
import { getStickyFontStyle, getStickyShapeStyle } from '../shared/shape-styles'
import { styled } from '~styles'
import { Vec } from '@tldraw/vec'
import {FileIcon} from '@radix-ui/react-icons'

type T = FileShape
type E = HTMLDivElement

export class FileUtil extends TDShapeUtil<T, E> {
  type = TDShapeType.File as const

  canBind = true

  canEdit = true

  canClone = true

  hideResizeHandles = true

  showCloneHandles = true

  getShape = (props: Partial<T>): T => {
    return Utils.deepMerge<T>(
      {
        id: 'id',
        type: TDShapeType.File,
        name: 'File',
        parentId: 'page',
        childIndex: 1,
        point: [0, 0],
        size: [0, 0],
        rotation: 0,
        style: defaultTextStyle,
        url:'',
        title:''
      },
      props
    )
  }

  Component = TDShapeUtil.Component<T, E, TDMeta>(
    ({ shape, meta, events, isGhost, isBinding }, ref) => {
      const font = getStickyFontStyle(shape.style)

      const { color } = getStickyShapeStyle(shape.style, meta.isDarkMode)

      return (
        <HTMLContainer ref={ref} {...events}>
           
          <StyledFileContainer>
            {isBinding && (
              <div
                className="tl-binding-indicator"
                style={{
                  position: 'absolute',
                  top: -this.bindingDistance,
                  left: -this.bindingDistance,
                  width: `calc(100% + ${this.bindingDistance * 2}px)`,
                  height: `calc(100% + ${this.bindingDistance * 2}px)`,
                  backgroundColor: 'var(--tl-selectFill)',
                }}
              />
            )}
            <div style={{display:"flex", justifyContent:"center",alignItems:'center'}}>
                <FileIcon/>
                <div style={{cursor:"pointer", textDecoration:"underline"}} onClick={()=>window.open(`/${shape.url}`,'_blank')} {...events} >{shape.title}</div>
            </div>
           
          </StyledFileContainer>
        </HTMLContainer>
        
      )
    }
  )

  Indicator = TDShapeUtil.Indicator<T>(({ shape }) => {
    const {
      size: [width, height],
    } = shape

    return (
      <rect x={0} y={0} rx={3} ry={3} width={Math.max(1, width)} height={Math.max(1, height)} />
    )
  })

  getBounds = (shape: T) => {
    return getBoundsRectangle(shape, this.boundsCache)
  }

  shouldRender = (prev: T, next: T) => {
    return next.size !== prev.size || next.style !== prev.style
  }

  transform = (
    shape: T,
    bounds: TLBounds,
    { scaleX, scaleY, transformOrigin }: TransformInfo<T>
  ): Partial<T> => {
    const point = Vec.toFixed([
      bounds.minX +
        (bounds.width - shape.size[0]) * (scaleX < 0 ? 1 - transformOrigin[0] : transformOrigin[0]),
      bounds.minY +
        (bounds.height - shape.size[1]) *
          (scaleY < 0 ? 1 - transformOrigin[1] : transformOrigin[1]),
    ])

    return {
      point,
    }
  }

  transformSingle = (shape: T): Partial<T> => {
    return shape
  }

 
}

/* -------------------------------------------------- */
/*                       Helpers                      */
/* -------------------------------------------------- */

const StyledFileContainer = styled('div', {
  pointerEvents: 'all',
  position: 'relative',
  border: '1px solid #E2E4E9',
  borderRadius:'4px',
  fontFamily:"Graphik Web",
  height:"100%",
  backgroundColor:'#ffffff',
  display:'flex',
  alignItems:"center",
  justifyContent:"center"
})
