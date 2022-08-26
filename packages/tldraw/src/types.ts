/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import type {
  TLPage,
  TLUser,
  TLPageState,
  TLBinding,
  TLBoundsCorner,
  TLBoundsEdge,
  TLShape,
  TLHandle,
  TLSnapLine,
  TLPinchEventHandler,
  TLKeyboardEventHandler,
  TLPointerEventHandler,
  TLWheelEventHandler,
  TLCanvasEventHandler,
  TLBoundsEventHandler,
  TLBoundsHandleEventHandler,
  TLShapeBlurHandler,
  TLShapeCloneHandler,
  TLAsset,
} from '@tldraw/core'

/* -------------------------------------------------- */
/*                         App                        */
/* -------------------------------------------------- */

// A base class for all classes that handle events from the Renderer,
// including TDApp and all Tools.
export class TDEventHandler {
  onPinchStart?: TLPinchEventHandler
  onPinchEnd?: TLPinchEventHandler
  onPinch?: TLPinchEventHandler
  onKeyDown?: TLKeyboardEventHandler
  onKeyUp?: TLKeyboardEventHandler
  onPointerMove?: TLPointerEventHandler
  onPointerUp?: TLPointerEventHandler
  onPan?: TLWheelEventHandler
  onZoom?: TLWheelEventHandler
  onPointerDown?: TLPointerEventHandler
  onPointCanvas?: TLCanvasEventHandler
  onDoubleClickCanvas?: TLCanvasEventHandler
  onRightPointCanvas?: TLCanvasEventHandler
  onDragCanvas?: TLCanvasEventHandler
  onReleaseCanvas?: TLCanvasEventHandler
  onPointShape?: TLPointerEventHandler
  onDoubleClickShape?: TLPointerEventHandler
  onRightPointShape?: TLPointerEventHandler
  onDragShape?: TLPointerEventHandler
  onHoverShape?: TLPointerEventHandler
  onUnhoverShape?: TLPointerEventHandler
  onReleaseShape?: TLPointerEventHandler
  onPointBounds?: TLBoundsEventHandler
  onDoubleClickBounds?: TLBoundsEventHandler
  onRightPointBounds?: TLBoundsEventHandler
  onDragBounds?: TLBoundsEventHandler
  onHoverBounds?: TLBoundsEventHandler
  onUnhoverBounds?: TLBoundsEventHandler
  onReleaseBounds?: TLBoundsEventHandler
  onPointBoundsHandle?: TLBoundsHandleEventHandler
  onDoubleClickBoundsHandle?: TLBoundsHandleEventHandler
  onRightPointBoundsHandle?: TLBoundsHandleEventHandler
  onDragBoundsHandle?: TLBoundsHandleEventHandler
  onHoverBoundsHandle?: TLBoundsHandleEventHandler
  onUnhoverBoundsHandle?: TLBoundsHandleEventHandler
  onReleaseBoundsHandle?: TLBoundsHandleEventHandler
  onPointHandle?: TLPointerEventHandler
  onDoubleClickHandle?: TLPointerEventHandler
  onRightPointHandle?: TLPointerEventHandler
  onDragHandle?: TLPointerEventHandler
  onHoverHandle?: TLPointerEventHandler
  onUnhoverHandle?: TLPointerEventHandler
  onReleaseHandle?: TLPointerEventHandler
  onShapeBlur?: TLShapeBlurHandler
  onShapeClone?: TLShapeCloneHandler
}

// The shape of the TldrawApp's React (zustand) store
export interface TDSnapshot {
  settings: {
    isCadSelectMode: boolean
    isDarkMode: boolean
    isDebugMode: boolean
    isPenMode: boolean
    isReadonlyMode: boolean
    isZoomSnap: boolean
    nudgeDistanceSmall: number
    nudgeDistanceLarge: number
    isFocusMode: boolean
    isSnapping: boolean
    showRotateHandles: boolean
    showBindingHandles: boolean
    showCloneHandles: boolean
    showGrid: boolean
  }
  appState: {
    currentStyle: TextShapeStyles
    currentStickyStyle: ShapeStyles
    currentShapeStyle: ShapeStyles
    currentDrawStyle: ShapeStyles,
    currentHighlighterStyle:ShapeStyles,
    currentSectionStyle: ShapeStyles
    currentPageId: string
    hoveredId?: string
    activeTool: TDToolType
    isToolLocked: boolean
    isEmptyCanvas: boolean
    isMenuOpen: boolean
    status: string
    snapLines: TLSnapLine[]
    isLoading: boolean
    disableAssets: boolean
    selectByContain?: boolean,
    selectedSticker: string,
    sections: {
      [key: string]: string[]
    },
    currentStickerPoint: number[]
  }
  document: TDDocument
  room?: {
    id: string
    userId: string
    users: Record<string, TDUser>
  }
}

export type TldrawPatch = Patch<TDSnapshot>

export type TldrawCommand = Command<TDSnapshot>

// The shape of the files stored in JSON
export interface TDFile {
  name: string
  fileHandle: FileSystemHandle | null
  document: TDDocument
  assets: Record<string, unknown>
}

// The shape of the Tldraw document
export interface TDDocument {
  id: string
  name: string
  version: number
  pages: Record<string, TDPage>
  pageStates: Record<string, TLPageState>
  assets: TDAssets
}

// The shape of a single page in the Tldraw document
export type TDPage = TLPage<TDShape, TDBinding>

// A partial of a TDPage, used for commands / patches
export type PagePartial = {
  shapes: Patch<TDPage['shapes']>
  bindings: Patch<TDPage['bindings']>
}

// The meta information passed to TDShapeUtil components
export interface TDMeta {
  isDarkMode: boolean
}

// The type of info given to shapes when transforming
export interface TransformInfo<T extends TLShape> {
  type: TLBoundsEdge | TLBoundsCorner
  initialShape: T
  scaleX: number
  scaleY: number
  transformOrigin: number[]
}

// The status of a TDUser
export enum TDUserStatus {
  Idle = 'idle',
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnected = 'disconnected',
}

// A TDUser, for multiplayer rooms
export interface TDUser extends TLUser<TDShape> {
  activeShapes: TDShape[]
  status: TDUserStatus
}

export type Theme = 'dark' | 'light'

export enum SessionType {
  Transform = 'transform',
  Translate = 'translate',
  TransformSingle = 'transformSingle',
  Brush = 'brush',
  Arrow = 'arrow',
  Draw = 'draw',
  Erase = 'erase',
  Rotate = 'rotate',
  Handle = 'handle',
  Grid = 'grid',
}

export enum TDStatus {
  Idle = 'idle',
  PointingHandle = 'pointingHandle',
  PointingBounds = 'pointingBounds',
  PointingBoundsHandle = 'pointingBoundsHandle',
  TranslatingLabel = 'translatingLabel',
  TranslatingHandle = 'translatingHandle',
  Translating = 'translating',
  Transforming = 'transforming',
  Rotating = 'rotating',
  Pinching = 'pinching',
  Brushing = 'brushing',
  Creating = 'creating',
  EditingText = 'editing-text',
}

export type TDToolType =
  | 'select'
  | 'erase'
  | TDShapeType.Text
  | TDShapeType.Draw
  | TDShapeType.Ellipse
  | TDShapeType.Rectangle
  | TDShapeType.Triangle
  | TDShapeType.Line
  | TDShapeType.Arrow
  | TDShapeType.Sticky
  | TDShapeType.Sticker
  | TDShapeType.Section
  | TDShapeType.Highlighter
  | TDShapeType.Connector

export type Easing =
  | 'linear'
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInQuint'
  | 'easeOutQuint'
  | 'easeInOutQuint'
  | 'easeInSine'
  | 'easeOutSine'
  | 'easeInOutSine'
  | 'easeInExpo'
  | 'easeOutExpo'
  | 'easeInOutExpo'

export enum MoveType {
  Backward = 'backward',
  Forward = 'forward',
  ToFront = 'toFront',
  ToBack = 'toBack',
}

export enum AlignType {
  Top = 'top',
  CenterVertical = 'centerVertical',
  Bottom = 'bottom',
  Left = 'left',
  CenterHorizontal = 'centerHorizontal',
  Right = 'right',
}

export enum StretchType {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export enum DistributeType {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export enum FlipType {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

/* -------------------------------------------------- */
/*                       Shapes                       */
/* -------------------------------------------------- */

export enum TDShapeType {
  Sticky = 'sticky',
  Ellipse = 'ellipse',
  Rectangle = 'rectangle',
  Triangle = 'triangle',
  Draw = 'draw',
  Arrow = 'arrow',
  Line = 'line',
  Text = 'text',
  Group = 'group',
  Image = 'image',
  Video = 'video',
  Sticker = 'sticker',
  Link='link',
  Embed = 'embed',
  Section= 'section',
  File = 'file',
  Highlighter = 'highlighter',
  Lesson = 'lesson',
  Connector = 'connector'
}

export enum Decoration {
  Arrow = 'arrow',
}

export interface TDBaseShape extends TLShape {
  style: TextShapeStyles
  type: TDShapeType
  label?: string
  handles?: Record<string, TDHandle>
}

export interface DrawShape extends TDBaseShape {
  type: TDShapeType.Draw
  points: number[][]
  isComplete: boolean
}
export interface HighlighterShape extends TDBaseShape {
  type: TDShapeType.Highlighter
  points: number[][]
  isComplete: boolean
}

// The extended handle (used for arrows)
export interface TDHandle extends TLHandle {
  canBind?: boolean
  bindingId?: string
}

export interface RectangleShape extends TDBaseShape {
  type: TDShapeType.Rectangle
  size: number[]
  label?: string
  labelPoint?: number[]
}

export interface EllipseShape extends TDBaseShape {
  type: TDShapeType.Ellipse
  radius: number[]
  label?: string
  labelPoint?: number[]
}

export interface TriangleShape extends TDBaseShape {
  type: TDShapeType.Triangle
  size: number[]
  label?: string
  labelPoint?: number[]
}

// The shape created with the arrow tool
export interface ArrowShape extends TDBaseShape {
  type: TDShapeType.Arrow
  bend: number
  handles: {
    start: TDHandle
    bend: TDHandle
    end: TDHandle
  }
  decorations?: {
    start?: Decoration
    end?: Decoration
    middle?: Decoration
  }
  label?: string
  labelPoint?: number[]
}


export interface ConnectorShape extends TDBaseShape {
  type: TDShapeType.Connector
  handles: {
    start: TDHandle
    end: TDHandle
  }
  decorations?: {
    start?: Decoration
    end?: Decoration
    middle?: Decoration
  }
  label?: string
  labelPoint?: number[]
}

export interface ArrowBinding extends TLBinding {
  handleId: keyof ArrowShape['handles']
  distance: number
  point: number[]
}

export type TDBinding = ArrowBinding

export interface ImageShape extends TDBaseShape {
  type: TDShapeType.Image
  size: number[]
  assetId: string
}

export interface StickerShape extends TDBaseShape {
  type: TDShapeType.Sticker
  size: number[]
  assetId: string
  svg:string
}


export interface VideoShape extends TDBaseShape {
  type: TDShapeType.Video
  size: number[]
  assetId: string
  isPlaying: boolean
  currentTime: number
}

// The shape created by the text tool
export interface TextShape extends TDBaseShape {
  type: TDShapeType.Text
  text: string
}

// The shape created by the sticky tool
export interface StickyShape extends TDBaseShape {
  type: TDShapeType.Sticky
  size: number[]
  text: string
}

export interface LinkShape extends TDBaseShape {
  type: TDShapeType.Link
  size: number[]
  url: string,
  title:string|undefined,
  imageUrl: string|undefined,
  description:string|undefined
}

export interface FileShape extends TDBaseShape {
  type: TDShapeType.File
  size: number[]
  url: string,
  title: string,
  icon: string,
  avatarUrl: any[],
  firstName:string,
  time:string,
  fileType: string,
  fileIcon: string
}

export interface LessonShape extends TDBaseShape {
  type: TDShapeType.Lesson
  size: number[]
  title: string,
  imageUrl: string,
  description: string,
  url: string
}

export interface EmbedShape extends TDBaseShape {
  type: TDShapeType.Embed
  size: number[]
  src: string,
  faviconSrc: string
}

export interface SectionShape extends TDBaseShape {
  type: TDShapeType.Section
  size: number[]
  children: string[]
  label?: string
  labelPoint?: number[]
}

// The shape created when multiple shapes are grouped
export interface GroupShape extends TDBaseShape {
  type: TDShapeType.Group
  size: number[]
  children: string[]
}

// A union of all shapes
export type TDShape =
  | RectangleShape
  | EllipseShape
  | TriangleShape
  | DrawShape
  | ArrowShape
  | TextShape
  | GroupShape
  | StickyShape
  | ImageShape
  | VideoShape
  | StickerShape
  | LinkShape
  | EmbedShape
  | SectionShape
  | FileShape
  | HighlighterShape
  | LessonShape
  | ConnectorShape

/* ------------------ Shape Styles ------------------ */

export enum ColorStyle {
  White = 'white',
  // LightGray = 'lightGray',
  // Gray = 'gray',
  Black = 'black',
  Green = 'green',
  // Cyan = 'cyan',
  Blue = 'blue',
  Pink = 'pink',
  Violet = 'violet',
  Red = 'red',
  Orange = 'orange',
  Yellow = 'yellow',
}

export enum SizeStyle {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export enum DashStyle {
  Draw = 'draw',
  Solid = 'solid',
  Dashed = 'dashed',
  Dotted = 'dotted',
}

export enum FontSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  ExtraLarge = 'extraLarge',
}

export enum AlignStyle {
  Start = 'start',
  Middle = 'middle',
  End = 'end',
  Justify = 'justify',
}

export enum TextWeight {
  Normal = 'normal',
  Bold = 'bold',
}

export enum ListType {
  None = 'none',
  Bullet = 'bullet',
  Numbered = 'numbered'
}

export enum FontStyle {
  Script = 'script',
  Sans = 'sans',
  Serif = 'erif',
  Mono = 'mono',
  Graphik = 'Graphik Web'
}

export type ShapeStyles = {
  color: ColorStyle
  size: SizeStyle
  dash: DashStyle
  font?: FontStyle
  textAlign?: AlignStyle
  isFilled?: boolean
  scale?: number
}

export type TextShapeStyles = {
  color: ColorStyle
  size: SizeStyle
  dash: DashStyle
  font?: FontStyle
  textAlign?: AlignStyle
  isFilled?: boolean
  scale?: number,
  textWeight: TextWeight,
  listType: ListType,
  textDecoration: string,
  fontStyle:string
}

export enum TDAssetType {
  Image = 'image',
  Video = 'video',
}

export interface TDImageAsset extends TLAsset {
  type: TDAssetType.Image
  src: string
  size: number[]
}

export interface TDVideoAsset extends TLAsset {
  type: TDAssetType.Video
  src: string
  size: number[]
}

export type TDAsset = TDImageAsset | TDVideoAsset

export type TDAssets = Record<string, TDAsset>

/* -------------------------------------------------- */
/*                    Export                          */
/* -------------------------------------------------- */

export enum TDExportTypes {
  PNG = 'png',
  JPG = 'jpeg',
  WEBP = 'webp',
  PDF = 'pdf',
  SVG = 'svg',
  JSON = 'json',
}

export interface TDExport {
  currentPageId: string
  name: string
  shapes: TDShape[]
  assets: TDAssets
  type: TDExportTypes
  size: number[]
  serialized?: string
}

/* -------------------------------------------------- */
/*                    Type Helpers                    */
/* -------------------------------------------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParametersExceptFirst<F> = F extends (arg0: any, ...rest: infer R) => any ? R : never

export type ExceptFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never

export type ExceptFirstTwo<T extends unknown[]> = T extends [any, any, ...infer U] ? U : never

export type PropsOfType<U> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof TDShape]: TDShape[K] extends any ? (TDShape[K] extends U ? K : never) : never
}[keyof TDShape]

export type Difference<A, B, C = A> = A extends B ? never : C

export type Intersection<A, B, C = A> = A extends B ? C : never

export type FilteredKeys<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never
}[keyof T]

export type RequiredKeys<T> = {
  [K in keyof T]-?: Difference<Record<string, unknown>, Pick<T, K>, K>
}[keyof T]

export type MembersWithRequiredKey<T, U> = {
  [P in keyof T]: Intersection<U, RequiredKeys<T[P]>, T[P]>
}[keyof T]

export type MappedByType<U extends string, T extends { type: U }> = {
  [P in T['type']]: T extends any ? (P extends T['type'] ? T : never) : never
}

export type ShapesWithProp<U> = MembersWithRequiredKey<MappedByType<TDShapeType, TDShape>, U>

export type Patch<T> = Partial<{ [P in keyof T]: Patch<T[P]> }>

export interface Command<T extends { [key: string]: any }> {
  id?: string
  before: Patch<T>
  after: Patch<T>
}

export interface FileWithHandle extends File {
  handle?: FileSystemHandle
}

export interface FileWithDirectoryHandle extends File {
  directoryHandle?: FileSystemHandle
}

// The following typings implement the relevant parts of the File System Access
// API. This can be removed once the specification reaches the Candidate phase
// and is implemented as part of microsoft/TSJS-lib-generator.

export interface FileSystemHandlePermissionDescriptor {
  mode?: 'read' | 'readwrite'
}

export interface FileSystemHandle {
  readonly kind: 'file' | 'directory'
  readonly name: string

  isSameEntry: (other: FileSystemHandle) => Promise<boolean>

  queryPermission: (descriptor?: FileSystemHandlePermissionDescriptor) => Promise<PermissionState>
  requestPermission: (descriptor?: FileSystemHandlePermissionDescriptor) => Promise<PermissionState>
}
