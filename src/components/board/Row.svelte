<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import Tile from "./Tile.svelte";
	export let guesses: number;
	export let num: number;
	export let value = "";
	export let state: LetterState[];
	export let length: number;
	export let target: string;
	export function shake() {
		animation = "shake";
	}
	export function bounce() {
		tiles.forEach((e) => e && e.bounce());
	}
	const dispatch = createEventDispatcher();
	let animation = "";
	let tiles: Tile[] = [];
</script>

<div
	class="board-row"
	on:contextmenu|preventDefault={(e) => dispatch("ctx", { x: e.clientX, y: e.clientY })}
	on:dblclick|preventDefault={(e) => dispatch("ctx", { x: e.clientX, y: e.clientY })}
	on:animationend={() => (animation = "")}
	data-animation={animation}
	class:complete={guesses > num}
>
	{#each Array(length) as _, i}
		<Tile 
			bind:this={tiles[i]} 
			state={state[i]} 
			value={target.charAt(i) == " " ? " " : value.charAt(i)} 
			position={i}
			word_length={state.length} 
		/>
	{/each}
</div>

<style lang="scss">
	.board-row {
		display: grid;
		grid-template-columns: repeat(var(--cols), 1fr);
		gap: 5px;
		height: fit-content;
		&[data-animation="shake"] {
			animation: shake 0.6s steps(10000);
		}
	}
	@keyframes shake {
		10%,
		90% {
			transform: translateX(-1px);
		}

		20%,
		80% {
			transform: translateX(2px);
		}

		30%,
		50%,
		70% {
			transform: translateX(-4px);
		}

		40%,
		60% {
			transform: translateX(4px);
		}
	}
</style>
