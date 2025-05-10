'use client'

import React from 'react'
import Link from 'next/link'

export const LoginBanner: React.FC = () => {
    return (
        <Link href="/login" className="block">
            <div className="sys-item-2">
                <span>部分内容不宜展示，请登录主动开启！</span>
            </div>
        </Link>
    )
} 