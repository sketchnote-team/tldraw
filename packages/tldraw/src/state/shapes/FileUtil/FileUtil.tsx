import * as React from 'react'
import { Utils, HTMLContainer, TLBounds } from '@tldraw/core'
import { FileShape, TDMeta, TDShapeType, TransformInfo } from '~types'
import { defaultTextStyle, getBoundsRectangle } from '../shared'
import { TDShapeUtil } from '../TDShapeUtil'
import { getStickyFontStyle, getStickyShapeStyle } from '../shared/shape-styles'
import { styled } from '~styles'
import { Vec } from '@tldraw/vec'
import FileSvg from './FileSvg'

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
        title:'',
        files: 0,
        avatarUrl: [],
        firstName:'',
        time:''
      },
      props
    )
  }

  Component = TDShapeUtil.Component<T, E, TDMeta>(
    ({ shape, meta, events, isGhost, isBinding }, ref) => {
      const font = getStickyFontStyle(shape.style)

      const { color } = getStickyShapeStyle(shape.style, meta.isDarkMode)
      const fileIcon = <svg
          width={10}
          height={12}
          viewBox="0 0 10 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.96086 3.02143V0.0548571L9.92743 3.02143H6.96086ZM5.44972 3.02143C5.44972 3.42221 5.60893 3.80657 5.89232 4.08997C6.17572 4.37336 6.56008 4.53257 6.96086 4.53257H9.98229V10.4889C9.98229 10.8896 9.82308 11.274 9.53969 11.5574C9.25629 11.8408 8.87193 12 8.47115 12H1.67229C1.47331 12.0001 1.27626 11.9609 1.09248 11.8846C0.908694 11.8084 0.741795 11.6965 0.601371 11.5555C0.460948 11.4145 0.349767 11.2472 0.274219 11.0631C0.198671 10.879 0.160245 10.6818 0.161148 10.4829V1.51714C0.160693 1.11567 0.319564 0.730424 0.602885 0.445978C0.886206 0.161532 1.27082 0.00113513 1.67229 0L5.44972 0V3.02143Z"
            fill="#D5D7DD"
          />
        </svg>
    
    const burgerIcon =<svg
    width={46}
    height={38}
    viewBox="0 0 46 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_5279_59336)">
      <rect x={8} y={6} width={30} height={22} rx={4} fill="white" />
      <g clipPath="url(#clip0_5279_59336)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M28.2158 18.75C28.5619 18.75 28.9003 18.6474 29.1881 18.4551C29.4759 18.2628 29.7002 17.9895 29.8326 17.6697C29.9651 17.3499 29.9997 16.9981 29.9322 16.6586C29.8647 16.3191 29.698 16.0073 29.4533 15.7626C29.2085 15.5178 28.8967 15.3512 28.5572 15.2836C28.2178 15.2161 27.8659 15.2508 27.5461 15.3832C27.2264 15.5157 26.953 15.74 26.7607 16.0278C26.5685 16.3155 26.4658 16.6539 26.4658 17C26.4657 17.2299 26.5109 17.4575 26.5988 17.6699C26.6867 17.8822 26.8156 18.0752 26.9781 18.2377C27.1406 18.4003 27.3336 18.5292 27.546 18.6171C27.7583 18.705 27.986 18.7501 28.2158 18.75ZM22.9658 18.75C23.3119 18.75 23.6503 18.6474 23.9381 18.4551C24.2259 18.2628 24.4502 17.9895 24.5826 17.6697C24.7151 17.3499 24.7497 16.9981 24.6822 16.6586C24.6147 16.3191 24.448 16.0073 24.2033 15.7626C23.9585 15.5178 23.6467 15.3512 23.3072 15.2836C22.9678 15.2161 22.6159 15.2508 22.2961 15.3832C21.9764 15.5157 21.703 15.74 21.5107 16.0278C21.3185 16.3155 21.2158 16.6539 21.2158 17C21.2157 17.2299 21.2609 17.4575 21.3488 17.6699C21.4367 17.8822 21.5656 18.0752 21.7281 18.2377C21.8906 18.4003 22.0836 18.5292 22.296 18.6171C22.5083 18.705 22.736 18.7501 22.9658 18.75ZM17.7158 18.75C18.0619 18.75 18.4003 18.6474 18.6881 18.4551C18.9759 18.2628 19.2002 17.9895 19.3326 17.6697C19.4651 17.3499 19.4997 16.9981 19.4322 16.6586C19.3647 16.3191 19.198 16.0073 18.9533 15.7626C18.7085 15.5178 18.3967 15.3512 18.0572 15.2836C17.7178 15.2161 17.3659 15.2508 17.0461 15.3832C16.7264 15.5157 16.453 15.74 16.2607 16.0278C16.0685 16.3155 15.9658 16.6539 15.9658 17C15.9657 17.2299 16.0109 17.4575 16.0988 17.6699C16.1867 17.8822 16.3156 18.0752 16.4781 18.2377C16.6406 18.4003 16.8336 18.5292 17.046 18.6171C17.2583 18.705 17.486 18.7501 17.7158 18.75Z"
          fill="#878A92"
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_5279_59336"
        x={0}
        y={0}
        width={46}
        height={38}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={2} />
        <feGaussianBlur stdDeviation={4} />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.0745098 0 0 0 0 0.0901961 0 0 0 0 0.12549 0 0 0 0.16 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_5279_59336"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_5279_59336"
          result="shape"
        />
      </filter>
      <clipPath id="clip0_5279_59336">
        <rect width={14} height={14} fill="white" transform="translate(16 10)" />
      </clipPath>
    </defs>
  </svg>
    
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
            <div style={{display:'flex', alignItems:'start', gap:"10px", width:"100%", paddingTop:"5px" }}>
                  
                <div 
                  style={{
                    width: '24px',
                    height: '28px',
                    background: "#F9FAFB",
                    border: "1px solid #F6F7F9",
                    boxShadow: "0px 1px 0px #F0F1F5",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems:"center",
                    justifyContent:"center",
                    marginTop:"10px"
                }}>
                  <FileSvg />
                </div>

              <div style={{display:'flex',   flexDirection: 'column',}}>
                <StyledHeader {...events} onClick={()=>window.open(`${shape.url}`,'_blank')}>
                  {shape.title?.length>=20?`${shape.title?.slice(0,20)}...`:shape.title}
                </StyledHeader>
                <div style={{display:'flex', paddingTop:"2px",}}>
                  <div style={{fontStyle: "normal", opacity: "0.6",paddingLeft: '5px', fontWeight: 400, fontSize: "12px", lineHeight: "16px", display: "flex", alignItems: "center" }}>
                    Edited by {shape.firstName} {shape.time} ago
                  </div>
                </div>
                <div style={{display: 'flex', paddingTop:"10px"}}>
                  {shape.avatarUrl.length===0? <div style={{height:"24px", visibility:"hidden"}}></div> :
                  shape.avatarUrl.map((item,i)=><img src={item.avatar} alt={item.member.firstname} style={{width: '24px', height: '24px', borderRadius: '50%', border:'1px solid white', marginRight:'-10px', zIndex:`${shape.avatarUrl.length+2-i}`}} />)}
                </div>
              </div>
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
  borderRadius:'6px',
  fontFamily:"Graphik Web",
  height:"100%",
  backgroundColor:'#ffffff',
  display:'flex',
  alignItems:"center",
  justifyContent:"center",
  padding:"12px",
  boxShadow:" 0px 2px 4px rgba(0, 0, 0, 0.08)"
})

const StyledHeader = styled('div',{
  fontStyle: "normal",
  fontWeight: "600",
  fontSize: "14px",
  lineHeight: "21px",
  cursor:"pointer",
})
