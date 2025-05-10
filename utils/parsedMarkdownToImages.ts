/**
 * 从Markdown或HTML中提取所有图片链接
 * @param content Markdown或HTML内容
 * @returns 提取的图片数组
 */
export const parsedMarkdownToImages = async (content: string): Promise<{ src: string; alt: string }[]> => {
    // 正则匹配Markdown格式的图片: ![alt](src)
    const markdownImageRegex = /!\[(.*?)\]\((.*?)\)/g
    const markdownImages: { src: string; alt: string }[] = []

    let match
    while ((match = markdownImageRegex.exec(content)) !== null) {
        const alt = match[1] || ''
        const src = match[2] || ''
        if (src) {
            markdownImages.push({ src, alt })
        }
    }

    // 正则匹配HTML格式的图片: <img src="..." alt="...">
    const htmlImageRegex = /<img[^>]+src="([^"]+)"[^>]*?(?:alt="([^"]*)")?[^>]*>/g
    const htmlImages: { src: string; alt: string }[] = []

    let htmlMatch
    while ((htmlMatch = htmlImageRegex.exec(content)) !== null) {
        const src = htmlMatch[1] || ''
        const alt = htmlMatch[2] || ''
        if (src && !markdownImages.find(img => img.src === src)) {
            htmlImages.push({ src, alt })
        }
    }

    // 确保没有重复的图片
    const uniqueImages = [...markdownImages, ...htmlImages]

    // 过滤掉不合法的URL和重复的图片
    return uniqueImages.filter(
        (img, index, self) =>
            img.src &&
            (img.src.startsWith('http') || img.src.startsWith('/')) &&
            self.findIndex(i => i.src === img.src) === index
    )
} 