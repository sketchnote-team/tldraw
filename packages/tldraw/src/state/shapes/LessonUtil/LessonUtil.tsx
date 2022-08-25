import * as React from 'react'
import { Utils, HTMLContainer, TLBounds } from '@tldraw/core'
import { LessonShape, TDMeta, TDShapeType, TransformInfo } from '~types'
import { defaultTextStyle, getBoundsRectangle } from '../shared'
import { TDShapeUtil } from '../TDShapeUtil'
import { getStickyFontStyle, getStickyShapeStyle } from '../shared/shape-styles'
import { styled } from '~styles'
import { Vec } from '@tldraw/vec'

type T = LessonShape
type E = HTMLDivElement

const arrow = <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M7.17902 10.128L10.26 7.083L1.06602 7.041C0.925333 7.04047 0.786134 7.01221 0.656385 6.95783C0.526636 6.90344 0.408885 6.82401 0.309872 6.72407C0.210858 6.62412 0.132525 6.50564 0.0793567 6.37539C0.026188 6.24513 -0.000772996 6.10568 1.68656e-05 5.965C0.00067166 5.8244 0.0290302 5.6853 0.0834714 5.55567C0.137913 5.42604 0.217369 5.3084 0.317298 5.2095C0.417228 5.11059 0.535671 5.03235 0.665856 4.97924C0.796042 4.92613 0.935418 4.89921 1.07602 4.9L10.268 4.941L7.22802 1.865C7.12893 1.76523 7.05048 1.64691 6.99715 1.51681C6.94383 1.3867 6.91666 1.24736 6.91722 1.10675C6.91778 0.966143 6.94604 0.827022 7.0004 0.697344C7.05476 0.567666 7.13414 0.449974 7.23402 0.350995C7.43594 0.151199 7.70891 0.0397146 7.99297 0.0410271C8.27702 0.0423396 8.54895 0.156342 8.74902 0.357995L13.749 5.407C13.9129 5.57276 14.0042 5.79684 14.0029 6.02994C14.0016 6.26305 13.9078 6.48608 13.742 6.65L8.68902 11.65C8.48726 11.8497 8.21446 11.9612 7.93057 11.9599C7.64667 11.9586 7.37491 11.8446 7.17502 11.643C7.07577 11.5433 6.99714 11.425 6.94363 11.2949C6.89012 11.1647 6.86277 11.0254 6.86314 10.8847C6.86351 10.744 6.8916 10.6047 6.9458 10.4749C7 10.3451 7.07925 10.2272 7.17902 10.128Z" fill="white"/>
</svg>


export class LessonUtil extends TDShapeUtil<T, E> {
  type = TDShapeType.Lesson as const

  canBind = true

  canEdit = true

  canClone = true

  hideResizeHandles = true

  showCloneHandles = true

  getShape = (props: Partial<T>): T => {
    return Utils.deepMerge<T>(
      {
        id: 'id',
        type: TDShapeType.Lesson,
        name: 'Lesson',
        parentId: 'page',
        childIndex: 1,
        point: [0, 0],
        size: [0, 0],
        rotation: 0,
        style: defaultTextStyle,
        url: '',
        imageUrl: '',
        title: '',
        description:''
      },
      props
    )
  }

  Component = TDShapeUtil.Component<T, E, TDMeta>(
    ({ shape, meta, events, isGhost, isBinding }, ref) => {
      const font = getStickyFontStyle(shape.style)

      const { color } = getStickyShapeStyle(shape.style, meta.isDarkMode)

      const seperator = <div style={{ borderRight: '1px solid #F0F1F5' }}></div>

      return (
        <HTMLContainer ref={ref} {...events}>
          <StyledFileContainer>
            <StyledImage src={shape.imageUrl} alt={shape.title} />
            <StyledHeader>{shape.title.length>30?shape.title.slice(0,30)+'...':shape.title}</StyledHeader>
            <StyledParagraph>{shape.description.length>80?shape.description.slice(0,80)+'...':shape.description}</StyledParagraph>
            <StyledButton onClick={()=>{window.open(shape.url,'_blank')} } {...events}>Open
                <div style={{position:"absolute", top:"12px", right:"14px"}}>{arrow}</div>
            </StyledButton>
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
  borderRadius: '8px',
  fontFamily: 'Graphik Web',
  height: '100%',
  backgroundColor: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection:'column',
  padding: '16px',
  boxShadow: ' 0px 2px 4px rgba(0, 0, 0, 0.08)',
  gap:"8px"
})

const StyledHeader = styled('div', {
  display:'flex',
  alignItems:"start",
  fontStyle: 'normal',
  fontWeight: '700',
  fontSize: '18px',
  lineHeight: '24px',
  height:'24px',
  width:"100%",
  color: '#131720'
})

const StyledImage = styled('img', {
    width:"303px",
    height:"106px",
    borderRadius:"7px",
    objectFit:"cover",
    pointerEvents:"none"
  })

const StyledParagraph = styled('p',{
    height:"40px",
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '20px',    
    letterSpacing: '-0.1px',
    verticalAlign:"top",
    margin:'0px'
})

const StyledButton = styled('div',{
    height:"40px",
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '20px',    
    letterSpacing: '-0.1px',
    background: '#254DDA',
    margin:'0px',
    color: '#FFFFFF',
    padding: '10px 16px',
    width:"100%",
    borderRadius:"4px",
    border:"none",
    cursor:"pointer",
    textAlign:"start",
    position:"relative"
})
  
  
