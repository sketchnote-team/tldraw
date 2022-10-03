import type { Patch, TDShape, TldrawCommand, TDBinding } from '~types'
import type { TldrawApp } from '../../internal'

export function createShapes(
  app: TldrawApp,
  shapes: TDShape[],
  bindings: TDBinding[] = [],
  sections: any[] = []
): TldrawCommand {
  const { currentPageId } = app
  const beforeShapes: Record<string, Patch<TDShape> | undefined> = {}
  const afterShapes: Record<string, Patch<TDShape> | undefined> = {}
  const beforeSections: Record<string, string[] | undefined> = {}
  const afterSections: Record<string, string[] | undefined> = {}

  shapes.forEach((shape) => {
    beforeShapes[shape.id] = undefined
    afterShapes[shape.id] = shape
  })

  Object.keys(sections).forEach((section) => {
    beforeSections[section] = undefined
    afterSections[section] = sections[section]
  })
  
  
  const beforeBindings: Record<string, Patch<TDBinding> | undefined> = {}
  const afterBindings: Record<string, Patch<TDBinding> | undefined> = {}

  bindings.forEach((binding) => {
    beforeBindings[binding.id] = undefined
    afterBindings[binding.id] = binding
  })

  return {
    id: 'create',
    before: {
      document: {
        pages: {
          [currentPageId]: {
            shapes: beforeShapes,
            bindings: beforeBindings,
            sections: beforeSections
          },
        },
        pageStates: {
          [currentPageId]: {
            selectedIds: [...app.selectedIds],
          },
        },
      },
    },
    after: {
      document: {
        pages: {
          [currentPageId]: {
            shapes: afterShapes,
            bindings: afterBindings,
            sections: afterSections
          },
        },
        pageStates: {
          [currentPageId]: {
            selectedIds: shapes.map((shape) => shape.id),
          },
        },
      },
    },
  }
}