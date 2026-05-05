// Sync entre prospector (browser) e bot — usa Netlify Blobs
const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  // CORS para o prospector poder chamar
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Sync-Key',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const store = getStore('martinelle-doctors');

  // GET — devolve dados sincronizados (com fallback para JSON estático)
  if (event.httpMethod === 'GET') {
    try {
      const data = await store.get('current', { type: 'json' });
      if (data && Array.isArray(data) && data.length) {
        return { statusCode: 200, headers, body: JSON.stringify({ ok: true, source: 'blob', count: data.length, doctors: data }) };
      }
    } catch (e) {}
    // fallback: lê do JSON estático
    try {
      const r = await fetch('https://martinelle-pro.netlify.app/doctors-data.json');
      const fallback = await r.json();
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, source: 'static', count: fallback.length, doctors: fallback }) };
    } catch (e) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, count: 0, doctors: [] }) };
    }
  }

  // POST — recebe dados do prospector e salva no Blob
  if (event.httpMethod === 'POST') {
    try {
      const payload = JSON.parse(event.body);
      const doctors = payload.doctors;
      if (!Array.isArray(doctors)) {
        return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'doctors deve ser array' }) };
      }
      await store.setJSON('current', doctors);
      await store.setJSON('last-sync', { at: new Date().toISOString(), count: doctors.length });
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true, count: doctors.length, syncedAt: new Date().toISOString() }) };
    } catch (e) {
      return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: e.message }) };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: 'method not allowed' }) };
};
