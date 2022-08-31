<script lang="ts">
	import { fade } from "svelte/transition";
	import Header from "./Header.svelte";
	import { Board } from "./board";
	import Keyboard from "./keyboard";
	import Modal from "./Modal.svelte";
	import { getContext, onMount, setContext } from "svelte";
	import Settings from "./settings";
	import {
		Share,
		Definition,
		Tutorial,
		Statistics,
		Distribution,
		Toaster
	} from "./widgets";
	import {
		contractNum,
		DELAY_INCREMENT,
		PRAISE,
		getState,
		checkHardMode,
		ROWS,
		createNewGame,
		createLetterStates,
		words,
		targets,
		isValidWord,
	} from "../utils";
	import { letterStates, settings } from "../stores";

	export let word: string;
	export let stats: Stats;
	export let game: GameState;
	export let toaster: Toaster;

	setContext("toaster", toaster);
	const version = getContext<string>("version");

	// implement transition delay on keys
	const delay = DELAY_INCREMENT * ROWS + 800;

	let showTutorial = $settings.tutorial === 3;
	let showSettings = false;
	let showStats = false;
	let showRefresh = false;

	let board: Board;

	function submitWord() {
		if (game.board.words[game.guesses].length !== word.length) {
			toaster.pop("Not enough letters");
			board.shake(game.guesses);
		} else if (isValidWord(game.board.words[game.guesses])) {
			if (game.guesses > 0) {
				const hm = checkHardMode(game.board, game.guesses);
				if ($settings.hard) {
					if (hm.type === "🟩") {
						toaster.pop(
							`${contractNum(hm.pos + 1)} letter must be ${hm.char.toUpperCase()}`
						);
						board.shake(game.guesses);
						return;
					} else if (hm.type === "🟨") {
						toaster.pop(`Guess must contain ${hm.char.toUpperCase()}`);
						board.shake(game.guesses);
						return;
					}
				} else if (hm.type !== "⬛") {
					game.validHard = false;
				}
			}
			const state = getState(word, game.board.words[game.guesses]);
			game.board.state[game.guesses] = state;
			state.forEach((e, i) => {
				const ls = $letterStates[game.board.words[game.guesses][i]];
				if (ls === "🔳" || e === "🟩") {
					$letterStates[game.board.words[game.guesses][i]] = e;
				}
			});
			++game.guesses;
			if (game.board.words[game.guesses - 1] === word) win();
			else if (game.guesses === ROWS) lose();
		} else {
			toaster.pop("Not in word list");
			board.shake(game.guesses);
		}
	}

	function win() {
		board.bounce(game.guesses - 1);
		game.active = false;
		setTimeout(
			() => toaster.pop(PRAISE[game.guesses - 1]),
			DELAY_INCREMENT * word.length + DELAY_INCREMENT
		);
		setTimeout(setShowStatsTrue, delay * 1.4);
		
		++stats.guesses[game.guesses];
		++stats.played;
		if ("streak" in stats) {
			stats.streak = stats.streak + 1;
			if (stats.streak > stats.maxStreak) stats.maxStreak = stats.streak;
		}
		stats.lastGame = game.wordNumber;
		localStorage.setItem(`stats`, JSON.stringify(stats));
		
	}

	function lose() {
		game.active = false;
		setTimeout(setShowStatsTrue, delay);
		++stats.guesses.fail;
		++stats.played;
		stats.streak = 0;
		stats.lastGame = game.wordNumber;
		localStorage.setItem(`stats`, JSON.stringify(stats));
	}

	function concede() {
		showSettings = false;
		setTimeout(setShowStatsTrue, DELAY_INCREMENT);
		lose();
	}

	function reload() {
		game = createNewGame(game);
		word = targets.words[game.wordNumber];
		$letterStates = createLetterStates();
		showStats = false;
		showRefresh = false;
	}

	function setShowStatsTrue() {
		if (!game.active) showStats = true;
	}

	onMount(() => {
		if (!game.active) setTimeout(setShowStatsTrue, delay);
	});
	// $: toaster.pop(word);
</script>

<svelte:body on:click={board.hideCtx} on:contextmenu={board.hideCtx} />

<main class:guesses={game.guesses !== 0} style="--rows: {ROWS}; --cols: {word.length}">
	<Header
		bind:showRefresh
		tutorial={$settings.tutorial === 2}
		on:closeTutPopUp|once={() => ($settings.tutorial = 1)}
		showStats={stats.played > 0}
		on:stats={() => (showStats = true)}
		on:tutorial={() => (showTutorial = true)}
		on:settings={() => (showSettings = true)}
	/>
	<Board
		bind:this={board}
		bind:value={game.board.words}
		tutorial={$settings.tutorial === 1}
		on:closeTutPopUp|once={() => ($settings.tutorial = 0)}
		board={game.board}
		guesses={game.guesses}
		target={word}
	/>
	<Keyboard
		on:keystroke={() => {
			if ($settings.tutorial) $settings.tutorial = 0;
			board.hideCtx();
		}}
		bind:value={game.board.words[game.guesses === ROWS ? 0 : game.guesses]}
		on:submitWord={submitWord}
		on:esc={() => {
			showTutorial = false;
			showStats = false;
			showSettings = false;
		}}
		disabled={!game.active || $settings.tutorial === 3}
		word_length={game.board.state[0].length}
		target={word}
	/>
</main>

<Modal
	bind:visible={showTutorial}
	on:close|once={() => $settings.tutorial === 3 && --$settings.tutorial}
	fullscreen={$settings.tutorial === 0}
>
	<Tutorial visible={showTutorial} />
</Modal>

<Modal bind:visible={showStats}>
	<h3>Jerbiwordle # {game.wordNumber+1} / {targets.words.length}</h3>
	{#if !game.active}
		<Definition {word} alternates={2} />
		{#if ((game.wordNumber+1) < targets.words.length)}
			<div class="next" on:click={() => reload()}>
				Next word
				<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
					<path
						fill="white"
						d="M12 8V4l8 8-8 8v-4H4V8z"
					/>
				</svg>
			</div>
		{/if}
		
	{:else}
		<!-- Fade with delay is to prevent a bright red button from appearing as soon as refresh is pressed -->
		<div in:fade={{ delay: 300 }} class="concede" on:click={concede}>give up</div>
	{/if}
	
	<Statistics data={stats} />
	<Distribution distribution={stats.guesses} {game} />

	{#if !game.active}
		<Share state={game} />
	{/if}
</Modal>

<Modal fullscreen={true} bind:visible={showSettings}>
	<Settings state={game} />
	{#if game.active}
		<div class="concede" on:click={concede}>give up</div>
	{/if}

	<div slot="footer">
		<a href="https://www.nytimes.com/games/wordle/" target="_blank">Original Wordle</a>
		<div>
			<div>v{version}</div>
			<div
				title="double click to reset your stats"
				class="word"
				on:dblclick={() => {
					localStorage.clear();
					toaster.pop("localStorage cleared");
				}}
			>
				word #{game.wordNumber}
			</div>
		</div>
	</div>
</Modal>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		height: 100%;
		max-width: var(--game-width);
		margin: auto;
		position: relative;
		@media (orientation: landscape) {
			padding-bottom: 10px;
		}
	}
	.concede {
		margin-top: 15px;
		text-transform: uppercase;
		color: #fff;
		cursor: pointer;
		font-size: var(--fs-medium);
		font-weight: bold;
		padding: 15px;
		border-radius: 4px;
		text-align: center;
		background-color: var(--red);
		&:hover {
			opacity: 0.9;
		}
	}
	.button {
		height: 45px;
		aspect-ratio: 1;
		padding: 4px;
		background: var(--color-correct);
		border-radius: 4px;
		cursor: pointer;
		margin: auto;
		fill: white;
	}
	.button:hover {
		opacity: 0.9;
	}
	.next {
		color: #fff;
		font-size: var(--fs-medium);
		line-height: var(--fs-medium);
		text-transform: uppercase;
		font-weight: bold;
		background: var(--color-correct);
		border-radius: 4px;
		height: 52px;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;
		width: 80%;
		cursor: pointer;
		&:hover {
			opacity: 0.9;
		}
		margin: auto;
	}
</style>
