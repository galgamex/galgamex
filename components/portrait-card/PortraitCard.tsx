import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { Article } from '@/types/article';
import { CloudDownload, Eye, MessageCircle, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// 格式化数字函数
function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

export default function PortraitCard({
  article,
  lang
}: {
  article: Article
  lang?: string
}) {
  return (
    <div className='relative shadow bg-background dark:bg-muted rounded-lg overflow-hidden'>
      <Link
        href={`/article/${article.id}`}
        className='flex flex-col'
      >
        <AspectRatio className="overflow-hidden relative" ratio={4 / 6}>
          <Image
            src={article.avatar || article.cover || article.images?.split(',')[0] || ''}
            alt={article.title!}
            draggable={false}
            fill
            className='object-cover bg-muted hover:scale-110 transition-transform duration-300'
          />
          {/* 大小信息 */}
          {article.size && (
            <p className='absolute top-0 right-0 text-xs text-white bg-black/50 px-2 py-1'>
              {Math.round(Number(article.size)).toFixed(0)}G
            </p>
          )}
          {/* 下载渠道 */}
          {article.download?.length && (
            <div className='absolute bottom-0 left-0 text-white bg-black/50 py-1 flex items-center text-xs space-y-1 px-2'>
              <CloudDownload className="w-3 h-3 mr-1" />
              <span>{article.download.length}个下载</span>
            </div>
          )}
          {article.tags?.length && (
            <div className='absolute right-0 bottom-0 flex flex-col items-end space-y-1'>
              {article.tags.map(tag => (
                <div key={tag.tagId} className='py-1 px-2 text-white text-xs line-clamp-1 text-ellipsis bg-black/50'>
                  <span>
                    {tag.tag.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </AspectRatio>
        <div className='flex flex-col p-3 gap-2'>
          <h2 className='text-base text-ellipsis line-clamp-1 font-medium'>
            {article.title}
          </h2>
          <div className='grid grid-cols-4 gap-1 text-xs text-gray-500'>
            <div className='flex items-center justify-center'>
              <CloudDownload className="w-3 h-3 mr-1" />
              <span>{formatNumber(article.download?.length || 0)}</span>
            </div>
            <div className='flex items-center justify-center'>
              <ThumbsUp className="w-3 h-3 mr-1" />
              <span>{formatNumber(article.likes)}</span>
            </div>
            <div className='flex items-center justify-center'>
              <MessageCircle className="w-3 h-3 mr-1" />
              <span>{formatNumber(article.comments)}</span>
            </div>
            <div className='flex items-center justify-center'>
              <Eye className="w-3 h-3 mr-1" />
              <span>{formatNumber(article.views)}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
