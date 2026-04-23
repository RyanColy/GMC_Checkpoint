// ─── WMO Weather Code Maps ────────────────────────────
const WMO_ICON = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌦️',
  61: '🌧️', 63: '🌧️', 65: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '🌨️',
  80: '🌧️', 81: '🌧️', 82: '🌧️',
  95: '⛈️', 96: '⛈️', 99: '⛈️'
};

const WMO_DESC = {
  0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy Fog',
  51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
  61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
  71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow',
  80: 'Rain Showers', 81: 'Showers', 82: 'Heavy Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Severe Thunderstorm'
};

const DAYS      = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const WIND_DIRS = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];

// ─── Helpers ──────────────────────────────────────────
const icon = code => WMO_ICON[code]  ?? '🌡️';
const desc = code => WMO_DESC[code]  ?? 'Unknown';

function formatTime(isoStr) {
  const d = new Date(isoStr);
  let h = d.getHours();
  const m    = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function humidityStatus(h) {
  if (h < 30) return 'Low';
  if (h < 60) return 'Normal';
  if (h < 80) return 'High';
  return 'Very High';
}

function visibilityStatus(km) {
  if (km >= 10) return 'Excellent';
  if (km >= 5)  return 'Average';
  if (km >= 2)  return 'Poor';
  return 'Very Poor';
}

function aqiStatus(aqi) {
  if (aqi <= 20)  return 'Good';
  if (aqi <= 40)  return 'Fair';
  if (aqi <= 60)  return 'Moderate';
  if (aqi <= 80)  return 'Poor';
  if (aqi <= 100) return 'Very Poor';
  return 'Hazardous';
}

function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

// ─── API Calls ────────────────────────────────────────
async function geocode(city) {
  const res  = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
  const data = await res.json();
  if (!data.results?.length) throw new Error('City not found');
  return data.results[0];
}

async function geocodeSuggestions(query) {
  const res  = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`);
  const data = await res.json();
  return data.results ?? [];
}

async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat, longitude: lon,
    current_weather: true,
    hourly: 'relativehumidity_2m,visibility,uv_index',
    daily:  'weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,windspeed_10m_max',
    timezone: 'auto',
    wind_speed_unit: 'kmh'
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  return res.json();
}

async function fetchAQI(lat, lon) {
  const res  = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi`);
  const data = await res.json();
  return data.current?.european_aqi ?? null;
}

async function fetchCityImage(cityName) {
  try {
    const res  = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`);
    const data = await res.json();
    return data.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}

// ─── Autocomplete ─────────────────────────────────────
const suggestionsEl = document.getElementById('suggestions');
const cityInput     = document.getElementById('city-input');

const handleInput = debounce(async (query) => {
  if (query.length < 2) { suggestionsEl.classList.add('hidden'); return; }

  const results = await geocodeSuggestions(query);
  if (!results.length) { suggestionsEl.classList.add('hidden'); return; }

  suggestionsEl.innerHTML = '';
  results.forEach(r => {
    const item = document.createElement('div');
    item.className = 'px-4 py-3 cursor-pointer hover:bg-gray-50 text-sm text-gray-700 border-b border-gray-100 last:border-0 transition-colors flex items-center gap-2';
    item.innerHTML = `
      <span class="text-base">📍</span>
      <span>
        <span class="font-medium">${r.name}</span>
        <span class="text-gray-400 ml-1">${r.admin1 ? r.admin1 + ', ' : ''}${r.country}</span>
      </span>
    `;
    item.addEventListener('mousedown', () => {
      suggestionsEl.classList.add('hidden');
      cityInput.value = '';
      search(r.name);
    });
    suggestionsEl.appendChild(item);
  });
  suggestionsEl.classList.remove('hidden');
}, 300);

cityInput.addEventListener('input',  e => handleInput(e.target.value.trim()));
cityInput.addEventListener('blur',   () => setTimeout(() => suggestionsEl.classList.add('hidden'), 150));
cityInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const city = cityInput.value.trim();
    suggestionsEl.classList.add('hidden');
    if (city) search(city);
  }
});

// ─── DOM Update ───────────────────────────────────────
let lastWeatherData = null;

function updateUI(location, weather, aqi) {
  const now    = new Date();
  const cw     = weather.current_weather;
  const hourly = weather.hourly;
  const daily  = weather.daily;

  lastWeatherData = { location, weather, aqi };

  // Current hour index
  const currentHourStr = `${now.toISOString().slice(0, 13)}:00`;
  let hIdx = hourly.time.findIndex(t => t === currentHourStr);
  if (hIdx === -1) hIdx = now.getHours();

  const humidity = hourly.relativehumidity_2m[hIdx] ?? 0;
  const visKm    = ((hourly.visibility[hIdx] ?? 0) / 1000).toFixed(1);
  const uv       = Math.round(hourly.uv_index[hIdx] ?? 0);
  const rainProb = daily.precipitation_probability_max[0] ?? 0;

  // ── Sidebar ──
  document.getElementById('main-icon').textContent   = icon(cw.weathercode);
  document.getElementById('temperature').textContent = `${Math.round(cw.temperature)}°C`;
  document.getElementById('description').textContent = desc(cw.weathercode);
  document.getElementById('rain').textContent        = `Rain - ${rainProb}%`;
  document.getElementById('city-name').textContent   = `${location.name}, ${location.country_code}`;

  const dd = now.getDate().toString().padStart(2, '0');
  const mm = (now.getMonth() + 1).toString().padStart(2, '0');
  document.getElementById('date').textContent = `${DAYS_FULL[now.getDay()]}, ${dd}.${mm}`;

  // City card background image (Wikipedia)
  fetchCityImage(location.name).then(imgUrl => {
    const cityCard = document.getElementById('city-card');
    if (imgUrl) {
      cityCard.style.backgroundImage    = `url('${imgUrl}')`;
      cityCard.style.backgroundSize     = 'cover';
      cityCard.style.backgroundPosition = 'center';
    }
  });

  // ── Highlights ──
  document.getElementById('uv-value').textContent = uv;
  const uvPct = Math.min(Math.round((uv / 11) * 100), 100);
  document.getElementById('uv-gauge').style.setProperty('--pct', `${uvPct}%`);

  const dirIndex = Math.round(cw.winddirection / 22.5) % 16;
  document.getElementById('wind-speed').textContent = Math.round(cw.windspeed);
  document.getElementById('wind-dir').textContent   = WIND_DIRS[dirIndex];

  document.getElementById('sunrise').textContent = formatTime(daily.sunrise[0]);
  document.getElementById('sunset').textContent  = formatTime(daily.sunset[0]);

  document.getElementById('humidity').textContent        = humidity;
  document.getElementById('humidity-bar').style.width    = `${humidity}%`;
  document.getElementById('humidity-status').textContent = humidityStatus(humidity);

  document.getElementById('visibility').textContent        = visKm;
  document.getElementById('visibility-status').textContent = visibilityStatus(parseFloat(visKm));

  document.getElementById('aqi').textContent        = aqi !== null ? aqi   : 'N/A';
  document.getElementById('aqi-status').textContent = aqi !== null ? aqiStatus(aqi) : '--';

  // ── Weekly forecast strip ──
  renderForecastStrip(daily);

  // ── Week list view ──
  renderWeekList(daily);
}

function renderForecastStrip(daily) {
  const el = document.getElementById('weekly-forecast');
  el.innerHTML = '';
  const now = new Date();

  for (let i = 0; i < 7; i++) {
    const d       = new Date(now);
    d.setDate(d.getDate() + i);
    const isToday = i === 0;

    const card = document.createElement('div');
    card.className = [
      'flex flex-col items-center gap-2 py-4 px-2 rounded-2xl cursor-default select-none',
      isToday ? 'forecast-card-active' : 'bg-gray-50 hover:bg-gray-100 transition-colors'
    ].join(' ');

    card.innerHTML = `
      <span class="text-xs font-medium uppercase tracking-wide text-gray-400">${DAYS[d.getDay()]}</span>
      <span class="text-2xl leading-none">${icon(daily.weathercode[i])}</span>
      <span class="text-sm font-semibold ${isToday ? 'text-white' : 'text-night'}">${Math.round(daily.temperature_2m_max[i])}°</span>
      <span class="text-xs ${isToday ? 'text-gray-400' : 'text-gray-400'}">${Math.round(daily.temperature_2m_min[i])}°</span>
    `;
    el.appendChild(card);
  }
}

function renderWeekList(daily) {
  const list = document.getElementById('week-list');
  list.innerHTML = '';
  // Hide detail panel when new data loads
  document.getElementById('day-detail').classList.add('hidden');
  const now = new Date();

  for (let i = 0; i < 7; i++) {
    const d     = new Date(now);
    d.setDate(d.getDate() + i);
    const label = i === 0 ? 'Today' : DAYS_FULL[d.getDay()];
    const rain  = daily.precipitation_probability_max[i] ?? 0;
    const wind  = Math.round(daily.windspeed_10m_max[i] ?? 0);

    const row = document.createElement('div');
    row.className = 'week-row flex items-center gap-4 bg-gray-50 rounded-2xl px-5 py-4 hover:bg-gray-100 transition-colors cursor-pointer select-none';
    row.dataset.index = i;
    row.innerHTML = `
      <span class="w-20 text-sm font-medium ${i === 0 ? 'text-night' : 'text-gray-500'}">${label}</span>
      <span class="text-2xl">${icon(daily.weathercode[i])}</span>
      <span class="flex-1 text-sm text-gray-500">${desc(daily.weathercode[i])}</span>
      <div class="flex items-center gap-1 text-xs text-blue-400 w-14 justify-end">
        <span>💧</span><span>${rain}%</span>
      </div>
      <div class="flex items-center gap-1 text-xs text-gray-400 w-16 justify-end">
        <span>💨</span><span>${wind} km/h</span>
      </div>
      <div class="flex items-center gap-2 text-sm font-medium w-16 justify-end">
        <span class="text-night">${Math.round(daily.temperature_2m_max[i])}°</span>
        <span class="text-gray-400">${Math.round(daily.temperature_2m_min[i])}°</span>
      </div>
      <span class="text-gray-300 text-xs ml-1">›</span>
    `;

    row.addEventListener('click', () => {
      // Toggle: if already active, close detail
      const wasActive = row.classList.contains('row-active');
      list.querySelectorAll('.week-row').forEach(r => {
        r.classList.remove('row-active', '!bg-night');
        r.querySelectorAll('span, div').forEach(el => el.classList.remove('!text-white', '!text-gray-300'));
      });

      if (wasActive) {
        document.getElementById('day-detail').classList.add('hidden');
        return;
      }

      row.classList.add('row-active', '!bg-night');
      showDayDetail(i, daily);
    });

    list.appendChild(row);
  }
}

function showDayDetail(index, daily) {
  const now   = new Date();
  const d     = new Date(now);
  d.setDate(d.getDate() + index);
  const label = index === 0 ? 'Today' : DAYS_FULL[d.getDay()];

  document.getElementById('detail-icon').textContent    = icon(daily.weathercode[index]);
  document.getElementById('detail-day').textContent     = label;
  document.getElementById('detail-desc').textContent    = desc(daily.weathercode[index]);
  document.getElementById('detail-max').textContent     = `${Math.round(daily.temperature_2m_max[index])}°`;
  document.getElementById('detail-min').textContent     = `${Math.round(daily.temperature_2m_min[index])}°`;
  document.getElementById('detail-rain').textContent    = `${daily.precipitation_probability_max[index] ?? 0}%`;
  document.getElementById('detail-wind').textContent    = `${Math.round(daily.windspeed_10m_max[index])} km/h`;
  document.getElementById('detail-sunrise').textContent = formatTime(daily.sunrise[index]);
  document.getElementById('detail-sunset').textContent  = formatTime(daily.sunset[index]);

  const panel = document.getElementById('day-detail');
  panel.classList.remove('hidden');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── Tab Switching ────────────────────────────────────
const todayView = document.getElementById('today-view');
const weekView  = document.getElementById('week-view');

document.getElementById('tab-today').addEventListener('click', () => {
  setActiveTab('today');
  todayView.classList.remove('hidden');
  weekView.classList.add('hidden');
});

document.getElementById('tab-week').addEventListener('click', () => {
  setActiveTab('week');
  weekView.classList.remove('hidden');
  todayView.classList.add('hidden');
});

function setActiveTab(tab) {
  const todayBtn = document.getElementById('tab-today');
  const weekBtn  = document.getElementById('tab-week');
  const isToday  = tab === 'today';

  todayBtn.classList.toggle('bg-white',      isToday);
  todayBtn.classList.toggle('text-night',    isToday);
  todayBtn.classList.toggle('shadow-sm',     isToday);
  todayBtn.classList.toggle('text-gray-400', !isToday);

  weekBtn.classList.toggle('bg-white',      !isToday);
  weekBtn.classList.toggle('text-night',    !isToday);
  weekBtn.classList.toggle('shadow-sm',     !isToday);
  weekBtn.classList.toggle('text-gray-400',  isToday);
}

// ─── Main Search ──────────────────────────────────────
async function search(city) {
  try {
    const location = await geocode(city);
    const [weather, aqi] = await Promise.all([
      fetchWeather(location.latitude, location.longitude),
      fetchAQI(location.latitude, location.longitude)
    ]);
    updateUI(location, weather, aqi);
  } catch (err) {
    const msg = err.message === 'City not found'
      ? 'City not found. Try another name.'
      : 'Could not fetch weather. Check your connection.';
    alert(msg);
  }
}

// ─── Boot ─────────────────────────────────────────────
search('Paris');
