import path from 'path'
import { readFile } from 'fs/promises'
import { getKv, setKv } from '~/lib/redis'
import type { AdminRedirectConfig } from '~/types/api/admin'

const REDIS_KEY = 'admin:config:redirect'

export const getRedirectConfig = async () => {
  const redirectJson = await getKv(REDIS_KEY)
  if (redirectJson) {
    return JSON.parse(redirectJson) as AdminRedirectConfig
  }

  const configPath = path.join(process.cwd(), 'config/redirect.json')
  const redirectJsonFile = (await readFile(
    configPath,
    'utf8'
  )) as unknown as string
  await setKv(REDIS_KEY, redirectJsonFile, 86400)

  return JSON.parse(redirectJsonFile) as AdminRedirectConfig
}
