/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Mention, MentionsInput } from 'react-mentions'
import MentionInputStyle from './mentionInputStyle'
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
import mentionInputStyle from './mentionInputStyle'

const defaultMentionStyle = {
  backgroundColor: '#cee4e5',
}

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
        user: {},
        comments: [],
        rotation: 0,
        style: defaultTextStyle,
        currentComment: '',
        isOpen: true,
      },
      props
    )
  }

  Component = TDShapeUtil.Component<T, E, TDMeta>(
    ({ shape, meta, events, isGhost, isBinding, isEditing, onShapeBlur, onShapeChange }, ref) => {
      const rContainer = React.useRef<HTMLDivElement>(null)

      const rComment = React.useRef<HTMLDivElement>(null)

      const style = {
        transform: '',
      }

      const shapeStyle = {
        borderRadius: '50%',
        border: 'none',
      }

      const app = useTldrawApp()
      const pageState = app.document.pageStates.page
      const user = app.appState.user
      const isOpen = app.useStore(s => s.appState.isOpen[shape.id])
      const members = app.appState.members
      const [commentValue, setCommentValue] = React.useState('')
      // const defaultOpen = app.useStore((s) => s.appState.defaultOpen)
      // using this will cause every comment shape to render on default open change so avoid it
      // if needed make key value pair to store every default open for each comment

      if (shape.id == pageState.hoveredId && pageState.selectedIds[0] !== shape.id) {
        style['transform'] = 'scale(1.2)'
      }

      if (shape.id === pageState.selectedIds[0]) {
        shapeStyle['border'] = '1px solid #254DDA'
      }

      const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setCommentValue(value)
      }

      const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onShapeChange?.({
          ...shape,
          currentComment: TLDR.normalizeText(e.currentTarget.value),
        })
      }

      const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') addComment()
      }

      const addComment = () => {
        if (commentValue.trim() === '') return
        const regex = /[^{}]+(?=})/g
        const comments = commentValue.split('}uxB)')

        const mentions = commentValue.match(regex)?.filter(c => !c.includes('uxB'))
        const mentionedUsers = members
          .filter(member => {
            if (mentions?.includes(member.id)) return member
            return false
          })
          .map(m => m.id)

        if (mentions && mentions.length) {
          app.setMention(true)
        }
        app.setMentionedUsers(mentionedUsers)
        const newCommentArray = comments.map(comment => {
          if (comment.includes('[@')) {
            return `<span style="color:#254DDA;">@${comment.split('[@')[1].split(' ')[0]}</span>`
          }
          return comment
        })
        const comment = newCommentArray.join('')
        setCommentValue('')
        const newComments = [
          ...shape.comments,
          {
            id: Utils.uniqueId(),
            userName: user.user.name,
            time: getTodayDate(),
            avatar: user.user.avatar,
            message: comment,
          },
        ]
        onShapeChange?.({
          ...shape,
          comments: newComments,
          currentComment: '',
        })
      }

      const deleteComment = (shapeId = shape.id) => app.delete([shapeId])
      const deleteCommentbyId = (id: string) => {
        const newComments = shape.comments.filter(comment => comment.id !== id)

        onShapeChange?.({
          ...shape,
          comments: newComments,
        })
      }

      const getTodayDate = () => {
        const today = new Date()
        const yyyy = today.getFullYear()
        let mm = today.getMonth() + 1 // Months start at 0!
        let dd = today.getDate()

        if (dd < 10) dd = '0' + dd
        if (mm < 10) mm = '0' + mm

        const formattedToday = dd + '/' + mm + '/' + yyyy

        return formattedToday
      }

      React.useEffect(() => {
        rComment.current?.scroll({
          top: rComment.current.scrollHeight,
          behavior: 'smooth',
        })
      }, [shape])

      return (
        <HTMLContainer ref={ref} {...events}>
          <StyledCommentContainer ref={rContainer} style={{ ...shapeStyle }}>
            <DropdownMenu.Root
              modal={false}
              dir="ltr"
              open={app.appState.defaultOpen ? true : isOpen}
            >
              <DropdownMenu.Trigger asChild>
                <StyledAvatar
                  {...events}
                  onPointerDown={() => {
                    app.setDropDown(shape.id)
                  }}
                  style={{ backgroundImage: `url(${shape.user.user.avatar})`, ...style }}
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                onPointerDownOutside={() => {
                  if (!shape.comments.length && shape.currentComment == '') {
                    deleteComment(shape.id)
                    app.setDefaultOpen(false)
                    return
                  }
                  app.setDefaultOpen(false)
                  app.setDropDown(shape.id, false)
                  onShapeChange?.({
                    ...shape,
                  })
                }}
                side="right"
                sideOffset={20}
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
                        // onClick = {deleteComment}
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
                    <div
                      ref={rComment}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        maxHeight: '400px',
                        overflow: 'auto',
                      }}
                    >
                      {shape.comments.map((comment, i) => (
                        <Comment
                          onPointerDown={events.onPointerDown}
                          userName={comment.userName}
                          time={comment.time}
                          avatar={comment.avatar}
                          message={comment.message}
                          key={comment.id}
                          deleteCommentbyId={() => deleteCommentbyId(comment.id)}
                          style={
                            i !== shape.comments.length - 1
                              ? { borderBottom: '1px solid #E2E4E9', paddingBottom: '16px' }
                              : null
                          }
                        />
                      ))}
                    </div>
                    <StyledCommentInputWrapper {...events}>
                      <StyledAvatar
                        style={{ backgroundImage: `url(${user.user.avatar})` }}
                      ></StyledAvatar>
                      {/* <input
                        placeholder="Add a Comment..."
                        style={{
                          marginLeft: '2px',
                          outline: 'none',
                          border: 'none',
                          flex: 'auto',
                        }}
                        type="text"
                        onChange={handleTextChange}
                        value={shape.currentComment}
                        onKeyDown={handleKeyDown}
                      ></input> */}
                      <MentionsInput
                        singleLine
                        value={commentValue}
                        onChange={onChangeText}
                        onKeyDown={handleKeyDown}
                        placeholder="Add a Comment..."
                        style={MentionInputStyle}
                        type="text"
                      >
                        <Mention
                          markup="}uxB)[@__display__]{__id__}uxB)"
                          trigger="@"
                          data={members}
                          style={defaultMentionStyle}
                          renderSuggestion={(entry:any) => {
                            
                            return (
                              <div
                                {...events}
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  gap: '10px',
                                  alignItems: 'center',
                                  position: 'relative',
                                }}
                              >
                                <div
                                  style={{
                                    position: 'absolute',
                                    fontWeight: '500',
                                    fontSize: '12px',
                                    lineHeight: '18px',
                                    height: '18px',
                                    color: '#55585E',
                                    top:'10px',
                                    right:'3px'
                                  }}
                                >{entry.role}</div>
                                <img
                                  style={{
                                    height: '28px',
                                    width: '28px',
                                    borderRadius: '9999px',
                                    backgroundSize: 'cover',
                                  }}
                                  src={entry.avatar}
                                  alt={entry.id}
                                />
                                <div
                                  {...events}
                                  style={{ display: 'flex', flexDirection: 'column' }}
                                >
                                  <div
                                    style={{
                                      fontWeight: '400',
                                      fontSize: '14px',
                                      lineHeight: '20px',
                                      height: '20px',
                                      color: '#131720',
                                      position: 'relative',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {entry.display}
                                  </div>
                                  <div
                                    style={{
                                      fontWeight: '400',
                                      fontSize: '10px',
                                      lineHeight: '16px',
                                      height: '16px',
                                      color: '#55585E',
                                    }}
                                  >
                                    {entry.id}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    fontWeight: '500',
                                    fontSize: '12px',
                                    lineHeight: '18px',
                                    height: '18px',
                                    color: '#55585E',
                                    marginLeft: '10px',
                                    visibility: 'hidden',
                                  }}
                                >
                                  {entry.role}
                                </div>
                              </div>
                            )
                          }}
                        />
                      </MentionsInput>
                      <button
                        style={{
                          padding: '6px 16px',
                          height: '32px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          background: 'transparent ',
                          border: '1px solid #254DDA',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                        {...events}
                        onClick={addComment}
                      >
                        <StyledHeader
                          style={{
                            fontWeight: '500',
                            fontSize: '14px',
                            lineHeight: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#254DDA',
                          }}
                        >
                          Send
                        </StyledHeader>
                      </button>
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
    return next.size !== prev.size || next.style !== prev.style || next.isOpen !== prev.isOpen
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
  fontFamily: 'Graphik Web',
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
  // justifyContent:"space-between"
})
