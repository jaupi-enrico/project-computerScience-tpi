async function setFavorite(id) {
  try {
    const response = await fetch('/api/favorite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    if (!response.ok) throw new Error(`Errore ${response.status}`);

    const data = await response.json();
    return data.event;
  } catch (error) {
    console.error('Errore durante la modifica del preferito:', error);
  }
}

async function buyTicket() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  try {
    const response = await fetch('/api/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    if (!response.ok) throw new Error(`Errore ${response.status}`);

    const data = await response.json();
    return data.event;
  } catch (error) {
    console.error('Errore durante la modifica del preferito:', error);
  }
}
