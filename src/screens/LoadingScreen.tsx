

interface Props {
  message: string
}

export function LoadingScreen({ message }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-8xl mb-8 translate-y-[-10px] animate-[bounce_2s_infinite]">🦉</div>
      <h2 className="font-bold text-xl text-gray-700 text-center mb-6">{message}</h2>
      <div className="flex gap-2">
        <div className="w-4 h-4 rounded-full bg-orange-500 animate-[bounce_1s_infinite_0ms]"></div>
        <div className="w-4 h-4 rounded-full bg-orange-500 animate-[bounce_1s_infinite_200ms]"></div>
        <div className="w-4 h-4 rounded-full bg-orange-500 animate-[bounce_1s_infinite_400ms]"></div>
      </div>
    </div>
  )
}
