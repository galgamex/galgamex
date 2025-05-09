import Image from 'next/image'

interface Props {
  message: string
}

export const KunNull = ({ message }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 size-full">
      <Image
        className="rounded-2xl"
        src="/null.webp"
        alt={message}
        width={150}
        height={150}
        priority
      />
      <span>{message}</span>
    </div>
  )
}
