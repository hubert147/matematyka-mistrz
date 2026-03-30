export default async function handler(req: any, res: any) {
  const KEY = process.env.ANTHROPIC_API_KEY
  if (!KEY) return res.status(500).json({ error: 'Brak klucza ANTHROPIC_API_KEY' })

  const body = req.body
  const primaryModel = body.model
  
  // Określamy fallback na podstawie głównego modelu
  const fallbackModel = primaryModel.includes('sonnet') 
    ? 'claude-3-5-sonnet-20241022' 
    : 'claude-3-5-haiku-20241022'

  async function callAnthropic(modelName: string) {
    return fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KEY as string,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ ...body, model: modelName })
    })
  }

  try {
    let response = await callAnthropic(primaryModel)
    
    // Jeśli główny model zawiedzie (np. 4.5 nie istnieje lub przeciążony), próbujemy fallback
    if (!response.ok) {
      console.warn(`Model ${primaryModel} zawiódł (${response.status}), próba fallback na ${fallbackModel}`)
      response = await callAnthropic(fallbackModel)
    }

    const data = await response.json()
    res.status(response.status).json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
