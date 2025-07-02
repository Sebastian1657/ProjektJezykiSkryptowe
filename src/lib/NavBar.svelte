<script>
    const navItems = [
      {text: "STRONA GŁÓWNA", href: "/"},
      {text: "KALENDARZ", href: "/kalendarz"},
      {text: "ZDJĘCIA", href: "/zdjecia"},
      {text: "KONTO", href: "/konto"},
    ];
  </script>
  
  <nav class="navbar">
    <ul>
      {#each navItems as item}
        <li><a href={item.href} class="pixel-font">{item.text}</a></li>
      {/each}
    </ul>
  </nav>
  
  <style>
    .navbar {
      border-top: var(--border-style);
      border-bottom: var(--border-style);
      border-left: none;
      border-right: none;
      border-radius: 0;
      padding: 10px 20px;
      position: sticky;
      top: 0;
      z-index: 10;
      margin-bottom: 10px;
    }
    ul {
      display: flex;
      justify-content: space-evenly; /* Or space-between */
      list-style: none;
      padding: 0;
      margin: 0 auto;
      flex-wrap: wrap;
      gap: 10px;
    }
    a {
      text-decoration: none;
      color: var(--accent-color);
      font-size: 0.9em;
      transition: all 0.3s ease;
    }
    a:hover {
      opacity: 0.8;
      scale: 1.05;
      transition: all 0.3s ease;
    }
  </style>