import * as React from 'react'
import type { TLBounds } from '~types'
import { CloneButton } from './CloneButton'

export interface CloneButtonsProps {
  bounds: TLBounds
  targetSize: number
  size: number
  status: any
}

export function CloneButtons({ targetSize, size, bounds, status }: CloneButtonsProps) {
  if(status!=='idle') return <></>
  return (
    <>
      <CloneButton targetSize={targetSize} size={size} bounds={bounds} side="top" />
      <CloneButton targetSize={targetSize} size={size} bounds={bounds} side="right" /> 
      <CloneButton targetSize={targetSize} size={size} bounds={bounds} side="bottom" />
      <CloneButton targetSize={targetSize} size={size} bounds={bounds} side="left" />
      {/* <CloneButton targetSize={targetSize} size={size} bounds={bounds} side="topLeft" />
      <CloneButton targetSize={targetSize} size={size} bounds={bounds} side="topRight" />
      <CloneButton targetSize={targetSize} size={size} bounds={bounds} side="bottomLeft" />
      <CloneButton targetSize={targetSize} size={size} bounds={bounds} side="bottomRight" /> */}
    </>
  )
}
