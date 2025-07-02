<script>
   import { invalidateAll } from '$app/navigation';
   import AccountEditForm from '$lib/AccountEditForm.svelte';

    /** @type {import('./$types').PageData} */
    export let data;

    // Pobieramy profil użytkownika z BD
    $: profile = data.profile;
    let isEditing = false;

   /** @param {typeof profile} formData */
   async function handleSave(formData) {
      console.log("Parent's handleSave received data:", formData);
      
      // Wyślij dane do nowego punktu końcowego API
      const response = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
      });
      if (response.ok) {
          isEditing = false;
          await invalidateAll(); 
      } else {
          alert('Nie udało się zapisać zmian.');
      }
   }
</script>

<div class="account-container">
    {#if profile}
        <div class="profile-card">
            <!-- ZDJĘCIE PROFILOWE -->
            <div class="profile-picture-wrapper">
                <img src={profile.picture || '/default-avatar.png'} alt="Zdjęcie profilowe" class="profile-picture" />
            </div>

            <!-- DANE UŻYTKOWNIKA -->
            <div class="profile-details">
               <!-- USTAWIENIA -->
                <div class="details-header">
                    <h2 class="user-name">{`Dzień dobry ${profile.name}!` || 'Jak się zwiesz, podróżniku?'}</h2>
                    <button class="settings-button" on:click={() => isEditing = !isEditing} title="Ustawienia konta" aria-label="Ustawienia konta">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-settings">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                    </button>
                </div>
                {#if !isEditing}
                  <div class="info-grid">
                     <!-- wyświetlanie danych z `profile` -->
                  </div>
               {:else}
                  <AccountEditForm
                     {profile}
                     {handleSave}
                     handleCancel={() => isEditing = false}
                  />
               {/if}
                <!-- INFORMACJE O UŻYTKOWNIKU -->
                <div class="info-grid">
                    <span class="info-label">Imię i Nazwisko</span>
                    <span class="info-value">{profile.name+" "+profile.surname || 'Nie podano'}</span>

                    <span class="info-label">Data urodzenia</span>
                    <span class="info-value">{profile.dateOfBirth || 'Nie podano'}</span>

                    <span class="info-label">Ulubiony kolor</span>
                    <div class="info-value-color">
                        <span 
                            class="color-swatch" 
                            style="background-color: {profile.favoriteColor || '#ccc'}"
                            title={profile.favoriteColor || 'Nie ustawiono'}
                        ></span>
                        <span>{profile.favoriteColor || 'Nie podano'}</span>
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <!-- Ten redirect jest na wszelki wypadek, ale hook powinien przekierować niezalogowanych -->
        <script>redirect(302, '/api/auth/logout');</script>
    {/if}
</div>

<style>
    .account-container {
        padding: 2rem;
        max-width: 900px;
        margin: 2rem auto;
    }

    .profile-card {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        background-color: rgba(0, 0, 0, 0.2);
        padding: 2rem;
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .profile-picture-wrapper {
        flex-shrink: 0;
    }

    .profile-picture {
        width: 150px;
        height: 200px;
        border-radius: 10%; /* Okrągłe zdjęcie */
        border: 4px solid var(--denied-primary-color, #f8f9fa);
        object-fit: cover;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    .profile-details {
        flex-grow: 1;
        min-width: 300px;
    }

    .details-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.5rem;
    }

    .user-name {
        font-size: 1.8rem;
        font-weight: 500;
        margin: 0;
        color: var(--denied-primary-color, #f8f9fa);
    }

    .settings-button {
        background: none;
        border: none;
        color: var(--denied-secondary-color, #adb5bd);
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: background-color 0.2s, color 0.2s;
    }

    .settings-button:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: var(--denied-primary-color, #f8f9fa);
    }

    .info-grid {
        display: grid;
        grid-template-columns: 150px 1fr;
        gap: 1rem;
    }

    .info-label {
        font-weight: bold;
        color: var(--denied-secondary-color, #adb5bd);
    }

    .info-value {
        color: var(--denied-primary-color, #f8f9fa);
        word-break: break-all;
    }

    .info-value-color {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    .color-swatch {
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 5px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        /* Tło jest ustawiane dynamicznie przez `style` */
    }

</style>