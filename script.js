/**
 * Configuración del formulario.
 *
 * FORM_ENDPOINT: URL que recibe las solicitudes vía POST (por ejemplo, un
 * formulario de Formspree: "https://formspree.io/f/xxxxxxx").
 * Si se deja vacío, el formulario abre el cliente de correo del visitante
 * con la solicitud ya redactada y dirigida a CONTACT_EMAIL.
 */
const FORM_ENDPOINT = "";
const CONTACT_EMAIL = "contacto@agroayuda.com";

const form = document.getElementById("booking-form");
const success = document.getElementById("booking-success");
const successDetail = document.getElementById("success-detail");
const resetButton = document.getElementById("booking-reset");
const submitButton = form.querySelector('button[type="submit"]');
const dateInput = document.getElementById("date");

document.getElementById("year").textContent = new Date().getFullYear();

function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseISODate(value) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// Las reuniones se agendan a partir de mañana.
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
dateInput.min = toISODate(tomorrow);

const validators = {
  name: (v) => (v.trim().length >= 2 ? "" : "Ingresa tu nombre."),
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Ingresa un correo válido.",
  phone: (v) =>
    v.replace(/\D/g, "").length >= 7 ? "" : "Ingresa un teléfono válido.",
  date: (v) => {
    if (!v) return "Elige una fecha.";
    if (v < dateInput.min) return "Elige una fecha a partir de mañana.";
    const day = parseISODate(v).getDay();
    if (day === 0 || day === 6) return "Atendemos de lunes a viernes.";
    return "";
  },
  time: (v) => (v ? "" : "Elige una hora."),
};

function showError(name, message) {
  const input = form.elements[name];
  const field = input.closest(".field");
  const error = form.querySelector(`.error[data-for="${name}"]`);
  field.classList.toggle("invalid", Boolean(message));
  input.setAttribute("aria-invalid", message ? "true" : "false");
  error.textContent = message;
  if (message) {
    error.id = `${name}-error`;
    input.setAttribute("aria-describedby", error.id);
  } else {
    input.removeAttribute("aria-describedby");
  }
}

function validateField(name) {
  const message = validators[name](form.elements[name].value);
  showError(name, message);
  return !message;
}

function validateForm() {
  let firstInvalid = null;
  for (const name of Object.keys(validators)) {
    if (!validateField(name) && !firstInvalid) firstInvalid = form.elements[name];
  }
  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

// Revalida en vivo los campos que ya mostraron un error.
for (const name of Object.keys(validators)) {
  const input = form.elements[name];
  const handler = () => {
    if (input.closest(".field").classList.contains("invalid")) validateField(name);
  };
  input.addEventListener("input", handler);
  input.addEventListener("change", handler);
}

function formatDate(value) {
  return parseISODate(value).toLocaleDateString("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function buildMailto(data) {
  const subject = `Solicitud de reunión — ${data.name}`;
  const body = [
    `Nombre: ${data.name}`,
    `Correo: ${data.email}`,
    `Teléfono: ${data.phone}`,
    `Empresa o finca: ${data.farm || "—"}`,
    `Fecha: ${formatDate(data.date)}`,
    `Hora: ${data.time}`,
    `Modalidad: ${data.mode}`,
    "",
    data.message || "",
  ].join("\n");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

async function sendRequest(data) {
  if (!FORM_ENDPOINT) {
    window.location.href = buildMailto(data);
    return;
  }
  const response = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validateForm()) return;

  const data = Object.fromEntries(new FormData(form));
  submitButton.disabled = true;
  submitButton.textContent = "Enviando…";

  try {
    await sendRequest(data);
    successDetail.textContent = `Solicitaste una reunión por ${data.mode.toLowerCase()} el ${formatDate(
      data.date
    )} a las ${data.time}. Te escribiremos a ${data.email} para confirmarla.`;
    form.hidden = true;
    success.hidden = false;
    success.focus();
  } catch (error) {
    alert(
      `No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos a ${CONTACT_EMAIL}.`
    );
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Agendar reunión";
  }
});

resetButton.addEventListener("click", () => {
  form.reset();
  for (const name of Object.keys(validators)) showError(name, "");
  success.hidden = true;
  form.hidden = false;
  form.elements.name.focus();
});
