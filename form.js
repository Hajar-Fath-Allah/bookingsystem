// ===============================
// Form handling for resources page
// ===============================

// -------------- Helpers --------------
function $(id) {
  return document.getElementById(id);
}

function cleaned(value) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function logSection(title, data) {
  console.group(title);
  console.log(data);
  console.groupEnd();
}

// RÈGLES PARTAGÉES (identiques à resources.js)
const NAME_ALLOWED = /^[a-zA-Z0-9äöåÄÖÅ ]+$/;        // 5..30
const DESC_ALLOWED = /^[a-zA-Z0-9äöåÄÖÅ .,()'"!?-]+$/; // 10..50

function nameIsValid(v) {
  const t = cleaned(v);
  return t.length >= 5 && t.length <= 30 && NAME_ALLOWED.test(t);
}

function descIsValid(v) {
  const t = cleaned(v);
  return t.length >= 10 && t.length <= 50 && DESC_ALLOWED.test(t);
}

// -------------- Form wiring --------------
document.addEventListener("DOMContentLoaded", () => {
  const form = $("resourceForm");
  if (!form) {
    console.warn('resourceForm not found. Ensure the form has id="resourceForm".');
    return;
  }
  form.addEventListener("submit", onSubmit);
});

async function onSubmit(event) {
  event.preventDefault();

  const submitter = event.submitter;
  const actionValue = submitter && submitter.value ? submitter.value : "create";

  // Nettoyage + trim
  const name = cleaned($("resourceName")?.value ?? "");
  const description = cleaned($("resourceDescription")?.value ?? "");
  const available = $("resourceAvailable")?.checked ?? false;
  const price = $("resourcePrice")?.value ?? "";
  const unit = document.querySelector("input[name='resourcePriceUnit']:checked")?.value ?? "";

  // VALIDATION FINALE AVANT ENVOI (mêmes règles)
  if (!nameIsValid(name) || !descIsValid(description)) {
    alert("Please correct invalid fields before submitting.");
    console.warn("Form blocked. Invalid input.");
    return; // ❌ ne pas envoyer
  }

  const payload = {
    action: actionValue,
    resourceName: name,
    resourceDescription: description,
    resourceAvailable: available,
    resourcePrice: price,
    resourcePriceUnit: unit
  };

  logSection("Sending payload", payload);

  try {
    // Remplace par ton vrai backend si dispo
    const response = await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      alert("Server returned an error. Please try again.");
      throw new Error(`HTTP ${response.status} ${response.statusText}\n${text}`);
    }

    const data = await response.json();
    console.group("Response");
    console.log("Status:", response.status);
    console.log("URL:", data.url);
    console.log("Echo:", data.json);
    console.groupEnd();

    alert("Resource submitted successfully!");
  } catch (err) {
    console.error("POST error:", err);
    alert("Network error. Please try later.");
  }
}