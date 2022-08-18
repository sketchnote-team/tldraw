import * as React from 'react'
import { useTldrawApp } from '~hooks'
import { styled } from '~styles'
import { TDStatus } from '~types';
import { SelectionTools } from './SelectionTools';

interface SelectedPanelProps {
  selectedIds: string[]
}

export function SelectedPanel({selectedIds}:SelectedPanelProps): JSX.Element {
  const app = useTldrawApp()
  const zoom = app.useStore(s=>s.document.pageStates.page.camera.zoom)

  const selectedShapes = selectedIds.map((id) => app.getShape(id).name)
  const xPoints = selectedIds.map(id=>app.getShape(id).point[0])
  const yPoints = selectedIds.map(id=>app.getShape(id).point[1])
  const xPoint = xPoints.reduce((a, b) => a + b, 0)/xPoints.length
  const yPoint = Math.min(...yPoints)
  
  let content = <></>
  const firstShape = app.getShape(selectedIds[0])
  const pointX = (app.useStore(s=>s.document.pageStates.page.camera.point[0])+(xPoint)) * zoom
  const pointY = (app.useStore(s=>s.document.pageStates.page.camera.point[1])+(yPoint)) * zoom - 40
  const status = (app.useStore(s=>s.appState.status))

  if(selectedShapes.every( v => v === selectedShapes[0] )){
    if (firstShape && (status!==TDStatus.Translating  && status!==TDStatus.Creating))
    content =  
      <StyledToolsPanelContainer style={{ 
        transform: `translate(${pointX}px, ${pointY}px)`
      }}>
        <SelectionTools />
      </StyledToolsPanelContainer>
  }
  return content 
}

const StyledToolsPanelContainer = styled('div', {
  length: '',
  position: 'absolute',
  top: '0px',
  left: '0px',
  transformOrigin: 'center center',
})
