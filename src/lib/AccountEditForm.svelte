<script>
    /**
     * @type {import('../routes/konto/$types').PageData['profile']}
     */
    export let profile;

    /**
     * @type {(formData: any) => void}
     */
    export let handleSave;

    /** @type {() => void} */
    export let handleCancel;

    let formData = { ...profile };

    /**
	 * @param {{ target: any; currentTarget: any; }} event
	 */
    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            handleCancel();
        }
    }
</script>

<!-- Tło modala -->
<div 
    class="modal-backdrop" 
    role="dialog" 
    tabindex="-1"
    aria-modal="true" 
    aria-labelledby="modal-title"
    on:click={handleBackdropClick}
    on:keydown={(e) => e.key === 'Escape' && handleCancel()}
>
    <!-- Kontener formularza -->
    <div class="modal-content">
        <form class="edit-form" on:submit|preventDefault={() => handleSave(formData)}>
            <h3 id="modal-title">Edytuj Profil</h3>

            <div class="form-group">
                <label for="name">Imię</label>
                <input id="name" type="text" bind:value={formData.name} />
            </div>
            
            <div class="form-group">
                <label for="surname">Nazwisko</label>
                <input id="surname" type="text" bind:value={formData.surname} />
            </div>
            
            <div class="form-group">
                <label for="dob">Data urodzenia</label>
                <input id="dob" type="date" bind:value={formData.dateOfBirth} />
            </div>

            <div class="form-group color-picker-group">
                <label for="favColor">Ulubiony kolor</label>
                <div class="color-input-wrapper">
                    <input id="favColor" type="text" bind:value={formData.favoriteColor} placeholder="#RRGGBB" />
                    <input type="color" bind:value={formData.favoriteColor} class="color-swatch-input" title="Wybierz kolor"/>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="button-save">Zapisz zmiany</button>
                <button type="button" on:click={handleCancel} class="button-cancel">Anuluj</button>
            </div>
        </form>
    </div>
</div>

<style>
    .color-picker-group .color-input-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .color-picker-group input[type="text"] {
        flex-grow: 1;
    }

    .color-swatch-input {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 40px;
        height: 40px;
        background-color: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
    }

    .color-swatch-input::-webkit-color-swatch-wrapper {
        padding: 0;
    }

    .color-swatch-input::-webkit-color-swatch {
        border: 2px solid #555;
        border-radius: 5px;
    }

    .color-swatch-input::-moz-color-swatch {
        border: 2px solid #555;
        border-radius: 5px;
    }
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    .modal-content {
        background: #333;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 25px rgba(0,0,0,0.5);
        width: 100%;
        max-width: 500px;
    }
    .edit-form h3 {
        margin-top: 0;
        color: #f8f9fa;
        text-align: center;
    }
    .form-group {
        margin-bottom: 1rem;
    }
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: #adb5bd;
    }
    .form-group input {
        width: 100%;
        padding: 0.75rem;
        border-radius: 5px;
        border: 1px solid #555;
        background-color: #444;
        color: #f8f9fa;
        box-sizing: border-box;
    }
    .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 1.5rem;
    }
    .form-actions button {
        padding: 0.7rem 1.5rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
    }
    .button-save {
        background-color: var(--denied-accent-color, #e63946);
        color: white;
    }
    .button-cancel {
        background-color: #6c757d;
        color: white;
    }
</style>