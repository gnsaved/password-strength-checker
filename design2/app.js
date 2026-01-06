(() => {
  const elPwd = document.getElementById("pwd");
  const elLen = document.getElementById("lenBox");
  const elMeter = document.querySelector(".meter");
  const elMeterFill = document.getElementById("meterFill");
  const elStrength = document.getElementById("strengthText");

  const elCrackValue = document.getElementById("crackValue");
  const elCrackUnit = document.getElementById("crackUnit");

  const elToggleBtn = document.getElementById("toggleBtn");
  const eye = elToggleBtn?.querySelector(".eyeIcon");
  const eyeOff = elToggleBtn?.querySelector(".eyeOffIcon");

  const chipLower = document.getElementById("chipLower");
  const chipUpper = document.getElementById("chipUpper");
  const chipNum = document.getElementById("chipNum");
  const chipSym = document.getElementById("chipSym");

  // Guard: if essential nodes missing, don’t crash page
  if (!elPwd || !elLen || !elMeterFill || !elStrength || !elCrackValue || !elCrackUnit || !elToggleBtn) return;

  // Regex checks
  const reLower = /[a-z]/;
  const reUpper = /[A-Z]/;
  const reNum = /[0-9]/;
  const reSym = /[^A-Za-z0-9]/;

  // Guess speed assumption (offline / GPU-ish). Demo estimate.
  const GUESSES_PER_SEC = 1e10;

  function setChip(chip, on) {
    if (!chip) return;
    chip.classList.toggle("isOn", !!on);
    // Optional: announce state to screen readers
    chip.setAttribute("aria-checked", on ? "true" : "false");
  }

  function strengthFromScore(score) {
    // 0-2 weak, 3-4 medium, 5-6 strong, 7+ very strong
    if (score <= 2) return { label: "Weak", colorVar: "--weak", level: 1 };
    if (score <= 4) return { label: "Medium", colorVar: "--medium", level: 2 };
    if (score <= 6) return { label: "Strong", colorVar: "--strong", level: 3 };
    return { label: "Very Strong", colorVar: "--vstrong", level: 4 };
  }

  function computeScore(pwd, checks) {
    const len = pwd.length;
    let score = 0;

    // length tiers
    if (len >= 6) score += 1;
    if (len >= 10) score += 1;
    if (len >= 14) score += 1;

    // variety
    if (checks.lower) score += 1;
    if (checks.upper) score += 1;
    if (checks.num) score += 1;
    if (checks.sym) score += 1;

    // bonus for full variety + decent length
    if (len >= 12 && checks.lower && checks.upper && checks.num && checks.sym) score += 1;

    return score;
  }

  function charsetSize(checks) {
    let size = 0;
    if (checks.lower) size += 26;
    if (checks.upper) size += 26;
    if (checks.num) size += 10;
    if (checks.sym) size += 33; // rough printable symbols bucket
    return Math.max(size, 1);
  }

  function formatNumberSmart(x) {
    if (!isFinite(x) || x <= 0) return "—";
    if (x < 1000) return x.toFixed(3).replace(/\.?0+$/, "");
    return Math.round(x).toLocaleString();
  }

  function crackTimeEstimate(pwd, checks) {
    const len = pwd.length;
    if (!len) return { value: "—", unit: "—" };

    const N = charsetSize(checks);

    const log10Seconds =
      Math.log10(0.5) + (len * Math.log10(N)) - Math.log10(GUESSES_PER_SEC);

    if (log10Seconds < 0) return { value: "< 1", unit: "second" };

    const YEAR = 31557600;
    const units = [
      { nameSing: "second", namePl: "seconds", sec: 1 },
      { nameSing: "minute", namePl: "minutes", sec: 60 },
      { nameSing: "hour", namePl: "hours", sec: 3600 },
      { nameSing: "day", namePl: "days", sec: 86400 },
      { nameSing: "year", namePl: "years", sec: YEAR },
      { nameSing: "century", namePl: "centuries", sec: YEAR * 100 },
      { nameSing: "millennium", namePl: "millennia", sec: YEAR * 1000 },
      { nameSing: "million years", namePl: "million years", sec: YEAR * 1e6 },
      { nameSing: "billion years", namePl: "billion years", sec: YEAR * 1e9 },
    ];

    let chosen = units[0];
    for (const u of units) {
      const log10Unit = Math.log10(u.sec);
      if (log10Seconds - log10Unit >= 0) chosen = u;
    }

    const valueNum = Math.pow(10, log10Seconds - Math.log10(chosen.sec));
    const unit = valueNum >= 2 ? chosen.namePl : chosen.nameSing;

    return { value: formatNumberSmart(valueNum), unit };
  }

  function updateMeter(level, hasValue) {
    // level: 0..4
    const safeLevel = hasValue ? Math.max(0, Math.min(4, level)) : 0;
    const percent = (safeLevel / 4) * 100;

    elMeterFill.style.width = `${percent}%`;

    if (elMeter) {
      elMeter.setAttribute("aria-valuenow", String(safeLevel));
    }
  }

  function updateUI() {
    const pwd = elPwd.value || "";
    const len = pwd.length;

    const checks = {
      lower: reLower.test(pwd),
      upper: reUpper.test(pwd),
      num: reNum.test(pwd),
      sym: reSym.test(pwd),
    };

    elLen.textContent = String(len);

    setChip(chipLower, checks.lower);
    setChip(chipUpper, checks.upper);
    setChip(chipNum, checks.num);
    setChip(chipSym, checks.sym);

    const score = computeScore(pwd, checks);
    const s = strengthFromScore(score);

    elStrength.textContent = len ? s.label : "—";
    elMeterFill.style.background = len ? `var(${s.colorVar})` : "";

    updateMeter(s.level, len > 0);

    const crack = crackTimeEstimate(pwd, checks);
    elCrackValue.textContent = crack.value;
    elCrackUnit.textContent = crack.unit;
  }

  function togglePassword() {
    const isHidden = elPwd.type === "password";
    elPwd.type = isHidden ? "text" : "password";

    elToggleBtn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    elToggleBtn.setAttribute("aria-pressed", isHidden ? "true" : "false");

    if (eye) eye.style.display = isHidden ? "none" : "block";
    if (eyeOff) eyeOff.style.display = isHidden ? "block" : "none";

    elPwd.focus();
  }

  elPwd.addEventListener("input", updateUI);
  elToggleBtn.addEventListener("click", togglePassword);

  // init
  updateUI();
})();
