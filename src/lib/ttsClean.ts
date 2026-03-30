/**
 * Przygotowuje tekst do odczytania przez syntezator mowy (TTS).
 * Zamienia symbole matematyczne na słowa i usuwa znaki formatowania.
 */
export function cleanForTTS(text: string): string {
  return text
    // Emotikony — usuń zupełnie
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    // Markdown — usuń znaczniki, zostaw treść
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*/g, '')
    // Symbole matematyczne — zamień na słowa po polsku
    .replace(/×/g, ' razy ')
    .replace(/÷/g, ' podzielone przez ')
    .replace(/\+/g, ' plus ')
    .replace(/ - /g, ' minus ')
    .replace(/–/g, ' minus ')
    .replace(/=/g, ' równa się ')
    .replace(/≠/g, ' nie równa się ')
    .replace(/≤/g, ' mniejsze lub równe ')
    .replace(/≥/g, ' większe lub równe ')
    .replace(/</g, ' mniejsze niż ')
    .replace(/>/g, ' większe niż ')
    .replace(/\?/g, '?') // zostaw znaki zapytania
    // Sprzątanie nadmiarowych spacji
    .replace(/\s{2,}/g, ' ')
    .trim()
}
