<script>
    import ContentBox from '../lib/ContentBox.svelte';
    import Calendar from '../lib/Calendar.svelte';
</script>

  <div class="container">
    <div class="main-layout">
      <div class="left-column">
        <ContentBox>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </ContentBox>
        <ContentBox>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit icd.
        </ContentBox>
        <ContentBox>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit sed.
        </ContentBox>
      </div>
  
      <div class="right-column">
        <Calendar interactive={false} />
      </div>
    </div>
  
    <ContentBox>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Uderus au rus ac justo odmollis ac tingudaicien sed.
    </ContentBox>
  
  </div>
  
  <style>
    .main-layout {
      display: grid;
      grid-template-columns: 2fr 2fr;
      gap: 20px;
      margin: 15px 0px;
    }
    .left-column {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
  </style>