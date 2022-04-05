import * as React from 'react'
import { styled } from '~styles'
import type { TDSnapshot } from '~types'
import { useTldrawApp } from '~hooks'
import { StatusBar } from './StatusBar'
import { BackToContent } from './BackToContent'
import { PrimaryTools } from './PrimaryTools'
import { ActionButton } from './ActionButton'
import { DeleteButton } from './DeleteButton'

const isDebugModeSelector = (s: TDSnapshot) => s.settings.isDebugMode

interface ToolsPanelProps {
  onBlur?: React.FocusEventHandler
}

export const ToolsPanel = React.memo(function ToolsPanel({ onBlur }: ToolsPanelProps): JSX.Element {
  const app = useTldrawApp()
  const isDebugMode = app.useStore(isDebugModeSelector)

  return (
    <StyledToolsPanelContainer onBlur={onBlur}>
      <StyledCenterWrap id="TD-Tools">
        <BackToContent />
        <StyledPrimaryTools>
          <ActionButton />
          <PrimaryTools />
          <DeleteButton />
        </StyledPrimaryTools>
      </StyledCenterWrap>
      {isDebugMode && (
        <StyledStatusWrap>
          <StatusBar />
        </StyledStatusWrap>
      )}
    </StyledToolsPanelContainer>
  )
})

export const StyledToolsPanelContainer = styled('div', {
  margin: 'auto',
  width: '100%',
  minWidth: 0,
  maxWidth: '100%',
  display: 'grid',
  gridTemplateColumns: 'auto auto auto',
  gridTemplateRows: 'auto auto',
  justifyContent: 'space-between',
  padding: '0',
  gap: '$4',
  zIndex: 200,
  pointerEvents: 'none',
  '& > div > *': {
    pointerEvents: 'all',
  },
})

export const StyledCenterWrap = styled('div', {
  position: 'absolute',
  width: 'fit-content',
  bottom: 0,
  left: '50%',
  gap: '$4',
})

export const StyledStatusWrap = styled('div', {
  gridRow: 2,
  gridColumn: '1 / span 3',
})

export const StyledPrimaryTools = styled('div', {
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  paddingLeft: '18px',
})
