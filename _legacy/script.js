document.querySelector('.foot-panel1').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

document.querySelector('.search-icon').addEventListener('click', () => {
    alert('Search functionality would be implemented on the backend.');
});

// Simple carousel effect for hero section (optional, can be expanded)
const heroSection = document.querySelector('.hero-section');
const images = [
    'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop'
];

let currentImage = 0;

// Uncomment to enable auto-rotation
// setInterval(() => {
//     currentImage = (currentImage + 1) % images.length;
//     heroSection.style.backgroundImage = `url('${images[currentImage]}')`;
// }, 5000);
