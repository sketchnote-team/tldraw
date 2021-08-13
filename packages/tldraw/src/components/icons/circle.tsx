import * as React from 'react'

export default function CircleIcon(
  props: Pick<React.SVGProps<SVGSVGElement>, 'stroke' | 'fill'> & {
    size: number
  }
) {
  const { size = 16, ...rest } = props
  return (
    <svg width={24} height={24} {...rest}>
      <circle cx={12} cy={12} r={size / 2} />
    </svg>
  )
}
