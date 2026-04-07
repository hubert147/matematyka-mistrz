import { useEffect, useRef } from 'react'

interface Props {
  onBack: () => void
}

export function PaniSowaGame({ onBack }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'panisowa:back') onBack()
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [onBack])

  return (
    <iframe
      ref={iframeRef}
      src="/games/pani-sowa-gra.html"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
      title="Przygody Pani Sowy"
    />
  )
}
