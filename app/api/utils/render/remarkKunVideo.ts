import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Node } from 'unist'

export const remarkKunVideo: Plugin<[], Node> = () => {
  return (tree) => {
    visit(tree, (node: any) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        if (node.name !== 'kun-video') return

        const data = node.data || (node.data = {})
        const attributes = node.attributes || {}

        data.hName = 'div'
        data.hProperties = {
          'data-video-player': '',
          'data-src': attributes.src,
          className: 'w-full my-4 overflow-hidden shadow-lg rounded-xl'
        }
      }
    })
  }
}
