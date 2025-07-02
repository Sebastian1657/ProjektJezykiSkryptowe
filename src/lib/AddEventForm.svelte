<script>
    import { onMount } from 'svelte';
    /** @type {(data: formData) => void} */
    export let handleSave;
    
    /** @type {() => void} */
    export let handleCancel;

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
    /* @type {EventFormData} */
    let formData = {
        title: '',
        description: '',
        startDate: todayString,
        endDate: '',
        sharedWith: [],
        emoji: '🎉'
    };
    
    /** @type {{ sub: string, name: string, surname: string, email: string, favoriteColor: string }[]} */
    let allUsers = [];
    let showUserList = false;

    onMount(async () => {
        try {
            const response = await fetch('/api/user/profile');
            if(response.ok) {
                allUsers = await response.json();
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    });

    /** @param {string} userSub */
    function isUserSelected(userSub) {
        // @ts-ignore
        return formData.sharedWith.includes(userSub);
    }

    /** @param {string} userSub */
    function toggleUserSelection(userSub) {
        if (isUserSelected(userSub)) {
            formData.sharedWith = formData.sharedWith.filter(sub => sub !== userSub);
        } else {
            // @ts-ignore
            formData.sharedWith = [...formData.sharedWith, userSub];
        }
        
        formData = formData;
    }
    
    const commonEmojis = ['🎉', '🎂', '✈️', '❤️', '💼', '🏖️', '👨‍💻', '📅'];
    let showEmojiPicker = false;
</script>

<div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title" on:click|self={handleCancel} on:keydown={(e) => e.key === 'Escape' && handleCancel()} tabindex="-1">
    <div class="modal-content" role="document">
        <form class="event-form" on:submit|preventDefault={() => handleSave(formData)}>
            <h3 id="modal-title">Nowe Wydarzenie</h3>

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
                <div class="user-pills" id="user-pills" aria-labelledby="shared-with-label" >
                    {#each formData.sharedWith as userSub}
                        {@const user = allUsers.find(u => u.sub === userSub)}
                        <span class="pill">{user?.name || '...'} <button type="button" on:click={() => toggleUserSelection(userSub)}>×</button></span>
                    {/each}
                    <button type="button" class="add-user-btn" on:click={() => showUserList = !showUserList} aria-label="Dodaj lub usuń użytkowników z listy" aria-haspopup="true" aria-expanded={showUserList}>+</button>
                </div>
                {#if showUserList}
                    <ul class="user-list" role="listbox" aria-labelledby="shared-with-label" tabindex="-1">
                        {#each allUsers as user}
                            <li role="option" aria-selected={isUserSelected(user.sub)} tabindex="0"
                            on:click={() => {toggleUserSelection(user.sub); console.log("clicked: "+formData.sharedWith);}}
                            on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleUserSelection(user.sub)}>
                                <input type="checkbox" checked={isUserSelected(user.sub)} tabindex="-1" aria-hidden="true"/>
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
                    <button class="current-emoji" on:click={() => showEmojiPicker = !showEmojiPicker} aria-label="Wybierz ikonę wydarzenia">
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
                <button type="submit" class="button-save">Utwórz</button>
                <button type="button" on:click={handleCancel} class="button-cancel">Anuluj</button>
            </div>
        </form>
    </div>
</div>

<style>
/* Style dla wyboru użytkowników */
.user-pills { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }
.pill { display: inline-flex; align-items: center; background: #555; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.9em; }
.pill button { background: none; border: none; color: white; cursor: pointer; margin-left: 0.3rem; padding: 0; }
.add-user-btn { width: 24px; height: 24px; border-radius: 50%; border: 1px dashed #888; background: none; color: #888; cursor: pointer; }
.user-list { list-style: none; padding: 0; margin-top: 0.5rem; border: 1px solid #555; border-radius: 5px; max-height: 150px; overflow-y: auto; }
.user-list li { padding: 0.5rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
.user-list li:hover { background: #444; }

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
.emoji-selector { position: relative; }
.current-emoji { font-size: 1.5rem; cursor: pointer; padding: 0.2rem; background: #444; border-radius: 5px; }
.emoji-picker { position: absolute; background: #222; border: 1px solid #555; border-radius: 5px; padding: 0.5rem; display: flex; gap: 0.5rem; z-index: 10; }
.emoji-option { cursor: pointer; font-size: 1.5rem; }
.emoji-option:hover { transform: scale(1.2); }
</style>