const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type");

fetch(`http://localhost:5000/events`)
  .then(res => res.json())
  .then(data => {
    const source = type === "normal" ? data.normalEvents : data.specialEvents;
    const event = source.find(e => e.id === id);
    const form = document.getElementById("edit-form");

    for (let key in event) {
      if (key !== "
