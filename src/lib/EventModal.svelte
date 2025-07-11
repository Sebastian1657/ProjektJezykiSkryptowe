<script>
    import { onMount } from 'svelte';
    import { invalidateAll } from '$app/navigation';
    import AddEventForm from '$lib/AddEventForm.svelte';

    /** @type {import('$lib/types').Event} */
    export let event;

    /** @type {string} */
    export let currentUserId;

    /** @type {() => void} */
    export let onClose;

    const isOwner = event.createdBy?._id === currentUserId;
    let editMode = isOwner;

    /** @type {(updatedData: import('$lib/types').EventFormData) => Promise<void>} */
    async function handleSaveEdit(updatedData) {
        try {
            const res = await fetch(`/api/events/${event._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
            });

            if (!res.ok) throw new Error(`Błąd: ${res.status}`);

            await invalidateAll();
            onClose();
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Nieznany błąd';
            alert(`Nie udało się zaktualizować wydarzenia.\n${msg}`);
            console.error('PUT error:', err);
        }
    }
    async function handleDelete() {
        const confirmDelete = confirm(`Czy na pewno chcesz usunąć "${event.title}"?`);
        if (!confirmDelete) return;

        try {
            const res = await fetch(`/api/events/${event._id}`, {
            method: 'DELETE'
            });

            if (!res.ok) throw new Error(`Błąd: ${res.status}`);

            await invalidateAll();
            onClose();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Nieznany błąd';
            alert(`Nie udało się usunąć wydarzenia.\n${errorMessage}`);
            console.error('Delete failed:', err);
        }
    }
</script>

<div 
    class="modal-backdrop" 
    role="dialog" 
    aria-modal="true" 
    tabindex="0" 
    on:click|self={onClose} 
    on:keydown={(e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }}
>
  <div class="modal-content" role="document">
    {#if editMode}
      <h3>Edytuj Wydarzenie</h3>
      <AddEventForm
        handleSave={handleSaveEdit}
        handleCancel={onClose}
        showDelete={true}
        onDelete={handleDelete}
        initialData={event} />
    {:else}
      <div class="event-view">
        <div class="emoji-header">
          <span class="emoji">{event.emoji}</span>
          <h2>{event.title}</h2>
          <span class="emoji">{event.emoji}</span>
        </div>
        <p><strong>Data:</strong> {event.startDate.slice(0, 10)}
          {#if event.endDate} – {event.endDate.slice(0, 10)}{/if}</p>

        {#if event.description}
          <p><strong>Opis:</strong> {event.description}</p>
        {/if}

        <p><strong>Organizator:</strong> {event.createdBy?.name} {event.createdBy?.surname}</p>

        {#if event.sharedWith.length}
        <p><strong>Goście:</strong></p>
        <ul class="guest-list">
            {#each event.sharedWith as guest}
            <li>
                {#if typeof guest === 'string'}
                  (ID: {guest})
                {:else}
                  {guest.name ?? 'Bezimienny'} {guest.surname ?? ''}
                {/if}
            </li>
            {/each}
        </ul>
        {/if}

        <div class="form-actions">
          <button class="button-cancel" on:click={onClose}>Zamknij</button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background: #222;
  padding: 2rem;
  border-radius: 10px;
  max-width: 600px;
  width: 95%;
  color: white;
}

.emoji-header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  gap: 0.5rem;
}

.event-view p {
  margin: 0.5rem 0;
}

.guest-list {
  margin: 0.5rem 0 1rem 0;
  padding-left: 1rem;
}

.button-cancel {
  background: #444;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
}
</style>
