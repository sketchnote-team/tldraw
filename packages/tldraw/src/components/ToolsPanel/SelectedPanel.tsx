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
  const getShapePoints = (currentId:string) => app.getShapeUtil(app.getShape(currentId).type).getBounds(app.getShape(currentId))

  const selectedShapes = selectedIds.map((id) => app.getShape(id).name)
  const xPoints = selectedIds.map(id=>(getShapePoints(id).maxX + getShapePoints(id).minX)/2)
  const yPoints = selectedIds.map(id=>app.getShape(id).point[1])
  const xPoint = xPoints.reduce((a, b) => a + b, 0)/xPoints.length
  const yPoint = Math.min(...yPoints)
  
  let content = <></>
  const firstShape = app.getShape(selectedIds[0])
  const pointX = (app.useStore(s=>s.document.pageStates.page.camera.point[0])+(xPoint)) * zoom
  const pointY = (app.useStore(s=>s.document.pageStates.page.camera.point[1])+(yPoint)) * zoom - 40
  const status = (app.useStore(s=>s.appState.status))
  const selectedStickyText = app.useStore(s => s.appState.selectedStickyText)

  if(selectedShapes.every( v => v === selectedShapes[0] )){
    if (firstShape && (status!==TDStatus.Translating  && status!==TDStatus.Creating))
    content =  
      
          <SelectionTools />
       
  }
  
  if(selectedStickyText !== '' &&  firstShape.name==='Sticky') 
    content = (
     
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          right: '60%',
          zIndex: 90,
        }}
      >
        <EditButton cmd="strikethrough" />
        <EditButton cmd="underline" />
        <EditButton cmd="bold" />
        <EditButton cmd="italic" />
        <EditButton cmd="foreColor" name="blue" arg="rgb(0,0,255)"/>
        <EditButton cmd="foreColor" name="red" arg="rgb(255,0,0)"/>
        <EditButton cmd="foreColor" name="yellow" arg="rgb(255,255,0)"/>



      </div>
    
    )
  return  <StyledToolsPanelContainer style={{ 
    transform: `translate(${pointX }px, ${pointY}px)`
  }}>
    <div style={{ 
      transform: `translate(-50%, 0)`
    }}>{content}   </div>
      </StyledToolsPanelContainer>
}

function EditButton(props) {
  return (
    <button
      key={props.cmd}
      onMouseDown={evt => {
        evt.preventDefault() // Avoids loosing focus from the editable area
        document.execCommand('styleWithCSS', false, true);
        document.execCommand(props.cmd, false, props.arg) // Send the command to the browser
      }}
    >
      {props.name || props.cmd}
    </button>
  )
}


const StyledToolsPanelContainer = styled('div', {
  length: '',
  position: 'absolute',
  top: '0px',
  left: '0px',
  transformOrigin: 'center center',
})
