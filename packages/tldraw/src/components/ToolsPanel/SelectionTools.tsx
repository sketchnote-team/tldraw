import * as React from 'react'

import { useTldrawApp } from '~hooks'
import {styled} from '~styles';
import { AlignStyle, ListType, TextWeight } from '~types';


export const SelectionTools = React.memo(function SelectionTools(): JSX.Element {
  const app = useTldrawApp()
  app.useStore(s=>s.appState.currentStyle)
  const selectedId = app.useStore(s=>s.document.pageStates.page.selectedIds)
  const scale = app.getShape(selectedId[0]).style.scale || 1
  return ( 
    <></>
    // <StyledToolBarContainer>
    //   <button onClick={()=>{
    //     console.log(scale)
    //     app.style({scale: (scale + 0.1 * scale)})
    //   }}>A+</button>
    //   <button onClick={()=>{
    //     console.log(scale)
    //     app.style({scale: (scale - 0.1 * scale)})
    //   }}>A-</button>
    //   <button onClick={()=>{
    //     app.style({textAlign:AlignStyle.Start})
    //   }}>L</button>
    //   <button onClick={()=>{
    //     app.style({textAlign:AlignStyle.Middle})
    //   }}>M</button>
    //   <button onClick={()=>{
    //     app.style({textAlign:AlignStyle.End})
    //   }}>R</button>
    //   <button onClick={()=>{
    //     app.style({textWeight:TextWeight.Bold})
    //   }}>B</button>
    //   <button onClick={()=>{
    //     app.style({textWeight:TextWeight.Normal})
    //   }}>N</button>
    //   <button onClick={()=>{
    //     app.style({listType: ListType.Bullet})
    //   }}>BLi</button>
    //    <button onClick={()=>{
    //     app.style({listType: ListType.Numbered})
    //   }}>Li</button>
    //     <button onClick={()=>{
    //     app.style({listType: ListType.None})
    //   }}>NLi</button>
    //    <button onClick={()=>{
    //     app.style({textDecoration:'line-through'})
    //   }}>Strike</button> 
    //   <button onClick={()=>{
    //     app.style({textDecoration:'none'})
    //   }}>NS</button> 
    //    <button onClick={()=>{
    //     app.style({textDecoration:'underline'})
    //   }}>U</button> 
    //   <button onClick={()=>{
    //     app.style({fontStyle:'italic'})
    //   }}>I</button> 
    //   <button onClick={()=>{
    //     app.style({fontStyle:'normal'})
    //   }}>N</button> 
    // </StyledToolBarContainer>
  )
})

const StyledToolBarContainer = styled('div',{
  background:"#131C39",
  height:'21px',
  display:'flex',
})
