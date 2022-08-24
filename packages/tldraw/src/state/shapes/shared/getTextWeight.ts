import { TextWeight } from '~types'

const WEIGHT_VALUES = {
  [TextWeight.Normal]: 'normal',
  [TextWeight.Bold]: 'bold',
} as const

export function getTextWeight(weightStyle: TextWeight = TextWeight.Normal) {
  return WEIGHT_VALUES[weightStyle]
}
