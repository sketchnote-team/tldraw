import * as React from 'react'

import { useTldrawApp } from '~hooks'
import {styled} from '~styles';


export const SelectionTools = React.memo(function SelectionTools(): JSX.Element {
  const app = useTldrawApp()
  const [isFilled,setFilled] = React.useState(false)

  return ( 
    <StyledToolBarContainer>
    </StyledToolBarContainer>
  )
})

const StyledToolBarContainer = styled('div',{
  background:"#131C39",
  height:'21px',
  display:'flex',
})
