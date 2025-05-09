import { z } from 'zod'

export const createTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: '标签名不可为空' })
    .max(17, { message: '单个标签最大 17 个字符' }),
  introduction: z
    .string()
    .trim()
    .max(10007, { message: '标签的介绍最大 10007 个字符' })
    .optional(),
  alias: z.array(
    z
      .string()
      .trim()
      .min(1, { message: '标签名不可为空' })
      .max(17, { message: '单个标签的别名最大 17 个字符' })
  )
})

export const updateTagSchema = createTagSchema.merge(
  z.object({
    tagId: z.coerce.number().min(1).max(9999999)
  })
)

export const getTagSchema = z.object({
  page: z.coerce.number().min(1).max(9999999),
  limit: z.coerce.number().min(1).max(100)
})

export const getTagByIdSchema = z.object({
  tagId: z.coerce.number().min(1).max(9999999)
})

export const getPatchByTagSchema = z.object({
  tagId: z.coerce.number().min(1).max(9999999),
  page: z.coerce.number().min(1).max(9999999),
  limit: z.coerce.number().min(1).max(24),
  sortField: z.union([
    z.literal('resource_update_time'),
    z.literal('created'),
    z.literal('view'),
    z.literal('download')
  ])
})
