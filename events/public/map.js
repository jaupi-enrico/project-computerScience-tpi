async function loadEvents() {
    const response = await fetch('/api/event');
    if (!response.ok) throw new Error('Errore nel caricamento eventi');
    const events = await response.json();

    // Inizializza la mappa centrata su Brescia
    const map = L.map('map').setView([45.5416, 10.2118], 13);

    // Layer OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Funzione per aggiungere marker dinamici
    events.forEach(event => {
    // Usa coordinate x/y se presenti, altrimenti usa Brescia centro
    const lat = event.x || 45.5416;
    const lon = event.y || 10.2118;

    // Popup con dettagli dell'evento
    const popupContent = `
        <strong>${event.title}</strong><br/>
        ${event.date} - ${event.time}<br/>
        ${event.location}<br/>
        Prezzo: €${event.price}<br/>
        ${event.favorite ? '❤️ Preferito' : ''}
    `;

    // Marker sul posto
    L.marker([lat, lon])
        .addTo(map)
        .bindPopup(popupContent);
    });
};

loadEvents();