

interface Props {
  onSelectQuiz: () => void
  onSelectTutor: () => void
  onSelectChat: () => void
}

export function MainScreen({ onSelectQuiz, onSelectTutor, onSelectChat }: Props) {
  return (
    <div className="max-w-5xl mx-auto px-4 min-h-screen flex flex-col items-center py-12 w-full">
      <div className="text-[6rem] sm:text-[8rem] animate-bounce mb-4 drop-shadow-xl">🦉</div>
      <h1 className="text-4xl sm:text-6xl font-black text-orange-500 mb-2 text-center drop-shadow-sm">
        Maja Się Uczy
      </h1>
      <p className="text-gray-500 font-bold mb-12 text-center text-lg">Wybierz, co robimy dzisiaj!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <button 
          onClick={onSelectQuiz}
          className="bg-white p-8 rounded-[2rem] shadow-sm border-4 border-orange-100 hover:border-orange-400 hover:shadow-lg transition-all flex flex-col items-center gap-4 group"
        >
          <div className="text-7xl group-hover:scale-110 transition-transform duration-300">🏆</div>
          <h2 className="text-2xl font-black text-orange-600">Konkurs<br/>Matematyczny</h2>
          <p className="text-gray-500 text-center font-medium leading-tight">Sprawdź swoją wiedzę<br/>w szybkim quizie z oceną AI!</p>
        </button>

        <button 
          onClick={onSelectTutor}
          className="bg-white p-8 rounded-[2rem] shadow-sm border-4 border-purple-100 hover:border-purple-400 hover:shadow-lg transition-all flex flex-col items-center gap-4 group"
        >
          <div className="text-7xl group-hover:scale-110 transition-transform duration-300">📸</div>
          <h2 className="text-2xl font-black text-purple-600">Sowa<br/>Tłumaczy</h2>
          <p className="text-gray-500 text-center font-medium leading-tight">Masz zadanie w książce?<br/>Zrób mu zdjęcie i poproś o pomóc!</p>
        </button>

        <button 
          onClick={onSelectChat}
          className="bg-white p-8 rounded-[2rem] shadow-sm border-4 border-green-100 hover:border-green-400 hover:shadow-lg transition-all flex flex-col items-center gap-4 group"
        >
          <div className="text-7xl group-hover:scale-110 transition-transform duration-300">🎤</div>
          <h2 className="text-2xl font-black text-green-600">Porozmawiaj<br/>z Sową</h2>
          <p className="text-gray-500 text-center font-medium leading-tight">Zadawaj mądre pytania i<br/>rozpocznij ciekawą rozmowę!</p>
        </button>
      </div>
    </div>
  )
}
