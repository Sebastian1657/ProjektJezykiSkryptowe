<script>
    export let animationDuration = '60s';
    const imageWidthPx = 2360;
    const title = "Seals 'n' Memes";
    const letterColors=[
      '#F97316',
      '#F59E0B',
      '#EAB308',
      '#84CC16',
      '#22C55E',
      '#10B981',
      '#06B6D4',
      '#0EA5E9',
      '#3B82F6',
    ];
    let index = 0;
    const titleChars = title.split('').map(char => {
      if(char === ' ') {
        return {letter: char, color: null};
      } else {
        const color = letterColors[index % letterColors.length];
        index++;
        return {letter: char, color: color};
      }
    });
</script>
  
<div class="header-background-wrapper" style="--animation-duration: {animationDuration}; --bg-image-width: {imageWidthPx}px;">
  <div class="header-content-area content-box">
    <h1 class="header-title">
      <a href="/" class="pixel-font">
        {#each titleChars as charInfo (charInfo.letter + Math.random())}
          {#if charInfo.color}
            <span style="color: {charInfo.color}">{charInfo.letter}</span>
          {:else}
            {#if charInfo.letter === ' '}
              <br>
            {/if}
          {/if}
        {/each}
      </a>
    </h1>
  </div>
</div>
  
<style>
  .header-background-wrapper {
    width: 100%;
    height: 100px;
    padding: 20px 0;
    position: relative;
    overflow: hidden;
    z-index: 1;
    margin-top: 0;

    background-image: url('/src/resources/rolka_header_project.png');
    background-repeat: repeat-x;
    background-position: 0% center;
    background-size: auto;

    animation: scrollBackground var(--animation-duration) linear infinite;

    background-color: var(--border-color-subtle);
  }

  .header-content-area {
    max-width: 20%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 10px;
    position: relative;
    z-index: 2;
    border: 0px solid var(--border-style);
    border-radius: 50%;
    background-color: rgba(245, 241, 230, 0.5);
    box-shadow: 0px 0px 25px rgba(245, 241, 230, 1);
    transition: all 0.1s ease-in-out;
  }
  .header-content-area:hover {
    scale: 1.02;
    transition: all 0.2s ease-in-out;
  }

  .header-title {
    font-size: 2em;
    z-index: 3;
    text-align: center;
    margin: 0;
    transition: all 0.3s ease;
  }
  .header-title:hover {
    scale: 1.06;
    transition: all 0.3s ease;
  }
  .header-title a {
    display: inline-block;
    color: var(--background-color);
  }
  .header-title a span {
    display: inline-block;
    text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);
  }

  @keyframes scrollBackground {
    from{
      background-position-x: 0px;
    }
    to{
      background-position-x: calc(var(--bg-image-width) * -1);
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    .header-background-wrapper {
      animation: none;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center center;
    }
  }
</style>