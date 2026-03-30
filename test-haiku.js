import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

async function testHaiku() {
    const key = process.env.VITE_ANTHROPIC_API_KEY;
    if (!key) {
        console.error("No key");
        return;
    }
    
    for (const model of ['claude-3-5-haiku-20241022', 'claude-3-haiku-20240307']) {
        console.log("Testing " + model);
        const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': key,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: model,
                max_tokens: 100,
                messages: [{ role: 'user', content: 'Say hello in JSON {"msg": "hello"}' }]
            })
        });
        
        if (!res.ok) {
            console.error(model + " FAILED: " + await res.text());
        } else {
            const data = await res.json();
            console.log(model + " SUCCEEDED: " + data.content[0].text);
        }
    }
}
testHaiku();
