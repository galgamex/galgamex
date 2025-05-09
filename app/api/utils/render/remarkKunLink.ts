import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Node } from 'unist'

export const remarkKunLink: Plugin<[], Node> = () => {
  return (tree) => {
    visit(tree, (node: any) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        if (node.name !== 'kun-link') return

        const data = node.data || (node.data = {})
        const attributes = node.attributes || {}

        data.hName = 'div'
        data.hProperties = {
          'data-kun-link': '',
          'data-href': attributes.href,
          'data-text': attributes.text,
          className: 'w-full'
        }
      }
    })
  }
}
