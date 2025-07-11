<script>
   import Calendar from '$lib/Calendar.svelte';
   import ContentBox from '$lib/ContentBox.svelte';

   export let data;
</script>  
  <ContentBox>
     <Calendar interactive={true} events={data.events}/>
  </ContentBox>