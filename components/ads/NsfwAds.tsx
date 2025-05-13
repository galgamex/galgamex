'use client'

import { useEffect, useState } from 'react'
import { Card, CardBody } from '@nextui-org/react'
import { useSettingStore } from '~/store/settingStore'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import Head from 'next/head'

interface AdItem {
    id: string
    title: string
    imageUrl: string
    linkUrl: string
}

interface NsfwAdsProps {
    section?: 'galgame' | 'patch'
}

export const NsfwAds = ({ section = 'galgame' }: NsfwAdsProps) => {
    const settings = useSettingStore((state) => state.data)
    const [isMounted, setIsMounted] = useState(false)

    // 从环境变量读取广告数据
    const adItems: AdItem[] = [
        {
            id: '1',
            title: process.env.NEXT_PUBLIC_NSFW_AD_1_TITLE || '广告项目1',
            imageUrl: process.env.NEXT_PUBLIC_NSFW_AD_1_IMAGE || '#',
            linkUrl: process.env.NEXT_PUBLIC_NSFW_AD_1_LINK || '#'
        },
        {
            id: '2',
            title: process.env.NEXT_PUBLIC_NSFW_AD_2_TITLE || '广告项目2',
            imageUrl: process.env.NEXT_PUBLIC_NSFW_AD_2_IMAGE || '#',
            linkUrl: process.env.NEXT_PUBLIC_NSFW_AD_2_LINK || '#'
        },
        {
            id: '3',
            title: process.env.NEXT_PUBLIC_NSFW_AD_3_TITLE || '广告项目3',
            imageUrl: process.env.NEXT_PUBLIC_NSFW_AD_3_IMAGE || '#',
            linkUrl: process.env.NEXT_PUBLIC_NSFW_AD_3_LINK || '#'
        }
    ]

    useEffect(() => {
        setIsMounted(true)

        // 在组件挂载时添加meta标签，防止搜索引擎抓取
        if (typeof document !== 'undefined') {
            const metaRobots = document.createElement('meta');
            metaRobots.name = 'robots';
            metaRobots.content = 'noindex, nofollow';
            document.head.appendChild(metaRobots);

            // 防止广告被缓存
            const metaCache = document.createElement('meta');
            metaCache.httpEquiv = 'Cache-Control';
            metaCache.content = 'no-store, no-cache, must-revalidate';
            document.head.appendChild(metaCache);

            return () => {
                // 组件卸载时移除meta标签
                document.head.removeChild(metaRobots);
                document.head.removeChild(metaCache);
            };
        }
    }, []);

    // 只有在NSFW模式下才显示广告
    if (!isMounted || (settings.kunNsfwEnable !== 'nsfw' && settings.kunNsfwEnable !== 'all')) {
        return null
    }

    return (
        <>
            {/* 添加脚本，确保搜索引擎不索引此内容 */}
            <Script id="nsfw-ads-noindex" strategy="afterInteractive">
                {`
                    const nsfwContent = document.querySelector('[data-nsfw-content="true"]');
                    if (nsfwContent) {
                        const meta = document.createElement('meta');
                        meta.name = 'robots';
                        meta.content = 'noindex, nofollow';
                        document.head.appendChild(meta);
                        
                        // 添加额外防抓取属性
                        nsfwContent.setAttribute('aria-hidden', 'true');
                        nsfwContent.setAttribute('itemscope', '');
                        nsfwContent.setAttribute('itemtype', 'https://schema.org/WebPageElement');
                    }
                `}
            </Script>

            <div
                data-nsfw-content="true"
                data-nosnippet
                data-noindex="true"
                data-nocache="true"
                className="my-6"
            >
                <div className="text-sm text-default-500 mb-2">
                    {section === 'galgame' ? '广告内容仅在NSFW模式下显示' : '广告内容仅在NSFW模式下显示'}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {adItems.map((ad) => (
                        <Card
                            key={ad.id}
                            className="border border-default-200 hover:border-primary/50 transition-all duration-300"
                            isPressable
                        >
                            <CardBody className="p-0 overflow-hidden">
                                <Link href={ad.linkUrl} target="_blank" rel="nofollow noopener noreferrer noarchive" aria-label="广告内容">
                                    <div className="relative w-full" style={{ aspectRatio: '300/150' }}>
                                        <Image
                                            src={ad.imageUrl}
                                            alt={ad.title}
                                            fill
                                            className="object-cover"
                                            priority={false}
                                            unoptimized={true}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-transparent">
                                            <p className="font-medium text-medium text-white drop-shadow-md">{ad.title}</p>
                                            <p className="text-xs text-white/70 mt-1 drop-shadow-md">广告内容 · 仅在NSFW模式下显示</p>
                                        </div>
                                    </div>
                                </Link>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    )
}