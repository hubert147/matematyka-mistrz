import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../lib/claude'

interface Props {
  onBack: () => void
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatScreen({ onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Play audio when a new assistant message arrives
  const playAudio = (text: string) => {
    // Usuń wszystkie emotikony, żeby systemowy lektor ich nie czytał (np. "sowa buźka")
    const cleanedText = text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    
    const speech = new SpeechSynthesisUtterance(cleanedText)
    speech.lang = 'pl-PL'
    speech.rate = 0.95
    speech.pitch = 1.3
    
    const voices = window.speechSynthesis.getVoices()
    const plVoices = voices.filter(v => v.lang.includes('pl') || v.lang.includes('PL'))
    const femaleVoice = plVoices.find(v => 
      v.name.includes('Zosia') || 
      v.name.includes('Paulina') || 
      v.name.includes('Ewa') || 
      v.name.includes('Maja') ||
      v.name.includes('Google') ||
      v.name.toLowerCase().includes('female')
    )
    
    if (femaleVoice) {
      speech.voice = femaleVoice
    } else if (plVoices.length > 0) {
      speech.voice = plVoices[0]
    }

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(speech)
  }

  const executeSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return
    const newMessages: Message[] = [...messages, { role: 'user', content: textToSend }]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const resp = await sendChatMessage(newMessages)
      setMessages([...newMessages, { role: 'assistant', content: resp }])
      playAudio(resp)
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: "Uhu! Coś przerwało połączenie. Pokaż to rodzicom." }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = () => {
    executeSend(input)
  }

  const handleRecord = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Twoja przeglądarka nie obsługuje nagrywania głosu. Napisz coś na klawiaturze!")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'pl-PL'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    let finalTranscript = ''

    recognition.onstart = () => setIsRecording(true)
    recognition.onresult = (event: any) => {
      finalTranscript = event.results[0][0].transcript
      setInput(prev => prev ? prev + ' ' + finalTranscript : finalTranscript)
    }
    recognition.onerror = (event: any) => {
      console.error(event.error)
      setIsRecording(false)
    }
    recognition.onend = () => {
      setIsRecording(false)
      if (finalTranscript) {
        executeSend(finalTranscript)
      }
    }

    recognition.start()
  }

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-[#FFF9F0] flex flex-col relative w-full shadow-lg">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md sticky top-0 z-10 p-4 border-b-2 border-green-100 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="text-4xl hover:scale-110 transition-transform">⬅️</button>
        <div className="flex items-center gap-3">
          <span className="text-4xl">🦉</span>
          <span className="text-3xl font-black text-green-600">Pani Sowa</span>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 pb-32">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10 font-bold">
            <div className="text-[6rem] opacity-50 mb-4 animate-bounce">🦉</div>
            Przywitaj się z Sową! Możesz do niej zadzwonić lub napisać.
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-4 rounded-3xl text-lg font-medium shadow-sm leading-relaxed ${
                msg.role === 'user' 
                ? 'bg-blue-500 text-white rounded-br-none' 
                : 'bg-white text-gray-800 border-2 border-green-100 rounded-bl-none'
              }`}
            >
              {msg.role === 'assistant' && <span className="mr-2 text-2xl">🦉</span>}
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-green-100 p-4 rounded-3xl rounded-bl-none text-gray-500 font-bold animate-pulse">
              <span className="mr-2 text-2xl">🦉</span>
              Sowa myśli...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-white p-4 border-t-2 border-gray-100 absolute bottom-0 left-0 right-0 max-w-2xl mx-auto shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex gap-2">
          <button
            onClick={handleRecord}
            className={`p-4 rounded-full text-3xl shadow-md transition-all ${
              isRecording ? 'bg-red-500 animate-pulse text-white' : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
          >
            {isRecording ? '🔴' : '🎤'}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Napisz do Sowy..."
            className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-3xl px-6 text-lg font-medium focus:outline-none focus:border-green-400 focus:bg-white transition-all shadow-inner"
          />
          
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:opacity-50 text-white p-4 rounded-full text-2xl transition-all shadow-md transform hover:scale-[1.05] disabled:hover:scale-100"
          >
            ✈️
          </button>
        </div>
      </div>
    </div>
  )
}
