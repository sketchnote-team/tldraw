import Vec from '@tldraw/vec'
import type { TLPointerEventHandler } from '@tldraw/core'
import { Utils } from '@tldraw/core'
import { Comment } from '~state/shapes'
import { SessionType, TDShapeType } from '~types'
import { BaseTool, Status } from '../BaseTool'

export class CommentTool extends BaseTool {
  type = TDShapeType.Comment as const

  shapeId?: string
  
  stopEditingShape = () => {
    this.setStatus(Status.Idle)

    if (!this.app.appState.isToolLocked) {
      this.app.selectTool('select')
    }
  }

  /* ----------------- Event Handlers ----------------- */


  onPointerDown: TLPointerEventHandler = () => {
    if (this.status === Status.Creating) {
      this.stopEditingShape()
      return
    }

    if (this.status === Status.Idle) {
      const {
        currentPoint,
        currentGrid,
        settings: { showGrid },
      } = this.app

      this.app.createCommentShapeAtPoint(showGrid ? Vec.snap(currentPoint, currentGrid) : currentPoint)
      this.setStatus(Status.Creating)
      return
    }
  }

  onPointerUp: TLPointerEventHandler = () => {
    if (this.status === Status.Creating) {
      this.setStatus(Status.Idle)
      this.app.completeSession()
      this.app.selectTool('select')
    }
  }
}
