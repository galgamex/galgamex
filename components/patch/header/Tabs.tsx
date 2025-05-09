import { Tab, Tabs } from '@nextui-org/tabs'
import { IntroductionTab } from '~/components/patch/introduction/IntroductionTab'
import { ResourceTab } from '~/components/patch/resource/ResourceTab'
import { CommentTab } from '~/components/patch/comment/CommentTab'
import { CharacterTab } from '~/components/patch/character/CharacterTab'
import type { PatchIntroduction } from '~/types/api/patch'
import type { Dispatch, SetStateAction } from 'react'

interface PatchHeaderProps {
  id: number
  intro: PatchIntroduction
  selected: string
  setSelected: Dispatch<SetStateAction<string>>
}

export const PatchHeaderTabs = ({
  id,
  intro,
  selected,
  setSelected
}: PatchHeaderProps) => {
  return (
    <div className="min-h-[600px]">
      <Tabs
        className="overflow-hidden rounded-lg"
        fullWidth={true}
        defaultSelectedKey="introduction"
        onSelectionChange={(value) => {
          if (value === 'galgame' || value === 'patch') {
            window.scroll(0, 400)
          }
          setSelected(value.toString())
        }}
        selectedKey={selected}
        variant="light"
        size="md"
        classNames={{
          tab: "py-2 px-4",
          tabList: "border-b border-default-100 gap-2",
          panel: "pt-4",
          base: "overflow-hidden"
        }}
      >
        <Tab key="introduction" title="游戏信息">
          <IntroductionTab intro={intro} patchId={Number(id)} />
        </Tab>

        <Tab key="characters" title="角色列表">
          <CharacterTab patchId={Number(id)} />
        </Tab>

        <Tab key="galgame" title="游戏资源">
          <ResourceTab id={id} section="galgame" />
        </Tab>

        <Tab key="patch" title="游戏补丁">
          <ResourceTab id={id} section="patch" />
        </Tab>

        <Tab key="comments" title="游戏评论">
          <CommentTab id={id} />
        </Tab>
      </Tabs>
    </div>
  )
}
