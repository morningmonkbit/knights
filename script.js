const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
toggle.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.main-nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
window.addEventListener('scroll', () => {
  document.documentElement.style.setProperty('--scrollY', `${window.scrollY}px`);
});

const heroCard = document.querySelector(".hero-card");
const heroImg = heroCard.querySelector("img");

let targetX = 0;
let targetY = 0;

let currentX = 0;
let currentY = 0;

heroCard.addEventListener("mousemove", (e) => {
    const rect = heroCard.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    targetY = (x - 0.5) * 8;
    targetX = (0.5 - y) * 8;
});

heroCard.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
});

function animate() {

    currentX += (targetX - currentX) * 0.15;
    currentY += (targetY - currentY) * 0.15;

    heroImg.style.transform = `
        perspective(1200px)
        rotateX(${currentX}deg)
        rotateY(${currentY}deg)
        translateZ(20px)
    `;

    requestAnimationFrame(animate);
}

animate();
