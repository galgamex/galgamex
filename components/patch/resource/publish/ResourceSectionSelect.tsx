'use client'

import { RadioGroup, Radio } from '@nextui-org/react'
import { ErrorType } from '../share'
import {
  SUPPORTED_RESOURCE_SECTION,
  RESOURCE_SECTION_MAP
} from '~/constants/resource'

interface Props {
  errors: ErrorType
  section: string
  userRole: number
  setSection: (value: string) => void
}

export const ResourceSectionSelect = ({
  errors,
  section,
  userRole,
  setSection
}: Props) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">请选择资源的类别</h3>
      {userRole < 3 && (
        <p className="text-sm font-medium text-default-500">
          本站用户仅可上传 Galgame 补丁资源
        </p>
      )}
      <RadioGroup
        isDisabled={userRole < 3}
        value={section}
        onValueChange={setSection}
        isInvalid={!!errors.section}
        errorMessage={errors.section?.message}
      >
        {SUPPORTED_RESOURCE_SECTION.map((section) => (
          <Radio key={section} value={section}>
            {RESOURCE_SECTION_MAP[section]}
          </Radio>
        ))}
      </RadioGroup>
    </div>
  )
}
