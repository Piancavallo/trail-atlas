import { useState } from 'react'
import { ParkCardFallbackImage } from '../ParkCard/ParkCardFallbackImage'

interface ParkImageProps {
  src: string
  alt: string
  parkName: string
  className?: string
  priority?: boolean
}

export function ParkImage({ src, alt, parkName, className, priority = false }: ParkImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <ParkCardFallbackImage parkName={parkName} />
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
