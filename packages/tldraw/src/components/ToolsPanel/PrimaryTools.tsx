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
  console.log(app.useStore(s=>s.appState.mentionedUsers))
//   console.log(app.useStore(s=>s.document.pages.page.shapes))

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
    app.selectTool(TDShapeType.Sticky)
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
        onClick={()=>app.selectTool(TDShapeType.Sticky)}
        isActive={activeTool === TDShapeType.Comment}
        id="TD-PrimaryTools-Pencil2"
      >
        <ArrowRightIcon></ArrowRightIcon>
      </ToolButtonWithTooltip>
      <ToolButtonWithTooltip
        kbd={'0'}
        label={TDShapeType.Comment}
        onClick={()=>app.selectTool(TDShapeType.Comment)}
        isActive={activeTool === TDShapeType.Comment}
        id="TD-PrimaryTools-Pencil2"
      >
        {isPreview?'previewing':'show preview'}
      </ToolButtonWithTooltip>
      <ToolButtonWithTooltip
        kbd={'0'}
        label={TDShapeType.Comment}
        onClick={()=>{
          app.createTemplateAtPoint(template)
          app.zoomToFit()
        }}
        isActive={activeTool === TDShapeType.Comment}
        id="TD-PrimaryTools-Pencil2"
      >
        Replace Content
      </ToolButtonWithTooltip>
    </Panel>
  )
})

const shapes = {
    "525583ca-9a15-4811-3368-2bd8507c2add": {
        "id": "525583ca-9a15-4811-3368-2bd8507c2add",
        "type": "text",
        "name": "Text",
        "parentId": "page",
        "childIndex": 2,
        "point": [
          177,
          169.5
        ],
        "rotation": 0,
        "text": "Inclusion",
        "style": {
          "color": "black",
          "size": "small",
          "isFilled": false,
          "dash": "draw",
          "scale": 1,
          "font": "Graphik Web",
          "textAlign": "start",
          "textWeight": "normal",
          "listType": "none",
          "textDecoration": "none",
          "fontStyle": "normal",
        },
      }
}
const shape2 = {
    "8f60ef51-1f89-4e84-0cf9-7adf4c590f40": {
        "id": "8f60ef51-1f89-4e84-0cf9-7adf4c590f40",
        "type": "text",
        "name": "Text",
        "parentId": "page",
        "childIndex": 1,
        "point": [
            294,
            310.9
        ],
        "rotation": 0,
        "text": "hello",
        "style": {
            "color": "black",
            "size": "small",
            "isFilled": false,
            "dash": "draw",
            "scale": 1,
            "font": "Graphik Web",
            "textAlign": "start",
            "textWeight": "normal",
            "listType": "none",
            "textDecoration": "none",
            "fontStyle": "normal",
            "bounds": [
                1,
                1
            ]
        },
        "textAreaWidth": 100,
        "hasResized": false
    }
}


const template = {
    "shapes": {
        "8843326c-f9b1-463e-1b9a-46083d58ecc7": {
            "id": "8843326c-f9b1-463e-1b9a-46083d58ecc7",
            "type": "image",
            "name": "Image",
            "parentId": "page",
            "childIndex": 5,
            "point": [
                2176,
                -256
            ],
            "size": [
                6194,
                3053
            ],
            "rotation": 0,
            "style": {
                "color": "black",
                "size": "small",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "assetId": "6396c499-8b9f-43be-1e32-e4f13eb7331f",
            "isLocked": false
        },
        "76d4a52c-fe5a-4789-074b-bafe6283a41d": {
            "id": "76d4a52c-fe5a-4789-074b-bafe6283a41d",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                2432,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "pink",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "762bbf7f-2a30-4c6c-2cbf-84456cf076bc": {
            "id": "762bbf7f-2a30-4c6c-2cbf-84456cf076bc",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                2656,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "pink",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "c2947373-7f6e-4996-2bd8-a83d993c9172": {
            "id": "c2947373-7f6e-4996-2bd8-a83d993c9172",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                2880,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "pink",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "e58b7af9-029a-4de0-2f8b-3b48c081e7ce": {
            "id": "e58b7af9-029a-4de0-2f8b-3b48c081e7ce",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                2432,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "pink",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "6b45bcf1-2ea0-42b6-0807-1ec342a758d3": {
            "id": "6b45bcf1-2ea0-42b6-0807-1ec342a758d3",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                2432,
                1280
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "pink",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "17f69cf0-c695-4295-0bf1-6b67fa8485b6": {
            "id": "17f69cf0-c695-4295-0bf1-6b67fa8485b6",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                2656,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "pink",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "648ac288-502e-43d3-1659-be4d6254dd7a": {
            "id": "648ac288-502e-43d3-1659-be4d6254dd7a",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                2880,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "pink",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "a12350c5-c079-42f9-2db7-dcce78758605": {
            "id": "a12350c5-c079-42f9-2db7-dcce78758605",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                3200,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "violet",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "8dab20ea-2b39-4c78-2489-141d6f0fb568": {
            "id": "8dab20ea-2b39-4c78-2489-141d6f0fb568",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                3424,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "violet",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "af61d5bf-441f-492a-2eef-870f4cba1d6a": {
            "id": "af61d5bf-441f-492a-2eef-870f4cba1d6a",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                3648,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "violet",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "56f50c66-8072-4541-26c8-0231958c8bae": {
            "id": "56f50c66-8072-4541-26c8-0231958c8bae",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                3200,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "violet",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "ecfb4f41-f631-410c-3518-98df0cbf093d": {
            "id": "ecfb4f41-f631-410c-3518-98df0cbf093d",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                3424,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "violet",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "e7aba99f-4237-4231-3eda-d561491b0950": {
            "id": "e7aba99f-4237-4231-3eda-d561491b0950",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                3648,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "violet",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "143af6b9-d408-401e-3be8-d4ee0ccdc077": {
            "id": "143af6b9-d408-401e-3be8-d4ee0ccdc077",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                3200,
                1280
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "violet",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "799cffc0-eabb-4b35-1281-480072fae550": {
            "id": "799cffc0-eabb-4b35-1281-480072fae550",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                3968,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "blue",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "849a833b-a8b5-47a2-0f51-e89a2cbfc07f": {
            "id": "849a833b-a8b5-47a2-0f51-e89a2cbfc07f",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                4192,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "blue",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "0be3077b-f98f-42ff-0389-bc97ad6ed1cb": {
            "id": "0be3077b-f98f-42ff-0389-bc97ad6ed1cb",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                4416,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "blue",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "8bd6c054-baa4-4192-0f5d-b1031c47b04a": {
            "id": "8bd6c054-baa4-4192-0f5d-b1031c47b04a",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                3968,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "blue",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "1e8cb84b-dfde-4bd9-2ff8-5948b6121601": {
            "id": "1e8cb84b-dfde-4bd9-2ff8-5948b6121601",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                4192,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "blue",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "e802a5f0-da80-4f41-1d7f-39140e488e28": {
            "id": "e802a5f0-da80-4f41-1d7f-39140e488e28",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                4416,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "blue",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "71a83716-0c92-40c3-15da-121171fc96a4": {
            "id": "71a83716-0c92-40c3-15da-121171fc96a4",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                3968,
                1280
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "blue",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "733c3956-4796-4d63-2fed-79fde64de71d": {
            "id": "733c3956-4796-4d63-2fed-79fde64de71d",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                4736,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "green",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "29440010-0a6a-4665-0f0a-6a7e032ad9a1": {
            "id": "29440010-0a6a-4665-0f0a-6a7e032ad9a1",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                4960,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "green",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "109c0a7e-b26f-4a55-0946-9334486eed36": {
            "id": "109c0a7e-b26f-4a55-0946-9334486eed36",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                5184,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "green",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "c79d9611-219a-4d0e-055d-ae36a74bf0b9": {
            "id": "c79d9611-219a-4d0e-055d-ae36a74bf0b9",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                4736,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "green",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "3f36d4fa-9600-4e8c-031c-5dd07ac5a2c7": {
            "id": "3f36d4fa-9600-4e8c-031c-5dd07ac5a2c7",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                4736,
                1280
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "green",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "92f7f34f-c606-4df3-3d1d-306830279308": {
            "id": "92f7f34f-c606-4df3-3d1d-306830279308",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                4960,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "green",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "cc6cb572-4eb6-406d-18aa-cf05d462de63": {
            "id": "cc6cb572-4eb6-406d-18aa-cf05d462de63",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                5184,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "green",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "d4fce06b-a822-460b-3d02-97ec59c1e36f": {
            "id": "d4fce06b-a822-460b-3d02-97ec59c1e36f",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                5504,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "yellow",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "7d3f79ee-55bd-48a4-329c-d5a7fcf43ef1": {
            "id": "7d3f79ee-55bd-48a4-329c-d5a7fcf43ef1",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                5728,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "yellow",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "c49f1db5-a5b9-44b6-3e67-0e0fc8914c8a": {
            "id": "c49f1db5-a5b9-44b6-3e67-0e0fc8914c8a",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                5952,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "yellow",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "09a1634b-0f3f-4c41-0b73-07015c3e4f99": {
            "id": "09a1634b-0f3f-4c41-0b73-07015c3e4f99",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                5504,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "yellow",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "f1a5138c-aa81-466b-27ad-78235de363e5": {
            "id": "f1a5138c-aa81-466b-27ad-78235de363e5",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                5728,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "yellow",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "fbc45415-f97c-4142-353d-7ababd684229": {
            "id": "fbc45415-f97c-4142-353d-7ababd684229",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                5952,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "yellow",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "3711eaed-1066-4530-1037-0665ae1ff34c": {
            "id": "3711eaed-1066-4530-1037-0665ae1ff34c",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                5504,
                1280
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "yellow",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "5ad15975-f3c0-48a6-35e6-df22c2028109": {
            "id": "5ad15975-f3c0-48a6-35e6-df22c2028109",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                6272,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "orange",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "0d3525c1-b1b8-431f-089f-bbd2af7b2e25": {
            "id": "0d3525c1-b1b8-431f-089f-bbd2af7b2e25",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                6496,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "orange",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "f5a7d6b8-beb2-4067-0712-9cbc67835b8e": {
            "id": "f5a7d6b8-beb2-4067-0712-9cbc67835b8e",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                6720,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "orange",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "3369374f-78a6-431e-314c-bbacc3359624": {
            "id": "3369374f-78a6-431e-314c-bbacc3359624",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                6272,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "orange",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "f75a3680-1183-4c73-3090-db174e2b1e17": {
            "id": "f75a3680-1183-4c73-3090-db174e2b1e17",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                6272,
                1280
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "orange",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "0e0b8c0a-0e78-4ef8-1b96-ccf63431780d": {
            "id": "0e0b8c0a-0e78-4ef8-1b96-ccf63431780d",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                6496,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "orange",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "f3d8c1a3-9029-482c-0896-3e7c4930a9ee": {
            "id": "f3d8c1a3-9029-482c-0896-3e7c4930a9ee",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                6720,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "orange",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "a2013217-3c14-4f65-20b2-400e1bf2028d": {
            "id": "a2013217-3c14-4f65-20b2-400e1bf2028d",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                7008,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "red",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "ef2f9bd1-32df-47bc-0f03-7d5194826995": {
            "id": "ef2f9bd1-32df-47bc-0f03-7d5194826995",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                7232,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "red",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "bf39361f-8ac7-4941-13b2-4d7b07e2ebd5": {
            "id": "bf39361f-8ac7-4941-13b2-4d7b07e2ebd5",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                7456,
                768
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "red",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "5c318224-1437-4274-05a8-4e607f062aed": {
            "id": "5c318224-1437-4274-05a8-4e607f062aed",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                7008,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "red",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "17343ef4-dfd3-453f-0ca6-2a460b6ae877": {
            "id": "17343ef4-dfd3-453f-0ca6-2a460b6ae877",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                7008,
                1280
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "red",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "bb51620d-5f67-4653-3152-7be5b0ce1c3f": {
            "id": "bb51620d-5f67-4653-3152-7be5b0ce1c3f",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                7232,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "red",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        },
        "14f36819-2198-4980-1d06-4672e2667e8f": {
            "id": "14f36819-2198-4980-1d06-4672e2667e8f",
            "type": "sticky",
            "name": "Sticky",
            "parentId": "page",
            "childIndex": 6,
            "point": [
                7456,
                1024
            ],
            "size": [
                200,
                200
            ],
            "text": "",
            "rotation": 0,
            "style": {
                "color": "red",
                "size": "large",
                "isFilled": false,
                "dash": "draw",
                "scale": 1,
                "font": "Graphik Web",
                "textAlign": "start",
                "textWeight": "normal",
                "listType": "none",
                "textDecoration": "none",
                "fontStyle": "normal"
            },
            "user": "Bhoomika Desai"
        }
    },
    "assets": {
        "6396c499-8b9f-43be-1e32-e4f13eb7331f": {
            "id": "6396c499-8b9f-43be-1e32-e4f13eb7331f",
            "type": "image",
            "src": "https://snuserassets.s3.amazonaws.com/uploads/635fc966d7488cae017c7d7d/file-1667804202712.png",
            "size": [
                6194,
                3053
            ]
        }
    },
    "bindings": undefined,
    "sections": undefined
}