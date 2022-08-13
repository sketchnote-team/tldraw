import * as React from 'react'
import { Utils, HTMLContainer, TLBounds } from '@tldraw/core'
import { EmbedShape, TDMeta, TDShapeType, TransformInfo } from '~types'
import { defaultTextStyle, getBoundsRectangle } from '../shared'
import { TDShapeUtil } from '../TDShapeUtil'
import { getStickyFontStyle, getStickyShapeStyle } from '../shared/shape-styles'
import { styled } from '~styles'
import { Vec } from '@tldraw/vec'
import embed from 'embed-video'

type T = EmbedShape
type E = HTMLDivElement

export class EmbedUtil extends TDShapeUtil<T, E> {

  type = TDShapeType.Embed as const

  canBind = true

  canEdit = true

  canClone = true

  hideResizeHandles = true

  showCloneHandles = true

  getShape = (props: Partial<T>): T => {
    return Utils.deepMerge<T>(
      {
        id: 'id',
        type: TDShapeType.Embed,
        name: 'Link',
        parentId: 'page',
        childIndex: 1,
        point: [0, 0],
        size: [70, 70],
        rotation: 0,
        style: defaultTextStyle,
        src:'',
        faviconSrc:''
      },
      props
    )
  }

  Component = TDShapeUtil.Component<T, E, TDMeta>(
    ({ shape, meta, events, isGhost, isBinding }, ref) => {
      const font = getStickyFontStyle(shape.style)

      const { color } = getStickyShapeStyle(shape.style, meta.isDarkMode)

      const rContainer = React.useRef<HTMLDivElement>(null)

      return (
        <HTMLContainer ref={ref} {...events}>  
          <StyledFrame>
  
           <div style={{display:'flex',gap:'8px', alignItems:"center", paddingLeft:"3px"}}>
            <img src={shape.faviconSrc} alt={shape.type} height="50%" width="50%"/>
            <p style={{margin:'0'}}>{embed.info(shape.src).source}</p>
           </div>
           <div style={{overflow:'hidden', borderRadius:"6px",}} dangerouslySetInnerHTML={{__html:embed(shape.src,{attr:{width:289,height:'162'}})}}>
          
           </div>
            </StyledFrame>
        
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
const StyledFrame = styled('div',{
  pointerEvents:'all',
  borderRadius:'6px',
  border: '0.383929px solid #C5D0D8',
  height:'100%',
  width:'100%',
  display:"flex",
  flexDirection:"column",
  alignItems:"start",
  padding:"5px",
})

