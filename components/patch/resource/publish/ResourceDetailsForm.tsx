import { Controller } from 'react-hook-form'
import { Input, Textarea } from '@nextui-org/input'
import { Select, SelectItem } from '@nextui-org/select'
import {
  resourceTypes,
  SUPPORTED_LANGUAGE,
  SUPPORTED_LANGUAGE_MAP,
  SUPPORTED_PLATFORM,
  SUPPORTED_PLATFORM_MAP
} from '~/constants/resource'
import { useUserStore } from '~/store/userStore'
import type { Control, FieldErrors } from 'react-hook-form'

interface ResourceDetailsFormProps {
  control: Control<any>
  errors: FieldErrors
  section?: string
}

export const ResourceDetailsForm = ({
  control,
  errors,
  section = 'patch'
}: ResourceDetailsFormProps) => {
  const user = useUserStore((state) => state.user)

  // 普通用户只能看到补丁相关的资源类型选项
  const filteredResourceTypes = resourceTypes.filter(type => {
    // 如果是普通用户且当前在上传游戏资源，只显示补丁相关选项
    if (user.role < 3 && section === 'galgame') {
      return type.value === 'patch';
    }
    // 如果是普通用户，不论在哪个模式下，都隐藏Galgame本体选项
    if (user.role < 3) {
      return type.value !== 'pc' && type.value !== 'row';
    }
    // 其他用户显示所有选项
    return true;
  });

  // 资源状态选项
  const resourceStatusOptions = [
    {
      value: 0,
      label: '正常可下载',
      description: '用户可以查看并下载此资源'
    },
    {
      value: 1,
      label: '仅备份不可下载',
      description: '仅作备份用途，用户无法下载'
    }
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">资源详情</h3>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              isRequired
              label="类型"
              placeholder="请选择资源的类型"
              selectionMode="multiple"
              selectedKeys={field.value}
              onSelectionChange={(key) => {
                field.onChange([...key] as string[])
              }}
              isInvalid={!!errors.type}
              errorMessage={errors.type?.message}
            >
              {filteredResourceTypes.map((type) => (
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

        <Controller
          name="language"
          control={control}
          render={({ field }) => (
            <Select
              isRequired
              label="语言"
              placeholder="请选择语言"
              selectionMode="multiple"
              selectedKeys={field.value}
              onSelectionChange={(key) => {
                field.onChange([...key] as string[])
              }}
              isInvalid={!!errors.language}
              errorMessage={errors.language?.message}
            >
              {SUPPORTED_LANGUAGE.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {SUPPORTED_LANGUAGE_MAP[lang]}
                </SelectItem>
              ))}
            </Select>
          )}
        />

        <Controller
          name="platform"
          control={control}
          render={({ field }) => (
            <Select
              isRequired
              label="平台"
              placeholder="请选择资源的平台"
              selectionMode="multiple"
              selectedKeys={field.value}
              onSelectionChange={(key) => {
                field.onChange([...key] as string[])
              }}
              isInvalid={!!errors.platform}
              errorMessage={errors.platform?.message}
            >
              {SUPPORTED_PLATFORM.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {SUPPORTED_PLATFORM_MAP[platform]}
                </SelectItem>
              ))}
            </Select>
          )}
        />

        <Controller
          name="size"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              isRequired
              label="大小 (MB 或 GB)"
              placeholder="请输入资源的大小, 例如 1.007MB"
              isInvalid={!!errors.size}
              errorMessage={errors.size?.message}
            />
          )}
        />
      </div>

      {user.role >= 2 && (
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              label="资源下载状态"
              placeholder="请选择资源是否可以下载"
              selectedKeys={[String(field.value || 0)]}
              onChange={(e) => field.onChange(Number(e.target.value))}
              isInvalid={!!errors.status}
              errorMessage={errors.status?.message}
            >
              {resourceStatusOptions.map((status) => (
                <SelectItem key={String(status.value)} textValue={status.label} value={status.value}>
                  <div className="flex flex-col">
                    <span className="text">{status.label}</span>
                    <span className="text-small text-default-500">
                      {status.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </Select>
          )}
        />
      )}

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="资源名称"
            placeholder="请填写您的资源名称, 例如 DeepSeek V3 翻译补丁"
            isInvalid={!!errors.note}
            errorMessage={errors.note?.message}
          />
        )}
      />

      <Controller
        name="code"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="提取码"
            placeholder="如果资源的获取需要密码, 请填写密码"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="解压码"
            placeholder="如果资源的解压需要解压码, 请填写解压码"
            isInvalid={!!errors.code}
            errorMessage={errors.code?.message}
          />
        )}
      />

      <Controller
        name="note"
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            label="备注"
            placeholder="您可以在此处随意添加备注, 例如资源的注意事项等"
            isInvalid={!!errors.note}
            errorMessage={errors.note?.message}
          />
        )}
      />
    </div>
  )
}
