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


const svg =  <svg 
  style={{boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)'}}
width="100%" height="100%" id="a" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 439.48 442.3">
<defs>
  <style
    dangerouslySetInnerHTML={{
      __html:
        ".b{fill:#f7eba5;}.c{fill:#f7e47a;}.d{fill:#f9ea6c;}.e{fill:#f8ea91;}.f{fill:#696868;}.g{fill:#eccb36;}.h{fill:#eccc36;}.i{fill:#f6db3d;}.j{fill:#fcfbfa;}.k{fill:#663d1a;}.l{fill:#673d19;}.m{fill:#997b63;}.n{fill:#c3912d;}.o{fill:#8d7561;}.p{fill:#915b29;}.q{fill:#c0752e;}.r{fill:#b35c2a;}.s{fill:#bf752e;}.t{fill:#dfb130;}.u{fill:#e0b02e;}.v{fill:#dfb02f;}.w{fill:#dfaf2f;}.x{fill:#d5a933;}.y{fill:#432b15;}.a`{fill:#2c2b25;}.aa{fill:#482e16;}.ab{fill:#462d16;}.ac{fill:#533218;}"
    }}
  />
</defs>
<path
  className="j"
  d="M348.08,399.22c-.73,.47-1.46,.9-2.15,1.39-26.92,19.28-56.66,32-89.22,38.03-19.72,3.65-39.58,4.63-59.59,2.67-46.64-4.57-87.78-22.02-122.95-52.92-35.74-31.41-58.48-70.65-68.92-117.02C1.18,253.24-.56,234.87,.16,216.32c1.54-39.99,12.71-77.09,34-111.05,16.8-26.79,38.51-48.86,64.75-66.51,20.9-14.06,43.56-24.21,67.92-30.62,2.78-.73,5.44-1.95,8.21-2.7,3.17-.85,6.39-1.54,9.63-2.11C201.34,.41,218.15-.68,235.03,.42c46.5,3.05,88.17,18.86,124.24,48.43,40.86,33.51,66.38,76.52,76.13,128.35,10.76,57.22,.08,110.75-30.36,160.35-1.45,2.36-2.13,4.62-1.92,7.34,.29,3.97,.92,7.84,1.84,11.72,2.17,9.2,5.68,17.84,10.06,26.18,3.88,7.37,5.71,15.37,7.11,23.5,.13,.76,.17,1.55,.13,2.32-.25,5.85-1.35,11.56-3.65,16.91-2.07,4.83-6,8.31-10.19,11.3-5.81,4.14-12.39,5.71-19.53,5-2.68-.27-5-1.37-7.31-2.62-8.98-4.87-16.08-11.76-21.51-20.32-3.94-6.2-7.57-12.59-11.35-18.89-.15-.24-.36-.44-.63-.78Zm5.83-326.63l-.9-.8c-.81-.82-1.57-1.7-2.44-2.45-36.94-32.34-80-48.35-129.11-48.38-6.6,0-13.04,1.14-19.55,1.78-3.08,.3-6.18,.55-9.23,1.05-29.98,4.88-57.53,15.86-82.41,33.31-5.37,3.76-10.34,8.09-15.49,12.16-.84,.65-1.71,1.25-2.5,1.95-20.48,18.13-36.83,39.39-48.74,64.04-13.13,27.16-20.13,55.78-20.64,85.92-.29,16.91,1.66,33.62,5.76,50.03,9.82,39.34,29.68,72.73,60.21,99.51,45.84,40.21,108.2,56.03,167.65,42.48,41-9.34,75.89-29.49,104.42-60.46,2.54-2.76,5.02-5.59,7.52-8.39-.13,13.72,2.13,27.12,5.41,40.39,2.19,8.84,6.06,16.88,11.43,24.21,.51,.7,1.05,1.4,1.7,1.97,2.22,1.97,5.28,2.08,7.45,.34,2.1-1.68,2.72-4.51,1.43-7.07-.56-1.12-1.28-2.17-2.02-3.17-4.73-6.4-7.75-13.61-9.42-21.31-1.52-6.98-2.83-14.02-3.79-21.09-1.43-10.5-.68-21.03,.38-31.52,.52-.69,1.08-1.34,1.55-2.06,20.28-31.26,30.81-65.63,32.51-102.73,.84-18.27-1.18-36.3-5.44-54.08-6.55-27.32-18.59-51.98-35.83-74.12-6.01-7.71-12.51-15.01-19.87-21.5h-.02Z"
/>
<path
  className="a`"
  d="M381.02,327.09c-1.07,10.5-1.81,21.02-.38,31.52,.96,7.07,2.27,14.11,3.79,21.09,1.68,7.7,4.69,14.91,9.42,21.31,.74,1.01,1.46,2.06,2.02,3.17,1.29,2.55,.67,5.39-1.43,7.07-2.18,1.74-5.23,1.63-7.45-.34-.64-.57-1.18-1.27-1.7-1.97-5.38-7.33-9.25-15.36-11.43-24.21-3.28-13.27-5.54-26.67-5.41-40.39,.06-1.98,.11-3.97,.17-5.95,.05-.68,.11-1.35,.14-2.02,.51-14.63,2.38-29.06,6.06-43.25,.65-2.5,.93-5.11,1.38-7.66,.24-1.13,.57-2.25,.71-3.4,.86-6.81,1.73-13.62,2.51-20.44,1.9-16.62,1.76-33.19-1.35-49.68-1.07-5.71-2.56-11.29-5.19-16.5-1.86-5.09-3.96-10.06-7.13-14.5-1.79-3.11-4.19-5.64-7.43-7.95,0,1.35,0,2.28,0,3.21,.02,2.42,.17,4.84,.03,7.25-.38,6.22-3.38,9.03-9.63,9.2-.95,.03-1.9,0-2.89,0-.48,1.17-.89,2.24-1.36,3.29-12.88,29.11-35.07,45.65-66.92,48.04-17.38,1.31-33.3-3.97-47.18-14.64-3.81-2.93-7.16-6.46-10.72-9.72l-.04-.06-.83-.92c-1.35-1.88-2.73-3.74-4.04-5.64-18.81-27.34-16.99-64.82,4.62-90.87,3.74-4.51,8.27-8.36,12.43-12.51,.75-.61,1.5-1.22,2.25-1.83h.97c1.15-.87,2.23-1.85,3.46-2.59,7.99-4.81,16.44-8.53,25.74-9.92,4.36-.65,8.77-1.27,13.17-1.34,3.91-.06,7.83,.73,11.76,1.02,6.04,.45,11.65,2.45,17.22,4.63,1.43,.56,2.83,1.21,4.24,1.82,.96,.58,1.93,1.16,2.89,1.74,16.46,9.54,27.49,23.43,33.27,41.51,.17,.53,.44,1.03,.64,1.49,1.43,0,2.68,.07,3.93-.01,2.33-.16,3.93,.88,4.85,2.93,.59,1.31,.97,2.71,1.44,4.06v6.56c1.42,.67,2.55,1.18,3.66,1.74,1.11,.57,2.19,1.2,3.28,1.8,3.28,3.23,6.57,6.46,9.85,9.7,.82,1.3,1.69,2.57,2.47,3.9,8.58,14.79,13.47,30.72,14.55,47.78,.33,5.2,.47,10.42,.7,15.63-.04,.29-.12,.57-.11,.86,.2,12.69-1.32,25.26-3.17,37.76-1.34,9.05-3.59,17.97-5.23,26.98-.81,4.43-2.2,8.79-2.01,13.37l-.56,7.91ZM207.46,172.9c-.11,6.54,1.14,12.88,3.11,19.07,9.8,30.76,39.95,51.04,74.02,45.73,19.26-3,34.66-12.8,46.17-28.49,18.38-25.07,18.43-59.07,.21-83.42-4.07-5.44-8.72-10.34-14.52-14.02-.27-.27-.5-.59-.8-.81-8.72-6.09-18.41-9.78-28.88-11.38-8.54-1.3-17.07-.76-25.34,1.54-27.79,7.75-45.13,25.88-52.39,53.65-1.54,5.9-2.17,11.98-1.58,18.12Zm182.52,62.89c-.62-6.05-1.03-12.9-2.1-19.65-1.03-6.46-2.44-12.9-4.26-19.18-1.45-4.99-3.62-9.79-5.77-14.54-1.22-2.7-2.94-5.2-4.61-7.68-.99-1.46-2.42-1.79-3.51-1.24-1.03,.52-1.41,1.92-.75,3.63,.59,1.53,1.28,3.05,2.15,4.43,3.12,4.96,5.08,10.42,7.01,15.88,4.18,11.86,5.22,24.28,6.24,36.69,.15,1.83,.1,3.67,.11,5.51,.02,3.17-.04,6.34,.03,9.51,.05,2.12,.25,4.23,.41,6.34,.07,.84,.44,1.68,1.38,1.45,.6-.15,1.25-.81,1.53-1.41,.4-.86,.58-1.85,.67-2.8,.5-5.38,.94-10.76,1.47-16.96Zm-34.23-83.45c-.04-1.99-3.63-4.39-5.43-3.63-1.1,.46-1.61,1.81-.86,2.56,1.02,1.01,2.12,1.96,3.32,2.74,1.16,.75,2.99-.36,2.96-1.67Z"
/>
<path
  className="s"
  d="M368.62,338.39c-.06,1.98-.11,3.97-.17,5.95-2.51,2.8-4.98,5.63-7.52,8.39-28.52,30.98-63.42,51.12-104.42,60.46-59.45,13.55-121.81-2.27-167.65-42.48-30.53-26.78-50.39-60.17-60.21-99.51-4.09-16.41-6.05-33.12-5.76-50.03,.52-30.15,7.52-58.77,20.64-85.92,11.91-24.65,28.26-45.91,48.74-64.04,.79-.7,1.67-1.3,2.5-1.95,.27,1.06,.55,2.13,.82,3.19-.64,.72-1.28,1.44-1.92,2.17-1.54,1.37-3.09,2.74-4.63,4.1-.72,.63-1.48,1.24-2.17,1.91-8.32,8.11-15.75,16.97-22.57,26.38-6.48,8.95-12.15,18.38-17.11,28.22-2.91,5.77-5.34,11.79-7.74,17.79-.87,2.18-1.95,4.44-1.68,6.95-.34,.3-.9,.54-1,.9-1.98,6.95-4.13,13.86-5.78,20.89-1.21,5.13-1.85,10.41-2.55,15.64-.67,5.04-1.36,10.11-1.54,15.19-.26,7.44-.13,14.9-.04,22.34,.04,3.17,.21,6.37,.64,9.5,.8,5.71,1.84,11.38,2.78,17.06,1.45,8.87,3.99,17.48,6.92,25.94,3.89,11.23,8.63,22.14,14.7,32.39,2.75,4.64,5.72,9.15,8.71,13.64,3.74,5.63,7.79,11.02,12.41,15.97,3.62,3.88,7.04,7.95,10.77,11.71,2.78,2.8,5.84,5.33,8.91,7.82,5.47,4.42,10.88,8.94,16.62,13,8.05,5.69,16.65,10.5,25.7,14.43,6.81,2.96,13.71,5.77,20.69,8.3,8.63,3.12,17.61,5.04,26.61,6.72,3.2,.6,6.48,.81,9.72,1.19,.68,.04,1.37,0,2.03,.14,7.13,1.65,14.42,.95,21.62,1.56,2.09,.18,4.22-.29,6.34-.43,2.98-.2,5.97-.41,8.95-.55,7.25-.33,14.36-1.61,21.47-2.95,16.04-3.03,31.38-8.22,46.09-15.25,9.7-4.63,18.92-10.11,27.7-16.32,7.11-5.02,13.92-10.42,20.28-16.34,4.53-4.22,8.93-8.6,13.13-13.14,3.2-3.46,5.99-7.28,8.96-10.94Z"
/>
<path
  className="q"
  d="M381.02,327.09c.19-2.64,.37-5.28,.56-7.92,.34-.34,.76-.62,1-1.02,7.15-11.89,12.88-24.46,17.49-37.52,4.21-11.95,7.17-24.2,8.95-36.77,1.23-8.71,1.81-17.45,2.09-26.21,.12-3.85-.44-7.71-.43-11.56,.02-7.17-.83-14.27-1.97-21.3-1.97-12.21-4.93-24.2-9.28-35.81-1.18-3.15-2.64-6.18-3.97-9.27-1.12-2.64-2.17-5.3-3.37-7.91-5.99-13.07-13.55-25.19-22.61-36.34-3.03-3.73-6.32-7.27-9.49-10.89-.96-1.16-1.92-2.32-2.88-3.48-.89-2.14-1.81-4.28-2.67-6.44-.26-.65-.34-1.36-.51-2.04,7.35,6.49,13.86,13.79,19.87,21.5,17.24,22.14,29.28,46.8,35.83,74.12,4.26,17.79,6.28,35.82,5.44,54.08-1.7,37.1-12.23,71.47-32.51,102.73-.47,.72-1.03,1.38-1.55,2.06Z"
/>
<path
  className="r"
  d="M353.94,72.6c.17,.68,.25,1.4,.51,2.04,.86,2.16,1.77,4.29,2.67,6.44-3.7-3.4-7.34-6.88-11.11-10.2-11.98-10.55-25.2-19.29-39.51-26.34-25.02-12.33-51.46-18.98-79.4-19.38-7.34-.1-14.69-.22-22.01,.18-4.99,.27-9.95,1.35-14.9,2.21-30.92,5.34-58.74,17.83-83.85,36.49-3.64,2.71-7.16,5.6-10.73,8.4-.27-1.06-.55-2.13-.82-3.19,5.15-4.07,10.12-8.4,15.49-12.16,24.88-17.45,52.43-28.42,82.41-33.31,3.05-.5,6.15-.75,9.23-1.05,6.51-.64,12.95-1.78,19.55-1.78,49.11,.02,92.16,16.03,129.11,48.38,.87,.76,1.63,1.63,2.44,2.45,.3,.27,.6,.54,.9,.8h.02Z"
/>
<path className="q" d="M353.91,72.59c-.3-.27-.6-.54-.9-.8l.9,.8Z" />
<path
  className="i"
  d="M95.61,72.44c3.57-2.81,7.08-5.69,10.73-8.4,25.11-18.66,52.93-31.15,83.85-36.49,4.95-.85,9.91-1.94,14.9-2.21,7.32-.4,14.67-.28,22.01-.18,27.94,.39,54.39,7.05,79.4,19.38,14.31,7.05,27.53,15.79,39.51,26.34,3.77,3.32,7.41,6.8,11.11,10.2,.96,1.16,1.92,2.32,2.88,3.48,.13,.75,.08,1.58,.4,2.24,4.26,8.8,7.29,18.04,9.86,27.45,2.99,10.99,4.65,22.22,5.37,33.54,.47,7.32,.14,14.7,.03,22.05-.02,1.02-.83,2.03-1.27,3.05-3.28-3.23-6.57-6.46-9.85-9.7-.5-1.74-.71-3.65-1.58-5.19-1.21-2.14-2.77-4.16-5.37-4.92-.47-1.36-.85-2.76-1.44-4.06-.92-2.05-2.52-3.09-4.85-2.93-1.24,.08-2.5,.01-3.93,.01-.2-.46-.47-.96-.64-1.49-5.78-18.09-16.8-31.97-33.27-41.51,1.28-3.03,.58-6.01-.89-8.62-5.54-9.9-14.29-14.88-25.46-15.81-6.27-.53-12.11,1.2-17.68,3.8-8.54,3.99-17.29,7.19-26.68,8.56-2.52,.37-5.04,1.43-7.29,2.67-3.34,1.83-5.38,4.7-4.98,8.79-1.5,2.71-.48,4.98,1.27,7.11-4.16,4.15-8.69,8.01-12.43,12.51-21.61,26.05-23.42,63.53-4.62,90.87,1.31,1.91,2.69,3.76,4.04,5.64l.83,.92,.04,.06c.25,.98,.29,2.09,.78,2.92,3.78,6.36,8.64,11.8,14.44,16.41,4.73,3.75,9.98,6.63,15.55,8.86,6.75,2.7,13.74,4.36,21.08,4.66,3.27,.13,6.51,.28,9.76-.07,2.68-.29,5.37-.5,8.02-.97,9.72-1.71,18.77-5.24,27.18-10.38,8.14-4.98,15.34-11.06,21.27-18.55,5.3-6.7,9.73-13.92,12.58-22.02,.45-1.27,1.16-2.03,2.7-2.18,1.19-.11,2.38-.77,3.45-1.39,4.44-2.61,6.69-6.81,8.17-11.53,.45-1.45,.77-2.94,1.14-4.42,3.17,4.45,5.28,9.41,7.13,14.5-.41,.95-.94,1.87-1.21,2.86-1.81,6.59-3.31,13.28-5.41,19.78-1.86,5.77-4.37,11.34-6.58,17-3.92,10.02-9.2,19.32-15.03,28.32-3.88,5.99-7.86,11.91-12.61,17.27-3.52,3.96-6.81,8.13-10.42,12-2.56,2.75-5.42,5.23-8.25,7.71-3.98,3.5-7.95,7.02-12.1,10.32-8.72,6.92-18.11,12.88-28.11,17.76-6.67,3.26-13.59,6.06-20.54,8.67-7.32,2.74-14.87,4.77-22.64,5.9-4.28,.62-8.56,1.26-12.86,1.74-4.11,.46-8.23,.94-12.36,1.04-3.65,.09-7.31-.46-10.97-.48-6.69-.04-13.23-1.22-19.76-2.4-10.02-1.81-19.62-5.03-28.93-9.13-6.72-2.96-13.07-6.55-19.31-10.43-7.17-4.46-13.71-9.67-19.79-15.47-5.73-5.47-11.21-11.16-15.97-17.55-4.39-5.89-8.63-11.86-12.08-18.35-2.49-4.69-5-9.38-7.09-14.26-2.35-5.49-4.4-11.12-6.27-16.79-2.48-7.5-4.15-15.21-5.42-23.03-1.12-6.94-2.02-13.89-2.12-20.92-.07-4.93-.17-9.88,.03-14.8,.24-5.96,.44-11.95,1.27-17.84,.92-6.55,2.51-13.01,3.83-19.5,2.88-14.18,8.08-27.57,14.39-40.51,3.33-6.84,7.52-13.26,11.28-19.89,.5-.89,.78-1.91,1.16-2.87,.01-.19,.03-.37,.04-.56,2.52-1.44,3.96-3.66,4.59-6.44,.64-.72,1.28-1.44,1.92-2.17Zm32.24,93.4c.06,.96,.1,1.93,.2,2.89,.54,5.67,2.03,11,5.64,15.55,2.03,2.57,4.55,4.45,7.73,5.34,5.61,1.58,10.24-.49,14.37-4.08,3.19-2.77,5.42-6.25,7.14-10.08,2.2-4.92,3.07-10.13,3.52-15.44,.34-3.22,1.14-6.47,.91-9.64-.41-5.65-2.56-10.8-5.91-15.44-4.57-6.31-10.77-8.53-18.19-5.14-4.53,2.07-7.74,5.6-10.28,9.82-2.12,3.51-3.42,7.35-4.43,11.25-.67,2.58-.82,5.3-1.08,7.96-.06,.57,.4,1.2,.62,1.8l-.23,4.59c-.06,.06-.19,.13-.18,.18,.04,.15,.12,.29,.19,.43Zm127.79,119.06c-.21-3.45-2.83-4.86-5.4-6.25-9.43-5.09-19.51-8.58-29.88-10.97-13.08-3.01-26.23-5.69-39.76-6.26-10.22-.44-20.05,.7-29.65,4.15-2.1,.76-3.79,1.94-4.41,4.23-2.68,4.55-.71,8.18,4.52,8.1,4.43-.07,8.87-.35,13.3-.63,4.51-.29,9.02-.93,13.53-1.01,4.62-.09,9.26,.2,13.88,.54,3.84,.28,7.69,.65,11.46,1.36,7.33,1.37,14.27,4.06,21.22,6.7,5.87,2.23,11.78,4.34,17.65,6.56,3.36,1.27,6.84,1.11,10.31,.99,.84-.03,1.72-.33,2.5-.7,2.67-1.27,2.91-3.7,.74-6.8ZM151.7,97.19c6.23-.21,10.58-.32,14.92-.5,4.05-.17,8.12-.24,12.15-.67,5.46-.58,10.92-1.28,16.32-2.26,7.3-1.33,14.61-2.72,21.8-4.56,6.17-1.58,12.2-3.71,18.22-5.83,5.83-2.06,11.6-4.3,17.31-6.68,6.51-2.71,12.94-5.61,19.35-8.53,2.99-1.36,5.83-3.01,8.11-5.49,4.47-4.88,4.18-10.91,.93-15.09-2.02-2.6-4.48-4.79-7.84-5.73-1.48-.41-2.85-1.19-4.3-1.74-6.36-2.37-12.83-4.2-19.68-4.43-2.7-.09-5.38-.51-8.08-.62-4.73-.2-9.47-.46-14.19-.34-5.4,.14-10.79,.63-16.17,1.04-2.69,.2-5.4,.4-8.05,.89-6.16,1.14-12.29,2.49-18.44,3.69-12.59,2.46-24.68,6.37-36.24,11.94-6.05,2.92-11.56,6.6-16.7,10.89-3.77,3.15-6.5,6.84-7.01,11.9-.42,4.13-.4,8.21,2.42,11.57,4.03,4.8,9.2,8.02,15.3,9.38,3.84,.85,7.84,.96,9.89,1.18Zm22.77,33.92c3.3,.16,7.38-1.25,11.31-3.25,1.95-.99,3.44-2.47,4.54-4.36,1.2-2.08,1.55-4.1,.06-6.24-1.47-2.12-3.52-2.01-5.71-1.79-1.52,.15-3.08,.24-4.58,.06-5.99-.72-11.7-2.51-17.34-4.59-7.89-2.9-15.77-5.83-23.71-8.58-4.43-1.53-9.04-2.05-13.73-1.24-7.86,1.35-13.71,6.01-18.92,11.62-1.09,1.18-1.8,2.74-2.54,4.2-1.19,2.36-1.07,4.75,.63,6.81,1.75,2.13,4.09,2.67,6.8,2.18,3.41-.61,6.34-2.29,9.41-3.71,3.5-1.61,6.99-3.43,10.68-4.42,6.06-1.63,11.63,.32,16.87,3.45,3.9,2.33,7.84,4.62,11.88,6.69,4.09,2.1,8.52,3.13,14.35,3.16Z"
/>
<path
  className="h"
  d="M89.05,81.62c-.38,.96-.66,1.98-1.16,2.87-3.76,6.63-7.95,13.05-11.28,19.89-6.31,12.94-11.51,26.33-14.39,40.51-1.32,6.49-2.91,12.95-3.83,19.5-.83,5.89-1.03,11.89-1.27,17.84-.2,4.93-.1,9.87-.03,14.8,.11,7.03,1,13.98,2.12,20.92,1.26,7.81,2.94,15.52,5.42,23.03,1.87,5.67,3.92,11.3,6.27,16.79,2.09,4.87,4.6,9.57,7.09,14.26,3.45,6.49,7.68,12.46,12.08,18.35,4.76,6.39,10.25,12.08,15.97,17.55,6.07,5.8,12.61,11.01,19.79,15.47,6.24,3.88,12.59,7.47,19.31,10.43,9.31,4.1,18.91,7.32,28.93,9.13,6.53,1.18,13.07,2.36,19.76,2.4,3.66,.02,7.32,.57,10.97,.48,4.13-.1,8.25-.58,12.36-1.04,4.3-.49,8.58-1.12,12.86-1.74,7.76-1.13,15.32-3.16,22.64-5.9,6.96-2.61,13.87-5.41,20.54-8.67,9.99-4.88,19.39-10.84,28.11-17.76,4.15-3.29,8.12-6.81,12.1-10.32,2.82-2.49,5.69-4.96,8.25-7.71,3.61-3.88,6.9-8.04,10.42-12,4.76-5.36,8.73-11.28,12.61-17.27,5.83-9,11.11-18.3,15.03-28.32,2.21-5.66,4.72-11.23,6.58-17,2.1-6.5,3.6-13.19,5.41-19.78,.27-.99,.8-1.91,1.21-2.86,2.63,5.22,4.12,10.8,5.19,16.5,3.1,16.49,3.24,33.06,1.35,49.68-.78,6.82-1.65,13.63-2.51,20.44-.15,1.14-.47,2.27-.71,3.4-.8,.91-1.82,1.7-2.37,2.74-3.7,7.01-8.08,13.61-12.73,20-7.27,9.98-15.22,19.39-24.42,27.72-4.22,3.83-8.49,7.56-12.93,11.14-9.51,7.66-19.79,14.12-30.63,19.7-3.77,1.95-7.71,3.58-11.62,5.26-7.11,3.04-14.38,5.64-21.86,7.61-8.21,2.16-16.44,4.11-24.95,4.67-4.51,.3-9.01,.86-13.53,1.05-4.45,.18-8.91,.12-13.37,.01-3.56-.08-7.13-.34-10.68-.61-1.82-.14-3.64-.4-5.43-.74-4.54-.85-9.07-1.76-13.6-2.67-8.36-1.68-16.41-4.4-24.31-7.53-8.46-3.34-16.48-7.54-24.24-12.31-9.99-6.14-19.22-13.25-27.74-21.27-3.23-3.04-6.1-6.46-9.18-9.66-5.57-5.79-10.36-12.19-14.84-18.83-5.73-8.5-10.74-17.4-14.91-26.79-4.33-9.73-7.93-19.69-10.45-30.03-1.52-6.25-2.92-12.56-3.9-18.92-.95-6.17-1.33-12.42-1.9-18.64-.26-2.87-.41-5.76-.55-8.64-.06-1.25-.03-2.52,.05-3.77,.12-1.82,.43-3.63,.46-5.45,.07-4.06-.09-8.13,.07-12.19,.11-2.77,.4-5.57,.95-8.29,1.11-5.47,2.4-10.9,3.71-16.32,1.29-5.33,2.49-10.7,4.13-15.93,3.22-10.32,6.95-20.48,11.56-30.27,4.87-10.34,11.13-19.87,17.56-29.28,1.34-1.97,2.99-3.73,4.5-5.59Z"
/>
<path
  className="u"
  d="M89.05,81.62c-1.51,1.86-3.15,3.62-4.5,5.59-6.43,9.41-12.7,18.95-17.56,29.28-4.61,9.79-8.34,19.95-11.56,30.27-1.63,5.23-2.83,10.6-4.13,15.93-1.32,5.42-2.6,10.86-3.71,16.32-.55,2.72-.84,5.52-.95,8.29-.16,4.06,0,8.13-.07,12.19-.03,1.82-.34,3.63-.46,5.45-.08,1.25-.11,2.52-.05,3.77,.14,2.88,.29,5.77,.55,8.64,.57,6.22,.95,12.48,1.9,18.64,.98,6.36,2.37,12.67,3.9,18.92,2.52,10.33,6.12,20.3,10.45,30.03,4.18,9.39,9.19,18.29,14.91,26.79,4.47,6.64,9.26,13.05,14.84,18.83,3.08,3.2,5.95,6.62,9.18,9.66,8.52,8.01,17.75,15.13,27.74,21.27,7.76,4.76,15.78,8.96,24.24,12.31,7.9,3.12,15.95,5.84,24.31,7.53,4.53,.91,9.06,1.82,13.6,2.67,1.79,.34,3.61,.6,5.43,.74,3.56,.27,7.12,.53,10.68,.61,4.45,.1,8.92,.17,13.37-.01,4.52-.19,9.01-.75,13.53-1.05,8.51-.56,16.75-2.52,24.95-4.67,7.49-1.97,14.75-4.56,21.86-7.61,3.91-1.67,7.84-3.31,11.62-5.26,10.83-5.59,21.11-12.04,30.63-19.7,4.44-3.57,8.71-7.31,12.93-11.14,9.2-8.34,17.15-17.74,24.42-27.72,4.65-6.39,9.03-12.98,12.73-20,.55-1.04,1.57-1.83,2.37-2.74-.45,2.56-.73,5.16-1.38,7.66-3.68,14.19-5.55,28.62-6.06,43.25-.02,.68-.09,1.35-.14,2.02-2.97,3.66-5.77,7.49-8.96,10.94-4.2,4.54-8.6,8.92-13.13,13.14-6.36,5.92-13.17,11.32-20.28,16.34-8.78,6.21-18,11.68-27.7,16.32-14.71,7.03-30.05,12.22-46.09,15.25-7.11,1.34-14.22,2.61-21.47,2.95-2.99,.14-5.97,.35-8.95,.55-2.12,.14-4.25,.61-6.34,.43-7.2-.61-14.5,.09-21.62-1.56-.65-.15-1.35-.1-2.03-.14-.5-.36-.95-.91-1.5-1.04-1.68-.41-3.44-.52-5.1-.99-10.13-2.87-20.19-5.94-29.93-9.98-3.02-1.25-6.27-1.97-9.28-3.25-4.08-1.73-8.03-3.78-12.05-5.67-2.01-.95-4.16-1.66-6.04-2.8-6.28-3.79-12.48-7.71-18.68-11.61-1.22-.77-2.29-1.78-3.53-2.52-6.45-3.82-12.02-8.72-17.31-13.95-4.47-4.41-8.8-8.97-13.05-13.59-3-3.26-5.85-6.66-8.64-10.11-4.56-5.64-8.47-11.71-12.07-18.01-3.7-6.47-7.08-13.05-9.31-20.18-2.8-8.93-5.8-17.79-8.47-26.75-1.7-5.72-3.06-11.54-4.42-17.35-1.75-7.54-1.88-15.3-2.18-22.95-.38-9.53,.19-19.11,.5-28.66,.09-2.67,.67-5.33,1.03-8,.4-2.95,1.02-5.89,1.17-8.86,.35-7.15,1.72-14.12,3.43-21.04,.44-1.76,.79-3.55,1.18-5.33-.26-2.51,.81-4.77,1.68-6.95,2.4-6,4.84-12.02,7.74-17.79,4.95-9.84,10.62-19.27,17.11-28.22,6.82-9.41,14.25-18.27,22.57-26.38,.69-.67,1.44-1.27,2.17-1.91l.04,2.34c-.01,.19-.03,.37-.04,.56Z"
/>
<path
  className="c"
  d="M316.46,111.76c5.8,3.68,10.45,8.58,14.52,14.02,18.21,24.35,18.17,58.35-.21,83.42-11.51,15.69-26.91,25.49-46.17,28.49-34.07,5.31-64.22-14.97-74.02-45.73-1.97-6.2-3.22-12.53-3.11-19.08,.81-.27,1.7-.39,2.4-.82,5.16-3.18,10.27-6.44,15.43-9.63,2.71-1.67,5.48-3.24,8.21-4.87,5.45-3.26,10.91-6.52,16.35-9.81,3.38-2.04,6.67-4.21,10.08-6.2,4.66-2.71,9.39-5.32,14.09-7.95,5.47-3.05,10.89-6.2,16.45-9.09,7.62-3.96,15.35-7.73,23.05-11.56,.94-.47,1.95-.8,2.93-1.2Zm-37.77,60.09c.08-6.62-.99-12.37-4.33-17.66-3-4.75-8.43-7.22-13.92-5.97-7.02,1.59-10.89,6.67-13.68,12.67-2.69,5.78-3.39,12.01-3.15,18.38,.19,5.23,1.44,10.11,4.01,14.65,2.47,4.35,8.67,7.56,13.24,6.57,4.16-.91,7.79-3.12,10.31-6.53,4.95-6.68,7.69-14.21,7.51-22.11Z"
/>
<path
  className="b"
  d="M316.46,111.76c-.98,.4-1.99,.73-2.93,1.2-7.7,3.83-15.42,7.59-23.05,11.56-5.56,2.89-10.98,6.04-16.45,9.09-4.71,2.63-9.43,5.23-14.09,7.95-3.41,1.98-6.71,4.16-10.08,6.2-5.44,3.29-10.89,6.55-16.35,9.81-2.73,1.63-5.5,3.2-8.21,4.87-5.16,3.19-10.27,6.45-15.43,9.63-.7,.43-1.6,.56-2.4,.82-.59-6.14,.04-12.22,1.58-18.12,7.26-27.77,24.6-45.9,52.39-53.65,8.27-2.31,16.81-2.84,25.34-1.54,10.48,1.59,20.16,5.29,28.88,11.38,.31,.21,.54,.53,.8,.81Z"
/>
<path
  className="g"
  d="M374.38,172.89c.44-1.02,1.25-2.02,1.27-3.05,.11-7.35,.43-14.73-.03-22.05-.72-11.32-2.37-22.55-5.37-33.54-2.56-9.42-5.59-18.65-9.86-27.45-.32-.66-.28-1.49-.4-2.24,3.17,3.62,6.46,7.15,9.49,10.89,9.06,11.16,16.62,23.27,22.61,36.34,1.19,2.6,2.25,5.27,3.37,7.91-.11,.9-.45,1.84-.31,2.7,.62,3.79,1.47,7.54,2.05,11.34,.73,4.84,1.35,9.7,1.89,14.56,.44,3.91,.69,7.84,1.02,11.76,.02,.28-.06,.57-.08,.86-.16,1.62-.39,3.24-.45,4.87-.23,6.36-.37,12.72-.63,19.07-.1,2.49-.35,4.99-.68,7.46-.47,3.52-.97,7.04-1.63,10.52-1.08,5.66-2.29,11.29-3.51,16.93-.04,.21-.66,.29-1.01,.43-.23-5.21-.37-10.42-.7-15.63-1.09-17.06-5.97-32.99-14.55-47.78-.77-1.33-1.64-2.6-2.47-3.9Z"
/>
<path
  className="w"
  d="M392.1,240.2c.35-.14,.97-.22,1.01-.43,1.21-5.63,2.43-11.27,3.51-16.93,.66-3.48,1.17-7,1.63-10.52,.33-2.48,.58-4.97,.68-7.46,.26-6.35,.4-12.71,.63-19.07,.06-1.63,.3-3.25,.45-4.87,.03-.29,.11-.58,.08-.86-.32-3.92-.58-7.85-1.02-11.76-.54-4.86-1.16-9.72-1.89-14.56-.58-3.79-1.43-7.55-2.05-11.34-.14-.86,.19-1.8,.31-2.7,1.33,3.09,2.79,6.13,3.97,9.27,4.35,11.61,7.31,23.6,9.28,35.81,1.13,7.03,1.99,14.13,1.97,21.3-.01,3.85,.55,7.72,.43,11.56-.28,8.76-.86,17.5-2.09,26.21-1.78,12.57-4.74,24.83-8.95,36.77-4.61,13.06-10.35,25.63-17.49,37.52-.24,.4-.66,.68-1,1.02-.19-4.58,1.21-8.94,2.01-13.37,1.64-9.01,3.89-17.93,5.23-26.98,1.85-12.5,3.37-25.07,3.17-37.76,0-.29,.07-.57,.11-.86Z"
/>
<path
  className="t"
  d="M365.74,180.92c-.38,1.47-.69,2.97-1.14,4.42-1.48,4.72-3.73,8.92-8.17,11.53-1.07,.63-2.26,1.28-3.45,1.39-1.54,.15-2.25,.91-2.7,2.18-2.86,8.1-7.29,15.33-12.58,22.02-5.93,7.49-13.13,13.57-21.27,18.55-8.41,5.15-17.46,8.67-27.18,10.38-2.65,.47-5.34,.67-8.02,.97-3.25,.36-6.49,.21-9.76,.07-7.33-.3-14.33-1.96-21.08-4.66-5.57-2.23-10.82-5.11-15.55-8.86-5.8-4.6-10.66-10.04-14.44-16.41-.5-.83-.53-1.94-.78-2.92,3.56,3.26,6.91,6.79,10.72,9.72,13.89,10.66,29.8,15.95,47.18,14.64,31.85-2.4,54.04-18.93,66.92-48.04,.47-1.05,.88-2.13,1.36-3.29,.99,0,1.94,.02,2.89,0,6.25-.17,9.25-2.97,9.63-9.2,.15-2.41-.01-4.83-.03-7.25,0-.93,0-1.87,0-3.21,3.25,2.31,5.65,4.84,7.43,7.95Z"
/>
<path
  className="f"
  d="M389.98,235.79c-.53,6.2-.97,11.58-1.47,16.96-.09,.95-.27,1.95-.67,2.8-.28,.6-.93,1.26-1.53,1.41-.95,.23-1.32-.61-1.38-1.45-.16-2.11-.37-4.23-.41-6.34-.07-3.17-.01-6.34-.03-9.51-.01-1.84,.04-3.68-.11-5.51-1.02-12.41-2.07-24.83-6.24-36.69-1.92-5.46-3.89-10.93-7.01-15.88-.87-1.38-1.56-2.91-2.15-4.43-.66-1.71-.28-3.11,.75-3.63,1.1-.55,2.52-.22,3.51,1.24,1.67,2.47,3.39,4.97,4.61,7.68,2.15,4.75,4.32,9.55,5.77,14.54,1.82,6.28,3.23,12.72,4.26,19.18,1.07,6.75,1.48,13.6,2.1,19.65Z"
/>
<path
  className="ac"
  d="M310.58,101.37c-1.41-.61-2.81-1.26-4.24-1.82-5.57-2.17-11.18-4.17-17.22-4.63-3.93-.29-7.85-1.08-11.76-1.02-4.4,.07-8.81,.69-13.17,1.34-9.3,1.39-17.74,5.11-25.74,9.92-1.23,.74-2.31,1.72-3.46,2.58,.35-1.99-1.71-2.63-2.3-4.1,1.28-1.12,2.48-2.35,3.86-3.32,3.18-2.26,6.7-3.91,10.51-4.73,5.17-1.12,10.4-1.92,15.57-3.03,5.08-1.09,10.1-2.45,15.18-3.58,2.15-.48,4.35-.82,6.55-.95,6.5-.39,12.61,1.29,18.58,3.68,1.79,.72,3.58,1.4,5.38,2.1,2.4,1.58,3.35,4.74,2.28,7.56Z"
/>
<path
  className="aa"
  d="M232.7,103.66c.59,1.46,2.65,2.11,2.3,4.1-.32,0-.65,0-.97,0-1.18-1.76-2.35-3.52-3.53-5.28-.4-4.09,1.64-6.95,4.98-8.79,2.25-1.24,4.78-2.3,7.29-2.67,9.4-1.37,18.14-4.57,26.68-8.56,5.57-2.6,11.42-4.33,17.68-3.8,11.17,.94,19.92,5.91,25.46,15.81,1.46,2.61,2.17,5.59,.89,8.62-.96-.58-1.93-1.16-2.89-1.74,1.08-2.83,.12-5.99-2.28-7.56-.38-.85-.58-1.84-1.16-2.52-2.2-2.59-4.81-4.75-7.73-6.49-5.15-3.07-10.8-4.26-16.68-3.61-5.98,.66-11.54,2.97-17.01,5.4-5.83,2.59-11.81,4.64-18.17,5.58-3.03,.44-6.04,1.23-8.94,2.22-4.33,1.47-6.72,4.41-5.92,9.27Z"
/>
<path
  className="v"
  d="M357.59,153.09c2.59,.76,4.16,2.78,5.37,4.92,.87,1.54,1.08,3.45,1.58,5.19-1.09-.6-2.17-1.23-3.28-1.8-1.11-.57-2.24-1.07-3.66-1.74v-6.56Z"
/>
<path
  className="f"
  d="M355.75,152.34c.03,1.3-1.81,2.42-2.96,1.67-1.2-.78-2.3-1.74-3.32-2.74-.76-.75-.24-2.09,.86-2.56,1.8-.76,5.39,1.64,5.43,3.63Z"
/>
<path
  className="x"
  d="M230.5,102.49c1.18,1.76,2.35,3.52,3.53,5.28-.75,.61-1.5,1.22-2.25,1.83-1.75-2.13-2.78-4.4-1.27-7.11Z"
/>
<path className="t" d="M219.59,219.55l-.83-.92,.83,.92Z" />
<path
  className="n"
  d="M37.78,159.95c-.39,1.78-.74,3.56-1.18,5.33-1.71,6.92-3.08,13.89-3.43,21.04-.15,2.97-.77,5.91-1.17,8.86-.36,2.66-.94,5.32-1.03,8-.3,9.55-.87,19.13-.5,28.66,.3,7.66,.43,15.41,2.18,22.95,1.35,5.81,2.71,11.64,4.42,17.35,2.67,8.96,5.67,17.83,8.47,26.75,2.24,7.13,5.62,13.72,9.31,20.18,3.6,6.3,7.52,12.37,12.07,18.01,2.78,3.45,5.64,6.85,8.64,10.11,4.25,4.62,8.58,9.18,13.05,13.59,5.29,5.22,10.86,10.13,17.31,13.95,1.24,.73,2.31,1.75,3.53,2.52,6.21,3.9,12.41,7.82,18.68,11.61,1.89,1.14,4.03,1.85,6.04,2.8,4.02,1.89,7.96,3.94,12.05,5.67,3.01,1.28,6.26,2,9.28,3.25,9.74,4.04,19.8,7.11,29.93,9.98,1.66,.47,3.42,.58,5.1,.99,.55,.13,1,.68,1.5,1.04-3.24-.39-6.52-.59-9.72-1.19-9.01-1.69-17.98-3.6-26.61-6.72-6.98-2.53-13.87-5.34-20.69-8.3-9.05-3.93-17.66-8.74-25.7-14.43-5.74-4.05-11.15-8.58-16.62-13-3.07-2.48-6.13-5.02-8.91-7.82-3.73-3.76-7.16-7.83-10.77-11.71-4.62-4.96-8.67-10.35-12.41-15.97-2.98-4.49-5.96-9-8.71-13.64-6.07-10.26-10.81-21.16-14.7-32.39-2.93-8.46-5.47-17.06-6.92-25.94-.93-5.69-1.98-11.36-2.78-17.06-.44-3.14-.61-6.33-.64-9.5-.09-7.45-.22-14.9,.04-22.34,.18-5.08,.87-10.15,1.54-15.19,.7-5.24,1.34-10.51,2.55-15.64,1.65-7.03,3.8-13.94,5.78-20.89,.1-.37,.66-.6,1-.9Z"
/>
<path
  className="h"
  d="M89.09,81.05l-.04-2.34c1.54-1.37,3.09-2.74,4.63-4.1-.63,2.79-2.07,5-4.59,6.44Z"
/>
<path
  className="e"
  d="M151.7,97.19c-2.05-.23-6.05-.33-9.89-1.18-6.09-1.35-11.27-4.58-15.3-9.38-2.83-3.37-2.84-7.45-2.42-11.57,.51-5.05,3.25-8.75,7.01-11.9,5.14-4.29,10.65-7.97,16.7-10.89,11.56-5.58,23.66-9.49,36.24-11.94,6.15-1.2,12.28-2.55,18.44-3.69,2.65-.49,5.36-.68,8.05-.89,5.39-.41,10.78-.9,16.17-1.04,4.72-.12,9.46,.14,14.19,.34,2.7,.11,5.38,.53,8.08,.62,6.85,.23,13.33,2.06,19.68,4.43,1.45,.54,2.82,1.32,4.3,1.74,3.36,.94,5.82,3.13,7.84,5.73,3.25,4.18,3.54,10.21-.93,15.09-2.28,2.49-5.11,4.13-8.11,5.49-6.42,2.92-12.85,5.82-19.35,8.53-5.71,2.38-11.48,4.62-17.31,6.68-6.01,2.12-12.05,4.25-18.22,5.83-7.18,1.84-14.49,3.24-21.8,4.56-5.4,.98-10.86,1.68-16.32,2.26-4.03,.43-8.1,.5-12.15,.67-4.34,.18-8.69,.3-14.92,.5Z"
/>
<path
  className="d"
  d="M255.64,284.9c2.17,3.1,1.93,5.53-.74,6.8-.77,.37-1.65,.67-2.5,.7-3.47,.12-6.95,.28-10.31-.99-5.87-2.22-11.78-4.33-17.65-6.56-6.95-2.64-13.89-5.33-21.22-6.7-3.77-.71-7.63-1.08-11.46-1.36-4.62-.34-9.26-.62-13.88-.54-4.51,.08-9.02,.72-13.53,1.01-4.43,.29-8.86,.57-13.3,.63-5.24,.08-7.2-3.54-4.52-8.1l.88,2.02c1.11,2.08,1.34,2.23,3.27,1.79,1.22-.28,2.44-.61,3.63-.99,10.44-3.33,21.19-3.49,31.93-2.61,12.17,1,24.12,3.51,35.87,6.81,9.12,2.56,18.21,5.3,26.46,10.19,.92,.55,2.2,.49,3.31,.71,2.23,.36,3.17-1,3.75-2.83Z"
/>
<path
  className="ab"
  d="M174.47,131.11c-5.83-.03-10.25-1.06-14.35-3.16-4.04-2.07-7.98-4.36-11.88-6.69-5.25-3.13-10.81-5.08-16.87-3.45-3.69,.99-7.18,2.81-10.68,4.42-3.07,1.41-6,3.1-9.41,3.71-2.71,.48-5.05-.06-6.8-2.18-1.7-2.06-1.81-4.45-.63-6.81,.74-1.46,1.45-3.02,2.54-4.2,5.21-5.61,11.05-10.27,18.92-11.62,4.7-.81,9.3-.29,13.73,1.24,7.94,2.75,15.82,5.68,23.71,8.58,5.64,2.07,11.35,3.87,17.34,4.59,1.51,.18,3.07,.1,4.58-.06,2.19-.22,4.24-.32,5.71,1.79,1.49,2.14,1.14,4.16-.06,6.24-1.1,1.9-2.59,3.37-4.54,4.36-3.93,2-8.01,3.41-11.31,3.25Zm12.85-8.84c1.87-2.97,1.19-4.35-2.3-4.64-.1,0-.19,0-.29,0-2.87-.25-5.78-.31-8.62-.78-7.94-1.31-15.42-4.13-22.93-6.92-7.02-2.61-13.93-5.55-21.55-6.46-4.06-.48-7.66,.27-11.22,1.72-5.03,2.05-8.93,5.69-12.51,9.65-.67,.74-.95,1.85-1.4,2.78-.99,1.52-1,3.24-.07,4.6,1.03,1.51,2.92,1.42,4.54,1.1,1.5-.3,2.98-.81,4.37-1.44,3.96-1.79,7.81-3.84,11.81-5.52,4.26-1.78,8.72-2.24,13.31-1.14,4.29,1.03,8.03,3.15,11.8,5.33,5.17,2.97,10.2,6.28,16.32,7.19,5.8,.86,11.38,.46,16.48-2.68,.96-.59,1.52-1.85,2.27-2.8Z"
/>
<path
  className="ab"
  d="M166.45,160.03c-.44,5.31-1.31,10.52-3.52,15.44-1.72,3.84-3.95,7.31-7.14,10.08-4.13,3.59-8.76,5.66-14.37,4.08-3.18-.89-5.7-2.78-7.73-5.34-3.61-4.56-5.1-9.89-5.64-15.55-.09-.96-.13-1.92-.2-2.89v-.61c.07-1.53,.15-3.06,.23-4.59,.13-.25,.34-.49,.38-.75,.81-5.52,2.77-10.56,5.75-15.3,2.06-3.28,4.65-5.9,7.98-7.77,5.71-3.21,12.04-2.33,16.77,2.24,2.69,2.61,4.44,5.79,5.64,9.31,1.28,3.78,1.66,7.7,1.86,11.65Zm-2.78-.24c-.25-1.71-.61-3.41-.73-5.13-.27-4.16-1.7-7.88-4.02-11.3-3.76-5.53-10.74-7.21-16.31-3.61-3.15,2.04-5.9,4.72-7.63,8.15-2.31,4.59-3.78,9.37-4.22,14.61-.32,3.83,.02,7.47,.81,11.1,.92,4.2,2.59,8.11,6.13,10.9,2,1.58,4.1,2.81,6.8,2.83,4.98,.05,8.8-2.29,11.69-6,4.91-6.28,7.15-13.58,7.47-21.56Z"
/>
<path
  className="p"
  d="M255.64,284.9c-.58,1.83-1.52,3.19-3.75,2.83,1.82-2.66,1.58-3.72-1-5.37-6.87-4.37-14.63-6.55-22.25-9.04-9.65-3.16-19.6-5.24-29.61-6.81-6.56-1.03-13.23-1.49-19.88-1.85-3.74-.21-7.52,.26-11.28,.47-5.04,.29-9.98,1.2-14.71,2.99-2.15,.82-4.42,1.57-5.75,3.71l-.88-2.02c.63-2.29,2.31-3.47,4.41-4.23,9.59-3.45,19.43-4.59,29.65-4.15,13.53,.58,26.68,3.25,39.76,6.26,10.38,2.39,20.45,5.88,29.88,10.97,2.57,1.39,5.19,2.79,5.4,6.25Z"
/>
<path
  className="v"
  d="M166.45,160.03c-.2-3.95-.58-7.88-1.86-11.65-1.19-3.52-2.94-6.7-5.64-9.31-4.72-4.57-11.05-5.46-16.77-2.24-3.33,1.87-5.92,4.5-7.98,7.77-2.98,4.73-4.94,9.78-5.75,15.3-.04,.26-.25,.5-.38,.75-.22-.6-.68-1.23-.62-1.8,.26-2.67,.42-5.39,1.08-7.96,1.01-3.91,2.31-7.74,4.43-11.25,2.55-4.22,5.75-7.75,10.28-9.82,7.42-3.4,13.63-1.18,18.19,5.14,3.35,4.63,5.5,9.79,5.91,15.44,.23,3.18-.57,6.43-.91,9.64Z"
/>
<path
  className="v"
  d="M127.84,165.24v.61c-.06-.14-.14-.28-.18-.43-.01-.04,.12-.12,.18-.18Z"
/>
<path
  className="o"
  d="M278.68,171.86c.17,7.9-2.57,15.43-7.51,22.11-2.52,3.4-6.15,5.62-10.31,6.53-4.57,.99-10.77-2.22-13.24-6.57-2.57-4.54-3.82-9.42-4.01-14.65-.24-6.37,.46-12.6,3.15-18.38,2.79-6,6.67-11.07,13.68-12.67,5.49-1.25,10.92,1.22,13.92,5.97,3.34,5.29,4.4,11.04,4.33,17.66Zm-15.74-21.73c-.39,.08-1.25,.22-2.07,.45-2.96,.84-5.29,2.42-7.22,4.95-2.85,3.72-4.64,7.88-5.18,12.37-.87,7.32,1.6,13.65,7.05,18.74,3,2.79,7.88,3.25,11.28,1.05,4.44-2.89,6.96-7.08,8.33-12.07,1.06-3.85,1.34-7.77,.49-11.66-.7-3.19-1.47-6.45-3.7-9.01-2.25-2.57-4.74-4.86-8.98-4.81Z"
/>
<path
  className="k"
  d="M232.7,103.66c-.8-4.86,1.59-7.8,5.92-9.27,2.9-.99,5.91-1.78,8.94-2.22,6.36-.93,12.34-2.99,18.17-5.58,5.47-2.43,11.03-4.74,17.01-5.4,5.88-.65,11.53,.54,16.68,3.61,2.92,1.74,5.52,3.9,7.73,6.49,.58,.68,.78,1.67,1.16,2.52-1.79-.7-3.59-1.38-5.38-2.1-5.96-2.39-12.08-4.07-18.58-3.68-2.2,.13-4.4,.48-6.55,.95-5.07,1.13-10.1,2.49-15.18,3.58-5.17,1.11-10.4,1.92-15.57,3.03-3.81,.82-7.33,2.47-10.51,4.73-1.38,.98-2.58,2.21-3.86,3.32Z"
/>
<path
  className="y"
  d="M147.41,271.82c1.33-2.14,3.59-2.89,5.75-3.71,4.73-1.79,9.66-2.7,14.71-2.99,3.76-.21,7.54-.68,11.28-.47,6.64,.37,13.31,.82,19.88,1.85,10.01,1.57,19.96,3.65,29.61,6.81,7.62,2.49,15.38,4.67,22.25,9.04,2.59,1.65,2.82,2.71,1,5.37-1.11-.22-2.39-.17-3.31-.71-8.25-4.9-17.34-7.63-26.46-10.19-11.75-3.3-23.7-5.81-35.87-6.81-10.74-.88-21.49-.72-31.93,2.61-1.2,.38-2.41,.71-3.63,.99-1.93,.44-2.16,.29-3.27-1.79Z"
/>
<path
  className="ac"
  d="M187.32,122.27c-.74,.95-1.3,2.21-2.27,2.8-5.09,3.14-10.67,3.54-16.48,2.68-6.11-.91-11.15-4.22-16.32-7.19-3.78-2.17-7.51-4.3-11.8-5.33-4.58-1.1-9.04-.65-13.31,1.14-4.01,1.67-7.85,3.72-11.81,5.52-1.39,.63-2.88,1.14-4.37,1.44-1.63,.33-3.51,.41-4.54-1.1-.93-1.36-.92-3.08,.07-4.6,1.58-.42,3.25-.63,4.71-1.31,4.99-2.3,10.09-4.23,15.33-5.93,5.74-1.86,11.28-2.21,16.9,.1,3.21,1.32,6.44,2.58,9.61,3.98,4.59,2.02,9.03,4.41,13.72,6.16,6.63,2.49,13.46,4.16,20.55,1.64Z"
/>
<path
  className="k"
  d="M187.32,122.27c-7.09,2.52-13.92,.85-20.55-1.64-4.68-1.76-9.13-4.14-13.72-6.16-3.17-1.4-6.4-2.66-9.61-3.98-5.62-2.31-11.17-1.96-16.9-.1-5.24,1.7-10.34,3.63-15.33,5.93-1.46,.67-3.13,.88-4.71,1.31,.46-.94,.73-2.04,1.4-2.78,3.59-3.96,7.49-7.6,12.51-9.65,3.56-1.45,7.16-2.21,11.22-1.72,7.61,.91,14.52,3.84,21.55,6.46,7.51,2.79,15,5.61,22.93,6.92,2.84,.47,5.74,.53,8.62,.78,.1,0,.19,0,.29,0,3.49,.29,4.18,1.67,2.3,4.64Z"
/>
<path
  className="ac"
  d="M163.66,159.79c-.32,7.98-2.56,15.28-7.47,21.56-2.89,3.7-6.71,6.04-11.69,6-2.7-.03-4.8-1.26-6.8-2.83-3.54-2.79-5.21-6.7-6.13-10.9-.79-3.63-1.13-7.27-.81-11.1,.44-5.24,1.91-10.02,4.22-14.61,1.73-3.43,4.47-6.11,7.63-8.15,5.57-3.6,12.55-1.92,16.31,3.61,2.32,3.41,3.75,7.14,4.02,11.3,.11,1.72,.48,3.42,.73,5.13Zm-28.75-.41c.25,5.72,2.05,11.15,6.86,15.25,2.63,2.24,5.56,2.81,8.89,1.69,4.38-1.47,7.02-4.64,8.64-8.74,1.66-4.21,2.67-8.46,1.97-13.17-.59-3.96-1.76-7.43-4.28-10.49-4.72-5.75-11.1-5.69-16.21-.27-3.95,4.2-5.67,9.53-5.87,15.72Z"
/>
<path
  className="m"
  d="M262.94,150.13c4.25-.05,6.74,2.24,8.98,4.81,2.23,2.55,3,5.82,3.7,9.01,.85,3.89,.57,7.82-.49,11.66-1.37,4.98-3.89,9.18-8.33,12.07-3.39,2.2-8.28,1.75-11.28-1.05-5.46-5.09-7.92-11.41-7.05-18.74,.53-4.49,2.33-8.65,5.18-12.37,1.93-2.52,4.26-4.11,7.22-4.95,.83-.23,1.68-.37,2.07-.45Z"
/>
<path
  className="l"
  d="M134.91,159.38c.2-6.19,1.92-11.53,5.87-15.72,5.11-5.43,11.49-5.48,16.21,.27,2.51,3.06,3.69,6.53,4.28,10.49,.7,4.71-.31,8.96-1.97,13.17-1.62,4.09-4.26,7.27-8.64,8.74-3.33,1.12-6.27,.55-8.89-1.69-4.81-4.1-6.61-9.53-6.86-15.25Z"
/>
</svg>



export const PrimaryTools = React.memo(function PrimaryTools(): JSX.Element {
  const app = useTldrawApp()
  const activeTool = app.useStore(activeToolSelector)
  const isToolLocked = app.useStore(toolLockedSelector)
  // console.log(app.useStore(s=>s.document.pages.page.bindings))
  // console.log('asdfasdf')
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
    // app.selectSticker(ReactDOM.renderToString(svg))
    // app.selectTool(TDShapeType.Sticker)
    app.selectTool(TDShapeType.Connector)
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
        <ArrowRightIcon></ArrowRightIcon>
      </ToolButtonWithTooltip>
    </Panel>
  )
})


