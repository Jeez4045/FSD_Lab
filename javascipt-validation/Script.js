// ─────────────────────────────────────────────
//  script.js  —  Real-time Form Validation
//  Experiment 3 | TY CSE Sem 8
// ─────────────────────────────────────────────

// ── Regex Patterns ──────────────────────────
const PATTERNS = {
  name:     /^[A-Za-z\s]{3,50}$/,           // 3–50 letters & spaces only
  email:    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, // standard email format
  password: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/, // min 6 chars, letters + digits
  mobile:   /^[6-9]\d{9}$/                    // Indian 10-digit mobile (starts 6-9)
};

// ── Validation Rules ────────────────────────
const RULES = {
  name(v) {
    if (!v) return "Name is required.";
    if (v.length < 3) return "Name must be at least 3 characters.";
    if (!PATTERNS.name.test(v)) return "Only letters and spaces allowed.";
    return null;
  },
  email(v) {
    if (!v) return "Email is required.";
    if (!PATTERNS.email.test(v)) return "Enter a valid email (e.g. you@example.com).";
    return null;
  },
  password(v) {
    if (!v) return "Password is required.";
    if (v.length < 6) return "Password must be at least 6 characters.";
    if (!PATTERNS.password.test(v)) return "Include at least one letter and one number.";
    return null;
  },
  mobile(v) {
    if (!v) return "Mobile number is required.";
    if (!/^\d+$/.test(v)) return "Only digits allowed.";
    if (v.length !== 10) return "Mobile number must be exactly 10 digits.";
    if (!PATTERNS.mobile.test(v)) return "Enter a valid Indian mobile number (starts with 6–9).";
    return null;
  }
};

// ── Password Strength ────────────────────────
function getStrength(pw) {
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw))    score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { label: "Weak",   color: "#f7546a", pct: "25%" };
  if (score === 2) return { label: "Fair",   color: "#f7a254", pct: "50%" };
  if (score === 3) return { label: "Good",   color: "#f7e254", pct: "72%" };
  return             { label: "Strong", color: "#22d3a5", pct: "100%" };
}

// ── DOM helpers ─────────────────────────────
function setStatus(id, error) {
  const input = document.getElementById(id);
  const errEl = document.getElementById("err-" + id);
  const siEl  = document.getElementById("si-" + id);

  if (error) {
    input.className = "invalid";
    errEl.textContent = error;
    errEl.className = "error-msg show";
    siEl.textContent = "✕";
    siEl.className = "status-icon err show";
  } else {
    input.className = "valid";
    errEl.className = "error-msg";
    siEl.textContent = "✓";
    siEl.className = "status-icon ok show";
  }
}

function clearStatus(id) {
  const input = document.getElementById(id);
  const errEl = document.getElementById("err-" + id);
  const siEl  = document.getElementById("si-" + id);
  input.className = "";
  errEl.className = "error-msg";
  siEl.className  = "status-icon";
}

// ── Real-time listeners ──────────────────────
["name", "email", "mobile"].forEach(id => {
  const input = document.getElementById(id);

  // Validate on each keystroke (after first blur)
  input.addEventListener("blur", () => {
    const err = RULES[id](input.value.trim());
    setStatus(id, err);
  });

  input.addEventListener("input", () => {
    if (input.classList.contains("valid") || input.classList.contains("invalid")) {
      const err = RULES[id](input.value.trim());
      setStatus(id, err);
    }
  });
});

// ── Password: real-time strength + validation ─
const pwInput = document.getElementById("password");
const bar     = document.getElementById("strengthBar");
const fill    = document.getElementById("strengthFill");
const sLabel  = document.getElementById("strengthLabel");

pwInput.addEventListener("input", () => {
  const v = pwInput.value;

  if (v.length === 0) {
    bar.classList.remove("active");
    sLabel.textContent = "";
    clearStatus("password");
    return;
  }

  const s = getStrength(v);
  bar.classList.add("active");
  fill.style.width      = s.pct;
  fill.style.background = s.color;
  sLabel.textContent    = "Strength: " + s.label;
  sLabel.style.color    = s.color;

  if (pwInput.classList.contains("valid") || pwInput.classList.contains("invalid")) {
    const err = RULES.password(v);
    setStatus("password", err);
  }
});

pwInput.addEventListener("blur", () => {
  const err = RULES.password(pwInput.value);
  setStatus("password", err);
});

// ── Toggle password visibility ───────────────
document.getElementById("togglePw").addEventListener("click", function () {
  const t = pwInput.type === "password" ? "text" : "password";
  pwInput.type  = t;
  this.textContent = t === "password" ? "👁" : "🙈";
});

// ── Mobile: only allow digits while typing ───
document.getElementById("mobile").addEventListener("keypress", e => {
  if (!/\d/.test(e.key)) e.preventDefault();
});

// ── Form Submit ──────────────────────────────
document.getElementById("regForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const fields = ["name", "email", "password", "mobile"];
  let allValid = true;

  fields.forEach(id => {
    const val = document.getElementById(id).value.trim();
    const err = RULES[id](val);
    setStatus(id, err);
    if (err) allValid = false;
  });

  if (allValid) {
    // Show success state
    document.getElementById("regForm").style.display = "none";
    document.getElementById("successView").classList.add("show");
  }
});

// ── Reset ────────────────────────────────────
function resetForm() {
  const form = document.getElementById("regForm");
  form.reset();
  form.style.display = "";

  // Clear all states
  ["name", "email", "password", "mobile"].forEach(id => clearStatus(id));
  bar.classList.remove("active");
  sLabel.textContent = "";
  pwInput.type = "password";
  document.getElementById("togglePw").textContent = "👁";
  document.getElementById("successView").classList.remove("show");
}
