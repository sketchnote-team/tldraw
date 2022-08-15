import { Utils, TLPointerEventHandler, TLBoundsCorner } from '@tldraw/core'
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
  shape:any = null
  selectedShapes:string[] = []

  /* ----------------- Event Handlers ----------------- */

  onPointerDown: TLPointerEventHandler = () => {
    if (this.status !== Status.Idle) return
    
    const {
      currentPoint,
      currentGrid,
      settings: { showGrid },
      appState: { currentPageId, currentShapeStyle },
    } = this.app

    const childIndex = this.getNextChildIndex()

    const id = Utils.uniqueId()

    const newShape = Section.create({
      id,
      parentId: currentPageId,
      childIndex,
      point: showGrid ? Vec.snap(currentPoint, currentGrid) : currentPoint,
      style: { ...currentShapeStyle },
    })

    this.shape = newShape;
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
    let  { origin, point } = info
    const { currentPageId } = this.app

    origin = [origin[0] - this.app.pageState.camera.point[0], origin[1] - this.app.pageState.camera.point[1] ]
    point = [point[0] - this.app.pageState.camera.point[0], point[1] - this.app.pageState.camera.point[1] ]
 
    const shapesToTest = this.app.shapes
      .filter(
        (shape) =>
          !(
            shape.isLocked ||
            shape.isHidden ||
            shape.parentId !== currentPageId 
          )
      )
      .map((shape) => ({
        id: shape.id,
        bounds: this.app.getShapeUtil(shape).getBounds(shape),
        selectId: shape.id, //TLDR.getTopParentId(data, shape.id, currentPageId),
      }))


    if(this.status === Status.Creating){
      const a = shapesToTest.filter(shapes =>
        shapes.bounds.minX > Math.min(origin[0], point[0]) &&
        shapes.bounds.maxX < Math.max(origin[0], point[0]) &&
        shapes.bounds.minY > Math.min(origin[1], point[1]) &&
        shapes.bounds.maxY < Math.max(origin[1], point[1]) 
      )
      
      this.selectedShapes = a.map(a=>a.id);
      this.app.select(...this.selectedShapes)

    }

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
    this.app.setSectionAndChildren(this.shape.id, this.selectedShapes)
    this.app.select(...this.selectedShapes)
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





