import * as React from 'react'
import { stopPropagation } from '~components/stopPropagation'
import { GHOSTED_OPACITY, LETTER_SPACING } from '~constants'
import { useTextKeyboardEvents } from '~state/internal'
import { getTextLabelSize } from '~state/internal'
import { TLDR } from '~state/TLDR'
import { styled } from '~styles'
import { useTldrawApp } from '~hooks'

export interface TextLabelProps {
  font: string
  text: string
  color: string
  onBlur?: () => void
  onChange: (text: string) => void
  offsetY?: number
  offsetX?: number
  scale?: number
  isEditing?: boolean,
}

export const SectionHeader = React.memo(function TextLabel({
  font,
  text,
  color,
  offsetX = 0,
  offsetY = 0,
  scale = 1,
  isEditing = false,
  onBlur,
  onChange,
}: TextLabelProps) {
  if(!text) text="section"

  const app = useTldrawApp()
  const rInput = React.useRef<HTMLTextAreaElement>(null)
  const rIsMounted = React.useRef(false)

  const rTextContent = React.useRef(text)

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      rTextContent.current = TLDR.normalizeText(e.currentTarget.value)
      onChange(rTextContent.current)
    },
    [onChange]
  )

  const handleKeyDown = React.useCallback(
  (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(e.key==="Enter"){
      app.setEditingId()
    }
  },
  [isEditing]
)

  const handleBlur = React.useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      e.currentTarget.setSelectionRange(0, 0)
      onBlur?.()
    },
    [onBlur]
  )

  const handleFocus = React.useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (!isEditing) return
      if (!rIsMounted.current) return

      if (document.activeElement === e.currentTarget) {
        e.currentTarget.select()
      }
    },
    [isEditing]
  )

  const handlePointerDown = React.useCallback(
    (e) => {
      if (isEditing) {
        e.stopPropagation()
      }
    },
    [isEditing]
  )

  React.useEffect(() => {
    if (isEditing) {
      rTextContent.current = text
      requestAnimationFrame(() => {
        rIsMounted.current = true
        const elm = rInput.current
        if (elm) {
          elm.focus()
          elm.select()
        }
      })
    } else {
      onBlur?.()
    }
  }, [isEditing, onBlur])

  const rInnerWrapper = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const elm = rInnerWrapper.current
    if (!elm) return
    const size = getTextLabelSize(text, font)
    elm.style.transform = `scale(${scale}, ${scale}) translate(${offsetX}px, ${offsetY}px)`
    elm.style.width = size[0] + 5 + 'px'
    
    elm.style.height = size[1] + 1 + 'px'
    elm.style.maxWidth = '200px'
    elm.style.overflow = 'hidden'
  }, [text, font, offsetY, offsetX, scale])

  return (
    <TextWrapper>
      <InnerWrapper
        ref={rInnerWrapper}
        hasText={!!text}
        isEditing={isEditing}
        style={{
          font,
          color,
        }}
      >
        {isEditing ? (
          <TextArea
            ref={rInput}
            style={{
              font,
              color,
            }}
            name="text"
            tabIndex={-1}
            autoComplete="false"
            autoCapitalize="false"
            autoCorrect="false"
            autoSave="false"
            autoFocus
            placeholder=""
            spellCheck="true"
            wrap="off"
            dir="auto"
            datatype="wysiwyg"
            defaultValue={rTextContent.current}
            color={color}
            onFocus={handleFocus}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onPointerDown={handlePointerDown}
            onContextMenu={stopPropagation}
          />
        ) : (
          text.length >= 15 ? `${text.slice(0,15)}...` : text
        )}
      </InnerWrapper>
    </TextWrapper>
  )
})

const TextWrapper = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
  userSelect: 'none',
  variants: {
    isGhost: {
      false: { opacity: 1 },
      true: { transition: 'opacity .2s', opacity: GHOSTED_OPACITY },
    },
  },
})

const commonTextWrapping = {
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
}

const InnerWrapper = styled('div', {
  position: 'absolute',
  padding: '4px',
  zIndex: 1,
  minHeight: 1,
  minWidth: 1,
  lineHeight: 1,
  letterSpacing: LETTER_SPACING,
  outline: 0,
  fontWeight: '500',
  textAlign: 'center',
  backfaceVisibility: 'hidden',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitTouchCallout: 'none',
  variants: {
    hasText: {
      false: {
        pointerEvents: 'none',
      },
      true: {
        pointerEvents: 'all',
      },
    },
    isEditing: {
      false: {
        userSelect: 'none',
      },
      true: {
        background: '$boundsBg',
        userSelect: 'text',
        WebkitUserSelect: 'text',
      },
    },
  },
  ...commonTextWrapping,
  border: "black solid 1px",
  borderRadius: '10px'
})

const TextArea = styled('textarea', {
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 1,
  width: '100%',
  height: '100%',
  border: 'none',
  padding: '4px',
  resize: 'none',
  textAlign: 'inherit',
  minHeight: 'inherit',
  minWidth: 'inherit',
  lineHeight: 'inherit',
  letterSpacing: 'inherit',
  outline: 0,
  fontWeight: 'inherit',
  overflow: 'hidden',
  backfaceVisibility: 'hidden',
  display: 'inline-block',
  pointerEvents: 'all',
  background: '$boundsBg',
  userSelect: 'text',
  WebkitUserSelect: 'text',
  fontSmooth: 'always',
  WebkitFontSmoothing: 'subpixel-antialiased',
  MozOsxFontSmoothing: 'auto',
  ...commonTextWrapping,
  borderRadius: '10px'
})
