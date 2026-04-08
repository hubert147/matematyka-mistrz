import { useState } from 'react'

interface Props {
  onSelectMathQuiz: () => void
  onSelectLiterQuiz: () => void
  onSelectTutor: () => void
  onSelectChat: () => void
  onSelectStudy: () => void
  onSelectLiterMistrz?: () => void
  onSelectPaniSowa?: () => void
  onSelectSkarbiec?: () => void
  onSelectLabirynt?: () => void
  onSelectSowaDJ?: () => void
  onSelectLaboratorium?: () => void
  onSelectKartograf?: () => void
}

export function MainScreen({ onSelectMathQuiz, onSelectLiterQuiz, onSelectTutor, onSelectChat, onSelectStudy, onSelectLiterMistrz, onSelectPaniSowa, onSelectSkarbiec, onSelectLabirynt, onSelectSowaDJ, onSelectLaboratorium, onSelectKartograf }: Props) {
  const [showGry, setShowGry] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-indigo-100 flex flex-col items-center px-4 pt-8 pb-6">

      {/* Nagłówek */}
      <div className="flex flex-col items-center mb-8">
        <div className="text-[5.5rem] leading-none drop-shadow-lg" style={{ animation: 'bounce 2s infinite' }}>🦉</div>
        <h1 className="text-4xl font-black text-orange-500 mt-3 tracking-tight drop-shadow-sm">
          Maja Się Uczy
        </h1>
        <p className="text-blue-400 font-bold mt-1 text-base">Co dziś robimy? ✨</p>
      </div>

      {/* Siatka 2x2 */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">

        {/* CYFERKI */}
        <button
          onClick={onSelectMathQuiz}
          className="flex flex-col items-center justify-center gap-2 p-5 rounded-[1.75rem] shadow-lg active:scale-95 transition-transform duration-100"
          style={{ background: 'linear-gradient(135deg, #60a5fa, #2563eb)' }}
        >
          <span className="text-[3.5rem] leading-none drop-shadow">🔢</span>
          <span className="text-lg font-black text-white tracking-tight">Cyferki</span>
          <span className="text-[0.65rem] font-bold text-blue-100 uppercase tracking-wide">Matematyka</span>
        </button>

        {/* LITERKI */}
        <button
          onClick={onSelectLiterQuiz}
          className="flex flex-col items-center justify-center gap-2 p-5 rounded-[1.75rem] shadow-lg active:scale-95 transition-transform duration-100"
          style={{ background: 'linear-gradient(135deg, #c084fc, #9333ea)' }}
        >
          <span className="text-[3.5rem] leading-none drop-shadow">🔤</span>
          <span className="text-lg font-black text-white tracking-tight">Literki</span>
          <span className="text-[0.65rem] font-bold text-purple-100 uppercase tracking-wide">Quiz z literami</span>
        </button>

        {/* NAUKA */}
        <button
          onClick={onSelectStudy}
          className="flex flex-col items-center justify-center gap-2 p-5 rounded-[1.75rem] shadow-lg active:scale-95 transition-transform duration-100"
          style={{ background: 'linear-gradient(135deg, #4ade80, #16a34a)' }}
        >
          <span className="text-[3.5rem] leading-none drop-shadow">📚</span>
          <span className="text-lg font-black text-white tracking-tight">Nauka</span>
          <span className="text-[0.65rem] font-bold text-green-100 uppercase tracking-wide">Ćwiczenia</span>
        </button>

        {/* GRY — przycisk */}
        <button
          onClick={() => setShowGry(v => !v)}
          className={`flex flex-col items-center justify-center gap-2 p-5 rounded-[1.75rem] shadow-lg active:scale-95 transition-all duration-100 ${showGry ? 'scale-95 ring-4 ring-white/40' : ''}`}
          style={{ background: 'linear-gradient(135deg, #fb923c, #ea580c)' }}
        >
          <span className="text-[3.5rem] leading-none drop-shadow">🎮</span>
          <span className="text-lg font-black text-white tracking-tight">Gry</span>
          <span className="text-[0.65rem] font-bold text-orange-100 uppercase tracking-wide">{showGry ? '▲ Zamknij' : '▼ Wybierz grę'}</span>
        </button>

      </div>

      {/* GRY — lista pod siatką */}
      {showGry && (
        <div className="w-full max-w-xs mt-3 bg-white rounded-2xl shadow-2xl border-2 border-orange-200 overflow-hidden">
          {[
            { show: onSelectLiterMistrz,   icon: '🦉', name: 'LiterMistrz',        sub: 'Słuchaj i dotykaj liter', fn: onSelectLiterMistrz },
            { show: onSelectPaniSowa,       icon: '🌲', name: 'Przygody Sowy',      sub: 'Platformówka',            fn: onSelectPaniSowa },
            { show: onSelectSkarbiec,       icon: '💰', name: 'Skarbiec Trolla',    sub: 'Matematyka',              fn: onSelectSkarbiec },
            { show: onSelectLabirynt,       icon: '🌑', name: 'Sowa w Labiryncie', sub: 'Mgła i literki',          fn: onSelectLabirynt },
            { show: onSelectSowaDJ,         icon: '🎧', name: 'Sowa DJ',            sub: 'Rytm i literki',          fn: onSelectSowaDJ },
            { show: onSelectLaboratorium,   icon: '🧪', name: 'Laboratorium',       sub: 'Mieszaj kolory',          fn: onSelectLaboratorium },
            { show: onSelectKartograf,      icon: '🗺️', name: 'Sowa Kartograf',     sub: 'Programowanie',           fn: onSelectKartograf },
          ].filter(g => g.show).map((g, i, arr) => (
            <button
              key={g.name}
              onClick={() => { setShowGry(false); g.fn?.() }}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 active:bg-orange-100 transition-colors ${i < arr.length - 1 ? 'border-b border-orange-100' : ''}`}
            >
              <span className="text-3xl">{g.icon}</span>
              <div className="text-left">
                <div className="font-black text-gray-800 text-sm">{g.name}</div>
                <div className="text-[0.6rem] text-gray-400 font-bold uppercase">{g.sub}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* DODATKI */}
      <div className="w-full max-w-xs mt-4">
        <div
          className="rounded-[1.75rem] shadow-lg p-4 flex gap-3"
          style={{ background: 'linear-gradient(135deg, #2dd4bf, #0891b2)' }}
        >
          <button
            onClick={onSelectChat}
            className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl active:scale-95 transition-transform duration-100"
            style={{ background: 'rgba(255,255,255,0.18)' }}
          >
            <span className="text-[2.8rem] leading-none">🎤</span>
            <span className="text-sm font-black text-white">Mikrofon</span>
          </button>
          <button
            onClick={onSelectTutor}
            className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl active:scale-95 transition-transform duration-100"
            style={{ background: 'rgba(255,255,255,0.18)' }}
          >
            <span className="text-[2.8rem] leading-none">📸</span>
            <span className="text-sm font-black text-white">Aparat</span>
          </button>
        </div>
        <p className="text-center text-teal-500 font-bold text-xs mt-2 uppercase tracking-widest">Dodatki</p>
      </div>

      <footer className="mt-auto pt-8 text-gray-300 font-medium text-xs italic">
        Stworzone z miłością dla Mai ❤️
      </footer>
    </div>
  )
}
