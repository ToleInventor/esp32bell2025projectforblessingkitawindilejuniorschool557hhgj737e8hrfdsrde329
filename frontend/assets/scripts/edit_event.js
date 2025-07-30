const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");
const eventType = params.get("type"); // normal or special

const form = document.getElementById("edit-form");

fetch("http://localhost:5000/events")
  .then(res => res.json())
  .then(data => {
    const source = eventType === "normal" ? data.normalEvents : data.specialEvents;
    const event = source.find(e => e.id === eventId);
    if (!event) return alert("Event not found!");

    renderForm(event);
  });

function renderForm(event) {
  form.innerHTML = ""; // Clear existing

  const fields = eventType === "normal"
    ? [
        { label: "Title", key: "title", type: "text" },
        { label: "Time", key: "time", type: "time" },
        { label: "Delay", key: "delay", type: "number" },
        { label: "Tone", key: "tone", type: "text" },
        { label: "Days (comma-separated)", key: "days", type: "text", value: event.days.join(", ") },
        { label: "Active", key: "active", type: "checkbox" }
      ]
    : [
        { label: "Date", key: "date", type: "date" },
        { label: "Time", key: "time", type: "time" },
        { label: "Description", key: "description", type: "text" },
        { label: "Tone", key: "tone", type: "text" }
      ];

  fields.forEach(field => {
    const wrapper = document.createElement("div");
    const label = document.createElement("label");
    label.textContent = field.label;
    const input = document.createElement("input");
    input.type = field.type;
    input.id = field.key;
    input.value = field.value ?? event[field.key] ?? "";
    if (field.type === "checkbox") input.checked = event[field.key];

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    form.appendChild(wrapper);
  });
}

function submitUpdate() {
  const updated = {};
  const inputs = document.querySelectorAll("#edit-form input");

  inputs.forEach(inp => {
    if (inp.type === "checkbox") {
      updated[inp.id] = inp.checked;
    } else if (inp.id === "days") {
      updated.days = inp.value.split(',').map(d => d.trim());
    } else {
      updated[inp.id] = inp.value;
    }
  });

  fetch(`http://localhost:5000/event/${eventId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      collection: eventType === "normal" ? "normalEvents" : "specialEvents",
      update: updated
    })
  }).then(res => res.json())
    .then(msg => {
      alert("Event updated!");
      window.location.href = "index.html";
    });
}
