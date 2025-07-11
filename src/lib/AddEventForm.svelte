<script>
    import { onMount } from 'svelte';

    /** @type {(data: import('$lib/types').EventFormData) => void} */
    export let handleSave;
    
    /** @type {() => void} */
    export let handleCancel;

    /** @type {import('$lib/types').Event | null} */
    export let initialData = null;

    /** @type {boolean} */
    export let showDelete = false;

    /** @type {() => void} */
    export let onDelete = () => {};

    const todayString = new Date().toISOString().split('T')[0];

    /**
    * @typedef {object} EventFormData
    * @property {string} title
    * @property {string} description
    * @property {string} startDate
    * @property {string} endDate
    * @property {string[]} sharedWith
    * @property {string} emoji
    */
    /** @type {EventFormData} */
    let formData = {
        title: '',
        description: '',
        startDate: todayString,
        endDate: '',
        sharedWith: [],
        emoji: '🎉'
    };
    
    /** @type {{ _id: string, name: string, surname: string, email: string, favoriteColor: string }[]} */
    let allUsers = [];
    let showUserList = false;

    onMount(() => {
        console.log("initialData:", initialData);
        if (initialData) {
            formData = {
                title: initialData.title ?? '',
                description: initialData.description ?? '',
                startDate: initialData.startDate?.slice(0, 10) ?? todayString,
                endDate: initialData.endDate?.slice(0, 10) ?? '',
                sharedWith: Array.isArray(initialData.sharedWith)
                ? initialData.sharedWith.map((u) =>
                    typeof u === 'string' ? u : u._id
                    )
                : [],
                emoji: initialData.emoji ?? '🎉'
            };
        }
        // Fetch user list
        fetch('/api/user/profile')
        .then(res => res.ok ? res.json() : Promise.reject(res.status))
        .then(users => { allUsers = users; })
        .catch(err => console.error("Failed to fetch users:", err));
    });

    /** @param {string} user_id */
    function isUserSelected(user_id) {
        return formData.sharedWith.includes(user_id);
    }

    /** @param {string} user_id */
    function toggleUserSelection(user_id) {
        if (isUserSelected(user_id)) {
            formData.sharedWith = formData.sharedWith.filter(_id => _id !== user_id);
        } else {
            formData.sharedWith = [...formData.sharedWith, user_id];
        }
        formData = { ...formData };
    }
    
    const commonEmojis = [
        '🎉', '🎂', '✈️', '❤️', '💼', '🏖️', '📅', '🎓',
        '🏆', '🎄', '🎃', '🕯️', '🍾', '🥂', '🍽️', '🍕',
        '🍻', '🎁', '📸', '🎶', '🎤', '🎬', '🎪', '🗓️',
        '🏡', '🚗', '🛍️', '💒', '📍', '⛪', '📖', '⛷️',
        '🏕️', '🧳', '🛏️', '🚂', '🎯', '📢', '🧁', '🌇',
        '💃', '🕺', '🎨', '🎈', '🗣️', '🚀', '📞', '⏰',
        '🏟️', '🎡', '🎢', '🧩', '🧸', '🎮', '🎲', '🧗'
    ];
    let showEmojiPicker = false;
</script>

<div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title" on:click|self={handleCancel} on:keydown={(e) => e.key === 'Escape' && handleCancel()} tabindex="-1">
    <div class="modal-content" role="document">
        <form class="event-form" on:submit|preventDefault={() => handleSave(formData)}>
            <h3 id="modal-title">
                {#if initialData}Edytuj Wydarzenie{:else}Nowe Wydarzenie{/if}</h3>

            <div class="form-group">
                <label for="title">Nazwa wydarzenia</label>
                <input id="title" type="text" bind:value={formData.title} required />
            </div>
            
            <div class="form-group">
                <label for="description">Opis</label>
                <textarea id="description" rows="3" bind:value={formData.description}></textarea>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="startDate">Data rozpoczęcia</label>
                    <input id="startDate" type="date" bind:value={formData.startDate} required/>
                </div>
                <div class="form-group">
                    <label for="endDate">Data zakończenia (opcjonalnie)</label>
                    <input id="endDate" type="date" bind:value={formData.endDate} />
                </div>
            </div>

            <!-- WYBÓR UŻYTKOWNIKÓW -->
            <div class="form-group">
                <label id="shared-with-label" for="user-pills">Udostępnij dla:</label>
                <div class="user-pills" id="user-pills" aria-labelledby="shared-with-label">
                    {#each formData.sharedWith as user_id}
                        {@const user = allUsers.find(u => u._id === user_id)}
                        <span class="pill">{user?.name || 'Bezimienny'} {user?.surname || ''}<button type="button" on:click={() => toggleUserSelection(user_id)}>×</button></span>
                    {/each}
                    <button type="button" class="add-user-btn" on:click={() => showUserList = !showUserList} aria-label="Dodaj lub usuń użytkowników z listy" aria-haspopup="true" aria-expanded={showUserList}>+</button>
                </div>
                {#if showUserList}
                    <ul class="user-list" role="listbox" aria-labelledby="shared-with-label">
                        {#each allUsers as user}
                            <li 
                                role="option" 
                                aria-selected={isUserSelected(user._id)}
                                class:selected={isUserSelected(user._id)}
                                on:click={() => {const _id = user._id;
                                                console.log("Clicked user:", _id);
                                                toggleUserSelection(_id);}
                                        }
                                on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleUserSelection(user._id)}
                            >
                                <span style="color: {user.favoriteColor};">{user.name} {user.surname}</span>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </div>

            <!-- WYBÓR EMOJI -->
            <div class="form-group">
                <label id="emoji-label" for="emoji-div">Ikona wydarzenia</label>
                <div class="emoji-selector" id="emoji-div" aria-labelledby="emoji-label">
                    <button type="button" class="current-emoji" on:click={() => showEmojiPicker = !showEmojiPicker} aria-label="Wybierz ikonę wydarzenia">
                        {formData.emoji}
                    </button>
                    {#if showEmojiPicker}
                    <div class="emoji-picker">
                        {#each commonEmojis as emoji}
                            <button type="button" class="emoji-option" on:click={() => { formData.emoji = emoji; showEmojiPicker = false; }}>
                                {emoji}
                            </button>
                        {/each}
                    </div>
                    {/if}
                </div>
            </div>
            
            <div class="form-actions">
                {#if showDelete}
                <button type="button" class="button-delete" on:click={onDelete}>Usuń</button>
                {/if}
                <button type="submit" class="button-save">{initialData ? 'Zapisz zmiany' : 'Utwórz'}</button>
                <button type="button" on:click={handleCancel} class="button-cancel">Anuluj</button>
            </div>
        </form>
    </div>
</div>

<style>
/* Style dla wyboru użytkowników */
.user-pills { 
    display: flex; 
    flex-wrap: wrap; 
    align-items: center; 
    gap: 0.5rem; 
}
.pill { 
    display: inline-flex; 
    align-items: center; 
    background: #555; 
    padding: 0.2rem 0.6rem; 
    border-radius: 12px; 
    font-size: 0.9em; 
}
.pill button { 
    background: none; 
    border: none; 
    color: white; 
    cursor: pointer; 
    margin-left: 0.3rem; 
    padding: 0; 
}
.add-user-btn { 
    width: 24px; 
    height: 24px; 
    border-radius: 50%; 
    border: 1px dashed #888; 
    background: none; 
    color: #888; 
    cursor: pointer; 
}
.user-list { 
    list-style: none; 
    padding: 0; 
    margin-top: 0.5rem; 
    border: 1px solid #555; 
    border-radius: 5px; 
    max-height: 150px; 
    overflow-y: auto; 
}
.user-list li { 
    padding: 0.5rem; 
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    gap: 0.5rem; 
}
.user-list li:hover { 
    background: #444; 
}
.user-list li.selected {
    background: #666;
}

/* Style dla wyboru emoji */
.current-emoji, .emoji-option {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    text-align: left;
    cursor: pointer;
    width: 100%;
}
.emoji-selector { 
    position: relative;
    display: inline-block;
}
.current-emoji { 
    font-size: 1.5rem; 
    cursor: pointer; 
    padding: 0.2rem; 
    background: #444; 
    border-radius: 5px; 
}
.emoji-picker { 
    min-width: 172px;
    position: absolute;
    display: flex;
    background: #222; 
    border: 1px solid #555; 
    border-radius: 5px; 
    padding: 0.5rem; 
    gap: 0.5rem; 
    z-index: 10;
    flex-wrap: wrap;
    max-height: 200px;
    left: 50%;
    transform: translateX(-50%);
    overflow-y: auto;
}
.emoji-option {
    flex: 0 0 32px;
    text-align: center;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.2rem;
    background: #333; 
    border-radius: 5px; 
    transition: transform 0.2s;
}
.emoji-option:hover { 
    transform: scale(1.2); 
}
.button-save {
  background: var(--accent-color, #2a8);
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s;
}
.button-save:hover {
  background: #1c7;
}
.button-cancel {
  background: #444;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: background 0.2s;
}
.button-cancel:hover {
  background: #666;
}
.button-delete {
  background: #822;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 0.5rem;
  transition: background 0.2s;
}
.button-delete:hover {
  background: #a33;
}
</style>