import { Utils, TLPointerEventHandler } from '@tldraw/core'
import { Highlighter } from '~state/shapes'
import { SessionType, TDShapeType } from '~types'
import { BaseTool } from '../BaseTool'

enum Status {
  Idle = 'idle',
  Creating = 'creating',
  Extending = 'extending',
  Pinching = 'pinching',
}

export class HighlighterTool extends BaseTool {
  type = TDShapeType.Highlighter as const

  private lastShapeId?: string 

  onEnter = () => {
    this.lastShapeId = undefined
  }

  onCancel = () => {
    switch (this.status) {
      case Status.Idle: {
        this.app.selectTool('select')
        break
      }
      default: {
        this.setStatus(Status.Idle)
        break
      }
    }

    this.app.cancelSession()
  }

  /* ----------------- Event Handlers ----------------- */

  onPointerDown: TLPointerEventHandler = (info) => {
    if (this.status !== Status.Idle) return
    const {
      currentPoint,
      appState: { currentPageId, currentHighlighterStyle },
    } = this.app
    const previous = this.lastShapeId && this.app.getShape(this.lastShapeId)
    if (info.shiftKey && previous) {
      // Extend the previous shape
      this.app.startSession(SessionType.Draw, previous.id)
      this.setStatus(Status.Extending)
    } else {
      // Create a new shape
      const childIndex = this.getNextChildIndex() - 99;
      const id = Utils.uniqueId()
      const newShape = Highlighter.create({
        id,
        parentId: currentPageId,
        childIndex,
        point: currentPoint,
        style: { ...currentHighlighterStyle },
      })
      this.lastShapeId = id
      this.app.patchCreate([newShape])
      this.app.startSession(SessionType.Draw, id)
      this.setStatus(Status.Creating)
    }
  }

  onPointerMove: TLPointerEventHandler = () => {
    switch (this.status) {
      case Status.Extending:
      case Status.Creating: {
        this.app.updateSession()
      }
    }
  }

  onPointerUp: TLPointerEventHandler = () => {
    this.app.completeSession()
    this.setStatus(Status.Idle)
  }
}
