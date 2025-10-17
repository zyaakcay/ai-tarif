// worker.js dosyasının içeriği
// Worker, istemciden gelen isteği alır, API anahtarını ekler ve Gemini API'ye iletir.

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    // Sadece POST isteklerini kabul et
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }
  
    // Worker'ın ayarlarında tanımlanan gizli anahtarı oku (AŞAMA II'de tanımlanacak)
    const apiKey = GEMINI_API_KEY; 
  
    if (!apiKey) {
      return new Response('API Key not configured in Worker environment', { status: 500 });
    }
  
    const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";
  
    // İstemciden gelen payload'ı oku
    const requestBody = await request.json();
  
    // API'ye gönderilecek isteği oluştur
    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
  
    // Gemini'den gelen yanıtı Pages'a (istemciye) direkt olarak döndür
    return new Response(geminiResponse.body, {
      status: geminiResponse.status,
      headers: {
        'Content-Type': 'application/json',
        // CORS başlıkları, farklı kaynaktan gelen isteklere izin verir
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    });
  }
  