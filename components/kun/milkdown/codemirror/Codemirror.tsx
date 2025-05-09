import { FC, useEffect, useLayoutEffect, useRef } from 'react'
import { createCodeMirrorState, createCodeMirrorView } from './setup'

export interface CodemirrorProps {
  markdown: string
  setCmAPI: (api: { update: (markdown: string) => void }) => void
  onChange: (getString: () => string) => void
}

export const Codemirror: FC<CodemirrorProps> = ({
  markdown,
  setCmAPI,
  onChange
}) => {
  const divRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<ReturnType<typeof createCodeMirrorView>>(null)

  useLayoutEffect(() => {
    if (!divRef.current) {
      return
    }

    const editor = createCodeMirrorView({
      root: divRef.current,
      onChange,
      content: markdown
    })
    editorRef.current = editor

    setCmAPI({
      update: (markdown: string) => {
        const state = createCodeMirrorState({
          onChange,
          content: markdown
        })
        editor.setState(state)
      }
    })

    return () => {
      editor.destroy()
    }
  }, [onChange, setCmAPI])

  useEffect(() => {
    if (
      editorRef.current &&
      editorRef.current.state.doc.toString() !== markdown
    ) {
      const state = createCodeMirrorState({
        onChange,
        content: markdown
      })
      editorRef.current.setState(state)
    }
  }, [markdown, onChange])

  return (
    <div
      className="flex-1 overflow-y-scroll overscroll-none scrollbar-hide"
      ref={divRef}
    />
  )
}
