import { Button, Tooltip } from '@nextui-org/react'
import { FC } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '~/utils/cn'

interface MenuButtonProps {
  tooltip: string
  icon: LucideIcon
  onPress: () => void
  ariaLabel: string
  disabled?: boolean
  className?: string
}

export const MenuButton: FC<MenuButtonProps> = ({
  tooltip,
  icon: Icon,
  onPress,
  ariaLabel,
  disabled = false,
  className = ''
}) => (
  <Tooltip content={tooltip}>
    <Button
      isIconOnly
      variant="light"
      onPress={onPress}
      aria-label={ariaLabel}
      isDisabled={disabled}
    >
      <Icon className={cn("size-6", className)} />
    </Button>
  </Tooltip>
)
