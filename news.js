// Dark mode toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateThemeIcon();
});

function updateThemeIcon(){
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')){
        icon.className = 'fas fa-sun';
    }else{
        icon.className = 'fas fa-moon';
    }
}

const healthAdviceData = [
    {
        title: "Wear a Mask",
        content: "Use an N95 mask on high pollution days to filter out harmful particles."
    },
    {
        title: "Purify Your Room",
        content: "Close windows and use an air purifier with HEPA filter indoors."
    },
    {
        title: "Eat Clean",
        content: "Consume antioxidant-rich fruits and vegetables to help your body combat pollution effects."
    },
    {
        title: "Stay Hydrated",
        content: "Drink plenty of water to help flush toxins from your system."
    },
    {
        title: "Monitor Air Quality",
        content: "Check real-time AQI levels before planning outdoor activities."
    },
    {
        title: "Exercise Indoors",
        content: "On bad air days, move your workout routine inside to avoid heavy breathing of polluted air."
    },
    {
        title: "Use Nasal Filters",
        content: "Consider using nasal filters or barrier creams when going outside in polluted areas."
    },
    {
        title: "Houseplants Help",
        content: "Keep air-purifying plants like spider plants or peace lilies in your living space."
    },
    {
        title: "Shower After Outdoors",
        content: "Wash your face and hair after being outside to remove settled pollutants."
    },
    {
        title: "Vitamin Protection",
        content: "Foods rich in vitamins C and E can help protect your lungs from pollution damage."
    },
    {
        title: "Avoid Peak Hours",
        content: "Limit outdoor activities during rush hours when pollution levels are highest."
    },
    {
        title: "Ventilate Wisely",
        content: "Open windows during times of lowest pollution (usually early morning) to air out your home."
    }
];

const airQualityNews = [
    {
        title: "Jakarta's Air Quality Reaches Hazardous Levels",
        content: "The Air Quality Index (AQI) in Jakarta hit 250 today, falling into the 'very unhealthy' category. Authorities advise vulnerable groups to limit outdoor activities.",
        source: "The Jakarta Post - Environmental Desk"
    },
    {
        title: "New Green Zones Planned for Surabaya",
        content: "Surabaya city council announces plans to create 15 new urban green zones to combat air pollution. The project is expected to be completed by mid-2026.",
        source: "Surabaya Environmental News"
    },
    {
        title: "Bali Implements Tourist Pollution Tax",
        content: "Starting next month, Bali will charge international visitors a $10 'environmental tax' to fund air quality improvement programs across the island.",
        source: "Bali Today"
    },
    {
        title: "Indonesian Coal Plants Under Scrutiny",
        content: "Environmental groups demand stricter emissions controls as new data shows Indonesia's coal-fired power plants are exceeding pollution limits in 60% of test cases.",
        source: "Green Indonesia Network"
    },
    {
        title: "Bandung Launches Electric Bus Fleet",
        content: "Bandung becomes the first Indonesian city to operate a fully electric public bus system, expected to reduce transport emissions by 30% in the city center.",
        source: "Bandung Metro News"
    },
    {
        title: "Forest Fires Worsen Sumatra Air Quality",
        content: "Illegal burning in Sumatra has caused the AQI to reach 180 in Pekanbaru, with haze spreading to neighboring Malaysia and Singapore.",
        source: "Sumatra Environmental Watch"
    },
    {
        title: "Government Announces New Air Quality Standards",
        content: "Indonesia updates its national air quality standards for the first time in 15 years, adopting stricter WHO-recommended limits for PM2.5 and ozone levels.",
        source: "National Environmental Agency"
    },
    {
        title: "Yogyakarta Students Develop Pollution Sensor",
        content: "A team of university students in Yogyakarta has created a low-cost air quality sensor that's 80% cheaper than commercial alternatives.",
        source: "Campus Innovation Daily"
    },
    {
        title: "Jakarta's Car-Free Day Expands to Sundays",
        content: "The popular weekly car-free event will now include Sundays along its main thoroughfares, doubling its pollution reduction impact.",
        source: "Metro Jakarta"
    },
    {
        title: "Indonesian Startups Focus on Clean Air Tech",
        content: "Venture capital funding for air quality technology startups in Indonesia has grown 300% in the past year, signaling a booming green tech sector.",
        source: "Tech Indonesia"
    }
];

function getCurrDate(){
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

// Populate Health Advice
function populateHealthAdvice(){
    const adviceContainer = document.querySelector('.left-column .news-content ul');
    if (!adviceContainer) return;

    const initialItems = 3;
    adviceContainer.innerHTML = '';

    healthAdviceData.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.title}</strong><br>${item.content}`;
        if (index >= initialItems){
            li.style.display = 'none'; //Hide other advice
        }
        adviceContainer.appendChild(li);
    });

    // "Show More" button for extra advice
    if (healthAdviceData.length > initialItems) {
        const showMoreBtn = document.createElement('button');
        showMoreBtn.textContent = 'Show More';
        showMoreBtn.className = 'show-more-btn';
        showMoreBtn.addEventListener('click', () => {
            const hiddenItems = adviceContainer.querySelectorAll('li[style="display: none;"]');
            hiddenItems.forEach(item => item.style.display = '');
            showMoreBtn.style.display = 'none';
        });


        adviceContainer.parentNode.appendChild(showMoreBtn);
    }
}

//  Populate Air Quality News
function populateAirQualityNews() {
    const newsContainer = document.querySelector('.right-column .news-content');
    if (!newsContainer) return;
    
    newsContainer.innerHTML = '';
    
    // Shuffel 3 random news items
    const shuffled = [...airQualityNews].sort(() => 0.5 - Math.random());
    const selectedNews = shuffled.slice(0, 3);
    
    selectedNews.forEach((item, index) => {
        const article = document.createElement('div');
        article.className = 'news-article';
        article.innerHTML = `
            <h3>${item.title}</h3>
            <div class="news-meta">
                <span class="news-date">${getCurrDate()}</span>
                <span class="news-source">${item.source}</span>
            </div>
            <p>${item.content}</p>
            ${index < 2 ? '<div class="news-divider"></div>' : ''}
        `;
        
        newsContainer.appendChild(article);
    });
}

function updateDateTime() {
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        
    const dateElement = document.getElementById('current-date');
    const timeElement = document.getElementById('current-time');
        
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
    }
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
    }
}

// Initialize the page
function initializePage(){
    if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    }
    updateThemeIcon();


    updateDateTime();
    setInterval(updateDateTime, 1000);

    function setActiveNavLink(){
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-links a');

        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage){
                link.classList.add('active');
            }else{
                link.classList.remove('active');
            }
        });
    }

    populateHealthAdvice();
    populateAirQualityNews();
}

document.addEventListener('DOMContentLoaded', initializePage);