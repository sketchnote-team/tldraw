import { Utils, TLPointerEventHandler, TLBoundsCorner, TLKeyboardEventHandler } from '@tldraw/core'
import Vec from '@tldraw/vec'
import { TldrawApp } from '~state/internal'
import { Section } from '~state/shapes'
import { SectionShape, SessionType, TDShapeType } from '~types'
import { BaseTool } from '../BaseTool'
import { TLDR } from '~state/TLDR'
import { Children } from 'react'

enum Status {
  Idle = 'idle',
  Creating = 'creating',
  Pinching = 'pinching',
  PointingCanvas = 'pointingCanvas',
  PointingHandle = 'pointingHandle',
  PointingBounds = 'pointingBounds',
  PointingClone = 'pointingClone',
  TranslatingClone = 'translatingClone',
  PointingBoundsHandle = 'pointingBoundsHandle',
  TranslatingHandle = 'translatingHandle',
  Translating = 'translating',
  Transforming = 'transforming',
  Rotating = 'rotating',
  Brushing = 'brushing',
  GridCloning = 'gridCloning',
  ClonePainting = 'clonePainting',
}

export class SectionTool extends BaseTool<Status> {
  type = TDShapeType.Section as const
  shape: any = null
  selectedShapes: string[] = []

  /* ----------------- Event Handlers ----------------- */

  onPointerDown: TLPointerEventHandler = () => {
    if (this.status !== Status.Idle) return

    const {
      currentPoint,
      currentGrid,
      settings: { showGrid },
      appState: { currentPageId, currentSectionStyle },
    } = this.app

    const childIndex = -9999

    const id = Utils.uniqueId()

    const newShape = Section.create({
      id,
      parentId: currentPageId,
      childIndex,
      point: showGrid ? Vec.snap(currentPoint, currentGrid) : currentPoint,
      style: { ...currentSectionStyle },
    })

    this.shape = newShape
    this.app.patchCreate([this.shape])

    this.app.startSession(
      SessionType.TransformSingle,
      newShape.id,
      TLBoundsCorner.BottomRight,
      true
    )

    this.setStatus(Status.Creating)
  }

  onPointerMove: TLPointerEventHandler = (info, e) => {
    this.app.updateSession()
  }

  onPointerUp: TLPointerEventHandler = (info) => {
    if (this.status === Status.Creating) {
      this.app.completeSession()

      const { isToolLocked } = this.app.appState

      if (!isToolLocked) {
        this.app.selectTool('select')
      }
    }
    if (Vec.dist(this.app.originPoint, this.app.currentPoint) > 2) {
      this.app.select(...[...this.selectedShapes, this.shape.id])
    }

    this.setStatus(Status.Idle)
  }

  onHoverShape: TLPointerEventHandler = (info) => {
    this.app.setHoveredId(info.target)
  }

  onUnhoverShape: TLPointerEventHandler = (info) => {
    const { currentPageId: oldCurrentPageId } = this.app

    // Wait a frame; and if we haven't changed the hovered id,
    // clear the current hovered id
    requestAnimationFrame(() => {
      if (
        oldCurrentPageId === this.app.currentPageId &&
        this.app.pageState.hoveredId === info.target
      ) {
        this.app.setHoveredId(undefined)
      }
    })
  }
}
