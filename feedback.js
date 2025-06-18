const forumData = [
    {
        username: "EcoWarrior",
        avatar: "E",
        date: "May 15, 2025",
        title: "Inconsistent Air Quality Readings in South Jakarta",
        content: "I've been monitoring the air quality in South Jakarta for the past week and noticed significant discrepancies between your readings and my personal air quality monitor. My readings show consistently higher PM2.5 levels (about 5-10% higher). Could there be an issue with the calibration of your sensors in this area? Happy to provide my data for comparison.",
        likes: 12,
        comments: 8
    },
    {
        username: "CleanAirAdvocate",
        avatar: "C",
        date: "May 14, 2025",
        title: "Feature Request: Historical Data Access",
        content: "The current version of your app only shows real-time and 24-hour air quality data. It would be extremely useful to have access to historical data from the past months or even years. This would help us understand trends and seasonal patterns in air quality. Could you consider adding this feature in a future update?",
        likes: 24,
        comments: 15
    },
    {
        username: "UrbanPlanner22",
        avatar: "U",
        date: "May 13, 2025",
        title: "Map Visualization Improvement Needed",
        content: "I use your service for urban planning projects, and while the data is excellent, the map visualization could use some improvements. Specifically, the color coding for different air quality levels can be hard to distinguish in some areas, especially where markers are close together. Perhaps adding an option to view heat map overlays instead of just markers would make spatial patterns more apparent?",
        likes: 18,
        comments: 7
    },
    {
        username: "HealthResearcher",
        avatar: "H",
        date: "May 12, 2025",
        title: "Excellent Data for Research Purposes",
        content: "I wanted to thank you for providing such comprehensive air quality data. My research team has been using it to study correlations between air quality and respiratory health incidents in Jakarta. The detailed breakdown of various pollutants has been invaluable. One suggestion: it would be helpful if the data could be easily exported",
        likes: 31,
        comments: 12
    },
    {
        username: "TechGuru99",
        avatar: "T",
        date: "May 10, 2025",
        title: "App Performance Issues on Older Devices",
        content: "I've been experiencing significant lag and occasional crashes when using the app on my older Android device (running Android 11). The map takes a long time to load, and selecting different locations sometimes causes the app to freeze. I understand that newer features require more resources, but it would be great if you could optimize performance for users with older hardware too.",
        likes: 9,
        comments: 22
    }
];

// DOM Elements
const forumBtn = document.getElementById('forum-btn');
const feedbackBtn = document.getElementById('feedback-btn');
const forumSection = document.getElementById('forum-section');
const formSection = document.getElementById('form-section');
const themeToggle = document.getElementById('theme-toggle');
const feedbackForm = document.getElementById('feedback-form');

// Update date and time
function updateDateTime() {
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', dateOptions);
    document.getElementById('current-time').textContent = now.toLocaleTimeString('en-US', timeOptions);
}

// Toggle between forum and feedback form
forumBtn.addEventListener('click', () => {
    forumBtn.classList.add('active');
    feedbackBtn.classList.remove('active');
    forumSection.style.display = 'grid';
    formSection.style.display = 'none';
});

feedbackBtn.addEventListener('click', () => {
    feedbackBtn.classList.add('active');
    forumBtn.classList.remove('active');
    formSection.style.display = 'block';
    forumSection.style.display = 'none';
});

// Dark mode toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    updateThemeIcon();
});

updateThemeIcon();

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Form submission
feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const complaintType = document.querySelector('input[name="complaint-type"]:checked').value;
    const description = document.getElementById('description').value;
    
    alert(`Thank you for your feedback, ${name}!\n\nYour ${complaintType.toLowerCase()} has been submitted successfully. We'll get back to you at ${email} as soon as possible.`);
    
    feedbackForm.reset();
    forumBtn.click();
});

// Populate forum sample data
function populateForum() {
    forumSection.innerHTML = '';
    
    forumData.forEach(post => {
        const forumItem = document.createElement('div');
        forumItem.className = 'forum-item';
        
        forumItem.innerHTML = `
            <div class="forum-header">
                <div class="user-info">
                    <div class="user-avatar">${post.avatar}</div>
                    <div class="user-details">
                        <div class="username">${post.username}</div>
                        <div class="post-date">${post.date}</div>
                    </div>
                </div>
            </div>
            <div class="forum-title">${post.title}</div>
            <div class="forum-content">${post.content}</div>
            <div class="forum-footer">
                <div class="forum-action">
                    <i class="fas fa-thumbs-up"></i>
                    <span>${post.likes}</span>
                </div>
                <div class="forum-action">
                    <i class="fas fa-comment"></i>
                    <span>${post.comments}</span>
                </div>
            </div>
        `;
        
        forumSection.appendChild(forumItem);
    });
}

// Initialize the page
function initializePage() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    updateThemeIcon();


    updateDateTime();
    setInterval(updateDateTime, 1000);
    populateForum();

    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    if (action === 'send') {   
        if (feedbackBtn) {
            feedbackBtn.click();
        }
    }
}

document.addEventListener('DOMContentLoaded', initializePage);