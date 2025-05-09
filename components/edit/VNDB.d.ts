export interface Title {
  title: string
  lang: 'ja' | 'zh-Hans' | 'en'
}

export interface VNDBData {
  id: number
  title: string
  titles: Title[]
  aliases: string[]
  languages: string[]
  platforms: string[]
}

export interface VNDB {
  title: string
  titles: Title[]
  aliases: string[]
  released: string
}

export interface VNDBResponse {
  more: boolean
  results: VNDB[]
}
