// script.js
window.addEventListener('scroll', function() {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progressBar = document.getElementById('reading-bar');
    const scrollPosition = window.scrollY;
    const progress = (scrollPosition / totalHeight) * 80;

    progressBar.style.width = progress + '%';
});