import { useState } from 'react'

interface Props {
  onSelectMathQuiz: () => void
  onSelectLiterQuiz: () => void
  onSelectTutor: () => void
  onSelectChat: () => void
  onSelectStudy: () => void
  onSelectLiterMistrz?: () => void
}

export function MainScreen({ onSelectMathQuiz, onSelectLiterQuiz, onSelectTutor, onSelectChat, onSelectStudy, onSelectLiterMistrz }: Props) {
  const [showKonkursOptions, setShowKonkursOptions] = useState(false)

  return (
    <div className="max-w-5xl mx-auto px-4 min-h-screen flex flex-col items-center py-12 w-full">
      <div className="text-[6rem] sm:text-[8rem] animate-bounce mb-4 drop-shadow-xl">🦉</div>
      <h1 className="text-4xl sm:text-6xl font-black text-orange-500 mb-2 text-center drop-shadow-sm">
        Maja Się Uczy
      </h1>
      <p className="text-gray-500 font-bold mb-12 text-center text-lg">Witaj w świecie mądrej sowy! Co robimy?</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* KONKURSY BOX */}
        <div className="relative group">
          <button 
            onClick={() => setShowKonkursOptions(!showKonkursOptions)}
            className={`w-full bg-white p-8 rounded-[2rem] shadow-sm border-4 transition-all flex flex-col items-center gap-4 ${
              showKonkursOptions ? 'border-orange-500 shadow-lg scale-105' : 'border-orange-100 hover:border-orange-400 hover:shadow-lg'
            }`}
          >
            <div className="text-7xl group-hover:scale-110 transition-transform duration-300">🏆</div>
            <h2 className="text-3xl font-black text-orange-600 uppercase tracking-tight">Konkursy</h2>
            <p className="text-gray-500 text-center font-medium leading-tight">Sprawdź co już umiesz!</p>
          </button>
          
          {showKonkursOptions && (
            <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-2xl border-4 border-orange-500 p-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
               <button 
                 onClick={onSelectMathQuiz}
                 className="w-full p-4 hover:bg-orange-50 rounded-2xl flex items-center gap-4 transition-colors mb-2 border-2 border-transparent hover:border-orange-200"
               >
                 <span className="text-4xl text-blue-500 bg-blue-50 w-16 h-16 flex items-center justify-center rounded-xl font-black italic">123</span>
                 <div className="text-left">
                   <div className="font-black text-gray-800 text-lg">Matematyka</div>
                   <div className="text-xs text-gray-500 font-bold uppercase">Liczby i figury</div>
                 </div>
               </button>
               <button
                 onClick={onSelectLiterQuiz}
                 className="w-full p-4 hover:bg-purple-50 rounded-2xl flex items-center gap-4 transition-colors border-2 border-transparent hover:border-purple-200"
               >
                 <span className="text-4xl text-purple-600 bg-purple-50 w-16 h-16 flex items-center justify-center rounded-xl font-black italic">ABC</span>
                 <div className="text-left">
                   <div className="font-black text-gray-800 text-lg">Literki</div>
                   <div className="text-xs text-gray-500 font-bold uppercase">Czytanie i pisanie</div>
                 </div>
               </button>
               {onSelectLiterMistrz && (
                 <button
                   onClick={onSelectLiterMistrz}
                   className="w-full p-4 hover:bg-yellow-50 rounded-2xl flex items-center gap-4 transition-colors border-2 border-transparent hover:border-yellow-300"
                 >
                   <span className="text-4xl bg-yellow-50 w-16 h-16 flex items-center justify-center rounded-xl">🦉</span>
                   <div className="text-left">
                     <div className="font-black text-gray-800 text-lg">LiterMistrz</div>
                     <div className="text-xs text-gray-500 font-bold uppercase">Gra z Panią Sową ✨</div>
                   </div>
                 </button>
               )}
            </div>
          )}
        </div>

        {/* NAUKA BOX */}
        <button 
          onClick={onSelectStudy}
          className="bg-white p-8 rounded-[2rem] shadow-sm border-4 border-green-100 hover:border-green-400 hover:shadow-lg transition-all flex flex-col items-center gap-4 group"
        >
          <div className="text-7xl group-hover:scale-110 transition-transform duration-300">📚</div>
          <h2 className="text-3xl font-black text-green-600 uppercase tracking-tight">Nauka</h2>
          <p className="text-gray-500 text-center font-medium leading-tight">Poznawaj nowe rzeczy!</p>
        </button>

        {/* SOWA BOX (merged Tutor & Chat or kept separate?) */}
        <div className="md:col-span-2 lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-4">
           {/* Mini Chat bit */}
           <button 
            onClick={onSelectChat}
            className="bg-white p-6 rounded-[2rem] border-4 border-blue-50 hover:border-blue-400 transition-all flex flex-col items-center gap-2 group"
          >
            <div className="text-5xl group-hover:scale-110 transition-transform">🎤</div>
            <div className="font-black text-blue-600 text-sm">ROZMAWIAJ</div>
          </button>
          
          {/* Mini Tutor bit */}
           <button 
            onClick={onSelectTutor}
            className="bg-white p-6 rounded-[2rem] border-4 border-purple-50 hover:border-purple-400 transition-all flex flex-col items-center gap-2 group"
          >
            <div className="text-5xl group-hover:scale-110 transition-transform">📸</div>
            <div className="font-black text-purple-600 text-sm">TŁUMACZ</div>
          </button>
        </div>
      </div>

      <footer className="mt-auto pt-12 text-gray-300 font-medium text-sm italic">
        Stworzone z miłością dla Mai ❤️
      </footer>
    </div>
  )
}
