import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { Article } from '@/types/article';
import { CloudDownload, Eye, MessageCircle, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
export default function PortraitCard({
  article,
  lang
}: {
  article: Article
  lang?: string
}) {
  return (
    <div className='relative shadow bg-background'>
      <Link
        href={`/article/${article.id}`}
        className=' flex flex-col'
      >
        <AspectRatio className="overflow-hidden rounded relative" ratio={4 / 6}>
          <Image
            src={article.avatar || article.cover || article.images?.split(',')[0] || ''}
            alt={article.title!}
            draggable={false}
            className='rounded object-cover bg-gray-100 dark:bg-gray-800 hover:scale-110 transition-transform duration-300'
          />
          {/* 大小信息 */}
          {article.size && (
            <p className='absolute top-0 right-0 rounded text-xs text-white bg-back/50 px-2 py-1'>
              {Math.round(Number(article.size)).toFixed(0)}G
            </p>
          )}
          {/* 下载渠道 */}
          {article.download?.length && (
            <div className='absolute bottom-0 left-0 rounded text-white bg-back/50 py-1 flex items-center text-xs space-y-1 px-2'>
              <CloudDownload />
              <span>{article.download.length}个下载渠道</span>
            </div>
          )}
          {article.tag?.length && (
            <div className='absolute right-0 bottom-0 flex flex-col items-end space-y-1'>
              {article.tag.map(item => (
                <div className='py-1 px-2 text-white text-xs line-clamp-1 text-ellipsis bg-black/50 rounded'>
                  <span>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </AspectRatio>
        <div className='flex flex-col space-t-3 p-3'>
          <h2 className='text-base text-ellipsis line-clamp-1'>
            {article.title}
          </h2>
          <div className='flex items-center'>
            <div className='shrink-0 bg-red-400 rounded px-2 py-1'>
              <span>{article.category?.name}</span>
            </div>
            <div className='flex-1 flex place-content-between space-x-3'>
              <div className='flex items-center text-xs'>
                <ThumbsUp />
                <span>{article.likes}</span>
              </div>
              <div className='flex items-center text-xs'>
                <MessageCircle />
                <span>{article.comments}</span>
              </div>
              <div className='flex items-center text-xs'>
                <Eye />
                <span>{article.views}</span>
              </div>
            </div>
          </div>
        </div>

      </Link>
    </div>
  );
}