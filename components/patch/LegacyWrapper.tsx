'use client'

import React from 'react'

interface LegacyWrapperProps {
    children: React.ReactNode
}

export const LegacyWrapper = ({ children }: LegacyWrapperProps) => {
    return (
        <div className="legacy-wrapper">
            {children}
        </div>
    )
}

export default LegacyWrapper 