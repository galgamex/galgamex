'use client'

import { useState } from 'react'
import { Card, CardBody, CardHeader, Input, Tabs, Tab } from '@nextui-org/react'
import { useCreatePatchStore } from '~/store/editStore'
import { VNDBInput } from './VNDBInput'
import { AliasInput } from './AliasInput'
import { BannerImage } from './BannerImage'
import { PublishButton } from './PublishButton'
import { PatchIntroduction } from './PatchIntroduction'
import { ContentLimit } from './ContentLimit'
import { BatchTag } from '../components/BatchTag'
import { ReleaseDateInput } from '../components/ReleaseDateInput'
import type { CreatePatchRequestData } from '~/store/editStore'
import { BookOpen, Tag, Calendar, Layers, Info } from 'lucide-react'

export const CreatePatch = () => {
  const { data, setData } = useCreatePatchStore()
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreatePatchRequestData, string>>
  >({})

  return (
    <form className="w-full max-w-[1500px] py-4 mx-auto">
      <Card className="w-full">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <h1 className="text-2xl">创建新游戏</h1>
          </div>
        </CardHeader>
        <CardBody>
          <Tabs
            aria-label="游戏信息填写"
            color="primary"
            variant="underlined"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-primary"
            }}
          >
            <Tab
              key="basic"
              title={
                <div className="flex items-center gap-2">
                  <Info className="text-small" />
                  <span>基本信息</span>
                </div>
              }
            >
              <div className="py-4 space-y-8">
                <VNDBInput errors={errors.vndbId} />

                <div className="space-y-2">
                  <h2 className="text-xl">游戏名称 (必须)</h2>
                  <Input
                    isRequired
                    variant="bordered"
                    labelPlacement="outside"
                    placeholder="输入游戏名称, 这会作为游戏的标题"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name}
                  />
                </div>

                <BannerImage errors={errors.banner} />
              </div>
            </Tab>

            <Tab
              key="content"
              title={
                <div className="flex items-center gap-2">
                  <BookOpen className="text-small" />
                  <span>游戏介绍</span>
                </div>
              }
            >
              <div className="py-4 space-y-8">
                <PatchIntroduction errors={errors.banner} />
                <ContentLimit errors={errors.contentLimit} />
              </div>
            </Tab>

            <Tab
              key="metadata"
              title={
                <div className="flex items-center gap-2">
                  <Layers className="text-small" />
                  <span>元数据</span>
                </div>
              }
            >
              <div className="py-4 space-y-8">
                <AliasInput errors={errors.alias} />

                <ReleaseDateInput
                  date={data.released}
                  setDate={(date) => {
                    setData({ ...data, released: date })
                  }}
                  errors={errors.released}
                />
              </div>
            </Tab>

            <Tab
              key="tags"
              title={
                <div className="flex items-center gap-2">
                  <Tag className="text-small" />
                  <span>标签</span>
                </div>
              }
            >
              <div className="py-4 space-y-8">
                <BatchTag
                  initialTag={data.tag}
                  saveTag={(tag) =>
                    setData({
                      ...data,
                      tag
                    })
                  }
                  errors={errors.tag}
                />
              </div>
            </Tab>
          </Tabs>

          <div className="mt-8">
            <PublishButton setErrors={setErrors} />
          </div>
        </CardBody>
      </Card>
    </form>
  )
}
