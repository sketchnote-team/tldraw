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
        url: '',
        title: '',
        icon: '',
        avatarUrl: [],
        firstName: '',
        time: '',
        fileType:''
      },
      props
    )
  }

  Component = TDShapeUtil.Component<T, E, TDMeta>(
    ({ shape, meta, events, isGhost, isBinding }, ref) => {
      const font = getStickyFontStyle(shape.style)

      const { color } = getStickyShapeStyle(shape.style, meta.isDarkMode)
      const fileIcon = (
        <svg
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
      )

      const seperator = <div style={{ borderRight: '1px solid #F0F1F5' }}></div>
        console.log(shape.icon)
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
            <div
              style={{
                display: 'flex',
                alignItems: 'start',
                gap: '10px',
                width: '100%',
                paddingTop: '5px',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '28px',
                  background: '#F9FAFB',
                  border: '1px solid #F6F7F9',
                  boxShadow: '0px 1px 0px #F0F1F5',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '10px',
                }}
              >
                <FileSvg />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <StyledHeader >
                  {shape.title?.length > 20 ? `${shape.title?.slice(0, 20)}...` : shape.title}
                </StyledHeader>

                <div style={{ display: 'flex', paddingTop: '2px', gap: '3px' }}>
                  <div dangerouslySetInnerHTML={{__html:shape.icon}}></div>
                  {seperator}
                  <div
                    style={{
                      fontWeight: '500',
                      fontSize: '12px',
                      lineHeight: '16px',
                      color: '#254DDA',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    {...events} onClick={() => window.open(`${shape.url}`, '_blank')}
                  >
                    {shape.fileType}
                  </div>
                  {seperator}
                  <div
                    style={{
                      fontStyle: 'normal',
                      opacity: '0.6',
                      fontWeight: 400,
                      fontSize: '12px',
                      lineHeight: '16px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Edited by {shape.firstName} {shape.time} ago
                  </div>
                </div>
                <div style={{ display: 'flex', paddingTop: '5px' }}>
                  {shape.avatarUrl.length === 0 ? (
                    <div style={{ height: '24px', visibility: 'hidden' }}></div>
                  ) : (
                    shape.avatarUrl.map((item, i) => (
                      <img
                        key={item.member.memberId}
                        src={item.avatar}
                        alt={item.member.firstname}
                        style={{
                          width: '26px',
                          objectFit: 'cover',
                          height: '26px',
                          borderRadius: '50%',
                          border: '1px solid white',
                          marginRight: '-7px',
                          zIndex: `${shape.avatarUrl.length + 2 - i}`,
                        }}
                      />
                    ))
                  )}
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
  borderRadius: '6px',
  fontFamily: 'Graphik Web',
  height: '100%',
  backgroundColor: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px',
  boxShadow: ' 0px 2px 4px rgba(0, 0, 0, 0.08)',
})

const StyledHeader = styled('div', {
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '14px',
  lineHeight: '21px',
})
