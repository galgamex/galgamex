export const resourceTypes = [
  {
    value: 'pc',
    label: 'Galgame',
    description: 'Galgame游戏'
  },
  {
    value: 'mobile',
    label: '同人游戏',
    description: '类似RPG,SLG,ACT等游戏'
  },
  {
    value: 'row',
    label: '生肉',
    description: '没有中文翻译, 仅有日语或其它语言的 Galgame'
  },
  {
    value: 'chinese',
    label: '汉化',
    description: '汉化 Galgame 下载资源, 有简体中文或繁体中文支持'
  },
  {
    value: 'patch',
    label: '补丁',
    description: '与这个 Galgame 相关的补丁资源'
  },
  {
    value: 'emulator',
    label: '模拟器资源',
    description:
      '可以在手机模拟器, 例如 KiriKiri, ONS, Tyranor 等模拟器中运行的 Galgame 游戏'
  },
  {
    value: 'app',
    label: 'APK',
    description: '可以直接在手机安装并游玩的 Galgame'
  },
  {
    value: 'tool',
    label: '游戏工具',
    description: '辅助游玩 Galgame 的工具, 例如 KRKR 模拟器, Magpie 等'
  },
  {
    value: 'notice',
    label: '官方通知',
    description: '由官方发布的站点通知'
  },
  {
    value: 'other',
    label: '其它',
    description: '其它内容'
  }
]

export const SUPPORTED_TYPE = [
  'pc',
  'chinese',
  'mobile',
  'emulator',
  'row',
  'app',
  'patch',
  'tool',
  'notice',
  'other'
]
export const SUPPORTED_TYPE_MAP: Record<string, string> = {
  all: '全部类型',
  pc: 'Galgame',
  chinese: '汉化',
  mobile: '同人游戏',
  emulator: '模拟器资源',
  row: '生肉',
  app: 'APK',
  patch: '补丁',
  tool: '游戏工具',
  notice: '官方通知',
  other: '其它'
}
export const ALL_SUPPORTED_TYPE = ['all', ...SUPPORTED_TYPE]

export const SUPPORTED_LANGUAGE = ['zh-Hans', 'zh-Hant', 'ja', 'en', 'other']
export const ALL_SUPPORTED_LANGUAGE = ['all', ...SUPPORTED_LANGUAGE]
export const SUPPORTED_LANGUAGE_MAP: Record<string, string> = {
  all: '全部语言',
  'zh-Hans': '简体中文',
  'zh-Hant': '繁體中文',
  ja: '日本語',
  en: 'English',
  other: '其它'
}

export const SUPPORTED_PLATFORM = [
  'windows',
  'android',
  'macos',
  'ios',
  'linux',
  'other'
]
export const ALL_SUPPORTED_PLATFORM = ['all', ...SUPPORTED_PLATFORM]
export const SUPPORTED_PLATFORM_MAP: Record<string, string> = {
  all: '全部平台',
  windows: 'Windows',
  android: 'Android',
  macos: 'MacOS',
  ios: 'iOS',
  linux: 'Linux',
  other: '其它'
}

export const SUPPORTED_RESOURCE_LINK = ['galgamex', 's3', 'baidu', 'aliyun', 'quark', '123pan', 'lanzou', 'onedrive', 'googledrive', 'uc', 'cmcloud', 'thunder', 'weiyun', 'user']

export const storageTypes = [
  {
    value: 'galgamex',
    label: 'Galgamex 资源盘 (官方可用)',
    description: '此选项用于官方发布 Galgame 下载资源'
  },
  {
    value: 's3',
    label: '对象存储 (<100MB, 创作者可用)',
    description: '此选项适合 <100MB 的补丁, 稳定, 永远不会失效过期'
  },
  {
    value: 'baidu',
    label: '百度网盘',
    description: '使用百度网盘存储和分享资源'
  },
  {
    value: 'aliyun',
    label: '阿里云盘',
    description: '使用阿里云盘存储和分享资源'
  },
  {
    value: 'quark',
    label: '夸克网盘',
    description: '使用夸克网盘存储和分享资源'
  },
  {
    value: '123pan',
    label: '123网盘',
    description: '使用123网盘存储和分享资源'
  },
  {
    value: 'lanzou',
    label: '蓝奏云',
    description: '使用蓝奏云存储和分享资源'
  },
  {
    value: 'onedrive',
    label: 'OneDrive',
    description: '使用微软OneDrive存储和分享资源'
  },
  {
    value: 'googledrive',
    label: 'Google Drive',
    description: '使用Google Drive存储和分享资源'
  },
  {
    value: 'uc',
    label: 'UC网盘',
    description: '使用UC网盘存储和分享资源'
  },
  {
    value: 'cmcloud',
    label: '中国移动云盘',
    description: '使用中国移动云盘存储和分享资源'
  },
  {
    value: 'thunder',
    label: '迅雷云盘',
    description: '使用迅雷云盘存储和分享资源'
  },
  {
    value: 'weiyun',
    label: '腾讯微云',
    description: '使用腾讯微云存储和分享资源'
  },
  {
    value: 'user',
    label: '自定义链接 (>100MB)',
    description: '此选项适合 >100MB 的补丁, 这需要您自行提供下载链接'
  }
]

export const SUPPORTED_RESOURCE_LINK_MAP: Record<string, string> = {
  galgamex: 'Galgamex 资源盘',
  s3: '对象存储下载',
  baidu: '百度网盘下载',
  aliyun: '阿里云盘下载',
  quark: '夸克网盘下载',
  '123pan': '123网盘下载',
  lanzou: '蓝奏云下载',
  onedrive: 'OneDrive下载',
  googledrive: 'Google Drive下载',
  uc: 'UC网盘下载',
  cmcloud: '中国移动云盘下载',
  thunder: '迅雷云盘下载',
  weiyun: '腾讯微云下载',
  user: '自定义链接下载'
}

export const ALLOWED_MIME_TYPES = [
  'application/zip',
  'application/x-lz4',
  'application/x-rar-compressed'
]

export const ALLOWED_EXTENSIONS = ['.zip', '.rar', '.7z']

export const SUPPORTED_RESOURCE_SECTION = ['galgame', 'patch']

export const RESOURCE_SECTION_MAP: Record<string, string> = {
  galgame: '游戏资源',
  patch: '游戏补丁'
}
