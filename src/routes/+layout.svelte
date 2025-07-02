<script>
  import { page } from '$app/stores';
  import '../app.css';
  import Header from '../lib/Header.svelte';
  import NavBar from '../lib/NavBar.svelte';

  const routeId = $page.route.id;
  const isStandalone = routeId?.startsWith('/(standalone)');
</script>

<div class="app-container">
  {#if !isStandalone}
    <Header />
    <NavBar />
  {/if}
  <main class="main-content">
    <slot />
  </main>
</div>
  
<style>
  .main-content {
    flex-grow: 1;
    max-width: var(--container-max-width, 1200px);
    width: 100%;
    margin: 0 auto;
    padding: 0 10px;
    box-sizing: border-box;
  }
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>