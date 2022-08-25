<script lang="ts">
	import { ROWS } from "../../utils";

	import { Tile } from "../board";
	export let visible: boolean;
</script>

<h3>how to play</h3>
<div>Guess the <strong>JERBIWORDLE</strong> in {ROWS} tries.</div> 

<div>A <strong>JERBIWORDLE</strong> is a word related to or significant to Abby and Jeremy.</div>

<div>Each guess must be a valid word. Hit the enter button to submit.</div>
<div>
	After each guess, the color of the tiles will change to show how close your guess was to the
	word.
</div>
<div class:complete={visible} class="examples">
	<div><strong>Examples</strong></div>
	<div class="row">
		<Tile value="A" state="🟩" />
		<Tile value="b" state="🔳" />
		<Tile value="i" state="🔳" />
		<Tile value="g" state="🔳" />
		<Tile value="a" state="🔳" />
		<Tile value="i" state="🔳" />
		<Tile value="l" state="🔳" />
	</div>
	<div>The letter <strong>A</strong> is in the word and in the correct spot.</div>
	<div class="row">
		<Tile value="j" state="🔳" />
		<Tile value="e" state="🔳" />
		<Tile value="r" state="🟨" />
		<Tile value="e" state="🔳" />
		<Tile value="m" state="🔳" />
		<Tile value="y" state="🔳" />
		<Tile value="🙃" state="🔳" />
	</div>
	<div>The letter <strong>R</strong> is in the word but in the wrong spot.</div>
	<div class="row">
		<Tile value="w" state="🔳" />
		<Tile value="e" state="🔳" />
		<Tile value="d" state="🔳" />
		<Tile value="d" state="🔳" />
		<Tile value="i" state="⬛" />
		<Tile value="n" state="🔳" />
		<Tile value="g" state="🔳" />
	</div>
	<div>The letter <strong>I</strong> is not in the word in any spot.</div>
</div>
<div>
	This is a recreation of the original <a
		href="https://www.nytimes.com/games/wordle/"
		target="_blank">Wordle</a
	>
	by Josh Wardle, adapted from an open source version by
	<a href="https://github.com/MikhaD" target="_blank">MikhaD</a>.
</div>

<style lang="scss">
	div {
		margin: 14px 0;
	}
	.examples {
		border-top: 1px solid var(--border-primary);
		border-bottom: 1px solid var(--border-primary);
		:global(.row > *) {
			height: 100%;
			aspect-ratio: 1;
		}
		&:not(.complete) :global(.row .back) {
			transition-delay: 0.3s;
		}
	}
	.row {
		height: 40px;
		display: flex;
		gap: 4px;
	}
</style>
