<script>
  import { FileDropzone } from '@skeletonlabs/skeleton';
  import * as sourceMap from 'source-map-js';
  import Highlight, { LineNumbers } from "svelte-highlight";
  import { javascript } from 'svelte-highlight/languages';
  import atomOneDark from "svelte-highlight/styles/atom-one-dark";

  let files;
  let decodedContent = null;
  let isLoading = false;
  let error = null;

  async function parseSourceMap(content) {
    try {
      isLoading = true;
      error = null;
      
      // Parse the source map
      const consumer = new sourceMap.SourceMapConsumer(content);
      
      // Create an array to store the original source
      let originalSource = [];
      
      // Iterate through each mapping
      consumer.eachMapping(mapping => {
        originalSource.push({
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: mapping.name,
          source: mapping.source,
          generatedLine: mapping.generatedLine,
          generatedColumn: mapping.generatedColumn
        });
      });

      // Get the original source content
      const sources = consumer.sources;
      const sourcesContent = consumer.sourcesContent;
      
      decodedContent = {
        mappings: originalSource,
        sources,
        sourcesContent
      };
    } catch (e) {
      error = e;
      console.error('Error parsing source map:', e);
    } finally {
      isLoading = false;
    }
  }

  $: if (files) {
    files[0].text().then(content => {
      try {
        // Parse the content as JSON to verify it's a valid source map
        const sourceMapData = JSON.parse(content);
        parseSourceMap(sourceMapData);
      } catch (e) {
        error = new Error('Invalid source map file');
        console.error('Invalid source map file:', e);
      }
    });
  }
</script>
<svelte:head>
  {@html atomOneDark}
</svelte:head>
<main>
  <div class="fileUpload">
    <FileDropzone bind:files name="files" />
  </div>
  {#if isLoading}
    <p>Loading source map...</p>
  {:else if error}
    <p class="error">Error: {error.message}</p>
  {:else if decodedContent}
    <div class="decoded-content">
      <h3>Source Files:</h3>
      {#each decodedContent.sources as source, i}
        <details>
          <summary>{source}</summary>
          <pre>

            <Highlight let:highlighted language={javascript} code={decodedContent.sourcesContent?.[i] || 'Source content not available'}>
              <LineNumbers {highlighted} />
            </Highlight>
          </pre>
        </details>
      {/each}

      <!-- <h3>Mappings:</h3>
      <div class="mappings">
        {#each decodedContent.mappings.slice(0, 100) as mapping}
          <div class="mapping">
            Original: {mapping.source}:{mapping.originalLine}:{mapping.originalColumn}
            {#if mapping.name}
              (${mapping.name})
            {/if}
            → Generated: {mapping.generatedLine}:{mapping.generatedColumn}
          </div>
        {/each}
        {#if decodedContent.mappings.length > 100}
          <p>... and {decodedContent.mappings.length - 100} more mappings</p>
        {/if}
      </div> -->
    </div>
  {/if}
</main>

<style>
  .fileUpload {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .fileUpload:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
    background: #6b5d5d !important;
  }
  .fileUpload {
    border: tomato;
    border-radius: 5px !important;
  }
  
  .decoded-content {
    margin-top: 2em;
    padding: 1em;
    background: #181717;
    border-radius: 4px;
  }
  
  .mapping {
    font-family: monospace;
    margin: 0.25em 0;
  }
  
  .error {
    color: red;
  }
  
  pre {
    background: #151414;
    padding: 1em;
    overflow-x: auto;
    max-height: 300px;
    overflow-y: auto;
  }
  
  details {
    margin: 1em 0;
  }
  
  summary {
    cursor: pointer;
    padding: 0.5em;
    background: #090909;
  }
</style>
