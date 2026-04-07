import { useEffect } from 'react'

interface Props {
  onBack: () => void
}

export function SowaDJGame({ onBack }: Props) {
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'sowadj:back') onBack()
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [onBack])

  return (
    <iframe
      src="/games/sowa-dj.html"
      style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
      title="Sowa DJ"
    />
  )
}
