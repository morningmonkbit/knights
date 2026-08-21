/* =========================================================
   PAGE TRANSITION / LOADING SCREEN
========================================================= */

const pageTransition = document.querySelector("#page-transition");

const TRANSITION_OUT_DURATION = 820;

/*
  Speichert, ob gerade ein Seitenwechsel durchgeführt wird.
  Dadurch können doppelte Klicks keine mehrfachen Navigationen
  auslösen.
*/
let pageIsLeaving = false;

/*
  Startanimation beim ersten Laden der Seite.
*/
function playPageIntro() {
  if (!pageTransition) {
    document.body.classList.remove("is-loading");
    return;
  }

  pageTransition.classList.remove("is-leaving");
  pageTransition.classList.add("is-entering");

  /*
    Scrollen wird wieder erlaubt, sobald der Screen beginnt,
    die Website freizugeben.
  */
  window.setTimeout(() => {
    document.body.classList.remove("is-loading");
  }, 2200);

  /*
    Nach dem Ende wird die Intro-Klasse entfernt.
    Der Screen bleibt durch das letzte Keyframe rechts außerhalb.
  */
  window.setTimeout(() => {
    pageTransition.classList.remove("is-entering");
    pageTransition.style.visibility = "hidden";
    pageTransition.style.transform = "translateX(100%)";
    pageTransition.style.pointerEvents = "none";
  }, 3100);
}

/*
  Prüft, ob ein Link einen richtigen Seitenwechsel auslösen soll.
*/
function shouldUsePageTransition(link, event) {
  if (!link) return false;

  const href = link.getAttribute("href");

  /*
    Keine Animation bei Links ohne Ziel.
  */
  if (!href || href.trim() === "") return false;

  /*
    Keine Animation bei bereits verhindertem Klick.
  */
  if (event.defaultPrevented) return false;

  /*
    Keine Animation bei Strg-, Cmd-, Shift- oder Alt-Klick.
    Dadurch kann weiterhin ein neuer Tab geöffnet werden.
  */
  if (
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return false;
  }

  /*
    Nur die linke Maustaste behandeln.
  */
  if (event.button !== 0) return false;

  /*
    Keine Animation für Downloads.
  */
  if (link.hasAttribute("download")) return false;

  /*
    Keine Animation bei target="_blank".
  */
  if (link.target === "_blank") return false;

  /*
    Keine Animation für Mail- und Telefonlinks.
  */
  if (
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return false;
  }

  /*
    Reine Sprunglinks wie #team oder #spiele bleiben normal.
  */
  if (href.startsWith("#")) return false;

  let targetUrl;

  try {
    targetUrl = new URL(link.href, window.location.href);
  } catch (error) {
    return false;
  }

  /*
    Externe Websites werden nicht abgefangen.
  */
  if (targetUrl.origin !== window.location.origin) {
    return false;
  }

  /*
    Ein Link auf exakt dieselbe URL benötigt keinen Übergang.
  */
  if (targetUrl.href === window.location.href) {
    return false;
  }

  /*
    Nur ein anderer Hash auf derselben Seite ist ebenfalls
    lediglich ein interner Sprung.
  */
  const currentUrl = new URL(window.location.href);

  const sameDocument =
    targetUrl.origin === currentUrl.origin &&
    targetUrl.pathname === currentUrl.pathname &&
    targetUrl.search === currentUrl.search;

  if (sameDocument && targetUrl.hash) {
    return false;
  }

  return true;
}

/*
  Übergang vor einem Wechsel zu einer anderen HTML-Seite.
*/
function playPageOutro(targetUrl) {
  if (!pageTransition || pageIsLeaving) return;

  pageIsLeaving = true;

  document.body.classList.add("is-loading");

  /*
    Alte Inline-Werte der Introanimation entfernen.
  */
  pageTransition.removeAttribute("style");

  pageTransition.classList.remove("is-entering");
  pageTransition.classList.add("is-leaving");

  /*
    Die neue Seite wird erst geöffnet, nachdem der rote Screen
    das Browserfenster vollständig bedeckt.
  */
  window.setTimeout(() => {
    window.location.href = targetUrl;
  }, TRANSITION_OUT_DURATION);
}

/*
  Klicks auf interne HTML-Seiten zentral abfangen.
*/
document.addEventListener("click", (event) => {
  const link = event.target.closest("a");

  if (!shouldUsePageTransition(link, event)) return;

  event.preventDefault();

  playPageOutro(link.href);
});

/*
  Animation starten, wenn das DOM bereit ist.
*/
document.addEventListener("DOMContentLoaded", () => {
  playPageIntro();
});

/*
  Wichtig für den Browser-Zurück-Button.
  Manche Browser laden eine Seite aus dem Back-Forward-Cache,
  ohne DOMContentLoaded erneut auszuführen.
*/
window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;

  pageIsLeaving = false;
  document.body.classList.remove("is-loading");

  if (!pageTransition) return;

  pageTransition.classList.remove(
    "is-entering",
    "is-leaving"
  );

  pageTransition.style.visibility = "hidden";
  pageTransition.style.transform = "translateX(100%)";
  pageTransition.style.pointerEvents = "none";
});


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".main-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });
}


/* =========================================================
   REVEAL ANIMATIONS
========================================================= */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.15
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  observer.observe(element);
});


/* =========================================================
   SCROLL VARIABLE
========================================================= */

window.addEventListener("scroll", () => {
  document.documentElement.style.setProperty(
    "--scrollY",
    `${window.scrollY}px`
  );
});


/* =========================================================
   HERO FOOTBALL PARALLAX
========================================================= */

const heroCard = document.querySelector(".hero-card");
const heroImg = heroCard?.querySelector("img");

if (heroCard && heroImg) {
  let targetX = 0;
  let targetY = 0;

  let currentX = 0;
  let currentY = 0;

  heroCard.addEventListener("mousemove", (event) => {
    const rect = heroCard.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) /
      rect.width;

    const y =
      (event.clientY - rect.top) /
      rect.height;

    targetY = (x - 0.5) * 8;
    targetX = (0.5 - y) * 8;
  });

  heroCard.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
  });

  function animateHeroFootball() {
    currentX +=
      (targetX - currentX) * 0.15;

    currentY +=
      (targetY - currentY) * 0.15;

    heroImg.style.transform = `
      perspective(1200px)
      rotateX(${currentX}deg)
      rotateY(${currentY}deg)
      translateZ(20px)
    `;

    requestAnimationFrame(animateHeroFootball);
  }

  animateHeroFootball();
}


/* =========================================================
   GAME RESULTS MARQUEE
========================================================= */

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
  }
];

const resultsTrack = document.querySelector(
  "#results-marquee-track"
);

if (resultsTrack && gameResults.length > 0) {
  const createResultGroup = (
    isDuplicate = false
  ) => {
    const group = document.createElement("div");

    group.classList.add(
      "results-marquee-group"
    );

    if (isDuplicate) {
      group.setAttribute(
        "aria-hidden",
        "true"
      );
    }

    gameResults.forEach((game) => {
      const result =
        document.createElement("div");

      result.classList.add("result-item");

      result.innerHTML = `
        <span class="result-team winner">
          ${game.winner}
        </span>

        <span class="result-score">
          <strong>${game.winnerScore}</strong>
          <span>:</span>
          <strong>${game.loserScore}</strong>
        </span>

        <span class="result-team">
          ${game.loser}
        </span>
      `;

      group.appendChild(result);
    });

    return group;
  };

  resultsTrack.appendChild(
    createResultGroup()
  );

  resultsTrack.appendChild(
    createResultGroup(true)
  );
}
