function saveEvent() {
  const type = document.getElementById("type_of_event").value;
  let payload = {};

  if (type === "normal") {
    payload = {
      title: document.getElementById("tile").value,
      time: document.getElementById("time").value,
      delay: Number(document.getElementById("delay").value) || 0,
      tone: document.getElementById("tone").value,
      active: true,
      days: getDaysArray(),
      createdAt: new Date().toISOString()
    };
  } else {
    payload = {
      date: document.getElementById("specialDate").value,
      time: document.getElementById("specialTime").value,
      description: document.getElementById("specialDescription").value,
      tone: document.getElementById("specialTone").value,
      createdAt: new Date().toISOString()
    };
  }

  fetch('http://localhost:5000/event', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, payload })
  }).then(res => res.json())
    .then(msg => alert(msg.status));
}

function getDaysArray() {
  const val = document.getElementById("days").value;
  if (val === "Weekdays") return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  if (val === "Weekends") return ["Saturday", "Sunday"];
  if (val === "All days") return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const manual = prompt("Enter comma-separated days:");
  return manual.split(',').map(d => d.trim());
}
