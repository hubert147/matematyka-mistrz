import { useEffect } from 'react'

interface Props {
  onBack: () => void
}

export function LaboratoriumGame({ onBack }: Props) {
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'laboratorium:back') onBack()
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [onBack])

  return (
    <iframe
      src="/games/laboratorium-pani-sowy.html"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
      title="Laboratorium Pani Sowy"
    />
  )
}
