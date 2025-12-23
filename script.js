document.addEventListener("DOMContentLoaded", () => {
  /* ❄️ SNOW CONTAINER */
  const snowContainer = document.createElement("div");
  snowContainer.style.position = "fixed";
  snowContainer.style.top = "0";
  snowContainer.style.left = "0";
  snowContainer.style.width = "100%";
  snowContainer.style.height = "100%";
  snowContainer.style.pointerEvents = "none";
  snowContainer.style.zIndex = "5";
  document.body.appendChild(snowContainer);

  /* ☃️ SNOWMAN + SNOWWOMAN (REPLACES MOUNDS) */
  const snowPeople = {
    man: {
      el: document.createElement("div"),
      snow: 0,
      side: "left",
    },
    woman: {
      el: document.createElement("div"),
      snow: 0,
      side: "right",
    },
  };

  Object.values(snowPeople).forEach((person) => {
    const el = person.el;
    el.className = `snowman ${person.side}`;

    el.innerHTML =
      person.side === "left"
        ? `
      <div class="body"></div>
      <div class="head"></div>
      <div class="eye left"></div>
      <div class="eye right"></div>
      <div class="nose"></div>
    `
        : `
      <div class="body"></div>
      <div class="head"></div>
      <div class="eye left"></div>
      <div class="eye right"></div>
      <div class="nose"></div>
      <div class="lashes"></div>
      <div class="scarf"></div>
    `;

    el.style.position = "fixed";
    el.style.bottom = "0";
    el.style[person.side] = "20px";
    el.style.opacity = "0";
    el.style.transform = "scale(0.6)";
    el.style.transition = "opacity 2s ease, transform 2s ease";
    el.style.pointerEvents = "none";
    el.style.zIndex = "4";

    document.body.appendChild(el);
  });

  /* ❄️ SNOW BUILDS THE SNOWMEN */
  function buildSnow(amount) {
    Object.values(snowPeople).forEach((person) => {
      person.snow = Math.min(person.snow + amount * 0.04, 160);

      // scale based on snow amount
      const scale = Math.min(0.6 + (person.snow / 160) * 0.4, 1);

      person.el.style.opacity = person.snow > 30 ? "1" : "0";
      person.el.style.transform = `scale(${scale})`;
    });
  }

  /* ❄️ SNOWFLAKES */
  function createSnowflake() {
    const snowflake = document.createElement("div");
    snowflake.textContent = "•";

    const size = Math.random() * 20 + 4; // ❄️ FIXED SIZE
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 3 + 6;
    const opacity = Math.random() * 0.6 + 0.3;

    snowflake.style.position = "absolute";
    snowflake.style.left = `${startX}px`;
    snowflake.style.top = "-10px";
    snowflake.style.fontSize = `${size}px`;
    snowflake.style.opacity = opacity;
    snowflake.style.color = "#ffffff";

    snowContainer.appendChild(snowflake);

    const fall = snowflake.animate(
      [
        { transform: "translateY(0px)" },
        { transform: `translateY(${window.innerHeight}px)` },
      ],
      { duration: duration * 1500, easing: "linear" }
    );

    fall.onfinish = () => {
      snowflake.remove();
      buildSnow(size);
    };
  }

  setInterval(createSnowflake, 180);

  /* 🧩 PUZZLES */
  document.querySelectorAll(".puzzle").forEach((puzzle) => {
    const imageSrc = puzzle.dataset.image;
    const captionText = puzzle.dataset.caption;

    const size = 300; // ✅ MATCHES CSS
    const pieceSize = size / 2;

    puzzle.style.width = `${size}px`;
    puzzle.style.height = `${size}px`;
    puzzle.style.display = "grid";
    puzzle.style.gridTemplateColumns = "repeat(2, 1fr)";
    puzzle.style.gridTemplateRows = "repeat(2, 1fr)";
    puzzle.style.gap = "6px";
    puzzle.style.margin = "3rem auto";

    const positions = [
      { x: 0, y: 0 },
      { x: -pieceSize, y: 0 },
      { x: 0, y: -pieceSize },
      { x: -pieceSize, y: -pieceSize },
    ];

    let pieces = [];

    positions.forEach((pos, index) => {
      const piece = document.createElement("div");
      piece.classList.add("piece");

      piece.dataset.correct = index;
      piece.dataset.current = index;

      piece.style.backgroundImage = `url(${imageSrc})`;
      piece.style.backgroundSize = `${size}px ${size}px`;
      piece.style.backgroundPosition = `${pos.x}px ${pos.y}px`;
      piece.style.cursor = "pointer";

      pieces.push(piece);
    });

    pieces.sort(() => Math.random() - 0.5);
    pieces.forEach((p, i) => {
      p.dataset.current = i;
      puzzle.appendChild(p);
    });

    let selected = null;
    let solved = false;

    pieces.forEach((piece) => {
      piece.addEventListener("click", () => {
        if (solved) return;

        if (!selected) {
          selected = piece;
          piece.style.outline = "3px solid #f0c987";
        } else {
          swap(selected, piece);
          selected.style.outline = "none";
          selected = null;
          checkSolved();
        }
      });
    });

    function swap(a, b) {
      const tempPos = a.style.backgroundPosition;
      a.style.backgroundPosition = b.style.backgroundPosition;
      b.style.backgroundPosition = tempPos;

      const temp = a.dataset.current;
      a.dataset.current = b.dataset.current;
      b.dataset.current = temp;
    }

    function checkSolved() {
      const solvedNow = [...puzzle.children].every(
        (piece) => piece.dataset.current === piece.dataset.correct
      );

      if (solvedNow) {
        solved = true;
        revealImage();
      }
    }

    function revealImage() {
      revealImageInternal();
    }

    function revealImageInternal() {
      puzzle.classList.add("solved");

      const wrapper = document.createElement("div");
      wrapper.className = "photo";
      wrapper.style.opacity = "0";

      const img = document.createElement("img");
      img.src = imageSrc;

      const caption = document.createElement("div");
      caption.className = "caption";
      caption.textContent = captionText;

      wrapper.appendChild(img);
      wrapper.appendChild(caption);

      img.onload = () => {
        puzzle.replaceWith(wrapper);
        requestAnimationFrame(() => {
          wrapper.style.opacity = "1";
        });
      };
    }

    const solveBtn = document.createElement("button");
    solveBtn.textContent = "Solve ";
    solveBtn.className = "solve-btn";
    function solvePuzzle() {
      if (solved) return;

      pieces.forEach((piece) => {
        piece.dataset.current = piece.dataset.correct;
        const pos = positions[piece.dataset.correct];
        piece.style.backgroundPosition = `${pos.x}px ${pos.y}px`;
      });

      solved = true;
      revealImage();
    }

solveBtn.addEventListener("click", () => {
  solvePuzzle();

  if (solved) return;

  pieces.forEach((piece) => {
    piece.dataset.current = piece.dataset.correct;

    const pos = positions[piece.dataset.correct];
    piece.style.backgroundPosition = `${pos.x}px ${pos.y}px`;
  });



  solved = true;
  revealImage();
});

    puzzle.appendChild(solveBtn);

  });
});
