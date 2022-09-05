import * as React from 'react'
import { useCursorAnimation } from '~hooks'
import type { TLShape, TLUser } from '~types'

interface UserProps {
  user: any
  zoom: number
}

export function WhiteboardUser({ user, zoom }: UserProps) {
  const rCursor = React.useRef<SVGSVGElement>(null)
  useCursorAnimation(rCursor, user.point)
  return (
    <div style={{
      transform:`translateX(${user.point[0]}px) translateY(${user.point[1]}px) scale(${1/zoom})`,
      position:"absolute",
      
    }}>
  <div style={{
    height:"30px",
    width:"30px"
  }}>
      <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 35 35"
      fill="none"
      fillRule="evenodd"
    >
      <g fill="rgba(0,0,0,.2)" transform="translate(1,1)">
        <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
        <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
      </g>
      <g fill="white">
        <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
        <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
      </g>
      <g fill={user.color}>
        <path d="m19.751 24.4155-1.844.774-3.1-7.374 1.841-.775z" />
        <path d="m13 10.814v11.188l2.969-2.866.428-.139h4.768z" />
      </g>
    </svg>
  </div>
    <div 
    // ref={rCursor}
    style={{
      width:"max-content",
      fontSize: "10px",
      marginLeft: "20px",
      color:'white',
      backgroundColor: user.color,
      padding:'3px 5px',
      boxShadow:`box-shadow: 0px 4px 4px rgba(135, 138, 146, 0.15)`,
      borderRadius:"1px"
    }}
    >{user.user.name}</div>
    </div>
  )
}
