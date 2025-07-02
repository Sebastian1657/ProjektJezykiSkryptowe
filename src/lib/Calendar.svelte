<script>
  import { invalidateAll } from '$app/navigation';
  import AddEventForm from '$lib/AddEventForm.svelte';

  /** @type {boolean} */
  export let interactive = false;
  // LOGIKA KALENDARZA
  const monthNames = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];
  const dayNames = ['PN', 'WT', 'ŚR', 'CZ', 'PT', 'SO', 'ND'];

  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();

  /** @type {number[]} */
  const yearOptions = [];
  for (let i = 2020; i <= year+10; i++)yearOptions.push(i);

  /** @type {{ value: string | number; isToday: boolean; isCurrentMonth: boolean; }[]} */
  let dates = [];
  $: {
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

    const newDates = [];
    for (let i = 0; i < startDayIndex; i++) {
      newDates.push({ value: '', isToday: false, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      newDates.push({ value: i, isToday: isToday, isCurrentMonth: true });
    }
    dates = newDates;
  }
  // LOGIKA WYDARZEŃ
  let showAddEventModal = false;
	/** @param {any} formData */
  async function handleCreateEvent(formData) {
        console.log("Creating event with data:", formData);

        const response = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showAddEventModal = false;
            console.log("Event created successfully!");
            // invalidateAll();
        } else {
            const errorData = await response.json();
            alert(`Błąd: ${errorData.error || 'Nie udało się utworzyć wydarzenia'}`);
        }
    }
</script>

<div class="content-box calendar-widget">
  {#if interactive}
  <div class="calendar-controls">
    <select bind:value={month} class="pixel-font">
      {#each monthNames as name, i}
        <option value={i}>{name}</option>
      {/each}
    </select>
    <select bind:value={year} class="pixel-font">
      {#each yearOptions as y}
        <option value={y}>{y}</option>
      {/each}
    </select>
  </div>
  {:else}
  <h2 class="calendar-title pixel-font">{monthNames[month]} {year}</h2>
  {/if}
  <div class="days-header pixel-font">
    {#each dayNames as day}
      <span>{day}</span>
    {/each}
  </div>
  <div class="dates-grid">
    {#each dates as date}
      <div
        class="date-cell-wrapper"
        class:not-current-month={!date.isCurrentMonth}
      >
        <span class="date-number" class:is-today={date.isToday}>
          {date.value}
        </span>
      </div>
    {/each}
  </div>
  {#if interactive}
    <div class="calendar-actions">
      <button class="add-event-button pixel-font" on:click={() => (showAddEventModal = true)}>
        + Dodaj Wydarzenie
      </button>
    </div>
  {/if}
  {#if showAddEventModal}
    <AddEventForm 
        handleSave={handleCreateEvent}
        handleCancel={() => showAddEventModal = false}
    />
{/if}
</div>

<style>
  .calendar-widget {
    padding: 1.5rem;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
  }
  .calendar-title {
    margin: 0 0 15px 0;
    font-size: 1.5em;
    color: var(--text-color);
  }
  .calendar-controls {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 15px;
  }
  .calendar-controls select {
    background-color: var(--background-color);
    border: 2px solid var(--accent-color);
    border-radius: 5px;
    padding: 5px 8px;
    color: var(--text-color);
    cursor: pointer;
  }
  .days-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    margin-bottom: 8px;
    font-size: 0.8em;
    color: var(--text-color);
  }
  .dates-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
  }
  .date-cell-wrapper {
    border: 2px solid var(--accent-color);
    border-radius: 5px;
    padding: 8px 5px;
    font-size: 0.85em;
    min-width: 25px;
    min-height: 40px;
    background-color: var(--background-color);
    color: var(--text-color);
    transition: background-color 0.2s;
  }
  .date-cell-wrapper.not-current-month {
    background-color: transparent;
    border-color: transparent;
    color: transparent;
  }
  .date-number {
    display: inline-block;
    color: var(--text-color);
    font-size: 1.25em;
  }
  .date-number.is-today {
    background-color: var(--accent-color);
    color: var(--background-color);
    font-weight: bold;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
  }
  .calendar-actions {
    margin-top: 1.5rem; /* Odstęp od siatki kalendarza */
  }
  .add-event-button {
    background-color: var(--accent-color);
    color: var(--background-color);
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    transition: opacity 0.2s;
  }
  .add-event-button:hover {
    opacity: 0.85;
  }
</style>