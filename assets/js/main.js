// Small progressive enhancements only: the site works with this disabled.
document.addEventListener("DOMContentLoaded", () => {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  initCarousels();
  initLoopSliders();
});

function initCarousels() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const track = root.querySelector("[data-track]");
    const slides = Array.from(track.children);
    const dotsWrap = root.querySelector("[data-dots]");
    const prevBtn = root.querySelector("[data-prev]");
    const nextBtn = root.querySelector("[data-next]");
    const pauseBtn = root.querySelector("[data-pause]");
    const interval = 5000;
    let index = 0;
    let timer = null;
    let playing = !reduceMotion;

    slides.forEach((slide, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Show slide ${i + 1} of ${slides.length}`);
      dot.setAttribute("aria-current", i === 0 ? "true" : "false");
      dot.addEventListener("click", () => goTo(i, true));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    const viewport = root.querySelector(".carousel-viewport");

    function fit() {
      if (!viewport) return;
      const border = viewport.offsetHeight - viewport.clientHeight;
      viewport.style.height = `${slides[index].offsetHeight + border}px`;
    }

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.setAttribute("aria-current", i === index ? "true" : "false"));
      fit();
    }

    function goTo(i, userInitiated) {
      index = (i + slides.length) % slides.length;
      render();
      if (userInitiated) restart();
    }

    function next() { goTo(index + 1); }

    function start() {
      if (!playing) return;
      stop();
      timer = window.setInterval(next, interval);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    function restart() { stop(); start(); }

    function setPlaying(next) {
      playing = next;
      if (pauseBtn) {
        pauseBtn.setAttribute("aria-pressed", String(!playing));
        pauseBtn.setAttribute("aria-label", playing ? "Pause automatic rotation" : "Resume automatic rotation");
        pauseBtn.textContent = playing ? "⏸" : "▶";
      }
      if (playing) start(); else stop();
    }

    prevBtn && prevBtn.addEventListener("click", () => goTo(index - 1, true));
    nextBtn && nextBtn.addEventListener("click", () => goTo(index + 1, true));
    pauseBtn && pauseBtn.addEventListener("click", () => setPlaying(!playing));

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", () => playing && start());
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", () => playing && start());

    setPlaying(playing);
    render();
    window.addEventListener("resize", fit);
  });
}

// A continuously-stepping, seamlessly-looping strip (e.g. certifications):
// always shows several items at once, advances by one item at a time, and
// can also be dragged/scrolled manually via the viewport's own scrollbar.
function initLoopSliders() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-loop-slider]").forEach((root) => {
    const track = root.querySelector("[data-track]");
    const viewport = track.parentElement;
    const originals = Array.from(track.children);
    const count = originals.length;
    if (count === 0) return;

    // Duplicate the set once so the strip can scroll past the end and snap
    // back to an identical-looking position for a seamless loop.
    originals.forEach((item) => track.appendChild(item.cloneNode(true)));

    const interval = 2200;
    let timer = null;
    let playing = !reduceMotion;
    let userActive = false;
    let resumeTimer = null;
    let autoScrolling = false;
    let autoScrollClear = null;

    function stepPx() {
      const first = track.children[0];
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return first.getBoundingClientRect().width + gap;
    }

    // Scrolling the viewport (even programmatically) fires "scroll" events;
    // mark programmatic scrolls so they aren't mistaken for user input.
    function markAutoScroll(ms) {
      autoScrolling = true;
      window.clearTimeout(autoScrollClear);
      autoScrollClear = window.setTimeout(() => { autoScrolling = false; }, ms);
    }

    function advance() {
      const px = stepPx();
      const loopPoint = px * count;
      const next = viewport.scrollLeft + px;
      markAutoScroll(700);
      if (next >= loopPoint - 1) {
        viewport.scrollTo({ left: loopPoint, behavior: "smooth" });
        window.setTimeout(() => {
          markAutoScroll(200);
          viewport.scrollTo({ left: 0, behavior: "instant" });
        }, 500);
      } else {
        viewport.scrollTo({ left: next, behavior: "smooth" });
      }
    }

    function start() {
      if (!playing || userActive) return;
      stop();
      timer = window.setInterval(advance, interval);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }

    // A real scroll the user caused (drag, trackpad, scrollbar) pauses
    // autoplay for a few seconds, then lets it resume on its own.
    viewport.addEventListener("scroll", () => {
      if (autoScrolling) return;
      userActive = true;
      stop();
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        userActive = false;
        if (playing) start();
      }, 2500);
    }, { passive: true });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", () => !userActive && playing && start());
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", () => !userActive && playing && start());

    if (playing) start();
  });
}
