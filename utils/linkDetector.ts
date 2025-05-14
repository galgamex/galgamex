/**
 * 网盘链接检测器
 * 根据链接URL自动检测是哪种网盘类型
 */

interface LinkPattern {
    type: string;
    patterns: (string | RegExp)[];
}

// 定义各种网盘的URL模式
const linkPatterns: LinkPattern[] = [
    {
        type: 'baidu',
        patterns: [
            'pan.baidu.com',
            'yun.baidu.com',
            /baidu\.com\/s\/[\w-]+/
        ]
    },
    {
        type: 'aliyun',
        patterns: [
            'aliyundrive.com/s/',
            'www.aliyundrive.com'
        ]
    },
    {
        type: 'quark',
        patterns: [
            'pan.quark.cn/s/',
            'pan-quark.cn'
        ]
    },
    {
        type: '123pan',
        patterns: [
            '123pan.com/',
            /123pan\.com\/s\/[\w-]+/
        ]
    },
    {
        type: 'lanzou',
        patterns: [
            'lanzou.com/',
            'lanzoux.com/',
            'lanzoui.com/',
            'lanzous.com/'
        ]
    },
    {
        type: 'onedrive',
        patterns: [
            'onedrive.live.com/',
            '1drv.ms/',
            'sharepoint.com/'
        ]
    },
    {
        type: 'googledrive',
        patterns: [
            'drive.google.com/file/',
            'drive.google.com/drive/',
            'docs.google.com/document/'
        ]
    },
    {
        type: 'uc',
        patterns: [
            'drive.uc.cn/',
            'pan.uc.cn/'
        ]
    },
    {
        type: 'cmcloud',
        patterns: [
            'caiyun.139.com/',
            'yun.139.com/'
        ]
    },
    {
        type: 'thunder',
        patterns: [
            'pan.xunlei.com/',
            'xunlei.com/'
        ]
    },
    {
        type: 'weiyun',
        patterns: [
            'weiyun.com/',
            'share.weiyun.com/'
        ]
    },
    {
        type: 'galgamex',
        patterns: [
            'pan.galgamex.com/'
        ]
    }
];

/**
 * 检测链接类型
 * @param url 要检测的URL
 * @returns 检测到的网盘类型，如果无法识别则返回'user'
 */
export const detectLinkType = (url: string): string => {
    if (!url) return 'user';

    const lowerUrl = url.toLowerCase();

    for (const pattern of linkPatterns) {
        for (const urlPattern of pattern.patterns) {
            if (typeof urlPattern === 'string') {
                if (lowerUrl.includes(urlPattern)) {
                    return pattern.type;
                }
            } else if (urlPattern instanceof RegExp) {
                if (urlPattern.test(lowerUrl)) {
                    return pattern.type;
                }
            }
        }
    }

    return 'user';
};

/**
 * 批量检测链接类型
 * @param links 多个链接数组
 * @returns 每个链接对应的类型数组
 */
export const detectLinksTypes = (links: string[]): string[] => {
    return links.map(link => detectLinkType(link));
}; 