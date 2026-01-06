(() => {
  const pwd = document.getElementById("pwd");
  const toggle = document.getElementById("toggle");

  const meter = document.querySelector(".meter");
  const meterFill = document.getElementById("meterFill");
  const label = document.getElementById("label");
  const scoreText = document.getElementById("scoreText");

  const cLen = document.getElementById("cLen");
  const cUp  = document.getElementById("cUp");
  const cNum = document.getElementById("cNum");
  const cSym = document.getElementById("cSym");

  // Guard: don't crash if markup changes
  if (
    !pwd || !toggle || !meter || !meterFill || !label || !scoreText ||
    !cLen || !cUp || !cNum || !cSym
  ) return;

  const RX_UPPER = /[A-Z]/;
  const RX_NUM   = /\d/;
  const RX_SYM   = /[^A-Za-z0-9]/; // any non-alphanumeric

  function setPill(type, text) {
    label.className = `pill pill--${type}`;
    label.textContent = text;
  }

  function setCheck(el, ok) {
    el.classList.toggle("ok", ok);
    el.setAttribute("aria-checked", ok ? "true" : "false");
  }

  function setTheme(theme) {
    // theme: "weak" | "okay" | "strong"
    pwd.dataset.strength = theme;
    meterFill.dataset.strength = theme;
  }

  function render() {
    const v = pwd.value || "";

    const okLen = v.length >= 8;
    const okUp  = RX_UPPER.test(v);
    const okNum = RX_NUM.test(v);
    const okSym = RX_SYM.test(v);

    setCheck(cLen, okLen);
    setCheck(cUp,  okUp);
    setCheck(cNum, okNum);
    setCheck(cSym, okSym);

    const score = [okLen, okUp, okNum, okSym].filter(Boolean).length;
    const pct = Math.round((score / 4) * 100);

    meter.setAttribute("aria-valuenow", String(pct));
    meterFill.style.width = `${pct}%`;

    // Strength label + theme (colors handled in CSS)
    if (score <= 1) {
      setPill("red", "Weak");
      setTheme("weak");
    } else if (score === 2) {
      setPill("yellow", "Okay");
      setTheme("okay");
    } else {
      setPill("green", "Strong");
      setTheme("strong");
    }

    scoreText.textContent = `${score}/4 checks passed`;
  }

  toggle.addEventListener("click", () => {
    const isHidden = pwd.type === "password";
    pwd.type = isHidden ? "text" : "password";
    toggle.textContent = isHidden ? "Hide" : "Show";
    toggle.setAttribute("aria-pressed", isHidden ? "true" : "false");
    pwd.focus();
  });

  pwd.addEventListener("input", render);

  // init
  render();
})();
