<script>
  import { invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import EventModal from './EventModal.svelte';
  import AddEventForm from '$lib/AddEventForm.svelte';

  // LOGIKA KALENDARZA
  /** @type {import('$lib/types').Event[]} */
  export let events = [];
  
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

  /** @type {{ value: string | number; isToday: boolean; isCurrentMonth: boolean; events: any[] }[]} */
  let dates = [];
  $: {
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

    dates = Array.from({ length: startDayIndex + daysInMonth }, (_, i) => {
            const value = i >= startDayIndex ? i - startDayIndex + 1 : '';
            const isToday = value ? (Number(value) === today.getDate() && month === today.getMonth() && year === today.getFullYear()) : false;
            const isCurrentMonth = value !== '';
            return { value, isToday, isCurrentMonth, events: [] };
        });
    if (events) {
            dates = dates.map(date => ({
                ...date,
                events: events.filter(event => {
                    const eventDate = new Date(event.startDate).getDate();
                    const eventMonth = new Date(event.startDate).getMonth();
                    const eventYear = new Date(event.startDate).getFullYear();
                    return eventDate === Number(date.value) && eventMonth === month && eventYear === year;
                })
            }));
        }
  }
  // LOGIKA WYDARZEŃ
  /** @type {boolean} */
  export let interactive = false;
  /** @type {import('$lib/types').Event | null} */
  let selectedEvent = null;
  let currentUserId = '';
  $: currentUserId = $page.data?.user?._id ?? '';
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
        await invalidateAll();
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
        <div class="event-emojis">
          {#each date.events as event}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <span 
              class="event-emoji"
              style="color: red; font-size: 1.2rem;"
              title={`Organizator: ${event.createdBy?.name || 'Bezimienny'} ${event.createdBy?.surname || ''}\nWydarzenie: ${event.title || 'Brak tytułu'}`}
              on:click={() => {selectedEvent = event; console.log("Selected event:", event);}}
              on:keydown={(e) => e.key === 'Enter' && (selectedEvent = event)}
            >
              {event.emoji || '🎉'}
            </span>
          {/each}
        </div>
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
  {#if showAddEventModal && !selectedEvent}
    <AddEventForm 
      handleSave={handleCreateEvent}
      handleCancel={() => showAddEventModal = false}
    />
  {/if}
  {#if selectedEvent && !showAddEventModal}
    <EventModal 
      event={selectedEvent} 
      currentUserId={currentUserId} 
      onClose={() => selectedEvent = null}
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
    padding: 1px 5px;
    font-size: 0.85em;
    min-width: 25px;
    min-height: 60px;
    background-color: var(--background-color);
    color: var(--text-color);
    transition: background-color 0.2s;
    position: relative;
  }
  .date-cell-wrapper.not-current-month {
    background-color: transparent;
    border-color: transparent;
    color: transparent;
  }
  .date-number {
    display: inline-block;
    color: var(--text-color);
    font-size: 1.25rem;
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
  .event-emojis {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .event-emoji {
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.2s;
    display: inline-block;
    margin: 0px;
    padding: 0px;
  }
  .event-emoji:hover {
    transform: scale(1.2);
    transition: 0.2s;
  }
  .calendar-actions {
    margin-top: 0.5rem;
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