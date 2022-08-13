import * as React from 'react'
import {
  ArrowTopRightIcon,
  CursorArrowIcon,
  Pencil1Icon,
  Pencil2Icon,
  TextIcon,
  SunIcon,
  Link1Icon
} from '@radix-ui/react-icons'
import { TDSnapshot, TDShapeType, ColorStyle } from '~types'
import { useTldrawApp } from '~hooks'
import { ToolButtonWithTooltip } from '~components/Primitives/ToolButton'
import { Panel } from '~components/Primitives/Panel'
import { ShapesMenu } from './ShapesMenu'
import { EraserIcon } from '~components/Primitives/icons'

const preview = {
  url: 'https://knowyourmeme.com/',
  title: 'Know Your Meme',
  siteName: 'Know Your Meme',
  description: 'Know Your Meme is a website dedicated to documenting Internet phenomena: viral videos, image macros, catchphrases, web celebs and more.',
  mediaType: 'article',
  contentType: 'text/html',
  images: [ 'https://s.kym-cdn.com/assets/kym-logo-large.png' ],
  videos: [],
  favicons: [
    'https://knowyourmeme.com/assets/favicons/android-icon-192x192.png',
    'https://knowyourmeme.com/assets/favicons/favicon-32x32.png',
    'https://knowyourmeme.com/assets/favicons/favicon-96x96.png',
    'https://knowyourmeme.com/assets/favicons/favicon-16x16.png',
    'https://knowyourmeme.com/assets/favicons/apple-icon-57x57.png',
    'https://knowyourmeme.com/assets/favicons/apple-icon-60x60.png',
    'https://knowyourmeme.com/assets/favicons/apple-icon-72x72.png',
    'https://knowyourmeme.com/assets/favicons/apple-icon-76x76.png',
    'https://knowyourmeme.com/assets/favicons/apple-icon-114x114.png',
    'https://knowyourmeme.com/assets/favicons/apple-icon-120x120.png',
    'https://knowyourmeme.com/assets/favicons/apple-icon-144x144.png',
    'https://knowyourmeme.com/assets/favicons/apple-icon-152x152.png',
    'https://knowyourmeme.com/assets/favicons/apple-icon-180x180.png'
  ]
}


const videosrc = {
  url: 'https://www.dailymotion.com/video/x8ctka9?playlist=x6lgtp',
  title: '"P-Valley" creator Katori Hall talks favorite characters and Chucalissa - video Dailymotion',
  siteName: 'Dailymotion',
  description: `Katori Hall discusses "P-Valley" on Starz. The creator and executive produers talks to Salon's D. Watkins about how the show demystifies sex work and the art of filming a pole dance.`,
  mediaType: 'video',
  contentType: 'text/html',
  images: [ 'https://s1.dmcdn.net/v/U7RVn1YzongUAAW9t/x720' ],
  videos: [],
  favicons: [
    'https://static1.dmcdn.net/images/neon/favicons/android-icon-36x36.png.vef49e2d9e48d19cf2',
    'https://static1.dmcdn.net/images/neon/favicons/android-icon-48x48.png.v86ea9deb48065c612',
    'https://static1.dmcdn.net/images/neon/favicons/android-icon-72x72.png.v9f13bb2c1fdc852b2',
    'https://static1.dmcdn.net/images/neon/favicons/android-icon-96x96.png.v7dccf5d1e1a3ac752',
    'https://static1.dmcdn.net/images/neon/favicons/android-icon-144x144.png.v3050cc54221462b02',
    'https://static1.dmcdn.net/images/neon/favicons/android-icon-192x192.png.v668e5fde9462cb3a2',
    'https://static1.dmcdn.net/images/neon/favicons/apple-icon-57x57.png.v22b24dab820b05f92',
    'https://static1.dmcdn.net/images/neon/favicons/apple-icon-60x60.png.ve3dde6b2d7d77c1c2',
    'https://static1.dmcdn.net/images/neon/favicons/apple-icon-72x72.png.v9f13bb2c1fdc852b2',
    'https://static1.dmcdn.net/images/neon/favicons/apple-icon-76x76.png.v1817261b6db08d1e2',
    'https://static1.dmcdn.net/images/neon/favicons/apple-icon-114x114.png.v8d74423652a018c62',
    'https://static1.dmcdn.net/images/neon/favicons/apple-icon-120x120.png.v83f6d4acc9d112e12',
    'https://static1.dmcdn.net/images/neon/favicons/apple-icon-144x144.png.v3050cc54221462b02',
    'https://static1.dmcdn.net/images/neon/favicons/apple-icon-152x152.png.vdfc35168d697759d2',
    'https://static1.dmcdn.net/images/neon/favicons/apple-icon-180x180.png.v1d792fa8d2459b6d2'
  ]
}






const activeToolSelector = (s: TDSnapshot) => s.appState.activeTool
const toolLockedSelector = (s: TDSnapshot) => s.appState.isToolLocked

export const PrimaryTools = React.memo(function PrimaryTools(): JSX.Element {
  const app = useTldrawApp()

  const activeTool = app.useStore(activeToolSelector)

  const isToolLocked = app.useStore(toolLockedSelector)


  const selectSelectTool = React.useCallback(() => {
    app.selectTool('select')
  }, [app])

  const selectEraseTool = React.useCallback(() => {
    app.selectTool('erase')
  }, [app])

  const selectDrawTool = React.useCallback(() => {
    app.selectTool(TDShapeType.Draw)
  }, [app])

  const selectArrowTool = React.useCallback(() => {
    app.selectTool(TDShapeType.Arrow)
  }, [app])

  const selectTextTool = React.useCallback(() => {
    app.selectTool(TDShapeType.Text)
  }, [app])

  const selectStickyTool = React.useCallback(() => {
    app.selectTool(TDShapeType.Sticky)
  }, [app])

  const selectLinkTool = React.useCallback(() => {
    app.createLink(preview)
    // app.selectTool(TDShapeType.Sticky)
  }, [app])

  const selectStickerTool = React.useCallback((svg:string) => {
    app.selectSticker(svg)
    app.selectTool(TDShapeType.Sticker)
  }, [app])

  const selectVideoEmbed = React.useCallback(() => {
    if(videosrc.mediaType.includes('video'))  app.createVideoEmbed(videosrc)
   
  }, [app])

  return (
    <Panel side="center" id="TD-PrimaryTools">
      <ToolButtonWithTooltip
        kbd={'1'}
        label={'select'}
        onClick={selectSelectTool}
        isActive={activeTool === 'select'}
        id="TD-PrimaryTools-CursorArrow"
      >
        <CursorArrowIcon />
      </ToolButtonWithTooltip>
      <ToolButtonWithTooltip
        kbd={'2'}
        label={TDShapeType.Draw}
        onClick={selectDrawTool}
        isActive={activeTool === TDShapeType.Draw}
        id="TD-PrimaryTools-Pencil"
      >
        <Pencil1Icon />
      </ToolButtonWithTooltip>
      <ToolButtonWithTooltip
        kbd={'3'}
        label={'eraser'}
        onClick={selectEraseTool}
        isActive={activeTool === 'erase'}
        id="TD-PrimaryTools-Eraser"
      >
        <EraserIcon />
      </ToolButtonWithTooltip>
      <ShapesMenu activeTool={activeTool} isToolLocked={isToolLocked} />
      <ToolButtonWithTooltip
        kbd={'8'}
        label={TDShapeType.Arrow}
        onClick={selectArrowTool}
        isLocked={isToolLocked}
        isActive={activeTool === TDShapeType.Arrow}
        id="TD-PrimaryTools-ArrowTopRight"
      >
        <ArrowTopRightIcon />
      </ToolButtonWithTooltip>
      <ToolButtonWithTooltip
        kbd={'9'}
        label={TDShapeType.Text}
        onClick={selectTextTool}
        isLocked={isToolLocked}
        isActive={activeTool === TDShapeType.Text}
        id="TD-PrimaryTools-Text"
      >
        <TextIcon />
      </ToolButtonWithTooltip>
      <ToolButtonWithTooltip
        kbd={'0'}
        label={TDShapeType.Sticky}
        onClick={selectStickyTool}
        isActive={activeTool === TDShapeType.Sticky}
        id="TD-PrimaryTools-Pencil2"
      >
        <Pencil2Icon />
      </ToolButtonWithTooltip>
      <ToolButtonWithTooltip
        kbd={'0'}
        label={TDShapeType.Sticky}
        onClick={selectLinkTool}
        isActive={activeTool === TDShapeType.Sticky}
        id="TD-PrimaryTools-Pencil2"
      >
        <Link1Icon />
      </ToolButtonWithTooltip>
      <ToolButtonWithTooltip
        onClick={selectVideoEmbed}
        label='sticker'
        isActive={activeTool === TDShapeType.Sticky}
        id="TD-PrimaryTools-Pencil3"
      >
        <SunIcon />
      </ToolButtonWithTooltip>
    </Panel>
  )
})
