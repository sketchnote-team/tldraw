import * as React from 'react'
import { useTldrawApp } from '~hooks'
import { styled } from '~styles'
import { TDStatus } from '~types';
import { SelectionTools } from './SelectionTools';

interface CursorSVGProps {
  sticker: string
}


export function CursorSVG({sticker}:CursorSVGProps): JSX.Element {
   
    const app = useTldrawApp()
    const points =  app.useStore(s=>s.appState.currentStickerPoint)
    const zoom = app.useStore(s=>s.document.pageStates.page.camera.zoom)
    const pointX = (app.useStore(s=>s.document.pageStates.page.camera.point[0])+(points[0])) * zoom -20
    const pointY = (app.useStore(s=>s.document.pageStates.page.camera.point[1])+(points[1])) * zoom -10


  return <StyledCursorSVGWrapper style={{ 
    transform: `translate(${pointX}px, ${pointY}px)`
  }}>
    <img src={sticker}/>
  </StyledCursorSVGWrapper>
}

const StyledCursorSVGWrapper = styled('div', {
 pointerEvents:'none',
  length: '',
  position: 'absolute',
  top: '0px',
  left: '0px',
  transformOrigin: 'center center',
  opacity:'0.5',
  background: '#fff',
  borderRadius:'50%',
  
})
