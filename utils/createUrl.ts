/**
 * 根据当前环境创建完整URL
 * 在开发环境使用相对路径，在生产环境使用完整域名
 */
export const createUrl = (path: string): string => {
    // 如果路径已经是完整URL，直接返回
    if (path.startsWith('http')) {
        return path;
    }

    // 确保路径以/开头
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // 开发环境使用相对路径
    if (process.env.NODE_ENV === 'development') {
        return normalizedPath;
    }

    // 生产环境使用完整域名
    const baseUrl = process.env.NEXT_PUBLIC_KUN_PATCH_ADDRESS_PROD;
    return `${baseUrl}${normalizedPath}`;
} 