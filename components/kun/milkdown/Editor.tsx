import { EditorProvider } from './EditorProvider'
import { MilkdownProvider } from '@milkdown/react'
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/react'

interface KunEditorProps {
  valueMarkdown: string
  saveMarkdown: (markdown: string) => void
  placeholder?: string
}

export const KunEditor = (props: KunEditorProps) => {
  return (
    <MilkdownProvider>
      <ProsemirrorAdapterProvider>
        <EditorProvider {...props} />
      </ProsemirrorAdapterProvider>
    </MilkdownProvider>
  )
}
