document.getElementById('searchBtn').addEventListener('click', sendRequest);
document.getElementById('query').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendRequest();
});

let lastParsedData = null;

// 2. Add event listeners for the new functional buttons
document.getElementById('coordsBtn').addEventListener('click', () => displayDetails('coordinates'));
document.getElementById('eventsBtn').addEventListener('click', () => displayDetails('events'));
document.getElementById('activitiesBtn').addEventListener('click', () => displayDetails('activities'));
document.getElementById('noteBtn').addEventListener('click', () => displayDetails('note'));

/**
 * Handles the display logic for the functional buttons.
 * @param {string} key - The data key to display ('coordinates', 'events', 'activities', or 'note').
 */
function displayDetails(key) {
  const outputElement = document.getElementById('buttonOutput');
  outputElement.textContent = 'No data available.';

  if (!lastParsedData || !lastParsedData.match || lastParsedData.match.length === 0) {
    outputElement.textContent = 'Run a search first, or no match was found.';
    return;
  }

  const match = lastParsedData.match[0];
  
  switch (key) {
    case 'coordinates':
      // Format: lat,long no other text
      if (match.latitude && match.longitude) {
        outputElement.textContent = `${match.latitude},${match.longitude}`;
      } else {
        outputElement.textContent = 'Coordinates not available.';
      }
      break;
    
    case 'events':
      // Format: events to attend
      if (match.cultural_events && match.cultural_events.length > 0) {
        const eventList = match.cultural_events.map(event => 
          `- **${event.name}** (${event.month_or_season}): ${event.short_description}`
        ).join('\n');
        outputElement.innerHTML = `**Events to Attend:**\n${eventList}`;
      } else {
        outputElement.textContent = 'No cultural events listed.';
      }
      break;
    
    case 'activities':
      // Format: activities list
      if (match.activities && match.activities.length > 0) {
        const activityList = match.activities.map(activity => `- ${activity}`).join('\n');
        outputElement.textContent = `Activities List:\n${activityList}`;
      } else {
        outputElement.textContent = 'No activities listed.';
      }
      break;

    case 'note':
      // Optional time (using the note field as the 'optional time/note')
      if (lastParsedData.note) {
        outputElement.textContent = `Note/Optional Time: ${lastParsedData.note}`;
      } else {
        outputElement.textContent = 'No optional note provided.';
      }
      break;

    default:
      outputElement.textContent = 'Invalid key.';
  }
}

/**
 * Disables or enables the functional buttons.
 * @param {boolean} disabled - True to disable, False to enable.
 */
function setButtonsDisabled(disabled) {
  document.getElementById('coordsBtn').disabled = disabled;
  document.getElementById('eventsBtn').disabled = disabled;
  document.getElementById('activitiesBtn').disabled = disabled;
  document.getElementById('noteBtn').disabled = disabled;
}


async function sendRequest() {
  const query = document.getElementById('query').value;
  const outputElement = document.getElementById('buttonOutput');
  
  lastParsedData = null;
  setButtonsDisabled(true);

  if (!query.trim()) {
    outputElement.textContent = 'Please enter a place name or description in Nepal.';
    return;
  }

  try {
    outputElement.textContent = 'Searching...';

    // First fetch the API key
    let apiKey;
    try {
      const keyResponse = await fetch('https://pahilopaila-backend-demo.onrender.com/pahilopaila/getApiKey');
      const keyData = await keyResponse.json();
      apiKey = keyData.key;
    } catch (error) {
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
      "latitude": 0.0,            // decimal degrees (number)
      "longitude": 0.0,           // decimal degrees (number)
      "overview": "One-paragraph overview (string)",
      "cultural_events": [        // array of events (max 3)
        {
          "name": "Event name (string)",
          "month_or_season": "Month or season (string)",
          "short_description": "One-line description (string)"
        }
      ],
      "activities": [ "activity 1", "activity 2" ], // array of short strings (max 5)
      "match_explanation": "One-sentence explanation why this place matches the description (string)"
    }
  ],
  "note": "Optional short note (string). Use \"No matching Nepal location found.\" when matches is empty."
}

- Provide at most 1 objects inside "match" (strictly 1 no more than one place should be recommended).
- Coordinates must be numbers (decimal degrees).
- If no Nepal matching place exists eg beaches, return  {"matches":[], "note":"No matching Nepal location found."}
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

    try {
      const parsed = JSON.parse(contentStr);
      lastParsedData = parsed; // Store the parsed data
      outputElement.textContent = 'Search successful. Click a button for details.';
      
      // 3. Enable buttons if a successful match is found (or if note is present for noteBtn)
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