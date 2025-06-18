const csvData = `location,latitude,longitude,aqi,aqi_category,temperature,humidity,pressure,o2,n2,co2,pm25,pm10,last_updated
Jakarta,-6.200000,106.816666,72,Moderate,32.5,78,1008,20.8,78.1,415,28.5,45.7,2025-05-14T08:30:00
Surabaya,-7.250000,112.750000,63,Moderate,31.8,75,1009,20.9,78.0,410,25.3,40.2,2025-05-14T08:15:00
Bandung,-6.917464,107.619125,85,Moderate,28.2,82,1010,20.7,78.2,420,32.7,50.1,2025-05-14T08:45:00
Medan,3.589444,98.673889,95,Moderate,30.5,85,1007,20.5,78.3,425,38.6,58.9,2025-05-14T08:20:00
Semarang,-6.990280,110.421790,53,Moderate,31.0,79,1009,20.9,78.0,405,20.1,35.8,2025-05-14T08:10:00
Makassar,-5.131880,119.417730,45,Good,30.8,76,1010,21.0,77.9,395,18.2,31.5,2025-05-14T08:25:00
Palembang,-2.976074,104.773720,88,Moderate,32.2,83,1008,20.6,78.2,430,34.5,52.3,2025-05-14T08:40:00
Denpasar,-8.650000,115.216667,37,Good,29.5,74,1011,21.1,77.8,390,15.8,27.6,2025-05-14T08:35:00
Balikpapan,-1.252728,116.828505,42,Good,30.2,75,1010,21.0,77.9,388,17.5,30.2,2025-05-14T08:15:00
Yogyakarta,-7.797690,110.368490,58,Moderate,29.3,80,1009,20.8,78.1,408,22.4,37.9,2025-05-14T08:05:00
Manado,1.474830,124.842079,40,Good,30.0,73,1011,21.1,77.8,385,16.9,29.0,2025-05-14T08:50:00
Bekasi,-6.238270,107.002911,102,Unhealthy,32.7,79,1007,20.4,78.4,445,40.2,61.5,2025-05-14T08:30:00
Depok,-6.400550,106.818920,82,Moderate,32.0,77,1008,20.7,78.2,425,32.0,48.9,2025-05-14T08:20:00
Tangerang,-6.178360,106.631889,80,Moderate,32.3,78,1008,20.7,78.2,420,31.5,48.2,2025-05-14T08:25:00
Bogor,-6.600000,106.800003,65,Moderate,29.0,85,1009,20.8,78.1,415,26.0,41.8,2025-05-14T08:15:00`;

const notificationsData = [
    {
        icon: "fas fa-exclamation-triangle",
        title: "Air Quality Alert: Bekasi",
        message: "Air quality has reached unhealthy levels (102) in Bekasi. Consider reducing outdoor activities.",
        time: "45 minutes ago"
    },
    {
        icon: "fas fa-info-circle",
        title: "Weather Update: Jakarta",
        message: "Temperature has increased by 2°C in the last hour in Jakarta.",
        time: "1 hour ago"
    },
    {
        icon: "fas fa-cloud-sun",
        title: "Air Quality Improvement: Denpasar",
        message: "Air quality has improved from Moderate to Good (37) in Denpasar.",
        time: "2 hours ago"
    },
    {
        icon: "fas fa-thermometer-half",
        title: "Heat Warning: Multiple Cities",
        message: "High temperatures expected throughout the day in Jakarta, Surabaya, and Bekasi.",
        time: "3 hours ago"
    },
    {
        icon: "fas fa-lungs",
        title: "PM2.5 Level Increase: Medan",
        message: "PM2.5 levels have increased to 38.6 μg/m³ in Medan, reaching Moderate levels.",
        time: "4 hours ago"
    }
];

// Reference values for comparison (typical good air quality values)
const referenceValues = {
    o2: 20.9,     // Normal oxygen percentage (atmospheric air is ~20.95%)
    n2: 78.0,     // Normal nitrogen percentage
    co2: 400,     // Good CO2 level in ppm (lower is generally better outdoors)
    pm25: 18,     // WHO guideline for PM2.5 μg/m³ (annual mean) / 25 (24-hour mean) - using a stricter general reference
    pm10: 30      // WHO guideline for PM10 μg/m³ (annual mean) / 50 (24-hour mean) - using a stricter general reference
};

// Parse CSV data
let airQualityData = [];
let map, lightTileLayer, darkTileLayer; // Declare map-related variables globally

Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
        airQualityData = results.data.map(row => { // Convert AQI category from data or derive it
            const aqi = parseInt(row.aqi);
            if (aqi <= 50) row.aqi_category = 'Good';
            else if (aqi <= 100) row.aqi_category = 'Moderate';
            else if (aqi <= 150) row.aqi_category = 'Unhealthy';
            else if (aqi <= 200) row.aqi_category = 'Very Unhealthy';
            else row.aqi_category = 'Hazardous';
            return row;
        });
        initializeApp();
    }
});

// Initialize the application
function initializeApp() {
    // Dark mode toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        updateThemeIcon();
        updateMapTheme();
    });

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    updateThemeIcon();

    // console.log("Dark mode status:", localStorage.getItem('darkMode')); //DEBUG

    function updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
    
    function updateMapTheme() {
            if (!map) return; // Ensure map is initialized
        if (document.body.classList.contains('dark-mode')) {
            if (map.hasLayer(lightTileLayer)) map.removeLayer(lightTileLayer);
            if (!map.hasLayer(darkTileLayer)) darkTileLayer.addTo(map);
        } else {
            if (map.hasLayer(darkTileLayer)) map.removeLayer(darkTileLayer);
            if (!map.hasLayer(lightTileLayer)) lightTileLayer.addTo(map);
        }
    }

    // Set current date and time
    function updateDateTime() {
        const now = new Date();
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        
        document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', dateOptions);
        document.getElementById('current-time').textContent = now.toLocaleTimeString('en-US', timeOptions);
    }

    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Populate location dropdown
    const locationDropdown = document.getElementById('location-dropdown');
    airQualityData.forEach(item => {
        const option = document.createElement('option');
        option.value = item.location;
        option.textContent = item.location;
        locationDropdown.appendChild(option);
    });

    // Initialize map (Indonesia)
    map = L.map('map').setView([-2.5, 118], 5);

    // Create tile layers
    lightTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    
    darkTileLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        maxZoom: 20
    });
    
    // Set initial tile layer based on current mode
    updateMapTheme(); // Call this to set the initial map theme

    const markers = {};

    // Add markers to map
    airQualityData.forEach(item => {
        const markerColor = getAqiColor(item.aqi);
        const shouldBlink = parseInt(item.aqi) > 100; // Blink if AQI is Unhealthy or worse
        
        const markerIcon = L.divIcon({
            className: 'custom-marker', // General class for potential styling, not strictly needed with inline style
            html: `<div style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px ${markerColor};" class="${shouldBlink ? 'marker-blink' : ''}"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10,10] // Center the icon
        });

        const marker = L.marker([parseFloat(item.latitude), parseFloat(item.longitude)], { icon: markerIcon })
            .addTo(map)
            .bindPopup(`
                <b>${item.location}</b><br>
                AQI: ${item.aqi} (${item.aqi_category})<br>
                Temperature: ${item.temperature}°C<br>
                Updated: ${formatDateTime(item.last_updated)}
            `);

        markers[item.location] = marker;
    });

    // Handle location selection
    locationDropdown.addEventListener('change', function() {
        const selectedLocation = this.value;
        if (!selectedLocation) { // Reset to default view if "Select a location" is chosen
            resetToDefaultView();
            map.setView([-2.5, 118], 5); // Reset map view
            return;
        }
        
        const locationData = airQualityData.find(item => item.location === selectedLocation);
        if (locationData) {
            updateAirQualityCard(locationData);
            updateTemperatureCard(locationData);
            updateAirCompositionCard(locationData);
            updateDailyTip(locationData);
            
            // Center map on selected location
            map.setView([parseFloat(locationData.latitude), parseFloat(locationData.longitude)], 10);
            if(markers[selectedLocation]) markers[selectedLocation].openPopup();
        }
    });
    
    function resetToDefaultView() {
        document.getElementById('quality-badge').className = 'quality-badge quality-good';
        document.getElementById('quality-badge').textContent = 'Good';
        document.getElementById('quality-value').textContent = '0';
        document.getElementById('quality-description').textContent = 'Select a location to see air quality information.';

        document.getElementById('temperature-value').textContent = '--°C';
        document.getElementById('humidity-value').textContent = '--%';
        document.getElementById('pressure-value').textContent = '-- hPa';

        document.getElementById('o2-value').textContent = '--%';
        document.getElementById('o2-trend').innerHTML = '';
        document.getElementById('o2-trend').className = 'trend-indicator';
        document.getElementById('n2-value').textContent = '--%';
        document.getElementById('n2-trend').innerHTML = '';
        document.getElementById('n2-trend').className = 'trend-indicator';
        document.getElementById('co2-value').textContent = '-- ppm';
        document.getElementById('co2-trend').innerHTML = '';
        document.getElementById('co2-trend').className = 'trend-indicator';
        document.getElementById('pm25-value').textContent = '-- μg/m³';
        document.getElementById('pm25-trend').innerHTML = '';
        document.getElementById('pm25-trend').className = 'trend-indicator';
        document.getElementById('pm10-value').textContent = '-- μg/m³';
        document.getElementById('pm10-trend').innerHTML = '';
        document.getElementById('pm10-trend').className = 'trend-indicator';
        
        document.getElementById('daily-tip').textContent = "Select a location to see today's recommendation.";
    }


    // Update UI with data for selected location
    function updateAirQualityCard(data) {
        const qualityBadge = document.getElementById('quality-badge');
        const qualityValue = document.getElementById('quality-value');
        const qualityDescription = document.getElementById('quality-description');
        
        qualityValue.textContent = data.aqi;
        
        // Update badge class and text
        qualityBadge.className = 'quality-badge'; // Reset classes first
        qualityBadge.classList.add(getAqiClass(data.aqi));
        qualityBadge.textContent = data.aqi_category;
        
        // Update description
        qualityDescription.textContent = getAqiDescription(data.aqi);
    }

    function updateTemperatureCard(data) {
        document.getElementById('temperature-value').textContent = `${data.temperature}°C`;
        document.getElementById('humidity-value').textContent = `${data.humidity}%`;
        document.getElementById('pressure-value').textContent = `${data.pressure} hPa`;
    }

    function updateAirCompositionCard(data) {
        document.getElementById('o2-value').textContent = `${data.o2}%`;
        document.getElementById('n2-value').textContent = `${data.n2}%`;
        document.getElementById('co2-value').textContent = `${data.co2} ppm`;
        document.getElementById('pm25-value').textContent = `${data.pm25} μg/m³`;
        document.getElementById('pm10-value').textContent = `${data.pm10} μg/m³`;

        // Update trend indicators
        updateTrendIndicator('o2', parseFloat(data.o2), referenceValues.o2, 'higher_is_better');
        updateTrendIndicator('n2', parseFloat(data.n2), referenceValues.n2, 'stable_is_ideal');
        updateTrendIndicator('co2', parseFloat(data.co2), referenceValues.co2, 'lower_is_better');
        updateTrendIndicator('pm25', parseFloat(data.pm25), referenceValues.pm25, 'lower_is_better');
        updateTrendIndicator('pm10', parseFloat(data.pm10), referenceValues.pm10, 'lower_is_better');
    }

    function updateTrendIndicator(elementId, currentValue, referenceValue, interpretation) {
        // interpretation: 'lower_is_better', 'higher_is_better', 'stable_is_ideal'
        const trendElement = document.getElementById(`${elementId}-trend`);
        trendElement.innerHTML = ''; // Clear previous trend
        trendElement.className = 'trend-indicator'; // Reset classes

        let arrowIcon = '';
        let trendClass = '';
        // Threshold for significant change, e.g., 5% of reference value.
        // For O2 and N2, which are percentages, a smaller absolute threshold might be better.
        // For pollutants like CO2, PM2.5, PM10, a relative threshold might be okay.
        let significantChangeThreshold;
        if (elementId === 'o2' || elementId === 'n2') {
            significantChangeThreshold = 0.2; // Absolute change (e.g. 0.2%)
        } else {
            significantChangeThreshold = referenceValue * 0.10; // 10% relative change
        }


        if (interpretation === 'lower_is_better') { // e.g., CO2, PM2.5, PM10
            if (currentValue > referenceValue + significantChangeThreshold) {
                arrowIcon = '<i class="fas fa-arrow-up trend-arrow"></i>';
                trendClass = 'trend-up-bad'; 
            } else if (currentValue < referenceValue - significantChangeThreshold) {
                arrowIcon = '<i class="fas fa-arrow-down trend-arrow"></i>';
                trendClass = 'trend-down-good'; 
            } else {
                arrowIcon = '<i class="fas fa-minus trend-arrow"></i>';
                trendClass = 'trend-stable';
            }
        } else if (interpretation === 'higher_is_better') { // e.g., O2 (Normal O2 is good, too low is bad)
            if (currentValue < referenceValue - significantChangeThreshold) {
                arrowIcon = '<i class="fas fa-arrow-down trend-arrow"></i>';
                trendClass = 'trend-up-bad'; // Lower is bad, use red color
            } else if (currentValue > referenceValue + significantChangeThreshold) {
                    // Slightly higher O2 than reference isn't necessarily "good" in a trend way, more like "not bad" or stable if close.
                    // For significant increases beyond normal atmospheric, it could indicate an issue not covered.
                    // Let's consider it stable if it's higher but close, or use neutral.
                arrowIcon = '<i class="fas fa-arrow-up trend-arrow"></i>';
                trendClass = 'trend-down-good'; // Higher is acceptable/good, use green
            } else {
                arrowIcon = '<i class="fas fa-minus trend-arrow"></i>';
                trendClass = 'trend-stable';
            }
        } else if (interpretation === 'stable_is_ideal') { // e.g., N2
            if (currentValue > referenceValue + significantChangeThreshold || currentValue < referenceValue - significantChangeThreshold) {
                arrowIcon = currentValue > referenceValue ? '<i class="fas fa-arrow-up trend-arrow"></i>' : '<i class="fas fa-arrow-down trend-arrow"></i>';
                trendClass = 'trend-up-neutral'; // Deviation is neutral/potentially concerning
            } else {
                arrowIcon = '<i class="fas fa-minus trend-arrow"></i>';
                trendClass = 'trend-stable';
            }
        }

        if (arrowIcon && trendClass) {
            trendElement.innerHTML = arrowIcon;
            trendElement.classList.add(trendClass);
        }
    }


    function updateDailyTip(data) {
        const tipElement = document.getElementById('daily-tip');
        const aqi = parseInt(data.aqi);
        const temp = parseFloat(data.temperature);
        const humidity = parseFloat(data.humidity);
        
        let tip = "";
        
        if (aqi > 150) { // Very Unhealthy or Hazardous
            tip = `<strong>Critical Air Quality Alert (${data.aqi_category}):</strong> Avoid all outdoor activities. Keep windows closed.`;
        } else if (aqi > 100) { // Unhealthy
            tip = `<strong>Air Quality Warning (${data.aqi_category}):</strong> Limit outdoor exertion, especially for sensitive groups. Consider wearing a mask if outside.`;
        } else if (aqi > 50) { // Moderate
            tip = `<strong>Air Quality is ${data.aqi_category}:</strong> Sensitive individuals should consider reducing prolonged or heavy exertion outdoors.`;
        } else { // Good
            tip = `<strong>Air Quality is Good!</strong> It's a great day for outdoor activities.`;
        }
        
        if (temp > 32) {
            tip += " It's quite hot; stay hydrated and avoid prolonged sun exposure, especially during peak hours.";
        } else if (temp < 20 && temp > 0) { // Cool but not freezing
            tip += " Temperatures are cool; a light jacket might be comfortable if you're outdoors.";
        } else if (temp <=0 ){
                tip += " It's freezing! Dress warmly in layers if you need to go out.";
        }
        
        if (humidity > 80) {
            tip += " High humidity can make it feel warmer. Be aware of potential for rain if other conditions align.";
        } else if (humidity < 30 && temp > 25){
                tip += " It's dry and warm; remember to moisturize and stay hydrated.";
        }
        
        tipElement.innerHTML = tip; // Use innerHTML if tip contains <strong> tags
    }

    // Helper functions
    function getAqiClass(aqi) {
        aqi = parseInt(aqi);
        if (aqi <= 50) return 'quality-good';
        if (aqi <= 100) return 'quality-moderate';
        if (aqi <= 150) return 'quality-unhealthy';
        // For AQI > 150, it implies Very Unhealthy or Hazardous. The 'dangerous' class fits well.
        // The CSV data has "Unhealthy" for AQI 102 (Bekasi), so the ranges align well with this.
        return 'quality-dangerous'; // Covers > 150 (Very Unhealthy, Hazardous)
    }

    function getAqiColor(aqi) {
        aqi = parseInt(aqi);
        // These colors should ideally match the CSS variables for consistency
        // For simplicity, hardcoding here, but could fetch from CSS vars if needed.
        if (aqi <= 50) return getComputedStyle(document.documentElement).getPropertyValue('--good-color').trim(); 
        if (aqi <= 100) return getComputedStyle(document.documentElement).getPropertyValue('--moderate-color').trim();
        if (aqi <= 150) return getComputedStyle(document.documentElement).getPropertyValue('--unhealthy-color').trim();
        return getComputedStyle(document.documentElement).getPropertyValue('--danger-color').trim();
    }


    function getAqiDescription(aqi) {
        aqi = parseInt(aqi);
        if (aqi <= 50) {
            return "Air quality is considered satisfactory, and air pollution poses little or no risk.";
        } else if (aqi <= 100) {
            return "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.";
        } else if (aqi <= 150) {
            return "Members of sensitive groups may experience health effects. The general public is not likely to be affected.";
        } else if (aqi <= 200) {
                return "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.";
        } else if (aqi <= 300) {
            return "Health alert: everyone may experience more serious health effects.";
        } else {
            return "Health warnings of emergency conditions. The entire population is more likely to be affected.";
        }
    }

    function formatDateTime(dateTimeStr) {
        if (!dateTimeStr) return "N/A";
        try {
            const date = new Date(dateTimeStr);
            if (isNaN(date)) return "Invalid Date"; // Check if date is valid
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return "Invalid Date";
        }
    }

    // Populate notifications
    const notificationList = document.querySelector('.notification-list');
    notificationsData.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = 'notification-item';
        notificationItem.innerHTML = `
            <div class="notification-icon">
                <i class="${notification.icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${notification.time}</div>
            </div>
        `;
        notificationList.appendChild(notificationItem);
    });
    
    // Set initial view if no location is selected
        resetToDefaultView();
}