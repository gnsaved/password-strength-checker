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

  const RX_UPPER = /[A-Z]/;
  const RX_NUM   = /\d/;
  const RX_SYM   = /[^A-Za-z0-9]/; // any non-alphanumeric

  function setPill(type, text) {
    label.className = `pill pill--${type}`;
    label.textContent = text;
  }

  function setCheck(el, ok) {
    el.classList.toggle("ok", ok);
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
    meterFill.style.width = pct + "%";

    // Color logic: Red → Yellow → Green
    if (score <= 1) {
      setPill("red", "Weak");
      pwd.style.borderColor = "rgba(255, 80, 80, .55)";
      meterFill.style.background = "rgba(255, 80, 80, .85)";
    } else if (score === 2) {
      setPill("yellow", "Okay");
      pwd.style.borderColor = "rgba(255, 210, 90, .55)";
      meterFill.style.background = "rgba(255, 210, 90, .90)";
    } else {
      setPill("green", "Strong");
      pwd.style.borderColor = "rgba(90, 230, 160, .55)";
      meterFill.style.background = "rgba(90, 230, 160, .90)";
    }

    scoreText.textContent = `${score}/4 checks passed`;
  }

  toggle.addEventListener("click", () => {
    const isHidden = pwd.type === "password";
    pwd.type = isHidden ? "text" : "password";
    toggle.textContent = isHidden ? "Hide" : "Show";
    toggle.setAttribute("aria-pressed", String(isHidden));
    pwd.focus();
  });

  pwd.addEventListener("input", render);
  render();
})();
