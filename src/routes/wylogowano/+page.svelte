<script>
  import { goto } from '$app/navigation';

  function relog() {
    goto('/api/auth/login');
  }
</script>

<div class="logout-page">
  <h1>👋 Zostałeś wylogowany</h1>
  <p>Dziękujemy za skorzystanie z aplikacji.</p>
  <button on:click={relog}>Zaloguj się ponownie</button>
</div>

<style>
  .logout-page {
    max-width: 600px;
    margin: 5rem auto;
    text-align: center;
    padding: 2rem;
    background: rgba(0,0,0,0.2);
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    color: white;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }

  button {
    padding: 0.6rem 1.5rem;
    border: none;
    background-color: #444;
    color: white;
    font-weight: bold;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:hover {
    background-color: #666;
  }
</style>
