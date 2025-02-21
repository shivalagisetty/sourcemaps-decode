<script>

  // Add these new variables
  let searchQuery = '';
  let visibleMappings = 50;
  let filteredMappings = [];
  export let decodedContent;

  // Add this computed property to filter and slice mappings
  $: {
    if (decodedContent) {
      filteredMappings = decodedContent.mappings.filter(mapping => 
        mapping.source?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mapping.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  }

  function loadMore() {
    visibleMappings += 50;
  }
</script>


      <h3>Mappings:</h3>
      <div class="mappings">
        <div class="search-container">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search mappings..."
            class="search-input"
          />
        </div>
        
        {#each filteredMappings.slice(0, visibleMappings) as mapping}
          <div class="mapping">
            Original: {mapping.source}:{mapping.originalLine}:{mapping.originalColumn}
            {#if mapping.name}
              (${mapping.name})
            {/if}
            → Generated: {mapping.generatedLine}:{mapping.generatedColumn}
          </div>
        {/each}
        
        {#if filteredMappings.length > visibleMappings}
          <button class="load-more" on:click={loadMore}>
            Load more ({filteredMappings.length - visibleMappings} remaining)
          </button>
        {/if}
      </div>

<style>

  .search-container {
    margin-bottom: 1em;
  }

  .search-input {
    width: 100%;
    padding: 0.5em;
    border: 1px solid #333;
    border-radius: 4px;
    background: #242424;
    color: #fff;
  }

  .load-more {
    width: 100%;
    padding: 0.5em;
    margin-top: 1em;
    background: #333;
    border: none;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
  }

  .load-more:hover {
    background: #444;
  }
</style>