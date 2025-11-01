document.getElementById('searchBtn').addEventListener('click', sendRequest);
document.getElementById('query').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendRequest();
});

let lastParsedData = null;
let lastGuides = []; // store guides and render after search

// keep other buttons, remove coordsBtn
document.getElementById('eventsBtn').addEventListener('click', () => displayDetails('events'));
document.getElementById('activitiesBtn').addEventListener('click', () => displayDetails('activities'));
document.getElementById('noteBtn').addEventListener('click', () => displayDetails('note'));

document.getElementById('scrollLeft').addEventListener('click', () => scrollGuides(-300));
document.getElementById('scrollRight').addEventListener('click', () => scrollGuides(300));

/**
 * Handles the display logic for the functional buttons.
 * Removed 'coordinates' case — guides are shown automatically after search.
 */
function displayDetails(key) {
  const outputElement = document.getElementById('buttonOutput');
  outputElement.textContent = 'No data available.';

  if (!lastParsedData || !lastParsedData.match || lastParsedData.match.length === 0) {
    outputElement.textContent = 'Run a search first, or no match was found.';
    document.getElementById('guidesWrapper').classList.add('hidden');
    return;
  }

  const match = lastParsedData.match[0];

  switch (key) {
    case 'events':
      if (match.cultural_events && match.cultural_events.length > 0) {
        const eventList = match.cultural_events.map(event =>
          `- ${event.name} (${event.month_or_season}): ${event.short_description}`
        ).join('\n');
        outputElement.textContent = `Events to Attend:\n${eventList}`;
      } else {
        outputElement.textContent = 'No cultural events listed.';
      }
      // hide guides when viewing other details
      document.getElementById('guidesWrapper').classList.add('hidden');
      break;

    case 'activities':
      if (match.activities && match.activities.length > 0) {
        const activityList = match.activities.map(activity => `- ${activity}`).join('\n');
        outputElement.textContent = `Activities List:\n${activityList}`;
      } else {
        outputElement.textContent = 'No activities listed.';
      }
      document.getElementById('guidesWrapper').classList.add('hidden');
      break;

    case 'note':
      if (match.name) {
        outputElement.textContent = `Exact Location Match: ${match.name}\n`;
        if (match.match_explanation) {
          outputElement.textContent += `\nWhy this matches: ${match.match_explanation}`;
        }
        if (match.overview) {
          outputElement.textContent += `\n\nOverview: ${match.overview}`;
        }
      } else if (lastParsedData.note) {
        outputElement.textContent = lastParsedData.note;
      } else {
        outputElement.textContent = 'No location name or note provided.';
      }
      document.getElementById('guidesWrapper').classList.add('hidden');
      break;

    default:
      outputElement.textContent = 'Invalid key.';
      document.getElementById('guidesWrapper').classList.add('hidden');
  }
}

/**
 * Disables or enables the functional buttons (no coordsBtn anymore).
 */
function setButtonsDisabled(disabled) {
  document.getElementById('eventsBtn').disabled = disabled;
  document.getElementById('activitiesBtn').disabled = disabled;
  document.getElementById('noteBtn').disabled = disabled;
}

/**
 * Fetch API key from backend endpoint (returns the key string).
 */
async function getApiKey() {
  const res = await fetch('https://pahilopaila-backend-demo.onrender.com/pahilopaila/getApiKey');
  if (!res.ok) throw new Error('Failed to fetch API key');
  const json = await res.json();
  if (!json || !json.key) throw new Error('API key missing in response');
  return json.key;
}

/**
 * Fetch guides from backend using latitude and longitude.
 * Endpoint: /pahilopaila/getGuides/{latitude}/{longitude}
 */
async function getGuides(latitude, longitude) {
  try {
    const url = `https://pahilopaila-backend-demo.onrender.com/pahilopaila/getGuides/${latitude}/${longitude}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn('getGuides response not OK', res.status);
      return [];
    }
    const json = await res.json();
    // expect array of guides
    return Array.isArray(json) ? json : (json.guides || []);
  } catch (err) {
    console.error('getGuides error:', err);
    return [];
  }
}

/* Render guides into cards inside #guidesContainer and reveal wrapper */
function renderGuides(guides) {
  const wrapper = document.getElementById('guidesWrapper');
  const container = document.getElementById('guidesContainer');
  container.innerHTML = '';

  if (!guides || guides.length === 0) {
    wrapper.classList.add('hidden');
    return;
  }

  guides.forEach(g => {
    const card = document.createElement('div');
    card.className = 'guide-card';
    card.innerHTML = `
      <h4>${escapeHtml(g.name || 'Unknown')}</h4>
      <div class="guide-meta">Rate: ${g.rate ? '$' + g.rate : 'N/A'}</div>
      <div class="guide-meta">Languages: ${Array.isArray(g.languages) ? g.languages.join(', ') : (g.languages || 'N/A')}</div>
      <div class="guide-meta">Coords: ${g.latitude || '-'} / ${g.longitude || '-'}</div>
      <div class="guide-actions">
        <a href="${escapeAttr(g.website)}" target="_blank" rel="noopener">Website</a>
        <button class="detailBtn">Details</button>
      </div>
      <div class="guide-extra" style="display:none; margin-top:8px; font-size:0.9rem; color:#444;">
        <div>Email: ${escapeHtml(g.email || 'N/A')}</div>
        <div>ID: ${escapeHtml(String(g.id || ''))}</div>
      </div>
    `;
    // toggle details
    const detailBtn = card.querySelector('.detailBtn');
    const extra = card.querySelector('.guide-extra');
    detailBtn.addEventListener('click', () => {
      extra.style.display = extra.style.display === 'none' ? 'block' : 'none';
    });

    container.appendChild(card);
  });

  wrapper.classList.remove('hidden');
  // ensure container starts scrolled to left
  document.getElementById('guidesContainer').scrollLeft = 0;
}

/* scroll guides viewport horizontally by px */
function scrollGuides(px) {
  const viewport = document.getElementById('guidesContainer');
  if (!viewport) return;
  viewport.scrollBy({ left: px, behavior: 'smooth' });
}

/* small helper to avoid injection when inserting user/backend strings */
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function escapeAttr(str) {
  if (!str) return '#';
  return str.replace(/"/g, '%22');
}

/* sendRequest: render guides immediately after search when guides exist */
async function sendRequest() {
  const query = document.getElementById('query').value;
  const outputElement = document.getElementById('buttonOutput');

  lastParsedData = null;
  lastGuides = [];
  setButtonsDisabled(true);

  if (!query.trim()) {
    outputElement.textContent = 'Please enter a place name or description in Nepal.';
    return;
  }

  try {
    outputElement.textContent = 'Searching...';

    // fetch API key
    let apiKey;
    try {
      apiKey = await getApiKey();
    } catch (error) {
      console.error('API key fetch error:', error);
      outputElement.textContent = 'Failed to fetch API key';
      return;
    }

    const promptText = `
You are an assistant that maps a user description to real places within Nepal.
User description: "${query}"

OUTPUT REQUIREMENTS — STRICT JSON ONLY:
- Reply with a single JSON object and NOTHING ELSE (no markdown, no prose).
- The JSON must exactly follow this schema:

{
  "match": [
    {
      "name": "Place name (string)",
      "latitude": 0.0,
      "longitude": 0.0,
      "overview": "One-paragraph overview (string)",
      "cultural_events": [
        {
          "name": "Event name (string)",
          "month_or_season": "Month or season (string)",
          "short_description": "One-line description (string)"
        }
      ],
      "activities": [ "activity 1", "activity 2" ],
      "match_explanation": "One-sentence explanation why this place matches the description (string)"
    }
  ],
  "note": "Optional short note (string). Use \"No matching Nepal location found.\" when matches is empty."
}

- Provide at most 1 objects inside "match" (strictly 1 no more than one place should be recommended).
- Coordinates must be numbers (decimal degrees).
- If no Nepal matching place exists eg beaches, return  {"matches":[], "note":"No matching Nepal location found."}
- Do NOT include any additional fields, HTML, or commentary.

Respond concisely and only as the described JSON.
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.5-flash-lite-preview-09-2025",
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": promptText
              }
            ]
          }
        ],
        "temperature": 0.2,
        "max_tokens": 600
      })
    });

    const data = await response.json();
    const raw = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content)
      || data.choices?.[0]?.text
      || data.text
      || JSON.stringify(data, null, 2);

    const contentStr = Array.isArray(raw) ? raw.map(r => (r.text || r)).join('') : String(raw);

    // after parsing response (replace the parsing block in your file with this logic)
    try {
      const parsed = JSON.parse(contentStr);
      lastParsedData = parsed;

      if (parsed.match && parsed.match.length > 0) {
        const m = parsed.match[0];
        const lat = Number(m.latitude);
        const lon = Number(m.longitude);
        if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
          // fetch guides, store and render immediately
          const guides = await getGuides(lat, lon);
          lastGuides = Array.isArray(guides) ? guides : [];
          if (lastGuides.length) {
            renderGuides(lastGuides); // show guides immediately after search
            outputElement.textContent = `Search successful. ${lastGuides.length} guide(s) found.`;
          } else {
            document.getElementById('guidesWrapper').classList.add('hidden');
            outputElement.textContent = 'Search successful. No guides found. Click a button for details.';
          }
        } else {
          outputElement.textContent = 'Search successful. Coordinates invalid. Click a button for details.';
        }
      } else {
        outputElement.textContent = 'Search successful. No place match found.';
        document.getElementById('guidesWrapper').classList.add('hidden');
      }

      setButtonsDisabled(false);

    } catch (e) {
      outputElement.textContent = 'Error in response processing. Raw JSON was invalid.';
      setButtonsDisabled(true);
    }

  } catch (error) {
    outputElement.textContent = 'Request failed due to network or API error.';
    setButtonsDisabled(true);
  }
}