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
		<Tile value="A" state="🟩" word_length={7}/>
		<Tile value="b" state="🔳" word_length={7}/>
		<Tile value="i" state="🔳" word_length={7}/>
		<Tile value="g" state="🔳" word_length={7}/>
		<Tile value="a" state="🔳" word_length={7}/>
		<Tile value="i" state="🔳" word_length={7}/>
		<Tile value="l" state="🔳" word_length={7}/>
	</div>
	<div>The letter <strong>A</strong> is in the word and in the correct spot.</div>
	<div class="row">
		<Tile value="j" state="🔳" word_length={7}/>
		<Tile value="e" state="🔳" word_length={7}/>
		<Tile value="r" state="🟨" word_length={7}/>
		<Tile value="e" state="🔳" word_length={7}/>
		<Tile value="m" state="🔳" word_length={7}/>
		<Tile value="y" state="🔳" word_length={7}/>
		<Tile value="🙃" state="🔳" word_length={7}/>
	</div>
	<div>The letter <strong>R</strong> is in the word but in the wrong spot.</div>
	<div class="row">
		<Tile value="w" state="🔳" word_length={7}/>
		<Tile value="e" state="🔳" word_length={7}/>
		<Tile value="d" state="🔳" word_length={7}/>
		<Tile value="d" state="🔳" word_length={7}/>
		<Tile value="i" state="⬛" word_length={7}/>
		<Tile value="n" state="🔳" word_length={7}/>
		<Tile value="g" state="🔳" word_length={7}/>
	</div>
	<div>The letter <strong>I</strong> is not in the word in any spot.</div>
</div>
<div>
	Adapted from an open source version of <a
		href="https://www.nytimes.com/games/wordle/"
		target="_blank">Wordle</a
	> by
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
	:global(.examples text) {
		font-size: min(3vh,3vw) !important;
	}
	.row {
		height: 40px;
		display: flex;
		gap: 4px;
	}
</style>
