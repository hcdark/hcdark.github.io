// Main JavaScript file for the website
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            section.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Add responsive navigation
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Add intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all sections
    document.querySelectorAll('.narrative-section').forEach(section => {
        observer.observe(section);
    });

    // Add loading state to charts
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
        container.innerHTML = '<div class="loading">Loading visualization...</div>';
    });
});

// Add CSS for loading state
const style = document.createElement('style');
style.textContent = `
    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: #666;
        font-style: italic;
    }

    .narrative-section {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease-out, transform 0.5s ease-out;
    }

    .narrative-section.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .scrolled {
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(style); 