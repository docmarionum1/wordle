<script context="module" lang="ts">
	const cache = new Map<string, Promise<DictionaryEntry>>();
</script>

<script lang="ts">
import { targets } from "../../utils";


	export let word: string;
	/** The maximum number of alternate definitions to provide*/
	export let alternates = 9;

	async function getWordData(word: string): Promise<DictionaryEntry> {
		// if (!cache.has(word)) {
		// 	const data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
		// 		mode: "cors",
		// 	});
		// 	if (data.ok) {
		// 		cache.set(word, (await data.json())[0]);
		// 	} else {
		// 		throw new Error(`Failed to fetch definition`);
		// 	}
		// }
		// return cache.get(word);

		if (word in targets.definitions) {
			return await targets.definitions[word];
		}

		throw new Error(`Failed to fetch definition`);
	}
</script>

<div class="def">
	{#await getWordData(word)}
		<h4>Fetching definition...</h4>
	{:then data}
		<h2>{data.word}</h2>
		<em>{data.partOfSpeech}</em>
		<ol>
			{#if word !== data.word.toLowerCase()}
				<li>variant of {data.word}.</li>
			{/if}
			{#each data.meanings.slice(0, 1 + alternates - (word !== data.word ? 1 : 0)) as def}
				<li>{def}</li>
			{/each}
		</ol>
	{:catch}
		<div>Your word was <strong>{word}</strong>. (failed to fetch definition)</div>
	{/await}
</div>

<style>
	.def {
		padding: 5px
	}
	h2 {
		display: inline-block;
		margin-right: 1rem;
		margin-bottom: 0.8rem;
	}
	ol {
		padding-left: 1.5rem;
	}
	li {
		margin-bottom: 0.5rem;
	}
	li::first-letter {
		text-transform: uppercase;
	}
	li::marker {
		color: var(--fg-secondary);
	}
</style>
