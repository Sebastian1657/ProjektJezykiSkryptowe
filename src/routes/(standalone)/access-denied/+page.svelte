<script>
    import { onMount } from 'svelte';

    const adminEmail = 'miler.sebastian1101@gmail.com';
    let showTooltip = false;

    async function copyEmailToClipboard() {
        if (!navigator.clipboard) {
            alert('Twoja przeglądarka nie wspiera bezpiecznego kopiowania do schowka.');
            return;
        }
        try {
            await navigator.clipboard.writeText(adminEmail);
            console.log('Email skopiowany do schowka');
            showTooltip = true;
            setTimeout(() => {
                showTooltip = false;
            }, 3000);
        } catch (err) {
            console.error('Failed to copy email: ', err);
            alert('Nie udało się skopiować adresu email. \nAdres kontaktowy: ' + adminEmail);
        }
    }

    let visible = false;
    onMount(() => {
        visible = true;
    });
</script>

<div class="denied-container" class:visible>
    <div class="icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-slash">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
        </svg>
    </div>

    <h1 class="title">Odmowa Dostępu</h1>

    <p class="message">
        Twoje konto zostało poprawnie uwierzytelnione, ale nie posiada uprawnień do korzystania z tej aplikacji.
    </p>
    <p class="message secondary">
        <button type="button" class="contact-button" on:click={copyEmailToClipboard}>
            Skontaktuj się z administratorem
        </button>, jeśli uważasz, że to pomyłka.

        {#if showTooltip}
            <span class="tooltip">Skopiowano!</span>
        {/if}
    </p>

    <a href="/api/auth/logout" class="button">
        Wyloguj i wróć na stronę główną
    </a>
</div>

<style>
    /* Używamy zmiennych z Twojego globalnego app.css dla spójności, jeśli są dostępne */
    :root {
        --denied-primary-color: #f8f9fa;   /* Jasny kolor tekstu */
        --denied-secondary-color: #adb5bd; /* Ciemniejszy, szary tekst */
        --denied-accent-color: #e63946;    /* Kolor akcentu - czerwony/ostrzegawczy */
        --denied-background: #212529;   /* Ciemne tło */
        --tape-yellow: #fca311;
        --tape-black: #14213d; /* Ciemny, prawie czarny, pasuje do tła */
        --tape-height: 50px;
    }

    .denied-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        width: 100%;
        background-color: var(--denied-background);
        color: var(--denied-primary-color);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        text-align: center;
        padding: 2rem;
        box-sizing: border-box;

        /* Animacja pojawiania się */
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        position: relative;
        overflow: hidden;
    }

    .denied-container::before, .denied-container::after {
        content: '';
        position: absolute;
        left: 0;
        width: 100%;
        height: var(--tape-height);
        background-image: repeating-linear-gradient(
            -45deg,
            var(--tape-yellow),
            var(--tape-yellow) 25px,
            var(--tape-black) 25px,
            var(--tape-black) 50px
        );
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Opcjonalny cień dla głębi */
    }

    .denied-container::before {
        top: 0;
        border-bottom: 2px solid var(--tape-black);
    }

    .denied-container::after {
        bottom: 0;
        border-top: 2px solid var(--tape-black);
    }

    .denied-container.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .icon-wrapper {
        margin-bottom: 2rem;
        color: var(--denied-accent-color);
        animation: pulse 2s infinite;
        z-index: 1;
    }

    .title, .message, .button {
        z-index: 1;
        position: relative;
    }

    .title {
        font-size: 2.5rem;
        font-weight: 300;
        margin: 0 0 1rem 0;
        letter-spacing: 1px;
    }

    .message {
        font-size: 1.1rem;
        line-height: 1.6;
        max-width: 500px;
        margin: 0.5rem 0;
    }

    .message.secondary {
        color: var(--denied-secondary-color);
        font-size: 0.9rem;
        position: relative;
    }

        .contact-button {
        /* Resetowanie stylów przycisku, aby wyglądał jak link */
        background: none;
        border: none;
        padding: 0;
        font: inherit;
        color: var(--denied-accent-color); /* Kolor jak link, przyciąga uwagę */
        text-decoration: underline;
        cursor: pointer;
    }

    .contact-button:hover {
        text-decoration: none;
    }

    .tooltip {
        position: absolute;
        top: -35px; /* Ustaw dymek nad przyciskiem */
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 0.8rem;
        white-space: nowrap;
        z-index: 10;

        /* Animacja pojawiania się dymka */
        animation: fadeIn 0.3s ease-out;
    }

    /* Strzałka dymka */
    .tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #333 transparent transparent transparent;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateX(-50%) translateY(5px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    .button {
        display: inline-block;
        margin-top: 2.5rem;
        padding: 0.8rem 1.8rem;
        border: 1px solid var(--denied-accent-color);
        border-radius: 5px;
        background-color: transparent;
        color: var(--denied-accent-color);
        font-size: 1rem;
        text-decoration: none;
        transition: background-color 0.2s, color 0.2s;
        cursor: pointer;
    }

    .button:hover,
    .button:focus {
        background-color: var(--denied-accent-color);
        color: var(--denied-background);
        outline: none;
    }

    /* Prosta animacja pulsowania dla ikony */
    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 0.7;
        }
        50% {
            transform: scale(1.1);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 0.7;
        }
    }
</style>