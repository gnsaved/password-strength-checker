(() => {
  const elPwd = document.getElementById("pwd");
  const elLen = document.getElementById("lenBox");
  const elMeterFill = document.getElementById("meterFill");
  const elStrength = document.getElementById("strengthText");

  const elCrackValue = document.getElementById("crackValue");
  const elCrackUnit  = document.getElementById("crackUnit");

  const elToggleBtn = document.getElementById("toggleBtn");
  const eye = elToggleBtn.querySelector(".eyeIcon");
  const eyeOff = elToggleBtn.querySelector(".eyeOffIcon");

  const chipLower = document.getElementById("chipLower");
  const chipUpper = document.getElementById("chipUpper");
  const chipNum   = document.getElementById("chipNum");
  const chipSym   = document.getElementById("chipSym");

  // Regex checks
  const reLower = /[a-z]/;
  const reUpper = /[A-Z]/;
  const reNum   = /[0-9]/;
  const reSym   = /[^A-Za-z0-9]/;

  // Guess speed assumption (offline / GPU-ish). This is just a demo estimate.
  const GUESSES_PER_SEC = 1e10;

  function setChip(chip, on) {
    chip.classList.toggle("isOn", !!on);
  }

  function strengthFromScore(score) {
    // 0-2 weak, 3-4 medium, 5-6 strong, 7+ very strong
    if (score <= 2) return { label: "Weak", colorVar: "--weak" };
    if (score <= 4) return { label: "Medium", colorVar: "--medium" };
    if (score <= 6) return { label: "Strong", colorVar: "--strong" };
    return { label: "Very Strong", colorVar: "--vstrong" };
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

    // small bonus for full variety + decent length
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
    // show 3 decimals for small numbers like 8.567, otherwise compact-ish
    if (!isFinite(x) || x <= 0) return "—";
    if (x < 1000) return x.toFixed(3).replace(/\.?0+$/, "");
    return Math.round(x).toLocaleString();
  }

  function crackTimeEstimate(pwd, checks) {
    const len = pwd.length;
    if (!len) return { value: "—", unit: "—" };

    const N = charsetSize(checks);

    // average tries = 0.5 * N^len
    // seconds = average_tries / guesses_per_sec
    // use log10 to avoid overflow: log10(seconds) = log10(0.5) + len*log10(N) - log10(GUESSES_PER_SEC)
    const log10Seconds = Math.log10(0.5) + (len * Math.log10(N)) - Math.log10(GUESSES_PER_SEC);

    if (log10Seconds < 0) return { value: "< 1", unit: "second" };

    const YEAR = 31557600; // 365.25 days
    const units = [
      { nameSing: "second",     namePl: "seconds",     sec: 1 },
      { nameSing: "minute",     namePl: "minutes",     sec: 60 },
      { nameSing: "hour",       namePl: "hours",       sec: 3600 },
      { nameSing: "day",        namePl: "days",        sec: 86400 },
      { nameSing: "year",       namePl: "years",       sec: YEAR },
      { nameSing: "century",    namePl: "centuries",   sec: YEAR * 100 },
      { nameSing: "millennium", namePl: "millennia",   sec: YEAR * 1000 },
      { nameSing: "million years", namePl: "million years", sec: YEAR * 1e6 },
      { nameSing: "billion years", namePl: "billion years", sec: YEAR * 1e9 },
    ];

    // pick biggest unit where value >= 1
    let chosen = units[0];
    for (const u of units) {
      const log10Unit = Math.log10(u.sec);
      if (log10Seconds - log10Unit >= 0) chosen = u;
    }

    const value = Math.pow(10, log10Seconds - Math.log10(chosen.sec));
    const valueNum = value;
    const unit = (valueNum >= 2) ? chosen.namePl : chosen.nameSing;

    return { value: formatNumberSmart(valueNum), unit };
  }

  function updateUI() {
    const pwd = elPwd.value;
    const len = pwd.length;

    const checks = {
      lower: reLower.test(pwd),
      upper: reUpper.test(pwd),
      num:   reNum.test(pwd),
      sym:   reSym.test(pwd),
    };

    elLen.textContent = String(len);

    setChip(chipLower, checks.lower);
    setChip(chipUpper, checks.upper);
    setChip(chipNum, checks.num);
    setChip(chipSym, checks.sym);

    const score = computeScore(pwd, checks);
    const s = strengthFromScore(score);

    elStrength.textContent = len ? s.label : "—";
    elMeterFill.style.background = len ? `var(${s.colorVar})` : "#9ca3af";

    const crack = crackTimeEstimate(pwd, checks);
    elCrackValue.textContent = crack.value;
    elCrackUnit.textContent = crack.unit;
  }

  function togglePassword() {
    const isHidden = elPwd.type === "password";
    elPwd.type = isHidden ? "text" : "password";
    elToggleBtn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    eye.style.display = isHidden ? "none" : "block";
    eyeOff.style.display = isHidden ? "block" : "none";
    elPwd.focus();
  }

  elPwd.addEventListener("input", updateUI);
  elToggleBtn.addEventListener("click", togglePassword);

  // init
  updateUI();
})();
