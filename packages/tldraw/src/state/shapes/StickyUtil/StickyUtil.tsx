/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from 'react'
import { Utils, HTMLContainer, TLBounds } from '@tldraw/core'
import { defaultTextStyle } from '../shared/shape-styles'
import { AlignStyle, StickyShape, TDMeta, TDShapeType, TransformInfo } from '~types'
import { getBoundsRectangle, TextAreaUtils } from '../shared'
import { TDShapeUtil } from '../TDShapeUtil'
import { getStickyFontStyle, getStickyShapeStyle } from '../shared/shape-styles'
import { styled } from '~styles'
import { Vec } from '@tldraw/vec'
import { GHOSTED_OPACITY } from '~constants'
import { TLDR } from '~state/TLDR'
import { getTextSvgElement } from '../shared/getTextSvgElement'
import { stopPropagation } from '~components/stopPropagation'

type T = StickyShape
type E = HTMLDivElement

export class StickyUtil extends TDShapeUtil<T, E> {
  type = TDShapeType.Sticky as const

  canBind = true

  canEdit = true

  canClone = true

  hideResizeHandles = true

  showCloneHandles = true

  getShape = (props: Partial<T>): T => {
    return Utils.deepMerge<T>(
      {
        id: 'id',
        type: TDShapeType.Sticky,
        name: 'Sticky',
        parentId: 'page',
        childIndex: 1,
        point: [0, 0],
        size: [200, 200],
        text: '',
        rotation: 0,
        style: defaultTextStyle,
      },
      props
    )
  }

  Component = TDShapeUtil.Component<T, E, TDMeta>(
    ({ shape, meta, events, isGhost, isBinding, isEditing, onShapeBlur, onShapeChange }, ref) => {
      let font = getStickyFontStyle(shape.style)

      const { color, fill } = getStickyShapeStyle(shape.style, meta.isDarkMode)

      const rContainer = React.useRef<HTMLDivElement>(null)

      const rTextArea = React.useRef<HTMLTextAreaElement>(null)

      const rText = React.useRef<HTMLDivElement>(null)

      const rTextContent = React.useRef(shape.text)

      const currentScale = React.useRef(shape.style.scale)

      const rIsMounted = React.useRef(false)

      const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
        e.stopPropagation()
      }, [])
      const handleTextChange = React.useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          rTextContent.current = TLDR.normalizeText(e.currentTarget.value)

          // if(rTextArea.current && this.checkOverflow(rTextArea.current) && currentScale.current ){

          //   currentScale.current *= .9
          // }
          if (!rTextContent.current) {
            onShapeChange?.({
              id: shape.id,
              type: shape.type,
              text: rTextContent.current,
              style: {
                ...shape.style,
                scale: 1,
              },
            })
            return
          }

          onShapeChange?.({
            id: shape.id,
            type: shape.type,
            text: rTextContent.current,
            // style: {
            //   ...shape.style,
            //   scale: currentScale.current
            // }
          })
        },
        [onShapeChange]
      )

      const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.key === 'Escape') return

          if (e.key === 'Tab' && shape.text.length === 0) {
            e.preventDefault()
            return
          }

          // If this keydown was just the meta key or a shortcut
          // that includes holding the meta key like (Command+V)
          // then leave the event untouched. We also have to explicitly
          // Implement undo/redo for some reason in order to get this working
          // in the vscode extension. Without the below code the following doesn't work
          //
          // - You can't cut/copy/paste when when text-editing/focused
          // - You can't undo/redo when when text-editing/focused
          // - You can't use Command+A to select all the text, when when text-editing/focused
          if (!(e.key === 'Meta' || e.metaKey)) {
            e.stopPropagation()
          } else if (e.key === 'z' && e.metaKey) {
            if (e.shiftKey) {
              document.execCommand('redo', false)
            } else {
              document.execCommand('undo', false)
            }
            e.stopPropagation()
            e.preventDefault()
            return
          }

          if (e.key === 'Tab') {
            e.preventDefault()
            if (e.shiftKey) {
              TextAreaUtils.unindent(e.currentTarget)
            } else {
              TextAreaUtils.indent(e.currentTarget)
            }

            rTextContent.current = TLDR.normalizeText(e.currentTarget.value)
            onShapeChange?.({ ...shape, text: rTextContent.current })
          }
        },
        [shape, onShapeChange]
      )

      const handleBlur = React.useCallback((e: React.FocusEvent<HTMLTextAreaElement>) => {
        e.currentTarget.setSelectionRange(0, 0)
        onShapeBlur?.()
      }, [])

      const handleFocus = React.useCallback(
        (e: React.FocusEvent<HTMLTextAreaElement>) => {
          if (!isEditing) return
          if (!rIsMounted.current) return
          e.currentTarget.select()
        },
        [isEditing]
      )
      // Focus when editing changes to true
      React.useEffect(() => {
        if (isEditing) {
          rTextContent.current = shape.text
          rIsMounted.current = true
          const elm = rTextArea.current!
          elm.focus()
          elm.select()
        }
      }, [isEditing])

      // Resize to fit text
      React.useEffect(() => {
        const text = rText.current!

        const { size, style } = shape
        const scale = style.scale || 1
        const { offsetHeight: currTextHeight } = text
        const minTextHeight = MIN_CONTAINER_HEIGHT - PADDING * 2
        const prevTextHeight = size[1] - PADDING * 2
        // Same size? We can quit here
        if (currTextHeight === prevTextHeight) return

        if (currTextHeight > minTextHeight) {
          // Snap the size to the text content if the text only when the
          // text is larger than the minimum text height.
          onShapeChange?.({
            id: shape.id,
            style: {
              ...shape.style,
              scale: scale - 0.03,
            },
          })
          return
        }

        const textarea = rTextArea.current
        textarea?.focus()
      }, [shape.text, shape.size[1], shape.style])

      const style = {
        font,
        color,
        textShadow: meta.isDarkMode
          ? `0.5px 0.5px 2px rgba(255, 255, 255,.25)`
          : `0.5px 0.5px 2px rgba(255, 255, 255,.5)`,
      }

      return (
        <HTMLContainer ref={ref} {...events}>
          <StyledStickyContainer ref={rContainer} style={{ backgroundColor: fill, ...style }}>
            <div
              style={{
                position: 'absolute',
                bottom: '-28px',
                left: '5%',
                width: '90%',
                height: '10px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '50%',
                filter: 'blur(10px)',
              }}
            ></div>
            {isBinding && (
              <div
                className="tl-binding-indicator"
                style={{
                  position: 'absolute',
                  top: -this.bindingDistance,
                  left: -this.bindingDistance,
                  width: `calc(100% + ${this.bindingDistance * 2}px)`,
                  height: `calc(100% + ${this.bindingDistance * 2}px)`,
                  backgroundColor: 'let(--tl-selectFill)',
                }}
              />
            )}
            <StyledText ref={rText} isEditing={isEditing} alignment={shape.style.textAlign}>
              {isEditing ? rTextContent.current : shape.text}&#8203;
            </StyledText>
            {isEditing && (
              <StyledTextArea
                style={{ lineHeight: '1' }}
                ref={rTextArea}
                onPointerDown={handlePointerDown}
                value={isEditing ? rTextContent.current : shape.text}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                tabIndex={-1}
                autoComplete="false"
                autoCapitalize="false"
                autoCorrect="false"
                autoSave="false"
                autoFocus
                spellCheck={true}
                alignment={shape.style.textAlign}
                onContextMenu={stopPropagation}
              />
            )}
          </StyledStickyContainer>
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
    return next.size !== prev.size || next.style !== prev.style || next.text !== prev.text
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

  getSvgElement = (shape: T): SVGElement | void => {
    const bounds = this.getBounds(shape)
    const textBounds = Utils.expandBounds(bounds, -PADDING)
    const textElm = getTextSvgElement(shape.text, shape.style, textBounds)
    const style = getStickyShapeStyle(shape.style)
    textElm.setAttribute('fill', style.color)
    textElm.setAttribute('transform', `translate(${PADDING}, ${PADDING})`)

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('width', bounds.width + '')
    rect.setAttribute('height', bounds.height + '')
    rect.setAttribute('fill', style.fill)
    rect.setAttribute('rx', '3')
    rect.setAttribute('ry', '3')

    g.appendChild(rect)
    g.appendChild(textElm)

    return g
  }
}

/* -------------------------------------------------- */
/*                       Helpers                      */
/* -------------------------------------------------- */

const PADDING = 16
const MIN_CONTAINER_HEIGHT = 200

const StyledStickyContainer = styled('div', {
  pointerEvents: 'all',
  position: 'relative',
  backgroundColor: 'rgba(255, 220, 100)',
  fontFamily: 'sans-serif',
  height: '100%',
  width: '100%',
  padding: PADDING + 'px',
  borderRadius: '3px',
  perspective: '800px',
})

const commonTextWrapping = {
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
}

const StyledText = styled('div', {
  position: 'absolute',
  top: PADDING,
  left: PADDING,
  width: `calc(100% - ${PADDING * 2}px)`,
  height: 'fit-content',
  font: 'inherit',
  pointerEvents: 'none',
  userSelect: 'none',
  letiants: {
    isEditing: {
      true: {
        opacity: 1,
      },
      false: {
        opacity: 1,
      },
    },
    alignment: {
      [AlignStyle.Start]: {
        textAlign: 'left',
      },
      [AlignStyle.Middle]: {
        textAlign: 'center',
      },
      [AlignStyle.End]: {
        textAlign: 'right',
      },
      [AlignStyle.Justify]: {
        textAlign: 'justify',
      },
    },
  },
  ...commonTextWrapping,
})

const StyledTextArea = styled('textarea', {
  width: '100%',
  height: '100%',
  border: 'none',
  overflow: 'hidden',
  background: 'none',
  outline: 'none',
  textAlign: 'left',
  font: 'inherit',
  padding: 0,
  color: 'transparent',
  verticalAlign: 'top',
  resize: 'none',
  caretColor: 'black',
  ...commonTextWrapping,
  letiants: {
    alignment: {
      [AlignStyle.Start]: {
        textAlign: 'left',
      },
      [AlignStyle.Middle]: {
        textAlign: 'center',
      },
      [AlignStyle.End]: {
        textAlign: 'right',
      },
      [AlignStyle.Justify]: {
        textAlign: 'justify',
      },
    },
  },
})
