const eventContainer = document.getElementById('eventContainer');

async function generateEvents() {
    try {
    // 🔹 Richiedi il file JSON dal server
    const response = await fetch('/api/event');
    if (!response.ok) throw new Error('Errore nel caricamento eventi');
    const events = await response.json();

    // 🔹 Pulisci il container
    eventContainer.innerHTML = '';

    // 🔹 Genera le card dinamicamente
    events.forEach(event => {
        if(event.bought){
        const card = document.createElement('div');
        card.classList.add('col');

        card.addEventListener('click', () => {
            window.location.href = `/event?id=${event.id}`;
        });

        const heartIcon = event.favorite ? 'bi-heart-fill text-danger' : 'bi-heart';

        card.innerHTML = `
            <div class="card h-100 shadow-sm">
            <img src="${event.imgUrl}" alt="${event.title}" class="card-img-top">
            <div class="card-body d-flex justify-content-between align-items-start">
                <div>
                <div class="event-title">${event.title}</div>
                <div class="event-info">${event.info}</div>
                <div class="event-price">${event.price}</div>
                </div>
                <div class="d-flex flex-column align-items-center">
                <button class="icon-btn btn btn-light btn-sm mb-1 share-btn" data-id="${event.id}" title="Condividi">
                    <i class="bi bi-share"></i>
                </button>
                <button class="icon-btn btn btn-light btn-sm favorite-btn" data-id="${event.id}" title="Preferito">
                    <i class="bi ${heartIcon}"></i>
                </button>
                </div>
            </div>
            </div>
        `;

        eventContainer.appendChild(card);
        }
    });

    // 🔹 Listener per i pulsanti "cuore"
    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', async () => {
            
            event.stopPropagation();

            const id = parseInt(button.getAttribute('data-id'));
            const icon = button.querySelector('i');

            const updated = await setFavorite(id);

            if (updated && updated.favorite) {
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill', 'text-danger');
            } else {
            icon.classList.remove('bi-heart-fill', 'text-danger');
            icon.classList.add('bi-heart');
            }
            
        });
        });

    document.querySelectorAll('.share-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            event.stopPropagation(); // blocca il click sulla card

            const id = parseInt(button.getAttribute('data-id'));
            const url = `${window.location.origin}/event?id=${id}`;
            const title = "Guarda questo evento!";
            const text = "Dai un'occhiata a questo evento che potrebbe interessarti 👇";

            if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
                console.log('Evento condiviso con successo');
            } catch (err) {
                console.warn('Condivisione annullata o non riuscita', err);
            }
            } else {
            // Fallback → copia link negli appunti
            await navigator.clipboard.writeText(url);
            alert('🔗 Link copiato negli appunti!');
            }
        });
    });

    } catch (err) {
    console.error('Errore nel caricamento degli eventi:', err);
    eventContainer.innerHTML = `
        <div class="text-center text-muted py-5">
        <i class="bi bi-exclamation-triangle fs-1"></i>
        <p class="mt-2">Impossibile caricare gli eventi al momento.</p>
        </div>
    `;
    }
}

document.querySelector('.search-bar input').addEventListener('input', e => {
    const query = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll('#eventContainer .card');

    cards.forEach(card => {
        const title = card.querySelector('.event-title').textContent.toLowerCase();
        const info = card.querySelector('.event-info').textContent.toLowerCase();

        // Mostra/nascondi in base alla ricerca
        if (title.includes(query) || info.includes(query)) {
            card.parentElement.style.display = '';
        } else {
            card.parentElement.style.display = 'none';
        }
    });
});

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

// 🚀 Avvia caricamento
generateEvents();