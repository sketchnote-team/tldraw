import * as React from 'react'
import ReactDOM from 'react-dom/server'
import {
  ArrowTopRightIcon,
  CursorArrowIcon,
  Pencil1Icon,
  Pencil2Icon,
  TextIcon,
  SunIcon,
  Link1Icon,
  SectionIcon,
  ArrowRightIcon,
} from '@radix-ui/react-icons'
import { TDSnapshot, TDShapeType, ColorStyle } from '~types'
import { useTldrawApp } from '~hooks'
import { ToolButtonWithTooltip } from '~components/Primitives/ToolButton'
import { Panel } from '~components/Primitives/Panel'
import { ShapesMenu } from './ShapesMenu'
import { EraserIcon } from '~components/Primitives/icons'
import Vec from '@tldraw/vec'
import { template1, template2 } from '~templates'
import { PenMenu } from './PenMenu'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

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

export const PrimaryTools = React.memo(function PrimaryTools(): JSX.Element {
  const app = useTldrawApp()
  const activeTool = app.useStore(activeToolSelector)
  const isToolLocked = app.useStore(toolLockedSelector)
  const isPreview = app.useStore(s=>s.appState.isPreview)


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
    app.selectTool(TDShapeType.Section)
  }, [app])

  const selectTextTool = React.useCallback(() => {
    app.selectTool(TDShapeType.Text)
  }, [app])

  const selectSectionTool = React.useCallback(() => {
    app.selectTool(TDShapeType.Section)
  }, [app])

  const selectLinkTool = React.useCallback(() => {
    app.selectTool(TDShapeType.Highlighter)
  }, [app])

  const createTemplateCopy = React.useCallback(() => {
    app.selectAll()
    app.deleteAll()
    app.createTemplateCopy()

  }, [app])


  const createTemplateAtPoint = () => {
    if(isPreview){
      app.deleteAll()
    app.createTemplateAtPoint(template1)
    }
  }

  const createTemplate2AtPoint = () => {
    if(isPreview){
      app.deleteAll()
    app.createTemplateAtPoint(template2)
    }
  }


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
        onClick={selectSectionTool}
        isActive={activeTool === TDShapeType.Sticky}
        id="TD-PrimaryTools-Pencil2"
      >
        <Pencil2Icon />
      </ToolButtonWithTooltip>
      <ToolButtonWithTooltip
        kbd={'0'}
        label={TDShapeType.Sticky}
        isActive={activeTool === TDShapeType.Sticky}
        onMouseEnter={createTemplateAtPoint}
        id="TD-PrimaryTools-Pencil2"
      >
        Template 1
      </ToolButtonWithTooltip>
      <ToolButtonWithTooltip
        kbd={'0'}
        label={TDShapeType.Sticky}
        isActive={activeTool === TDShapeType.Sticky}
        onMouseEnter={createTemplate2AtPoint}
        id="TD-PrimaryTools-Pencil2"
      >
       Template 2
      </ToolButtonWithTooltip>
      <ToolButtonWithTooltip
        kbd={'0'}
        label={TDShapeType.Comment}
        onClick={createTemplateCopy}
        isActive={activeTool === TDShapeType.Comment}
        id="TD-PrimaryTools-Pencil2"
      >
        <ArrowRightIcon></ArrowRightIcon>
      </ToolButtonWithTooltip>
      <ToolButtonWithTooltip
        kbd={'0'}
        label={TDShapeType.Comment}
        onClick={()=>app.setPreview(true)}
        isActive={activeTool === TDShapeType.Comment}
        id="TD-PrimaryTools-Pencil2"
      >
        {isPreview?'previewing':'show preview'}
      </ToolButtonWithTooltip>
    </Panel>
  )
})
