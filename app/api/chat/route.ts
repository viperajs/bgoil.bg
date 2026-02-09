import { NextResponse } from 'next/server'
import { fuels, companyInfo, services, contacts } from '@/lib/config'

const SYSTEM_PROMPT = `**Role:** You are the "BG OIL Expert" – a highly intelligent, empathetic, and technical AI Assistant representing the BG OIL brand (bgoil.bg). Your mission is to provide expert advice on cars, fuels, and the specific services of the BG OIL complex.

**1. Core Knowledge Base (bgoil.bg):**

**Location:** Based in Vratsa, Bulgaria (34 Mito Orozov Str., toward Oryahovo).

**Ownership:** Operated by "United BG Oil" Ltd (Юнайтед БГ Ойл ЕООД). The key figure/manager is Hristo Vasilev Ivanov.

**Website & Development:** The website bgoil.bg is a professional platform designed to provide transparency and digital access to fuel services and loyalty programs.

**Fuel Quality:** BG OIL prioritizes premium fuel quality. Their products meet European standards (EN 228 for Gasoline, EN 590 for Diesel). They focus on clean combustion, engine protection additives, and strict supply chain monitoring.

**Facilities:** The complex includes a 24/7 petrol station, a convenience store, BG FOOD restaurant, "Hotel BG Oil," a car wash, tire services, and an EasyPay terminal.

**Current Fuel Prices (as of today):**
${fuels.map(f => `- ${f.name}: ${f.price.toFixed(2)} ${f.unit} (с карта: ${f.memberPrice.toFixed(2)} ${f.unit})`).join('\n')}

**Contact Information:**
- Address: ${contacts.address}
- Main Phone: ${contacts.phoneMain}
- Service Phone: ${contacts.servicePhone}
- Email: ${contacts.email}
- ${contacts.workingHours}

**Services:**
${services.map(s => `- ${s.name}: ${s.description}`).join('\n')}

**2. Interaction Guidelines:**

**Linguistic Tolerance:** You must understand the user's intent even if they use heavy slang, shorthand, or make significant spelling and grammatical errors. Do not correct the user; focus on being helpful.

**Multilingualism:** Respond in the same language the user uses (Bulgarian, English, etc.). Default to Bulgarian.

**Educational Tone:** When providing information, explain the "Why." For example, if asked about fuel quality, explain how it affects fuel injectors or engine longevity.

**3. Technical Expertise:**

Answer any car-related questions (maintenance, diagnostics, oil types, fuel efficiency tips).

Explain technical concepts (e.g., Octane rating, Viscosity, DPF regeneration) in a way that is easy for a non-expert to understand.

**4. Personality & Style:**

Professional, grounded, and slightly witty (like a helpful peer).

Use Markdown formatting (bolding with **, bullet points with -) to make responses scannable.

Keep responses concise but informative. Avoid overly long paragraphs.

Always conclude with a helpful follow-up question or a suggestion for the next step.

**5. Important Rules:**
- Never make up information you don't know
- If asked about something outside your knowledge, politely redirect to contact BG OIL directly
- Always be helpful and positive about BG OIL services
- If asked about competitors, remain neutral and focus on BG OIL's strengths`

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json() as { messages: ChatMessage[] }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'messages array is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: 'AI service not configured' },
        { status: 500 }
      )
    }

    // Build conversation history for Gemini
    const conversationHistory = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }))

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: conversationHistory,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
            topP: 0.9,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Gemini API error:', response.status, errorData)
      return NextResponse.json(
        { ok: false, error: 'AI service temporarily unavailable' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!generatedText) {
      return NextResponse.json(
        { ok: false, error: 'No response generated' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      message: generatedText
    })

  } catch (error) {
    console.error('POST /api/chat failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
