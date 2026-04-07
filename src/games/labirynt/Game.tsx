import { useEffect } from 'react'

interface Props {
  onBack: () => void
}

export function LabiryntGame({ onBack }: Props) {
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'labirynt:back') onBack()
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [onBack])

  return (
    <iframe
      src="/games/sowa-w-labiryncie.html"
      style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
      title="Sowa w Labiryncie"
    />
  )
}
