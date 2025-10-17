const eventId = window.location.pathname.split("/").pop();
fetch(`/api/event/${eventId}`)
  .then(res => res.json())
  .then(data => {
    console.log(data); // Qui hai i dati dell’evento
    // mostra i dati nel DOM
  });
