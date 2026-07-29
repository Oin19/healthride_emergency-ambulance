import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY missing' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return new Response(JSON.stringify({ error: 'multipart/form-data required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const form = await req.formData();
    const audio = form.get('file');
    const language = (form.get('language') as string) || null;
    if (!(audio instanceof File) || audio.size < 1024) {
      return new Response(JSON.stringify({ error: 'Empty or missing audio file' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1) Transcribe via Lovable AI Gateway
    const upstream = new FormData();
    upstream.append('model', 'openai/gpt-4o-transcribe');
    upstream.append('file', audio, audio.name || 'recording.webm');
    // Auto-detect language when not provided (safest)
    if (language) upstream.append('language', language);

    const sttRes = await fetch('https://ai.gateway.lovable.dev/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}` },
      body: upstream,
    });

    if (!sttRes.ok) {
      const errText = await sttRes.text();
      console.error('STT failed:', sttRes.status, errText);
      return new Response(JSON.stringify({ error: 'Transcription failed', status: sttRes.status, details: errText }), {
        status: sttRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sttJson = await sttRes.json();
    const transcript: string = sttJson.text || '';

    // 2) Extract structured emergency info via chat model
    let extracted = {
      emergency_type: null as string | null,
      patient_name: null as string | null,
      patient_phone: null as string | null,
      notes: transcript,
    };

    if (transcript.trim()) {
      try {
        const chatRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-3.5-flash',
            messages: [
              {
                role: 'system',
                content:
                  'You extract emergency medical dispatch info from a spoken description (may be in Hindi, Bengali, Tamil, Telugu or English). Return ONLY JSON with keys emergency_type (one of: cardiac, trauma, stroke, burns, breathing, other), patient_name (string|null), patient_phone (string|null, digits only), notes (concise English summary of symptoms/situation). No prose.',
              },
              { role: 'user', content: transcript },
            ],
            response_format: { type: 'json_object' },
          }),
        });
        if (chatRes.ok) {
          const chatJson = await chatRes.json();
          const raw = chatJson.choices?.[0]?.message?.content || '{}';
          const parsed = JSON.parse(raw);
          const validTypes = ['cardiac', 'trauma', 'stroke', 'burns', 'breathing', 'other'];
          extracted = {
            emergency_type: validTypes.includes(parsed.emergency_type) ? parsed.emergency_type : null,
            patient_name: parsed.patient_name || null,
            patient_phone: parsed.patient_phone ? String(parsed.patient_phone).replace(/[^\d+]/g, '') : null,
            notes: parsed.notes || transcript,
          };
        }
      } catch (e) {
        console.error('Extraction failed, returning raw transcript:', e);
      }
    }

    return new Response(JSON.stringify({ transcript, ...extracted }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('voice-transcribe error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});