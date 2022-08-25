<script lang="ts">
	import {
		createDefaultStats,
		createNewGame,
		createDefaultSettings,
		createLetterStates,
		ROWS,
		words,
		targets,
	} from "./utils";
	import Game from "./components/Game.svelte";
	import { letterStates, settings } from "./stores";
	import { Toaster } from "./components/widgets";
	import { setContext } from "svelte";

	export let version: string;
	setContext("version", version);
	const previous_version = localStorage.getItem("version") || version;
	localStorage.setItem("version", version);

	let stats: Stats;
	let word: string;
	let state: GameState;

	settings.set(
		(JSON.parse(localStorage.getItem("settings")) as Settings) || createDefaultSettings()
	);
	settings.subscribe((s) => localStorage.setItem("settings", JSON.stringify(s)));

	const hash = window.location.hash.slice(1).split("/");

	// Load stats if it exists
	stats = (JSON.parse(localStorage.getItem(`stats`)) as Stats) || createDefaultStats();
	// Load state if it exists
	state = JSON.parse(localStorage.getItem(`state`)) || createNewGame();

	// If the version has changed, reset the stats and state, this is to just clear 
	if (
		(version !== previous_version) || 
		(state.wordNumber >= targets.words.length) ||
		(state.board.state[0].length !== targets.words[state.wordNumber].length) 
	) {
		stats = createDefaultStats();
		state = createNewGame();
	}

	// Make sure local storage is updated in case there are any reloads
	localStorage.setItem(`state`, JSON.stringify(state));
	localStorage.setItem(`stats`, JSON.stringify(stats));

	word = targets.words[state.wordNumber];

	// Set the letter states when data for a new game mode is loaded so the keyboard is correct
	const letters = createLetterStates();
	for (let row = 0; row < ROWS; ++row) {
		for (let col = 0; col < state.board.words[row].length; ++col) {
			if (
				letters[state.board.words[row][col]] === "🔳" ||
				state.board.state[row][col] === "🟩"
			) {
				letters[state.board.words[row][col]] = state.board.state[row][col];
			}
		}
	}
	letterStates.set(letters);


	$: saveState(state);
	function saveState(state: GameState) {
		localStorage.setItem(`state`, JSON.stringify(state));
	}
	let toaster: Toaster;

	document.title = "Jerbiwordle";
</script>

<Toaster bind:this={toaster} />
{#if toaster}
	<Game {stats} {word} {toaster} bind:game={state} />
{/if}
