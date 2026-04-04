import { useEffect, useRef } from 'react'
import { createLiterMistrzGame } from './index.js'

// Wrapper React — montuje/demontuje grę Phaser

export function LiterMistrzGame({ onBack }) {
  const containerRef = useRef(null)
  const gameRef      = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Inicjalizuj grę Phaser
    gameRef.current = createLiterMistrzGame(containerRef.current)

    // Nasłuchuj zdarzenia "wróć" z gry
    const handleBack = () => onBack?.()
    window.addEventListener('litermistrz:back', handleBack)

    return () => {
      window.removeEventListener('litermistrz:back', handleBack)

      // Zniszcz grę przy odmontowaniu
      if (gameRef.current) {
        // Anuluj mowę
        window.speechSynthesis?.cancel()

        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [])

  return (
    <div
      style={{
        width: '100%',
        height: '100dvh',
        background: '#1a1a2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '480px',
          maxHeight: '800px',
        }}
      />
    </div>
  )
}
