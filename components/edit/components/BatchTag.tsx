import { Textarea, Button, Chip } from '@nextui-org/react'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

interface Props {
  initialTag: string[]
  saveTag: (tag: string[]) => void
  errors?: string
}

export const BatchTag = ({ initialTag, saveTag, errors }: Props) => {
  // 定义快捷标签分类
  const quickTags = {
    风格: ['欧美风', '日系风', '国产风', '像素风', '2D', '3D'],
    玩法: ['SLG', 'RPG', 'ACT', 'PUZ'],
    平台: ['Steam', 'DLsite', 'BOKI2', 'F95zone'],
    年份: [
      '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016',
      '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006',
      '2005', '2004', '2003', '2002', '2001', '2000', '1999'
    ]
  }

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    // 按逗号分割当前标签，并移除空白项
    const currentTagsStr = initialTag.join(',');
    let currentTags = currentTagsStr ? currentTagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];

    // 检查标签是否已经存在
    if (!currentTags.includes(tag)) {
      // 添加新标签
      currentTags.push(tag);
      saveTag(currentTags);
    }
  }

  // 清空所有标签
  const clearAllTags = () => {
    saveTag([]);
  }

  // 标签分类渲染
  const renderTagCategory = (category: string, tags: string[]) => (
    <div className="mt-2">
      <h3 className="text-sm font-medium mb-1">{category}:</h3>
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Chip
            key={tag}
            variant="flat"
            onClick={() => handleTagClick(tag)}
            className="cursor-pointer hover:bg-primary-100"
          >
            {tag}
          </Chip>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-xl">游戏标签 (可选)</h2>
        <Button
          size="sm"
          color="danger"
          variant="light"
          startContent={<Trash2 size={16} />}
          onClick={clearAllTags}
        >
          清空标签
        </Button>
      </div>

      {errors && <p className="text-xs text-danger-500">{errors}</p>}
      <Textarea
        placeholder="批量添加标题, 每个标签需要使用英语逗号 ( , ) 分隔"
        value={initialTag.toString()}
        onChange={(e) => {
          saveTag(e.target.value.split(',').map((tag) => tag.trim()))
        }}
        className="w-full"
        minRows={3}
      />

      <div className="space-y-2 mt-3 p-2 border border-default-200 rounded-md">
        <p className="text-sm font-medium">快捷添加标签（点击添加）:</p>
        {renderTagCategory('风格', quickTags.风格)}
        {renderTagCategory('玩法', quickTags.玩法)}
        {renderTagCategory('平台', quickTags.平台)}
        {renderTagCategory('年份', quickTags.年份)}
      </div>

      <p className="text-sm text-default-500">
        无该标签时将会自动创建标签, 并且会根据标签名自动增删游戏的标签以及计数
      </p>
    </div>
  )
}
