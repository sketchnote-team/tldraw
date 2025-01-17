import { Utils } from '@tldraw/core'
import {
  Theme,
  ColorStyle,
  DashStyle,
  ShapeStyles,
  SizeStyle,
  FontStyle,
  AlignStyle,
  TextWeight,
  TextShapeStyles,
  ListType,
} from '~types'

const canvasLight = '#fafafa'

const canvasDark = '#343d45'

const colors = {
  // [ColorStyle.White]: '#f0f1f3',
  // [ColorStyle.LightGray]: '#c6cbd1',
  // [ColorStyle.Gray]: '#788492',
  // [ColorStyle.Black]: '#1d1d1d',
  [ColorStyle.Green]: '#3DD456',
  // [ColorStyle.Cyan]: '#0e98ad',
  [ColorStyle.Blue]: '#254DDA',
  [ColorStyle.Pink]: '#FF4A7B',
  [ColorStyle.Violet]: '#E4C0FF',
  [ColorStyle.Red]: '#F87463',
  [ColorStyle.Orange]: '#FF9700',
  [ColorStyle.Yellow]: '#FFDA47',
}

const stickyColors = {
  [ColorStyle.Green]: 'rgb(147, 210, 117)',
  [ColorStyle.Blue]: 'rgb(108, 216, 250)',
  [ColorStyle.Pink]: 'rgb(255, 206, 224)',
  [ColorStyle.Violet]: 'rgb(123, 146, 255)',
  [ColorStyle.Red]: 'rgb(241, 108, 127)',
  [ColorStyle.Orange]: 'rgb(255, 157, 72)',
  [ColorStyle.Yellow]: 'rgb(255, 249, 177)',
}

export const stickyFills: Record<Theme, Record<ColorStyle, string>> = {
  light: {
    ...(Object.fromEntries(
      Object.entries(colors).map(([k, v]) => [k, Utils.lerpColor(v, canvasLight, 0.45)])
    ) as Record<ColorStyle, string>),
    [ColorStyle.White]: '#ffffff',
    [ColorStyle.Black]: '#3d3d3d',
  },
  dark: {
    ...(Object.fromEntries(
      Object.entries(colors).map(([k, v]) => [
        k,
        Utils.lerpColor(Utils.lerpColor(v, '#999999', 0.3), canvasDark, 0.4),
      ])
    ) as Record<ColorStyle, string>),
    [ColorStyle.White]: '#1d1d1d',
    [ColorStyle.Black]: '#bbbbbb',
  },
}

export const strokes: Record<Theme, Record<ColorStyle, string>> = {
  light: {
    ...colors,
    [ColorStyle.White]: '#1d1d1d',
    [ColorStyle.Black]: '#3d3d3d',
  },
  dark: {
    ...(Object.fromEntries(
      Object.entries(colors).map(([k, v]) => [k, Utils.lerpColor(v, canvasDark, 0.1)])
    ) as Record<ColorStyle, string>),
    [ColorStyle.White]: '#cecece',
    [ColorStyle.Black]: '#cecece',
  },
}

export const fills: Record<Theme, Record<ColorStyle, string>> = {
  light: {
    ...(Object.fromEntries(
      Object.entries(colors).map(([k, v]) => [k, Utils.lerpColor(v, canvasLight, 0.82)])
    ) as Record<ColorStyle, string>),
    [ColorStyle.White]: '#fefefe',
  },
  dark: {
    ...(Object.fromEntries(
      Object.entries(colors).map(([k, v]) => [k, Utils.lerpColor(v, canvasDark, 0.82)])
    ) as Record<ColorStyle, string>),
    [ColorStyle.White]: 'rgb(30,33,37)',
    [ColorStyle.Black]: '#1e1e1f',
  },
}

const strokeWidths = {
  [SizeStyle.Small]: 2,
  [SizeStyle.Medium]: 3.5,
  [SizeStyle.Large]: 5,
}

const fontSizes = {
  [SizeStyle.Small]: 28,
  [SizeStyle.Medium]: 48,
  [SizeStyle.Large]: 96,
  auto: 'auto',
}

const fontFaces = {
  [FontStyle.Graphik]: '"Graphik Web"',
  [FontStyle.Script]: '"Caveat Brush"',
  [FontStyle.Sans]: '"Source Sans Pro"',
  [FontStyle.Serif]: '"Crimson Pro"',
  [FontStyle.Mono]: '"Source Code Pro"',
}

const fontSizeModifiers = {
  [FontStyle.Graphik]: 0.68,
  [FontStyle.Script]: 1,
  [FontStyle.Sans]: 1,
  [FontStyle.Serif]: 1,
  [FontStyle.Mono]: 1,
}

const stickyFontSizes = {
  [SizeStyle.Small]: 24,
  [SizeStyle.Medium]: 36,
  [SizeStyle.Large]: 48,
  auto: 'auto',
}

export function getStrokeWidth(size: SizeStyle): number {
  return strokeWidths[size]
}

export function getFontSize(size: SizeStyle, fontStyle: FontStyle = FontStyle.Graphik): number {
  return fontSizes[size] * fontSizeModifiers[fontStyle]
}

export function getFontFace(font: FontStyle = FontStyle.Graphik): string {
  return fontFaces[font]
}

export function getStickyFontSize(size: SizeStyle): number {
  return stickyFontSizes[size]
}

export function getFontStyle(style: ShapeStyles): string {
  const fontSize = getFontSize(style.size, style.font)
  const fontFace = getFontFace(style.font)
  const { scale = 1 } = style

  return `${fontSize * scale}px/1 ${fontFace}`
}

export function getStickyFontStyle(style: ShapeStyles): string {
  const fontSize = getStickyFontSize(style.size)
  const fontFace = getFontFace(style.font)
  const { scale = 1 } = style

  return `${fontSize * scale}px/1 ${fontFace}`
}

export function getStickyShapeStyle(style: ShapeStyles, isDarkMode = false) {
  const { color } = style

  const theme: Theme = isDarkMode ? 'dark' : 'light'
  const adjustedColor =
    color === ColorStyle.White || color === ColorStyle.Black ? ColorStyle.Pink : color

  return {
    fill: stickyColors[adjustedColor],
    stroke: strokes[theme][adjustedColor],
    color: isDarkMode ? '#1d1d1d' : '#0d0d0d',
  }
}

export function getSectionShapeStyle(
  style: ShapeStyles,
  isDarkMode?: boolean
): {
  stroke: string
  fill: string
  strokeWidth: number
} {
  const { color, size, isFilled } = style

  const strokeWidth = getStrokeWidth(size)

  const theme: Theme = isDarkMode ? 'dark' : 'light'

  const adjustedColor =
    color === ColorStyle.White || color === ColorStyle.Black ? ColorStyle.Blue : color
  return {
    stroke: strokes[theme][adjustedColor],
    fill: isFilled ? fills[theme][adjustedColor] : 'none',
    strokeWidth,
  }
}

export function getShapeStyle(
  style: ShapeStyles,
  isDarkMode?: boolean
): {
  stroke: string
  fill: string
  strokeWidth: number
} {
  const { color, size, isFilled } = style

  const strokeWidth = getStrokeWidth(size)

  const theme: Theme = isDarkMode ? 'dark' : 'light'

  return {
    stroke: strokes[theme][color],
    fill: isFilled ? fills[theme][color] : 'none',
    strokeWidth,
  }
}

export const defaultStyle: ShapeStyles = {
  color: ColorStyle.Black,
  size: SizeStyle.Small,
  isFilled: false,
  dash: DashStyle.Draw,
  scale: 1,
}

export const defaultStickyStyle: ShapeStyles = {
  color: ColorStyle.Black,
  size: SizeStyle.Large,
  isFilled: false,
  dash: DashStyle.Draw,
  scale: 1,
}

export const defaultHighlighterStyle: ShapeStyles = {
  color: ColorStyle.Yellow,
  size: SizeStyle.Small,
  isFilled: false,
  dash: DashStyle.Draw,
  scale: 1,
}

export const defaultSectionStyle: ShapeStyles = {
  color: ColorStyle.Blue,
  size: SizeStyle.Small,
  isFilled: true,
  dash: DashStyle.Solid,
  scale: 1,
}

export const defaultTextStyle: TextShapeStyles = {
  ...defaultStyle,
  font: FontStyle.Graphik,
  textAlign: AlignStyle.Start,
  textWeight: TextWeight.Normal,
  listType: ListType.None,
  textDecoration: 'none',
  fontStyle: 'normal',
  bounds: [1,1]
}

export const defaultUser = {
  id: 2189163346,
  point: [0, 0],
  color: '#aa030e',
  user: {
    name: 'Anonymous',
    avatar:
      'https://lh3.googleusercontent.com/a/AItbvmkxSDlPkw8aevUuUYOqVJBBf9QYo4MEugPtpdCx=s96-c',
  },
}
