'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '~/utils/cn'

interface OptimizedImageProps {
    src: string
    alt: string
    width?: number
    height?: number
    aspectRatio?: string | number
    className?: string
    containerClassName?: string
    priority?: boolean
    loadingStyle?: 'eager' | 'lazy'
    objectFit?: 'cover' | 'contain' | 'fill'
    sizes?: string
    onLoad?: () => void
}

/**
 * 优化的图片组件，预防布局偏移和提供更好的加载体验
 */
export function OptimizedImage({
    src,
    alt,
    width,
    height,
    aspectRatio = '4/3',
    className,
    containerClassName,
    priority = false,
    loadingStyle = 'lazy',
    objectFit = 'cover',
    sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    onLoad
}: OptimizedImageProps) {
    const [imageLoaded, setImageLoaded] = useState(false)

    // 处理图片加载完成事件
    const handleImageLoad = () => {
        setImageLoaded(true)
        if (onLoad) onLoad()
    }

    // 检测组件卸载防止内存泄漏
    useEffect(() => {
        return () => {
            // 清理工作
        }
    }, [])

    // 计算尺寸和样式
    const aRatio = typeof aspectRatio === 'string' ? aspectRatio : `${aspectRatio}`
    const containerStyle = {
        aspectRatio: aRatio,
        position: 'relative' as const,
        overflow: 'hidden' as const
    }

    // 如果提供了宽高，使用宽高
    const dimensionProps = width && height
        ? { width, height }
        : { fill: true } // 否则填满容器

    // 加载相关属性，当priority为true时，不设置loading
    const loadingProps = priority
        ? { priority: true }
        : { loading: loadingStyle }

    return (
        <div
            className={cn(
                "relative bg-default-100 overflow-hidden",
                containerClassName
            )}
            style={containerStyle}
        >
            {/* 加载骨架 */}
            <div
                className={cn(
                    "absolute inset-0 bg-default-200",
                    imageLoaded ? "opacity-0" : "opacity-100",
                    "transition-opacity duration-200"
                )}
            />

            <Image
                src={src}
                alt={alt}
                {...dimensionProps}
                {...loadingProps}
                sizes={sizes}
                className={cn(
                    objectFit === 'cover' ? "object-cover" :
                        objectFit === 'contain' ? "object-contain" : "object-fill",
                    "transition-opacity duration-300",
                    imageLoaded ? "opacity-100" : "opacity-0",
                    className
                )}
                onLoad={handleImageLoad}
            />
        </div>
    )
} 