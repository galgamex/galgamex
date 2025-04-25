import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

export default function IconComponent({
  name,
  size = 16,  // 添加默认大小
  strokeWidth = 2,  // 添加默认线宽
  ...props
}: { name: string } & LucideProps) {
  const Icon = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<LucideProps>;
  return Icon ? <Icon size={size} strokeWidth={strokeWidth} {...props} /> : null;
}