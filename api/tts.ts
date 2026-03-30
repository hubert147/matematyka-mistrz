export default async function handler(req: any, res: any) {
  const REGION = process.env.AZURE_REGION || 'westeurope'
  const KEY = process.env.AZURE_TTS_KEY

  if (!KEY) {
    return res.status(500).json({ error: 'Brak klucza AZURE_TTS_KEY na serwerze' })
  }

  try {
    const response = await fetch(
      `https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': KEY,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        },
        body: req.body
      }
    )

    if (!response.ok) {
      const err = await response.text()
      return res.status(response.status).send(err)
    }

    const audio = await response.arrayBuffer()
    res.setHeader('Content-Type', 'audio/mpeg')
    res.send(Buffer.from(audio))
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
