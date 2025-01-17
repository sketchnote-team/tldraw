import type { TDShapeUtil } from './TDShapeUtil'
import { RectangleUtil } from './RectangleUtil'
import { TriangleUtil } from './TriangleUtil'
import { EllipseUtil } from './EllipseUtil'
import { ArrowUtil } from './ArrowUtil'
import { GroupUtil } from './GroupUtil'
import { StickyUtil } from './StickyUtil'
import { TextUtil } from './TextUtil'
import { DrawUtil } from './DrawUtil'
import { ImageUtil } from './ImageUtil'
import { TDShape, TDShapeType } from '~types'
import { VideoUtil } from './VideoUtil'
import { StickerUtil } from './StickerUtil'
import { LinkUtil } from './LinkUtil'
import { EmbedUtil } from './EmbedUtil'
import {SectionUtil} from './SectionUtil'
import { FileUtil } from './FileUtil'
import { HighlighterUtil } from './HighlighterUtil'
import { LessonUtil } from './LessonUtil'
import { ConnectorUtil } from './ConnectorUtil'
import { CommentUtil } from './CommentUtil'

export const Rectangle = new RectangleUtil()
export const Triangle = new TriangleUtil()
export const Ellipse = new EllipseUtil()
export const Draw = new DrawUtil()
export const Arrow = new ArrowUtil()
export const Text = new TextUtil()
export const Group = new GroupUtil()
export const Sticky = new StickyUtil()
export const Image = new ImageUtil()
export const Video = new VideoUtil()
export const Sticker = new StickerUtil();
export const Link = new LinkUtil();
export const Embed = new EmbedUtil();
export const Section = new SectionUtil();
export const File = new FileUtil();
export const Highlighter = new HighlighterUtil();
export const Lesson = new LessonUtil();
export const Connector = new ConnectorUtil();
export const Comment = new CommentUtil();

export const shapeUtils = {
  [TDShapeType.Rectangle]: Rectangle,
  [TDShapeType.Triangle]: Triangle,
  [TDShapeType.Ellipse]: Ellipse,
  [TDShapeType.Draw]: Draw,
  [TDShapeType.Arrow]: Arrow,
  [TDShapeType.Text]: Text,
  [TDShapeType.Group]: Group,
  [TDShapeType.Sticky]: Sticky,
  [TDShapeType.Image]: Image,
  [TDShapeType.Video]: Video,
  [TDShapeType.Sticker]: Sticker,
  [TDShapeType.Link]: Link,
  [TDShapeType.Embed]: Embed,
  [TDShapeType.Section]: Section,
  [TDShapeType.File]: File,
  [TDShapeType.Highlighter]: Highlighter,
  [TDShapeType.Lesson]: Lesson,
  [TDShapeType.Connector]: Connector,
  [TDShapeType.Comment]: Comment,
}

export const getShapeUtil = <T extends TDShape>(shape: T | T['type']) => {
  if (typeof shape === 'string') return shapeUtils[shape] as unknown as TDShapeUtil<T>
  return shapeUtils[shape.type] as unknown as TDShapeUtil<T>
}

export * from './shared'
export * from './TDShapeUtil'
