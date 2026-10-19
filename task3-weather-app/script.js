/**
 * Live Weather Telemetry Application
 * Datheon Full Stack Web Development Internship (Task 3)
 * Student: Paras Nakum (ID: DT-2026-YQFWW)
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const searchForm = document.getElementById('weatherSearchForm');
    const cityInput = document.getElementById('cityInput');
    const quickCityButtons = document.querySelectorAll('.quick-city-btn');
    const errorBanner = document.getElementById('errorBanner');
    const errorMessage = document.getElementById('errorMessage');
    const loadingState = document.getElementById('loadingState');
    const weatherDisplay = document.getElementById('weatherDisplay');

    // Telemetry DOM Elements
    const cityNameEl = document.getElementById('cityName');
    const countryCodeEl = document.getElementById('countryCode');
    const currentDateEl = document.getElementById('currentDate');
    const currentTempEl = document.getElementById('currentTemp');
    const weatherConditionEl = document.getElementById('weatherCondition');
    const feelsLikeEl = document.getElementById('feelsLike');
    const weatherIconLargeEl = document.getElementById('weatherIconLarge');

    const humidityEl = document.getElementById('humidity');
    const windSpeedEl = document.getElementById('windSpeed');
    const pressureEl = document.getElementById('pressure');
    const visibilityEl = document.getElementById('visibility');
    const forecastGrid = document.getElementById('forecastGrid');

    // Default City on Initial Load
    fetchWeatherForCity('Surat');

    // Event Listeners
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherForCity(city);
        }
    });

    quickCityButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const city = btn.getAttribute('data-city');
            cityInput.value = city;
            fetchWeatherForCity(city);
        });
    });

    /**
     * Fetch Weather for Specified City
     * Uses Open-Meteo Geocoding + Weather Telemetry API (No API key needed, zero 401 rate-limit issues)
     */
    async function fetchWeatherForCity(city) {
        showLoading();
        hideError();

        try {
            // 1. Geocode City to Lat/Long
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
            if (!geoRes.ok) throw new Error('Geocoding service unavailable');
            
            const geoData = await geoRes.json();
            if (!geoData.results || geoData.results.length === 0) {
                throw new Error(`City "${city}" not found. Please verify spelling.`);
            }

            const location = geoData.results[0];
            const lat = location.latitude;
            const lon = location.longitude;
            const resolvedCityName = location.name;
            const country = location.country_code || location.country || '';

            // 2. Fetch Live Weather & 5-Day Daily Forecast
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
            if (!weatherRes.ok) throw new Error('Weather telemetry service unavailable');

            const weatherData = await weatherRes.json();

            // 3. Render Data to View
            renderTelemetry(resolvedCityName, country, weatherData);
            hideLoading();
        } catch (err) {
            hideLoading();
            showError(err.message || 'Unable to retrieve telemetry for the requested city.');
        }
    }

    /**
     * Render telemetry and update UI theme
     */
    function renderTelemetry(city, country, data) {
        const current = data.current;
        const daily = data.daily;

        cityNameEl.textContent = city;
        countryCodeEl.textContent = country.toUpperCase();

        const now = new Date();
        currentDateEl.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Current Metrics
        const temp = Math.round(current.temperature_2m);
        const apparentTemp = Math.round(current.apparent_temperature);
        currentTempEl.textContent = temp;
        feelsLikeEl.textContent = `${apparentTemp}°C`;

        humidityEl.textContent = `${current.relative_humidity_2m}%`;
        windSpeedEl.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
        pressureEl.textContent = `${Math.round(current.surface_pressure)} hPa`;
        visibilityEl.textContent = `10 km`;

        // Weather Code Interpretation
        const weatherMeta = parseWmoCode(current.weather_code, current.is_day);
        weatherConditionEl.textContent = weatherMeta.description;
        weatherIconLargeEl.innerHTML = `<i class="${weatherMeta.icon}"></i>`;

        // Dynamic Background Gradient
        updateBackgroundTheme(weatherMeta.theme);

        // 4. Render 5-Day Forecast using Array.map()
        renderForecastCards(daily);

        weatherDisplay.style.display = 'block';
    }

    /**
     * Render Forecast Cards
     */
    function renderForecastCards(daily) {
        forecastGrid.innerHTML = '';

        // Daily arrays have dates, weather_codes, max, min
        // Take next 5 days (from index 1 to 5)
        const daysToDisplay = daily.time.slice(1, 6);

        const forecastCardsHtml = daysToDisplay.map((dateStr, index) => {
            const actualIndex = index + 1;
            const dateObj = new Date(dateStr);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            const code = daily.weather_code[actualIndex];
            const meta = parseWmoCode(code, 1);
            const maxTemp = Math.round(daily.temperature_2m_max[actualIndex]);
            const minTemp = Math.round(daily.temperature_2m_min[actualIndex]);

            return `
                <div class="forecast-card">
                    <span class="fc-day">${dayName}</span>
                    <span class="fc-date">${formattedDate}</span>
                    <div class="fc-icon" style="color: ${meta.color}">
                        <i class="${meta.icon}"></i>
                    </div>
                    <div>
                        <span class="fc-temp-max">${maxTemp}°</span> / 
                        <span class="fc-temp-min">${minTemp}°</span>
                    </div>
                    <span class="fc-desc">${meta.description}</span>
                </div>
            `;
        }).join('');

        forecastGrid.innerHTML = forecastCardsHtml;
    }

    /**
     * WMO Weather Interpretation Code
     */
    function parseWmoCode(code, isDay = 1) {
        // Clear sky
        if (code === 0) {
            return isDay ? {
                description: 'Clear Sky / Sunny',
                icon: 'fas fa-sun',
                color: '#fbbf24',
                theme: 'weather-theme-sunny'
            } : {
                description: 'Clear Night',
                icon: 'fas fa-moon',
                color: '#e2e8f0',
                theme: 'weather-theme-clear-night'
            };
        }
        // Mainly clear, partly cloudy
        if (code === 1 || code === 2) {
            return isDay ? {
                description: 'Partly Cloudy',
                icon: 'fas fa-cloud-sun',
                color: '#fcd34d',
                theme: 'weather-theme-sunny'
            } : {
                description: 'Partly Cloudy',
                icon: 'fas fa-cloud-moon',
                color: '#94a3b8',
                theme: 'weather-theme-clear-night'
            };
        }
        // Overcast
        if (code === 3) {
            return {
                description: 'Overcast',
                icon: 'fas fa-cloud',
                color: '#94a3b8',
                theme: 'weather-theme-cloudy'
            };
        }
        // Fog
        if (code === 45 || code === 48) {
            return {
                description: 'Fog / Mist',
                icon: 'fas fa-smog',
                color: '#cbd5e1',
                theme: 'weather-theme-cloudy'
            };
        }
        // Drizzle & Rain
        if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
            return {
                description: 'Rain Showers',
                icon: 'fas fa-cloud-showers-heavy',
                color: '#38bdf8',
                theme: 'weather-theme-rainy'
            };
        }
        // Snow
        if ([71, 73, 75, 77, 85, 86].includes(code)) {
            return {
                description: 'Snow Fall',
                icon: 'fas fa-snowflake',
                color: '#e0f2fe',
                theme: 'weather-theme-cloudy'
            };
        }
        // Thunderstorm
        if ([95, 96, 99].includes(code)) {
            return {
                description: 'Thunderstorm',
                icon: 'fas fa-bolt-lightning',
                color: '#facc15',
                theme: 'weather-theme-thunder'
            };
        }

        return {
            description: 'Scattered Weather',
            icon: 'fas fa-cloud',
            color: '#cbd5e1',
            theme: 'weather-theme-default'
        };
    }

    /**
     * Update Background Dynamic Theme
     */
    function updateBackgroundTheme(themeClass) {
        document.body.className = '';
        document.body.classList.add(themeClass);
    }

    function showLoading() {
        loadingState.style.display = 'block';
        weatherDisplay.style.display = 'none';
    }

    function hideLoading() {
        loadingState.style.display = 'none';
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorBanner.style.display = 'flex';
    }

    function hideError() {
        errorBanner.style.display = 'none';
    }
});
