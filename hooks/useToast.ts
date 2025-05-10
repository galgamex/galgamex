import { useCallback } from 'react'
import { toast as hotToast } from 'react-hot-toast'

interface ToastOptions {
    title: string
    description?: string
    status?: 'success' | 'error' | 'info' | 'warning'
    duration?: number
}

export function useToast() {
    const toast = useCallback(
        ({ title, description, status = 'info', duration = 3000 }: ToastOptions) => {
            const options = {
                duration,
                style: {
                    padding: '16px',
                    borderRadius: '8px',
                }
            }

            switch (status) {
                case 'success':
                    return hotToast.success(
                        title + (description ? `\n${description}` : ''),
                        options
                    )
                case 'error':
                    return hotToast.error(
                        title + (description ? `\n${description}` : ''),
                        options
                    )
                default:
                    return hotToast(
                        title + (description ? `\n${description}` : ''),
                        options
                    )
            }
        },
        []
    )

    return { toast }
} 