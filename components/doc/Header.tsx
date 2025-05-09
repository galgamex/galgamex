import { Input } from '@nextui-org/react'
import { Search } from 'lucide-react'
import { KunHeader } from '../kun/Header'

// interface HeaderProps {
//   onSearch: (value: string) => void
// }

export const KunAboutHeader = () => {
  return (
    <div className="mb-8 space-y-6">
      <KunHeader
        name="帮助文档"
        description="如果您在网站遇到任何问题, 都可以来此处查看帮助文档"
      />

      {/* <Input
        classNames={{
          input: 'text-small',
          inputWrapper: 'h-12'
        }}
        placeholder="Search articles..."
        startContent={<Search size={18} />}
        onChange={(e) => onSearch(e.target.value)}
      /> */}
    </div>
  )
}
