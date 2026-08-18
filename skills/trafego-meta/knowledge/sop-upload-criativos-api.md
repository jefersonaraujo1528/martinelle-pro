# SOP — Upload de Criativos via Meta Marketing API

**Versão:** 1.0.0
**Data:** 2026-05-08
**Fonte:** Lições da missão noturna NDF Workshop (L04/L05/L06 + reforço L03)
**Companion:** `sop-campanha-api.md` (criação de campanhas/adsets), `nomenclatura-protocol.md` (UTMs)

> **Por que esse SOP existe:** subir vídeo via API tem **5 armadilhas silenciosas** que a Meta não documenta direito. Esse doc previne todas.

---

## TL;DR — Pipeline correto

```
1. Re-encode ffmpeg (ANTES do upload)
   ↓
2. Upload simples se ≤95MB / chunked se >95MB
   ↓
3. Wait video_status == 'ready' (poll 8-10s)
   ↓
4. Pega thumbnail (uri do is_preferred=true)
   ↓
5. Cria adcreative com video_id + image_url + copy
   ↓
6. Cria ad referenciando creative_id
```

Pular qualquer passo = anúncio falha silenciosamente.

---

## 1. Re-encode obrigatório (ANTES do upload)

**Problema:** vídeos exportados de CapCut/editores às vezes têm muxing/metadata que Meta rejeita silenciosamente. Status fica `video_status: error` sem motivo aparente. Codecs corretos, resolução OK — Meta simplesmente não digere.

**Solução:** re-encodar com ffmpeg pra normalizar.

### Para vídeos curtos/médios (até ~2min):

```bash
ffmpeg -y -i input.mp4 \
  -c:v libx264 -profile:v high -level 4.1 -preset fast -crf 22 \
  -vf "scale='min(1080,iw)':'min(1920,ih)':force_original_aspect_ratio=decrease" \
  -c:a aac -b:a 192k -ac 2 -ar 44100 \
  -movflags +faststart -pix_fmt yuv420p \
  output.mp4
```

### Para vídeos longos (>2min) ou se 1080p falhar:

```bash
ffmpeg -y -i input.mp4 \
  -c:v libx264 -profile:v main -level 4.0 -preset fast -crf 26 \
  -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2:black" \
  -c:a aac -b:a 128k -ac 2 -ar 44100 \
  -movflags +faststart -pix_fmt yuv420p \
  output.mp4
```

**Flags críticas:**
- `+faststart` — move metadata pro início do arquivo (Meta exige)
- `pix_fmt yuv420p` — compatibilidade universal
- `profile:v high level 4.1` — máximo que Meta aceita sem reprocessar

---

## 2. Upload — escolher método pelo tamanho

### Upload simples (≤ 95MB)

```python
with open(path, 'rb') as f:
    r = requests.post(
        f"https://graph.facebook.com/v21.0/{acct}/advideos",
        data={'access_token': token, 'name': name},
        files={'source': (filename, f, 'video/mp4')},
        timeout=600,
    )
video_id = r.json()['id']
```

### Upload chunked (> 95MB)

Phase 1 — start:
```python
r = requests.post(endpoint, data={
    'access_token': token,
    'upload_phase': 'start',
    'file_size': str(size),
})
session_id = r.json()['upload_session_id']
video_id = r.json()['video_id']
start_offset = int(r.json()['start_offset'])
end_offset = int(r.json()['end_offset'])
```

Phase 2 — transfer (loop até `start_offset == end_offset`):
```python
with open(path, 'rb') as f:
    while start_offset < size:
        f.seek(start_offset)
        chunk = f.read(end_offset - start_offset)
        r = requests.post(endpoint,
            data={'access_token': token, 'upload_phase': 'transfer',
                  'upload_session_id': session_id, 'start_offset': str(start_offset)},
            files={'video_file_chunk': (filename, chunk, 'application/octet-stream')},
        )
        j = r.json()
        if int(j['start_offset']) == int(j['end_offset']):
            break
        start_offset = int(j['start_offset'])
        end_offset = int(j['end_offset'])
```

Phase 3 — finish:
```python
requests.post(endpoint, data={
    'access_token': token,
    'upload_phase': 'finish',
    'upload_session_id': session_id,
    'title': name,
})
```

### Erros comuns e fixes

| Erro | Causa | Solução |
|------|-------|---------|
| HTTP 413 Payload Too Large | Vídeo >95MB no upload simples | Usa chunked upload |
| `video_status: error` após processing | Muxing/metadata anômala (CapCut) | Re-encode com ffmpeg |
| `video_status: error` mesmo após re-encode 1080p | Vídeo longo (>2min) ou 4K | Re-encode em 720p + CRF 26 |

---

## 3. Aguardar video processado

**OBRIGATÓRIO:** não tente criar creative com `video_id` recém-criado. Meta processa em background. Aguarde `video_status == 'ready'`.

```python
def wait_ready(video_id, max_wait=600):
    deadline = time.time() + max_wait
    while time.time() < deadline:
        r = requests.get(f"{base}/{video_id}", params={
            'access_token': token,
            'fields': 'status,thumbnails{uri,is_preferred}'
        })
        j = r.json()
        st = j.get('status', {}).get('video_status')
        if st == 'ready':
            thumbs = j.get('thumbnails', {}).get('data', [])
            pref = next((t for t in thumbs if t.get('is_preferred')), thumbs[0] if thumbs else None)
            return pref.get('uri') if pref else None
        if st == 'error':
            return False
        time.sleep(8)
    return None
```

**Tempo típico de processamento:**
- Vídeo curto (<60s, <50MB): 30-60s
- Vídeo médio (60-180s, 50-100MB): 1-2 min
- Vídeo longo (>180s): 2-5 min

---

## 4. Thumbnail — OBRIGATÓRIO no creative

**Erro silencioso #1:** criar adcreative com vídeo SEM `image_url` ou `image_hash` retorna:
```
HTTP 400 — error_subcode: 1443226
"Seu anúncio precisa de uma miniatura de vídeo"
```

**Solução:** usa o `uri` do thumbnail `is_preferred` (retornado pelo `wait_ready`):

```python
spec = {
    'page_id': PAGE_ID,
    'video_data': {
        'video_id': video_id,
        'title': copy['title'],
        'message': copy['message'],
        'image_url': thumb_uri,  # ← OBRIGATÓRIO
        'call_to_action': {
            'type': 'LEARN_MORE',
            'value': {'link': URL_UTM}
        }
    }
}
r = requests.post(f"{base}/{acct}/adcreatives", data={
    'access_token': token,
    'name': creative_name,
    'object_story_spec': json.dumps(spec),
})
```

---

## 5. Upload de imagem (estática)

Bem mais simples que vídeo. Sem processamento, retorna hash imediato:

```python
with open(path, 'rb') as f:
    r = requests.post(f"{base}/{acct}/adimages",
        data={'access_token': token},
        files={filename: (filename, f, 'image/png')},
    )
# Response: {'images': {'<filename>': {'hash': '...', 'url': '...'}}}
hash = r.json()['images'][filename]['hash']
```

### Creative com imagem

```python
spec = {
    'page_id': PAGE_ID,
    'link_data': {
        'link': URL_UTM,
        'message': copy['message'],
        'name': copy['title'],          # ← título
        'image_hash': hash,             # ← hash retornado do upload
        'call_to_action': {'type': 'LEARN_MORE', 'value': {'link': URL_UTM}}
    }
}
```

---

## 6. URL UTMify padrão (Fred Dias)

**Use exatamente esta URL — não tira `xcod`, não troca macros:**

```
https://digitaldofuturo.ai/?utm_source=FB&utm_campaign={{campaign.name}}|{{campaign.id}}&utm_medium={{adset.name}}|{{adset.id}}&utm_content={{ad.name}}|{{ad.id}}&utm_term={{placement}}&xcod=FBhQwK21wXxR{{campaign.name}}|{{campaign.id}}hQwK21wXxR{{adset.name}}|{{adset.id}}hQwK21wXxR{{ad.name}}|{{ad.id}}hQwK21wXxR{{placement}}
```

**Componentes:**
- `utm_*` com macros — Meta substitui automaticamente
- `xcod=FBhQwK21wXxR...` — hash da loja na UTMify (sem isso, UTMify não bate conversões)

**NÃO substitua macros por valores estáticos** — quebra tracking.

---

## 7. Rate limit Meta — code 17

**Sintoma:** HTTP 400 com `"User request limit reached"` e `code: 17`.

**Causa:** muitas calls em curto período. Conta típica do Fred Dias aguenta ~200-400 calls/hora.

**Estratégia preventiva:**
- Sleep ≥ 0.4s entre calls em loops
- Paralelize uploads (até 5 workers) — uploads não contam tanto
- Cache configs do L01 uma vez só, não puxe a cada operação

**Quando bate o limit:**
- Espera **~1h** (não minutos) pra liberar
- Retomada: faz 1 GET teste antes de retomar bulk

---

## 8. Pipeline Python end-to-end

Template completo testado em produção:

```python
import json, os, time, requests
from concurrent.futures import ThreadPoolExecutor

token = open('/tmp/token.txt').read().strip()
acct = 'act_898704878534613'
v = 'v21.0'
base = f"https://graph.facebook.com/{v}"

# 1. Upload videos (paralelo)
def upload_video(filename, src_dir):
    path = f"{src_dir}/{filename}"
    size = os.path.getsize(path)
    name = filename.replace('.mp4', '')
    if size > 95_000_000:
        return upload_chunked(path, name, size)
    with open(path, 'rb') as f:
        r = requests.post(f"{base}/{acct}/advideos",
            data={'access_token': token, 'name': name},
            files={'source': (filename, f, 'video/mp4')},
            timeout=600)
    return name, r.json().get('id')

# 2. Upload images (paralelo)
def upload_image(rel_path, src_dir):
    filename = os.path.basename(rel_path)
    with open(f"{src_dir}/{rel_path}", 'rb') as f:
        r = requests.post(f"{base}/{acct}/adimages",
            data={'access_token': token},
            files={filename: (filename, f, 'image/png')})
    return filename, r.json()['images'][filename]['hash']

# 3. Wait + thumb
def wait_thumb(video_id, max_wait=600):
    deadline = time.time() + max_wait
    while time.time() < deadline:
        j = requests.get(f"{base}/{video_id}", params={
            'access_token': token, 'fields': 'status,thumbnails{uri,is_preferred}'
        }).json()
        st = j.get('status', {}).get('video_status')
        if st == 'ready':
            thumbs = j.get('thumbnails', {}).get('data', [])
            pref = next((t for t in thumbs if t.get('is_preferred')), thumbs[0] if thumbs else None)
            return pref.get('uri') if pref else None
        if st == 'error': return False
        time.sleep(8)

# 4. Create creative + ad
def create_video_ad(adset_id, video_id, thumb, copy, ad_name):
    spec = {
        'page_id': PAGE_ID,
        'video_data': {
            'video_id': video_id,
            'title': copy['title'],
            'message': copy['message'],
            'image_url': thumb,
            'call_to_action': {'type': 'LEARN_MORE', 'value': {'link': URL_UTM}}
        }
    }
    cr = requests.post(f"{base}/{acct}/adcreatives", data={
        'access_token': token,
        'name': f"{ad_name}_creative",
        'object_story_spec': json.dumps(spec),
    }).json()
    ad = requests.post(f"{base}/{acct}/ads", data={
        'access_token': token, 'name': ad_name, 'adset_id': adset_id,
        'creative': json.dumps({'creative_id': cr['id']}),
        'status': 'ACTIVE',
    }).json()
    return ad['id']
```

---

## Checklist pré-upload

- [ ] Vídeos re-encodados com ffmpeg (faststart + yuv420p)
- [ ] Vídeos >2min em 720p preventivo
- [ ] Token Meta carregado do 1Password (`op read "op://claude/Meta API Token (bms velhas)/notesPlain"` → parse `META_ACCESS_TOKEN=`)
- [ ] Page ID + Pixel ID + Ad Account ID identificados
- [ ] Copies + títulos prontos POR vídeo (sem placeholders)
- [ ] URL UTMify completa (com `xcod`)
- [ ] Sleep 0.4-1s entre calls em loops
- [ ] Logs do progresso (não confiar só no return value)
