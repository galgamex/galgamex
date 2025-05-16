'use client'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@nextui-org/react'
import { useSettingStore } from '~/store/settingStore'
import { Ban, ShieldCheck, CircleSlash } from 'lucide-react'
import type { JSX } from 'react'

const themeIconMap: Record<string, JSX.Element> = {
  sfw: <ShieldCheck className="size-5" />,
  nsfw: <Ban className="size-5" />,
  all: <CircleSlash className="size-5" />
}

export const NSFWSwitcher = () => {
  const settings = useSettingStore((state) => state.data)
  const setData = useSettingStore((state) => state.setData)

  const themeIcon = themeIconMap[settings.kunNsfwEnable] || themeIconMap['all']

  return (
    <Dropdown className="min-w-0">
      <DropdownTrigger>
        <div className="flex justify-between">
          <span>网站内容显示</span>
          <span className="text-default-700">{themeIcon}</span>
        </div>
      </DropdownTrigger>

      <DropdownMenu
        disallowEmptySelection
        selectedKeys={new Set([settings.kunNsfwEnable])}
        selectionMode="single"
        onSelectionChange={(key) => {
          const newSetting = key.anchorKey ?? 'sfw';
          if (newSetting !== settings.kunNsfwEnable) {
            localStorage.setItem('nsfw-setting-changed', 'true');
            localStorage.setItem('nsfw-setting-previous', settings.kunNsfwEnable);
            localStorage.removeItem('nsfw-banner-hidden');
          }
          setData({ kunNsfwEnable: newSetting });
          location.reload();
        }}
      >
        {['sfw', 'nsfw', 'all'].map((key) => (
          <DropdownItem
            startContent={themeIconMap[key]}
            textValue={key}
            key={key}
            className="text-default-700"
          >
            {key === 'sfw' && '仅显示 (内容安全) 的文章'}
            {key === 'nsfw' && '显示 (内容不安全) 的文章'}
            {key === 'all' && '同时显示 (内容安全) 和 (内容不安全) 的文章'}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
