/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Utils, HTMLContainer, TLBounds } from '@tldraw/core'
import { defaultTextStyle } from '../shared/shape-styles'
import { StyledHeader, StyledParagraph, StyledButton } from '../LessonUtil'
import { AlignStyle, CommentShape, TDMeta, TDShapeType, TransformInfo } from '~types'
import { getBoundsRectangle, TextAreaUtils } from '../shared'
import { TDShapeUtil } from '../TDShapeUtil'
import { getStickyShapeStyle } from '../shared/shape-styles'
import { styled } from '~styles'
import { Vec } from '@tldraw/vec'
import { GHOSTED_OPACITY } from '~constants'
import { TLDR } from '~state/TLDR'
import { getTextSvgElement } from '../shared/getTextSvgElement'
import { stopPropagation } from '~components/stopPropagation'
import { useTldrawApp } from '~hooks'
import { Tooltip } from '~components'
import { Comment } from './components/comment'

type T = CommentShape
type E = HTMLDivElement

export class CommentUtil extends TDShapeUtil<T, E> {
  type = TDShapeType.Comment as const

  canBind = true

  canEdit = true

  canClone = true

  hideResizeHandles = true

  showCloneHandles = true

  getShape = (props: Partial<T>): T => {
    return Utils.deepMerge<T>(
      {
        id: 'id',
        type: TDShapeType.Comment,
        name: 'Comment',
        parentId: 'page',
        childIndex: 1,
        point: [0, 0],
        size: [32, 32],
        user: '',
        comment: '',
        rotation: 0,
        style: defaultTextStyle,
      },
      props
    )
  }

  Component = TDShapeUtil.Component<T, E, TDMeta>(
    ({ shape, meta, events, isGhost, isBinding, isEditing, onShapeBlur, onShapeChange }, ref) => {
      const { color, fill } = getStickyShapeStyle(shape.style, meta.isDarkMode)

      const rContainer = React.useRef<HTMLDivElement>(null)

      const style = {
        transform: '',
      }

      const shapeStyle = {
        borderRadius: '50%',
        border: 'none',
      }

      const app = useTldrawApp()
      const pageState = app.document.pageStates.page

      if (shape.id == pageState.hoveredId && pageState.selectedIds[0] !== shape.id) {
        style['transform'] = 'scale(1.2)'
      }

      if (shape.id === pageState.selectedIds[0]) {
        shapeStyle['border'] = '1px solid #254DDA'
      }

      const user = {
        id: 2189163346,
        point: [0, 0],
        color: '#aa030e',
        user: {
          name: 'Aayush Lama',
          avatar:
            'https://lh3.googleusercontent.com/a/AItbvmkxSDlPkw8aevUuUYOqVJBBf9QYo4MEugPtpdCx=s96-c',
        },
      }

      const deleteComment = () => app.delete()

      return (
        <HTMLContainer ref={ref} {...events}>
          <StyledCommentContainer ref={rContainer} style={{ ...shapeStyle }}>
            <DropdownMenu.Root dir="ltr">
              <DropdownMenu.Trigger asChild>
                <StyledAvatar style={{ backgroundImage: `url(${user.user.avatar})`, ...style }} />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                side="right"
                sideOffset={20}
                style={{ fontFamily: 'Graphik Web' }}
              >
                <StyledCommentWrapper>
                  <StyledCommentBox>
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'space-between',
                      }}
                    >
                      <StyledHeader
                        style={{
                          fontWeight: '500',
                          fontSize: '16px',
                          lineHeight: '20px',
                          height: '20px',
                          color: 'black',
                        }}
                      >
                        Add a Comment
                      </StyledHeader>
                      {/* <Tooltip side="left" label="Mark as resolved"> */}
                      <div
                        {...events}
                        onClick={deleteComment}
                        style={{
                          background: '#F6F7F9',
                          border: '2px solid #D5D7DD',
                          borderRadius: '4px',
                          height: '20px',
                          width: '20px',
                          cursor: 'pointer',
                        }}
                      ></div>
                    </div>
                    <Comment
                      userName={user.user.name}
                      time="10/03/2020"
                      avatar={user.user.avatar}
                      message={
                        'Be crystal clear in explaining your pitch deck and finish it under 20 minutes. Ideally, book the meeting'
                      }
                    />
                    <StyledCommentInputWrapper>
                      <StyledAvatar
                        style={{ backgroundImage: `url(${user.user.avatar})` }}
                      ></StyledAvatar>
                      <input type="text"></input>
                      <button style={{}}>Send</button>
                    </StyledCommentInputWrapper>
                  </StyledCommentBox>
                </StyledCommentWrapper>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
            {/* <InitialComment >Some Comment Here</InitialComment> */}
          </StyledCommentContainer>
        </HTMLContainer>
      )
    }
  )

  Indicator = TDShapeUtil.Indicator<T>(({ shape }) => {
    const {
      size: [width, height],
    } = shape

    return <></>
  })

  getBounds = (shape: T) => {
    return getBoundsRectangle(shape, this.boundsCache)
  }

  shouldRender = (prev: T, next: T) => {
    return next.size !== prev.size || next.style !== prev.style || next.text !== prev.text
  }

  transformSingle = (shape: T): Partial<T> => {
    return shape
  }

  getSvgElement = (shape: T): SVGElement | void => {
    const bounds = this.getBounds(shape)

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('width', bounds.width + '')
    rect.setAttribute('height', bounds.height + '')
    rect.setAttribute('rx', '3')
    rect.setAttribute('ry', '3')

    g.appendChild(rect)

    return g
  }
}

/* -------------------------------------------------- */
/*                       Helpers                      */
/* -------------------------------------------------- */

const PADDING = 16
const MIN_CONTAINER_HEIGHT = 200

const StyledCommentContainer = styled('div', {
  pointerEvents: 'all',
  height: '100%',
  width: '100%',
  position: 'relative',
  display: 'flex',
  fontFamily: 'Graphik Web',
  justifyContent: 'center',
  alignItems: 'center',
  perspective: '800px',
})

export const StyledAvatar = styled('div', {
  height: '24px',
  width: '24px',
  borderRadius: '9999px',
  backgroundSize: 'cover',
})

const StyledCommentWrapper = styled('div', {
  display: 'flex',
  gap: '3px',
  flexDirection: 'column',
})

const StyledCommentBox = styled('div', {
  width: '344px',
  padding: '15px',
  borderRadius: '8px',
  boxShadow: '0px 2px 12px rgba(19, 23, 32, 0.08)',
  background: 'white',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

const InitialComment = styled('div', {
  width: '324px',
  height: '100%',
  position: 'absolute',
  top: '0',
  left: '0',
  zIndex: '99999px',
})

const StyledCommentInputWrapper = styled('div', {
  display: 'flex',
  marginTop: '16px',
  gap: '12px',
  alignItems: 'center',
})
