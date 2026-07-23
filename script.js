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

const gameResults = [
  {
    winner: "Sassenberg Knights",
    winnerScore: 18,
    loserScore: 6,
    loser: "Paderborn Dolphins"
  },
  {
    winner: "Bielefeld Bulldogs",
    winnerScore: 13,
    loserScore: 12,
    loser: "Sassenberg Knights"
  },
  {
    winner: "Sassenberg Knights",
    winnerScore: 32,
    loserScore: 26,
    loser: "SC Greven 09 e.V."
  },

    {
    winner: "Minden Wolves",
    winnerScore: 28,
    loserScore: 12,
    loser: "Sassenberg Knights"
  },
  {
    winner: "Sassenberg Knights",
    winnerScore: 18,
    loserScore: 7,
    loser: "Bielefeld Bulldogs"
  },
    {
    winner: "Paderborn Dolphins",
    winnerScore: 36,
    loserScore: 25,
    loser: "Sassenberg Knights"
  },

  {
    winner: "Sassenberg Knights",
    winnerScore: 45,
    loserScore: 20,
    loser: "Bielefeld Bulldogs"
  },
  {
    winner: "Sassenberg Knights",
    winnerScore: 24,
    loserScore: 12,
    loser: "Minden Wolves"
  },
  {
    winner: "Sassenberg Knights",
    winnerScore: 39,
    loserScore: 19,
    loser: "SC Greven 09 e.V."
  },

];

const resultsTrack = document.querySelector("#results-marquee-track");

if (resultsTrack && gameResults.length > 0) {
  const createResultGroup = (isDuplicate = false) => {
    const group = document.createElement("div");
    group.classList.add("results-marquee-group");

    if (isDuplicate) {
      group.setAttribute("aria-hidden", "true");
    }

    gameResults.forEach((game) => {
      const result = document.createElement("div");
      result.classList.add("result-item");

      result.innerHTML = `
        <span class="result-team winner">${game.winner}</span>

        <span class="result-score">
          <strong>${game.winnerScore}</strong>
          <span>:</span>
          <strong>${game.loserScore}</strong>
        </span>

        <span class="result-team">${game.loser}</span>
      `;

      group.appendChild(result);
    });

    return group;
  };

  resultsTrack.appendChild(createResultGroup());
  resultsTrack.appendChild(createResultGroup(true));
}
