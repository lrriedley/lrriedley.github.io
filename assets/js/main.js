// Small progressive enhancements only — the site works with this disabled.
document.addEventListener("DOMContentLoaded", () => {
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  initCarousels();
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
