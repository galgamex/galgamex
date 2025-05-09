'use client'

import { useState } from 'react'
import { kunMoyuMoe } from '~/config/moyu-moe'
import { Button, Card, CardBody, CardFooter, Snippet } from '@nextui-org/react'
import { ExternalLink, ShieldAlert } from 'lucide-react'
import { CountdownTimer } from './CountdownTimer'
import { useSearchParams } from 'next/navigation'
import { useUserStore } from '~/store/userStore'
import { useMounted } from '~/hooks/useMounted'

export const KunRedirectCard = () => {
  const isMounted = useMounted()
  const searchParams = useSearchParams()
  const userConfig = useUserStore((state) => state.user)

  const [isCountdownComplete, setIsCountdownComplete] = useState(false)
  const url = searchParams.get('url') || kunMoyuMoe.domain.main

  const handleRedirect = () => {
    window.location.href = url
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardBody className="gap-4">
        <div className="flex items-center gap-2 text-warning-500">
          <ShieldAlert className="w-5 h-5" />
          <p className="text-lg">您即将离开 {kunMoyuMoe.titleShort}</p>
        </div>

        <p className="text-default-500">您将会被跳转到:</p>

        <div className="overflow-auto">
          <Snippet
            disableCopy
            symbol=""
            size="lg"
            className="w-full overflow-auto scrollbar-hide"
            color="primary"
            copyIcon={<ExternalLink />}
          >
            {url}
          </Snippet>
        </div>

        {isMounted && (
          <CountdownTimer
            delay={userConfig.delaySeconds}
            onComplete={() => setIsCountdownComplete(true)}
          />
        )}
      </CardBody>

      <CardFooter className="justify-center">
        <Button
          size="lg"
          color="primary"
          variant="shadow"
          onPress={handleRedirect}
          isDisabled={!isCountdownComplete}
        >
          点击跳转
        </Button>
      </CardFooter>
    </Card>
  )
}
