import { $remark } from '@milkdown/utils'
import directive from 'remark-directive'

export const remarkDirective = $remark('remarkDirective', () => directive)
