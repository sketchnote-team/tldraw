import * as React from 'react'
import { styled } from '~styles'
import { StyledHeader, StyledParagraph } from '~state/shapes/LessonUtil'
import { StyledAvatar } from '../CommentUtil'

export interface CommentProps {
  userName: string
  avatar: string
  message: string
  time: string
  style: any
}

export const Comment = React.memo(function Comment({
  userName,
  avatar,
  message,
  time,
  style,
}: CommentProps) {
  return (
    <StyledCommentWrapper style={{ ...style }}>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <StyledAvatar style={{ backgroundImage: `url(${avatar})` }} />
        <StyledUserName>
          <StyledHeader
            style={{
              fontWeight: '400',
              fontSize: '14px',
              lineHeight: '20px',
              height: '20px',
              color: 'black',
            }}
          >
            {userName}
          </StyledHeader>
          <div
            style={{
              fontWeight: '400',
              fontSize: '10px',
              lineHeight: '16px',
              height: '16px',
              color: '#55585E',
            }}
          >
            {time}
          </div>
        </StyledUserName>
      </div>
      <StyledMessage>{message}</StyledMessage>
    </StyledCommentWrapper>
  )
})

const StyledCommentWrapper = styled('div', {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

const StyledUserName = styled('div', {
  flex: 'auto',
  display: 'flex',
  flexDirection: 'column',
})

const StyledMessage = styled('div', {
  fontWeight: '400',
  fontSize: '14px',
  lineHeight: '20px',
  letterSpacing: '-0.1px',
  verticalAlign: 'top',
  margin: '0px',
  wordWrap: 'break-word',
})
