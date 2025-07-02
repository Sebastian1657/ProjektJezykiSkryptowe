    <script>
        import { onMount } from 'svelte';

        /** @type {{ name: string; type: 'folder' | 'image'; path: string; url: string;}[]} */
        let items = [];
        let isLoading = true;
        let currentPath = '';

        // --- Modal do powiększania zdjęć ---
        let modalVisible = false;
        let modalImageUrl = '';

        /** @param {string} url*/
        function showModal(url) {
            modalImageUrl = url;
            modalVisible = true;
        }
        /** @param {MouseEvent} event */
        function hideModal(event) {
            if (event.target === event.currentTarget){
                modalVisible = false;
            }
        }

        // --- Ładowanie danych z API ---
        /** @param {string} path */
        async function fetchItems(path) {
            isLoading = true;
            try {
                const response = await fetch(`/api/photos/${path}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch items');
                }
                items = await response.json();
                currentPath = path;
            } catch (error) {
                console.error(error);
                items = [];
            } finally {
                isLoading = false;
            }
        }


        /** @param {string} path */
        function navigateTo(path) {
            fetchItems(path);
        }
        function goUp() {
            if (!currentPath) return;
            const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
            fetchItems(parentPath);
        }
        onMount(() => {
            fetchItems('');
        });
    </script>

    <div class="photo-browser">
    <div class="navigation-bar">
        {#if currentPath}
        <button on:click={goUp} class="nav-button">Wróć</button>
        {/if}
        <span class="current-path">Aktualna ścieżka: /Photos/{currentPath}</span>
    </div>

    {#if isLoading}
        <p>Ładowanie...</p>
    {:else if items.length === 0}
        <p>Ten folder jest pusty.</p>
    {:else}
        <div class="items-grid">
        {#each items as item}
            {#if item.type === 'folder'}
            <!-- Foldery -->
            <button type="button" class="grid-item folder" on:click={() => navigateTo(item.path)} title={item.name}>
                <div class="icon-folder">📁</div>
                <span class="item-name">{item.name}</span>
            </button>
            {:else if item.type === 'image'}
            <!-- Obrazy (miniatury) -->
            <button class="grid-item image" on:click={() => showModal(item.url)}>
                <img src={item.url} alt={item.name} loading="lazy" />
            </button>
            {/if}
        {/each}
        </div>
    {/if}
    </div>

    {#if modalVisible}
    <div class="modal-backdrop" role="dialog" tabindex="-1" aria-modal="true" aria-label="Powiększone zdjęcie" on:click={hideModal} on:keydown={(e) => {
        if (e.key === 'Escape') {
            modalVisible = false;
        }
    }}>
        <img class="modal-image" src={modalImageUrl} alt="Powiększone zdjęcie"/>
    </div>
    {/if}

    <style>
    .navigation-bar { margin-bottom: 1rem; display: flex; align-items: center; gap: 1rem;}
    .nav-button { cursor: pointer; padding: 0.5rem 0.5rem; }
    .current-path { font-family: monospace; color: white;}
    .items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; }
    .grid-item { background: none; color: inherit; font: inherit; border: 2px solid var(--accent-color); padding: 0px; border-radius: 5px; text-align: center; cursor: pointer; transition: transform 0.2s; overflow: hidden; }
    .grid-item:hover { transform: scale(1.05); }
    .grid-item.folder .icon-folder { font-size: 4rem; line-height: 1;}
    .grid-item.image img { display:block; width: 100%; height: 100px; object-fit:cover;}
    .modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-image { max-width: 80vw; max-height: 80vh; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
    </style>