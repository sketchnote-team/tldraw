import {
    TLPointerEventHandler,
  } from '@tldraw/core'
  import { BaseTool } from '../BaseTool'
  
  
  export class MoveTool extends BaseTool {
    type = 'select' as const
  
    onPointerDown: TLPointerEventHandler = () => {
      this.app.setForcepanningTrue()
    }
  }