/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import {
  usePreventNavigation,
  useZoomEvents,
  useSafariFocusOutFix,
  useCanvasEvents,
  useCameraCss,
  useKeyEvents,
  useShapeTree,
} from '+hooks'
import type { TLBinding, TLPage, TLPageState, TLShape } from '+types'
import { ErrorFallback } from '+components/error-fallback'
import { ErrorBoundary } from '+components/error-boundary'
import { Brush } from '+components/brush'
import { Page } from '+components/page'
import { useResizeObserver } from '+hooks/useResizeObserver'
import { Minimap } from '+components/minimap'

function resetError() {
  void null
}

interface CanvasProps<T extends TLShape, M extends Record<string, unknown>> {
  page: TLPage<T, TLBinding>
  pageState: TLPageState
  hideBounds?: boolean
  hideHandles?: boolean
  hideIndicators?: boolean
  meta?: M
  id?: string
}

export function Canvas<T extends TLShape, M extends Record<string, unknown>>({
  id,
  page,
  pageState,
  meta,
  hideHandles = false,
  hideBounds = false,
  hideIndicators = false,
}: CanvasProps<T, M>): JSX.Element {
  const rCanvas = React.useRef<HTMLDivElement>(null)
  const rContainer = React.useRef<HTMLDivElement>(null)
  const rLayer = React.useRef<HTMLDivElement>(null)

  useResizeObserver(rCanvas)

  useZoomEvents(rCanvas)

  useSafariFocusOutFix()

  usePreventNavigation(rCanvas)

  const events = useCanvasEvents()

  useCameraCss(rLayer, rContainer, pageState)

  const preventScrolling = React.useCallback((e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    e.currentTarget.scrollTo(0, 0)
  }, [])

  useKeyEvents()

  const { shapeTree, viewport, commonBounds, minimap } = useShapeTree(page, pageState, meta)

  return (
    <div id={id} className="tl-container" ref={rContainer}>
      <div
        id="canvas"
        className="tl-absolute tl-canvas"
        ref={rCanvas}
        onScroll={preventScrolling}
        {...events}
      >
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={resetError}>
          <div ref={rLayer} className="tl-absolute tl-layer">
            <Page
              page={page}
              pageState={pageState}
              hideBounds={hideBounds}
              hideIndicators={hideIndicators}
              hideHandles={hideHandles}
              shapeTree={shapeTree}
              meta={meta}
            />
            {pageState.brush && <Brush brush={pageState.brush} />}
          </div>
          <Minimap commonBounds={commonBounds} {...minimap} />
        </ErrorBoundary>
      </div>
    </div>
  )
}
