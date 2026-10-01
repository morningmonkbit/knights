/* =========================================================
   LANDINGPAGE OPENING ANIMATION
========================================================= */

const pageTransition =
  document.querySelector("#page-transition");

/*
  Die Animation existiert nur auf der Landingpage.

  Wenn #page-transition nicht vorhanden ist,
  passiert einfach nichts.
*/
function playPageIntro() {
  if (!pageTransition) {
    document.body.classList.remove("is-loading");
    return;
  }

  /*
    Startzustand herstellen.
  */
  pageTransition.removeAttribute("style");

  pageTransition.classList.remove(
    "is-leaving"
  );

  pageTransition.classList.add(
    "is-entering"
  );

  /*
    Scrollen wieder erlauben, sobald die
    Landingpage sichtbar wird.
  */
  window.setTimeout(() => {
    document.body.classList.remove(
      "is-loading"
    );
  }, 2200);

  /*
    Transition nach Ende vollständig deaktivieren.
  */
  window.setTimeout(() => {
    pageTransition.classList.remove(
      "is-entering"
    );

    pageTransition.style.visibility =
      "hidden";

    pageTransition.style.transform =
      "translateX(100%)";

    pageTransition.style.pointerEvents =
      "none";
  }, 3100);
}


/*
  Animation starten, sobald die Landingpage
  geladen wurde.
*/
document.addEventListener(
  "DOMContentLoaded",
  () => {
    playPageIntro();
  }
);


/*
  Falls die Landingpage über den Zurück-Button
  aus dem Browser-Cache wiederhergestellt wird,
  soll kein Transition-Screen hängen bleiben.
*/
window.addEventListener(
  "pageshow",
  (event) => {
    if (!event.persisted) return;

    document.body.classList.remove(
      "is-loading"
    );

    if (!pageTransition) return;

    pageTransition.classList.remove(
      "is-entering",
      "is-leaving"
    );

    pageTransition.style.visibility =
      "hidden";

    pageTransition.style.transform =
      "translateX(100%)";

    pageTransition.style.pointerEvents =
      "none";
  }
);


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


/* =========================================================
   RESPONSIVE INTERACTION ENHANCEMENTS
========================================================= */

/*
  Mobile Navigation:
  - aria-expanded
  - Escape-Taste
  - Klick außerhalb
  - automatisches Schließen beim Wechsel auf Desktop
*/
if (toggle && nav) {
  const syncMenuState = () => {
    toggle.setAttribute(
      "aria-expanded",
      nav.classList.contains("open")
        ? "true"
        : "false"
    );
  };

  toggle.addEventListener("click", () => {
    requestAnimationFrame(syncMenuState);
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      nav.classList.contains("open")
    ) {
      nav.classList.remove("open");

      syncMenuState();

      toggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      window.innerWidth > 1100 ||
      !nav.classList.contains("open")
    ) {
      return;
    }

    if (
      nav.contains(event.target) ||
      toggle.contains(event.target)
    ) {
      return;
    }

    nav.classList.remove("open");

    syncMenuState();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) {
      nav.classList.remove("open");
    }

    syncMenuState();
  });
}


/* =========================================================
   HERO FOOTBALL – TOUCH / TABLET
========================================================= */

/*
  Desktop:
  Football reagiert weiterhin auf die Maus.

  Touch-Geräte:
  Football kann leicht mit dem Finger bewegt werden.
*/
if (heroCard && heroImg) {
  let pointerActive = false;

  let touchStartX = 0;
  let touchStartY = 0;

  const setFootballFromPointer = (
    clientX,
    clientY,
    strength = 8
  ) => {
    const rect =
      heroCard.getBoundingClientRect();

    const x = Math.max(
      0,
      Math.min(
        1,
        (clientX - rect.left) /
          rect.width
      )
    );

    const y = Math.max(
      0,
      Math.min(
        1,
        (clientY - rect.top) /
          rect.height
      )
    );

    const rotateY =
      (x - 0.5) * strength;

    const rotateX =
      (0.5 - y) * strength;

    const shiftX =
      (x - 0.5) * 18;

    const shiftY =
      (y - 0.5) * 12;

    heroImg.style.transform = `
      perspective(1200px)
      translate3d(
        ${shiftX}px,
        ${shiftY}px,
        18px
      )
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `;
  };

  heroCard.addEventListener(
    "pointerdown",
    (event) => {
      /*
        Maus wird bereits durch das normale
        Parallax-System behandelt.
      */
      if (event.pointerType === "mouse") {
        return;
      }

      pointerActive = true;

      touchStartX = event.clientX;
      touchStartY = event.clientY;

      heroCard.setPointerCapture?.(
        event.pointerId
      );
    }
  );

  heroCard.addEventListener(
    "pointermove",
    (event) => {
      if (
        !pointerActive ||
        event.pointerType === "mouse"
      ) {
        return;
      }

      const dx =
        event.clientX - touchStartX;

      const dy =
        event.clientY - touchStartY;

      /*
        Wenn hauptsächlich vertikal gewischt wird,
        soll weiterhin normal gescrollt werden können.
      */
      if (
        Math.abs(dy) >
        Math.abs(dx) * 1.35
      ) {
        return;
      }

      event.preventDefault();

      setFootballFromPointer(
        event.clientX,
        event.clientY,
        10
      );
    }
  );

  const releaseFootball = (event) => {
    if (
      event?.pointerType === "mouse"
    ) {
      return;
    }

    pointerActive = false;

    /*
      Football wieder in seine Ausgangsposition
      zurücksetzen.
    */
    heroImg.style.transform = "";
  };

  heroCard.addEventListener(
    "pointerup",
    releaseFootball
  );

  heroCard.addEventListener(
    "pointercancel",
    releaseFootball
  );
}