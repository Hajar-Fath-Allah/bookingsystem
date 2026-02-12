// ===============================
// 1) DOM references
// ===============================
const actions = document.getElementById("resourceActions");
// On récupère l'input EXISTANT dans le HTML (id="resourceName")
const resourceNameInput = document.getElementById("resourceName");

// Example roles
const role = "admin"; // "reserver" | "admin"

// Will hold references to buttons
let createButton = null;
let updateButton = null;
let deleteButton = null;

// ===============================
// 2) Button creation helpers
// ===============================
const BUTTON_BASE_CLASSES =
  "w-full rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out";

const BUTTON_ENABLED_CLASSES =
  "bg-brand-primary text-white hover:bg-brand-dark/80 shadow-soft";

function addButton({ label, type = "button", value, classes = "" }) {
  const btn = document.createElement("button");
  btn.type = type;
  btn.textContent = label;
  btn.name = "action";
  if (value) btn.value = value;

  btn.className = `${BUTTON_BASE_CLASSES} ${classes}`.trim();

  actions.appendChild(btn);
  return btn;
}

function setButtonEnabled(btn, enabled) {
  if (!btn) return;
  btn.disabled = !enabled;

  // Style visual "disabled"
  btn.classList.toggle("cursor-not-allowed", !enabled);
  btn.classList.toggle("opacity-50", !enabled);

  // Gestion du hover pour l'état enabled
  if (!enabled) {
    btn.classList.remove("hover:bg-brand-dark/80");
  } else {
    if (btn.value === "create" || btn.textContent === "Create") {
      btn.classList.add("hover:bg-brand-dark/80");
    }
  }
}

function renderActionButtons(currentRole) {
  if (currentRole === "reserver") {
    createButton = addButton({
      label: "Create",
      type: "submit",
      value: "create",
      classes: BUTTON_ENABLED_CLASSES,
    });
  }

  if (currentRole === "admin") {
    createButton = addButton({
      label: "Create",
      type: "submit",
      value: "create",
      classes: BUTTON_ENABLED_CLASSES,
    });

    updateButton = addButton({
      label: "Update",
      value: "update",
      classes: BUTTON_ENABLED_CLASSES,
    });

    deleteButton = addButton({
      label: "Delete",
      value: "delete",
      classes: BUTTON_ENABLED_CLASSES,
    });
  }

  // Par défaut : tout désactivé jusqu'à validation OK
  setButtonEnabled(createButton, false);
  setButtonEnabled(updateButton, false);
  setButtonEnabled(deleteButton, false);
}

// ===============================
// 3) Validation rules (Name + Description)
// ===============================

// Name : 5–30, lettres/chiffres/espaces (FI inclus)
function isResourceNameValid(value) {
  const trimmed = value.trim();
  const allowedPattern = /^[a-zA-Z0-9äöåÄÖÅ ]+$/;
  const lengthValid = trimmed.length >= 5 && trimmed.length <= 30;
  const charactersValid = allowedPattern.test(trimmed);
  return lengthValid && charactersValid;
}

// Description : 10–50, lettres/chiffres + ponctuation simple
function isDescriptionValid(value) {
  const trimmed = value.trim();
  const allowedPattern = /^[a-zA-Z0-9äöåÄÖÅ .,()'"!?-]+$/;
  const lengthValid = trimmed.length >= 10 && trimmed.length <= 50;
  const charactersValid = allowedPattern.test(trimmed);
  return lengthValid && charactersValid;
}

function setInputVisualState(input, state) {
  // On nettoie nos classes de validation uniquement
  input.classList.remove(
    "border-green-500",
    "bg-green-100",
    "focus:ring-green-500/30",
    "border-red-500",
    "bg-red-100",
    "focus:ring-red-500/30"
  );
  input.classList.add("focus:ring-2");

  if (state === "valid") {
    input.classList.add("border-green-500", "bg-green-100", "focus:ring-green-500/30");
  } else if (state === "invalid") {
    input.classList.add("border-red-500", "bg-red-100", "focus:ring-red-500/30");
  }
}

function recomputeCreateEnabled() {
  const nameValid = isResourceNameValid(document.getElementById("resourceName").value);
  const descValid = isDescriptionValid(document.getElementById("resourceDescription").value);
  setButtonEnabled(createButton, nameValid && descValid);
}

// ===============================
// 4) Live validation wiring
// ===============================
function attachResourceNameValidation(input) {
  const update = () => {
    const raw = input.value;
    const valid = isResourceNameValid(raw);
    setInputVisualState(input, valid ? "valid" : "invalid");
    recomputeCreateEnabled();
  };
  input.addEventListener("input", update);
  update(); // init
}

function attachDescriptionValidation() {
  const descriptionInput = document.getElementById("resourceDescription");
  const update = () => {
    const raw = descriptionInput.value;
    const valid = isDescriptionValid(raw);
    setInputVisualState(descriptionInput, valid ? "valid" : "invalid");
    recomputeCreateEnabled();
  };
  descriptionInput.addEventListener("input", update);
  update(); // init
}

// ===============================
// 5) Bootstrapping
// ===============================
renderActionButtons(role);
attachResourceNameValidation(resourceNameInput);
attachDescriptionValidation();