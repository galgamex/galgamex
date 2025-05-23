'use client'

import { Controller } from 'react-hook-form'
import { Select, SelectItem } from '@nextui-org/select'
import { useUserStore } from '~/store/userStore'
import { storageTypes } from '~/constants/resource'
import type { ControlType, ErrorType } from '../share'

interface Props {
  section: string
  control: ControlType
  errors: ErrorType
}

export const ResourceTypeSelect = ({ section, control, errors }: Props) => {
  const user = useUserStore((state) => state.user)

  const calcDisabledKeys = () => {
    // 管理员可以选择任何类型
    if (user.role >= 3) {
      return []
    }
    // 超级管理员在patch中可以选择任何类型
    if (user.role > 3 && section === 'patch') {
      return []
    }
    // 超级管理员在galgame中只能选择特定类型
    if (user.role > 3 && section === 'galgame') {
      return ['s3', 'user']
    }
    // 创作者在patch中不能选择galgamex
    if (user.role > 1 && section === 'patch') {
      return ['galgamex']
    }
    // 普通用户限制最多
    return ['s3', 'galgamex']
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">选择存储类型</h3>
      <p className="text-sm text-default-500">
        确定您的资源体积大小以便选择合适的存储方式
      </p>

      <Controller
        name="storage"
        control={control}
        render={({ field }) => (
          <Select
            label="请选择您的资源存储类型"
            selectedKeys={[field.value]}
            onSelectionChange={(key) => {
              field.onChange(Array.from(key).join(''))
            }}
            disabledKeys={calcDisabledKeys()}
            isInvalid={!!errors.storage}
            errorMessage={errors.storage?.message}
          >
            {storageTypes.map((type) => (
              <SelectItem key={type.value} textValue={type.label}>
                <div className="flex flex-col">
                  <span className="text">{type.label}</span>
                  <span className="text-small text-default-500">
                    {type.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </Select>
        )}
      />
    </div>
  )
}
