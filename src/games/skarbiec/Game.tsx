import { useEffect } from 'react'

interface Props {
  onBack: () => void
}

export function SkarbiecGame({ onBack }: Props) {
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'skarbiec:back') onBack()
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [onBack])

  return (
    <iframe
      src="/games/matematyczny-skarbiec.html"
      style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
      title="Matematyczny Skarbiec"
    />
  )
}
