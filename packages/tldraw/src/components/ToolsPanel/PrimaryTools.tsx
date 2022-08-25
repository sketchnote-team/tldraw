import * as React from 'react'
import {
  ArrowTopRightIcon,
  CursorArrowIcon,
  Pencil1Icon,
  Pencil2Icon,
  TextIcon,
  SunIcon,
  Link1Icon,
  SectionIcon,
} from '@radix-ui/react-icons'
import { TDSnapshot, TDShapeType, ColorStyle } from '~types'
import { useTldrawApp } from '~hooks'
import { ToolButtonWithTooltip } from '~components/Primitives/ToolButton'
import { Panel } from '~components/Primitives/Panel'
import { ShapesMenu } from './ShapesMenu'
import { EraserIcon } from '~components/Primitives/icons'

const activeToolSelector = (s: TDSnapshot) => s.appState.activeTool
const toolLockedSelector = (s: TDSnapshot) => s.appState.isToolLocked

const video = {
  url: 'https://www.youtube.com/watch?v=EueeNj98E6I',
  title: 'Seth MacFarlane Monologue: The Voices - Saturday Night Live',
  siteName: 'YouTube',
  description:
    'Subscribe to SaturdayNightLive: http://j.mp/1bjU39dMonologues: http://j.mp/17rzZgvSEASON 38: http://j.mp/17rz13DSeth MacFarlane has a hard time fighting the ...',
  mediaType: 'video.other',
  contentType: 'text/html',
  images: ['https://i.ytimg.com/vi/EueeNj98E6I/maxresdefault.jpg'],
  videos: [],
  favicons: [
    'https://www.youtube.com/s/desktop/e06db45c/img/favicon_32x32.png',
    'https://www.youtube.com/s/desktop/e06db45c/img/favicon_48x48.png',
    'https://www.youtube.com/s/desktop/e06db45c/img/favicon_96x96.png',
    'https://www.youtube.com/s/desktop/e06db45c/img/favicon_144x144.png',
    'https://www.youtube.com/s/desktop/e06db45c/img/favicon.ico',
  ],
}


const svg = 'helo'

export const PrimaryTools = React.memo(function PrimaryTools(): JSX.Element {
  const app = useTldrawApp()
  const activeTool = app.useStore(activeToolSelector)
  const isToolLocked = app.useStore(toolLockedSelector)
  // console.log(app.useStore(s=>s.appState))

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
    app.selectTool(TDShapeType.Highlighter)
  }, [app])

  const selectStickerTool = React.useCallback(() => {
    // app.createFile(
    //   '/sda',
    //   'MY INSANE FILE LOL LHHAHA',
    //   svg,
    //   [
    //     {
    //       avatar:
    //         'https://bestprofilepictures.com/wp-content/uploads/2021/04/Profile-Pic-For-Girl.jpg',
    //       member: {
    //         firstname: 'nepal1',
    //         memberId:"1"
    //       },
    //     },
    //     {
    //       avatar:
    //         'https://bestprofilepictures.com/wp-content/uploads/2021/04/Profile-Pic-For-Girl.jpg',
    //       member: {
    //         firstname: 'nepal2',
    //         memberId:"2"
    //       },
    //     },
    //     {
    //       avatar:
    //         'https://bestprofilepictures.com/wp-content/uploads/2021/04/Profile-Pic-For-Girl.jpg',
    //       member: {
    //         firstname: 'nepal3',
    //         memberId:"3"
    //       },
    //     },
    //   ],
    //   'aayush',
    //   '1994-11-05T13:15:30Z',
    //   'whiteboard'
    // )
    app.createLesson({
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/800px-Image_created_with_a_mobile_phone.png',
      title: 'Branding Lesson Branding Lesson Branding Lesson Branding Lesson',
      description: 'Keep records of the financial accounts of the business. Keep records of the financial accounts of the business.',
      url:'/ws'
    })
  }, [app])

  const selectSectionTool = React.useCallback(() => {
    app.selectTool(TDShapeType.Section)
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
        isActive={activeTool === TDShapeType.Sticky}
        onClick={selectSectionTool}
        id="TD-PrimaryTools-Pencil2"
      >
        <Link1Icon />
      </ToolButtonWithTooltip>
      <ToolButtonWithTooltip
        kbd={'0'}
        label={TDShapeType.Sticky}
        onClick={selectStickerTool}
        isActive={activeTool === TDShapeType.Sticky}
        id="TD-PrimaryTools-Pencil2"
      >
        <SectionIcon></SectionIcon>
      </ToolButtonWithTooltip>
    </Panel>
  )
})


