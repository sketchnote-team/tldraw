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

  showCloneHandles = false

  getShape = (props: Partial<T>): T => {
    return Utils.deepMerge<T>(
      {
        id: 'sticker',
        type: TDShapeType.Sticker,
        name: 'sticker',
        parentId: 'page',
        childIndex: 1,
        point: [0, 0],
        size: [50, 50],
        rotation: 0,
        style: { ...defaultStyle, isFilled: true },
        assetId: 'assetId',
        svg: '',
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
          <Wrapper ref={rWrapper}>
            {shape.svg.startsWith('<svg') ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                dangerouslySetInnerHTML={{ __html: shape.svg }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: 0,
                  paddingBottom: '100%',
                  position: 'relative',
                }}
              >
                <img
                  src={shape.svg}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            )}
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
  width: '45px',
  height: '45px',
  pointerEvents: 'all',
})
