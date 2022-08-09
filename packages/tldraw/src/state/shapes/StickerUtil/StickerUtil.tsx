import * as React from 'react'
import { Utils, HTMLContainer } from '@tldraw/core'
import { TDShapeType, TDMeta, StickerShape, TDSnapshot } from '~types'
import { GHOSTED_OPACITY } from '~constants'
import { TDShapeUtil } from '../TDShapeUtil'
import {
  defaultStyle,
  getBoundsRectangle,
  transformRectangle,
  transformSingleRectangle,
} from '~state/shapes/shared'
import { styled } from '@stitches/react'

type T = StickerShape
type E = HTMLDivElement

export class StickerUtil extends TDShapeUtil<T, E> {
  type = TDShapeType.Sticker as const

  canBind = true

  canClone = true

  isAspectRatioLocked = true

  showCloneHandles = true

  getShape = (props: Partial<T>): T => {
    return Utils.deepMerge<T>(
      {
        id: 'image',
        type: TDShapeType.Sticker,
        name: 'Image',
        parentId: 'page',
        childIndex: 1,
        point: [0, 0],
        size: [32, 32],
        rotation: 0,
        style: { ...defaultStyle, isFilled: true },
        assetId: 'assetId',
        svg:''
      },
      props
    )
  }

  Component = TDShapeUtil.Component<T, E, TDMeta>(
    ({ shape, isBinding, isGhost, meta, events, onShapeChange }, ref) => {
      const { size, style } = shape
      const rImage = React.useRef<HTMLImageElement>(null)
      const rWrapper = React.useRef<HTMLDivElement>(null)

      React.useLayoutEffect(() => {
        const wrapper = rWrapper.current
        if (!wrapper) return
        const [width, height] = size
        wrapper.style.width = `${width}px`
        wrapper.style.height = `${height}px`
      }, [size])
      

      return (
        <HTMLContainer ref={ref} {...events}>
          {isBinding && (
            <div
              className="tl-binding-indicator"
              style={{
                position: 'absolute',
                top: `calc(${-this.bindingDistance}px * var(--tl-zoom))`,
                left: `calc(${-this.bindingDistance}px * var(--tl-zoom))`,
                width: `calc(100% + ${this.bindingDistance * 2}px * var(--tl-zoom))`,
                height: `calc(100% + ${this.bindingDistance * 2}px * var(--tl-zoom))`,
                backgroundColor: 'var(--tl-selectFill)',
              }}
            />
          )}

          <Wrapper
            ref={rWrapper}
            
          >          
            <div style={{
              display:"flex",
              justifyContent:"center",
              alignItems:"center"
            }} dangerouslySetInnerHTML={{__html: shape.svg}}
            
            />
          </Wrapper>
 
        </HTMLContainer>
      )
    }
  )

  Indicator = TDShapeUtil.Indicator<T>(({ shape }) => {
    const {
      size: [width, height],
    } = shape

    return (
      <rect x={0} y={0} rx={2} ry={2} width={Math.max(1, width)} height={Math.max(1, height)} />
    )
  })

  getBounds = (shape: T) => {
    return getBoundsRectangle(shape, this.boundsCache)
  }

  shouldRender = (prev: T, next: T) => {
    return next.size !== prev.size || next.style !== prev.style
  }

  transform = transformRectangle

  transformSingle = transformSingleRectangle


}

const Wrapper = styled('div', {
  pointerEvents: 'all',
  position: 'relative',
  fontFamily: 'sans-serif',
  width:'32px',
  height:'32px',
  background: '#FFFFFF',
  border: '1px solid #E2E4E9',
  boxShadow: '0px 2px 4px rgba(19, 23, 32, 0.06)',
  display:'flex',
  justifyContent:'center',
  alignItems:'center',
  borderRadius:'999px'
})

