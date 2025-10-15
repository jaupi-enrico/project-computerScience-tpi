const eventContainer = document.getElementById('eventContainer');

async function generateEvents() {
  try {
    // 🔹 Richiedi il file JSON dal server
    const response = await fetch('/api/event');
    const events = await response.json();

    // 🔹 Pulisci il container (opzionale)
    eventContainer.innerHTML = '';

    // 🔹 Genera le card dinamicamente
    events.forEach(event => {
      const card = document.createElement('div');
      card.classList.add('col');
      card.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${event.imgUrl}" alt="${event.title}" class="card-img-top">
          <div class="card-body d-flex justify-content-between align-items-start">
            <div>
              <div class="event-title fw-bold">${event.title}</div>
              <div class="event-info text-muted small">${event.info}</div>
              <div class="event-price text-success mt-1">${event.price}</div>
            </div>
            <div class="d-flex flex-column align-items-center">
              <button class="icon-btn btn btn-light btn-sm mb-1"><i class="bi bi-share"></i></button>
              <button class="icon-btn btn btn-light btn-sm"><i class="bi bi-heart"></i></button>
            </div>
          </div>
        </div>
      `;
      eventContainer.appendChild(card);
    });

  } catch (err) {
    console.error('Errore nel caricamento degli eventi:', err);
  }
}

// Avvia la generazione
generateEvents();