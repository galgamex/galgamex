import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import type { Plugin } from 'unified'
import type { Node } from 'unist'

export const remarkKunExternalLinks: Plugin<[], Node> = () => {
  return (tree) => {
    visit(tree, 'element', (node: any) => {
      if (node.tagName === 'a') {
        const href = node.properties?.href
        if (!href) {
          return
        }
        node.properties['data-kun-external-link'] = ''
        node.properties['data-href'] = href
        node.properties['data-text'] = toString(node)
      }
    })
  }
}
