function updateTimeDisplay() {
  const now = new Date();
  const currentTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  document.getElementById('digital-clock').textContent = currentTime;
}

setInterval(updateTimeDisplay, 1000);
