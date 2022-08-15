import * as React from 'react'
import { Utils, HTMLContainer, TLBounds } from '@tldraw/core'
import { LinkShape, TDMeta, TDShapeType, TransformInfo } from '~types'
import { defaultTextStyle, getBoundsRectangle } from '../shared'
import { TDShapeUtil } from '../TDShapeUtil'
import { getStickyFontStyle, getStickyShapeStyle } from '../shared/shape-styles'
import { styled } from '~styles'
import { Vec } from '@tldraw/vec'

type T = LinkShape
type E = HTMLDivElement

export class LinkUtil extends TDShapeUtil<T, E> {
  type = TDShapeType.Link as const

  canBind = true

  canEdit = true

  canClone = true

  hideResizeHandles = true

  showCloneHandles = true

  getShape = (props: Partial<T>): T => {
    return Utils.deepMerge<T>(
      {
        id: 'id',
        type: TDShapeType.Link,
        name: 'Link',
        parentId: 'page',
        childIndex: 1,
        point: [0, 0],
        size: [70, 70],
        rotation: 0,
        style: defaultTextStyle,
        url:'',
        title:'',
        description:'',
        imageUrl:''
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
           
          <StyledLinkContainer>
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
            {shape.imageUrl && <div style={{backgroundImage:`url(${shape.imageUrl})`, width:"303px", height:`${shape.size[1]-120}px`, backgroundSize:"contain"}}></div>}
            <StyledLinkContent>
              
              {shape.title  &&  <StyledTitleContainer>
                {shape.title.length>=26? shape.title.slice(0,26) + '...' :shape.title }
              </StyledTitleContainer>}
             {shape.description  &&  <StyledDescription>
                {shape.description.length>=90? shape.description.slice(0,90) + '...' :shape.description }
              </StyledDescription>}
              <StyledLink {...events} onClick={()=>window.open(shape.url,"_blank")}>
                {shape.url}
              </StyledLink>
            </StyledLinkContent>
          </StyledLinkContainer>
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

const StyledLinkContainer = styled('div', {
  pointerEvents: 'all',
  position: 'relative',
  border: '1px solid #E2E4E9',
  borderRadius:'4px',
  fontFamily:"Graphik Web",
  height:"100%",
  backgroundColor:'#ffffff',
})

const StyledLinkContent = styled('div',{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '10px',
  padding:'16px',
})


const StyledTitleContainer = styled('h2', {
  fontWeight:'400',
  fontSize:'16px',
  lineHeight:'20px',
  color:'#55585E',
  margin:'0px',
})

const StyledDescription = styled('p', {
  fontWeight:'400',
  fontSize:'10px',
  lineHeight:'16px',
  letterSpacing:'-0.1px',
  margin:'0px',
  color:'#878A92',
})

const StyledLink = styled('p', {
  fontWeight:'400',
  fontSize:'10px',
  lineHeight:'16px',
  letterSpacing:'-0.1px',
  margin:'0px',
  color:'#55585E',
  zIndex:'100000',
  cursor:'pointer',
  pointerEvents:"all"
})

