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
import { useTldrawApp } from '~hooks'
import ContentEditable from 'react-contenteditable'
import sanitizeHtml from 'sanitize-html'

type T = StickyShape
type E = HTMLDivElement

export class StickyUtil extends TDShapeUtil<T, E> {
  type = TDShapeType.Sticky as const

  canBind = true

  canEdit = true

  canClone = true

  hideResizeHandles = true

  showCloneHandles = true

  hideCloneHandles = false

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
        user:'',
      },
      props
    )
  }

  Component = TDShapeUtil.Component<T, E, TDMeta>(
    ({ shape, meta, events, isGhost, isBinding, isEditing, onShapeBlur, onShapeChange }, ref) => {
      const app = useTldrawApp()
      const font = getStickyFontStyle(shape.style)
      const [initialString, setInitial] = React.useState<any>(true)

      const { color, fill } = getStickyShapeStyle(shape.style, meta.isDarkMode)

      const rContainer = React.useRef<HTMLDivElement>(null)

      const rTextArea = React.useRef<HTMLTextAreaElement>(null)

      const rText = React.useRef<HTMLDivElement>(null)

      const rTextContent = React.useRef(shape.text)

      const rIsMounted = React.useRef(false)

      const prevCharCount = React.useRef(0)


      function getSelectedText() {
        let text = ''
        if (typeof window.getSelection != 'undefined') {
          text = window.getSelection().toString()
        } else if (typeof document.selection != 'undefined' && document.selection.type == 'Text') {
          text = document.selection.createRange().text
        }
        return text
      }

      function doSomethingWithSelectedText() {
        const selectedText = getSelectedText()
        app.setSelectedText(selectedText)
      }

      const handleKeyUp = React.useCallback(() => {
        doSomethingWithSelectedText()
      }, [])

      React.useEffect(()=>{
        setInitial(shape.text)
      }, [])

      const sanitizeConf = {
        allowedTags: ['b', 'i', 'em', 'strong', 'span', 'div'],
        allowedStyles:{ allowedStyles: {
          '*': {
            'color': [/./],
            'font-style': [/./],
            'text-decoration-line': [/./]
          }}
      }}

      const handlePointerDown = React.useCallback((e: React.PointerEvent) => {
        e.stopPropagation()
      }, [])

      const sanitize = () => {
        onShapeChange?.({
          id: shape.id,
          text: sanitizeHtml(rTextContent.current, sanitizeConf),
        })
      }

      const handleTextChange = React.useCallback(
         e => {
          rTextContent.current = e.currentTarget.innerHTML
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
          })
        },
        [onShapeChange]
      )

      const handlePaste = React.useCallback(
        async e => {
          e.preventDefault()
          
          let selObj = window.getSelection();
          let selRange = selObj.getRangeAt(0);
          selRange.deleteContents();                
          const clipboard = await navigator.clipboard.readText()
          selRange.insertNode(document.createTextNode(clipboard));

          console.log( rTextContent.current);
          
          rTextContent.current =  e.target.innerHTML
          onShapeChange?.({
            id: shape.id,
            type: shape.type,
            text: rTextContent.current,
          })
        }, []
      )
      

      // Focus when editing changes to true
      React.useEffect(() => {
        if (isEditing ) {
          rTextContent.current = shape.text
          rIsMounted.current = true
          rText?.current?.focus()
        }
      }, [isEditing])

      // Resize to fit text
      React.useEffect(() => {
        const text = rText.current!

        const { size, style } = shape
        const scale = style.scale || 1
        const { offsetHeight: currTextHeight, offsetWidth: currTextWidth } = text
        
        const minTextHeight = MIN_CONTAINER_HEIGHT - PADDING * 2
        const minTextWidth = MIN_CONTAINER_WIDTH - PADDING * 2
        
        const prevTextHeight = size[1] - PADDING * 2

        // Same size? We can quit here
        if (currTextHeight === prevTextHeight) return

        if (currTextHeight > minTextHeight || (currTextWidth >= minTextWidth && this.getLongestLineLength(rTextContent) <= MAXIMUM_TEXT_IN_LINE)) {
          // Snap the size to the text content if the text only when the
          // text is larger than the minimum text height.
          if (text.textContent?.length)
            prevCharCount.current = text.textContent?.length
            onShapeChange?.({
              id: shape.id,
              style: {
                ...shape.style,
                scale: scale - 0.03,
              },
            })
          return
        } else if(text.textContent && text.textContent?.length < prevCharCount.current && scale < 0.97){
          onShapeChange?.({
            id: shape.id,
            style: {
              ...shape.style,
              scale: scale + 0.03,
            },
          })
          return
        }

        const textarea = rTextArea.current
        // textarea?.focus()
      }, [shape.text, shape.size[1], shape.style])

      const style = {
        font,
        color,
        textShadow: meta.isDarkMode
          ? `0.5px 0.5px 2px rgba(255, 255, 255,.25)`
          : `0.5px 0.5px 2px rgba(255, 255, 255,.5)`,
      }

      let whiteSpace = 'nowrap'

      if(this.getLongestLineLength(rTextContent) > MAXIMUM_TEXT_IN_LINE )
        whiteSpace = 'pre-line'

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
            <div
              contentEditable={true}
              ref={rText}
              onKeyUp={handleKeyUp}
              style={{
                outline: '0px solid transparent',
                margin: 0,
                padding: 0,
                whiteSpace: 'pre-line',
                overflow: 'hidden',
                width: 'fit-content',
                maxWidth: MIN_CONTAINER_WIDTH - PADDING * 2,
                minWidth: '5px',
                pointerEvents: isEditing?'all':'none',
                lineHeight: 'normal'
              }}
              onInput={handleTextChange}
              onPaste={handlePaste}
              onFocus={()=>document.execCommand('selectAll',false, undefined)}
              spellCheck={true}
              onPointerDown={handlePointerDown} 
              dangerouslySetInnerHTML={{__html:initialString}}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '5%',
                fontWeight: '400',
                fontSize: '12px',
                lineHeight: '10px',
                color: '#878A92',
                pointerEvents:'none'
              }}
            >{shape.user}</div>
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

  getLongestLineLength = (rTextContent) =>{
    return rTextContent.current.replace(/<\/div>/g,'').split('<div>').reduce((a, b) =>  a.length > b.length ? a : b).length
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
const MIN_CONTAINER_WIDTH = 200
const MAXIMUM_TEXT_IN_LINE = 10



const StyledStickyContainer = styled('div', {
  pointerEvents: 'all',
  position: 'relative',
  backgroundColor: 'rgba(255, 220, 100)',
  fontFamily: 'Graphik Web',
  height: '100%',
  width: '100%',
  padding: PADDING + 'px',
  borderRadius: '3px',
  perspective: '800px',
})