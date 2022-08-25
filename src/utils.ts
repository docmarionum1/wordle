import wordList from "./dictionary";

export const ROWS = 6;
//export const COLS = 5;

export const words = {
	...wordList,
	contains: (word: string) => {
		return wordList.words.includes(word);
	},
};

export const targets = {
	words: [
		//"prospectplace",
		//"pizza",
		// "abigail",
		// "ios",
		// "jeremy",
		// "barnard",
		// "litter",
		//"prospect place",
		//"subway",
		"pizza",
		"geode",
		"magic",
		"wuhan",
		"abby",
		"ios",
		"barnard",
		"antarctica",
		"little cupcake",
		"sidewalk labs",
	],

	definitions: {
		"abigail": {
			"word": "Abigail",
			"phonetic": "",
			"origin": "",
			"partOfSpeech": "noun",
			"meanings": [
				"variant of Abby",
				"The bride",
			]
		},
		"ios": {
			"word": "iOS",
			"phonetic": "",
			"origin": "",
			"partOfSpeech": "noun",
			"meanings": [
				"Jeremy and Abby's cat"
			]
		},
		"barnard": {
			"word": "Barnard",
			"phonetic": "",
			"origin": "",
			"partOfSpeech": "noun",
			"meanings": [
				"Abby's college"
			]
		},
	},

	contains: (word: string) => {
		return targets.words.includes(word);
	},
};

export function isValidWord(word:string) : boolean {
	
	// return words.contains(word) || targets.contains(word);
	// if () {
	// 	return true;
	// }

	return targets.contains(word) || word.split(" ").map(w => words.contains(w)).reduce((a, b) => a && b);
}

export function checkHardMode(board: GameBoard, row: number): HardModeData {
	const cols = board.state[0].length;

	for (let i = 0; i < cols; ++i) {
		if (board.state[row - 1][i] === "🟩" && board.words[row - 1][i] !== board.words[row][i]) {
			return { pos: i, char: board.words[row - 1][i], type: "🟩" };
		}
	}
	for (let i = 0; i < cols; ++i) {
		if (board.state[row - 1][i] === "🟨" && !board.words[row].includes(board.words[row - 1][i])) {
			return { pos: i, char: board.words[row - 1][i], type: "🟨" };
		}
	}
	return { pos: -1, char: "", type: "⬛" };
}

class Tile {
	public value: string;
	public notSet: Set<string>;
	constructor() {
		this.notSet = new Set<string>();
	}
	not(char: string) {
		this.notSet.add(char);
	}
}

class WordData {
	public letterCounts: Map<string, [number, boolean]>;
	private notSet: Set<string>;
	public word: Tile[];
	constructor(length: number) {
		this.notSet = new Set<string>();
		this.letterCounts = new Map<string, [number, boolean]>();
		this.word = [];
		for (let col = 0; col < length; ++col) {
			this.word.push(new Tile());
		}
	}
	confirmCount(char: string) {

		let c = this.letterCounts.get(char);
		if (!c) {
			this.not(char);
		} else {
			c[1] = true;
		}
	}
	countConfirmed(char: string) {
		const val = this.letterCounts.get(char);
		return val ? val[1] : false;
	}
	setCount(char: string, count: number) {
		let c = this.letterCounts.get(char);
		if (!c) {
			this.letterCounts.set(char, [count, false]);
		} else {
			c[0] = count;
		}
	}
	incrementCount(char: string) {
		++this.letterCounts.get(char)[0];
	}
	not(char: string) {
		this.notSet.add(char);
	}
	inGlobalNotList(char: string) {
		return this.notSet.has(char);
	}
	lettersNotAt(pos: number) {
		return new Set([...this.notSet, ...this.word[pos].notSet]);
	}
}

export function getRowData(n: number, board: GameBoard) {
	const word_length = board.state[0].length;
	const wd = new WordData(word_length);
	for (let row = 0; row < n; ++row) {
		const occured = new Set<string>();
		for (let col = 0; col < word_length; ++col) {
			const state = board.state[row][col];
			const char = board.words[row][col];
			if (state === "⬛") {
				wd.confirmCount(char);
				// if char isn't in the global not list add it to the not list for that position
				if (!wd.inGlobalNotList(char)) {
					wd.word[col].not(char);
				}
				continue;
			}
			// If this isn't the first time this letter has occured in this row
			if (occured.has(char)) {
				wd.incrementCount(char);
			} else if (!wd.countConfirmed(char)) {
				occured.add(char);
				wd.setCount(char, 1);
			}
			if (state === "🟩") {
				wd.word[col].value = char;
			}
			else {	// if (state === "🟨")
				wd.word[col].not(char);
			}
		}
	}

	let exp = "";
	for (let pos = 0; pos < wd.word.length; ++pos) {
		exp += wd.word[pos].value ? wd.word[pos].value : `[^${[...wd.lettersNotAt(pos)].join(" ")}]`;
	}
	return (word: string) => {
		if (new RegExp(exp).test(word)) {
			const chars = word.split("");
			for (const e of wd.letterCounts) {
				const occurences = countOccurences(chars, e[0]);
				if (!occurences || (e[1][1] && occurences !== e[1][0])) return false;
			}
			return true;
		}
		return false;
	};
}

function countOccurences<T>(arr: T[], val: T) {
	return arr.reduce((count, v) => v === val ? count + 1 : count, 0);
}

export function getState(word: string, guess: string): LetterState[] {
	const charArr = word.split("");
	const result = Array<LetterState>(word.length).fill("⬛");
	for (let i = 0; i < word.length; ++i) {
		if (charArr[i] === guess.charAt(i)) {
			result[i] = "🟩";
			charArr[i] = "$";
		}
	}
	for (let i = 0; i < word.length; ++i) {
		const pos = charArr.indexOf(guess[i]);
		if (result[i] !== "🟩" && pos >= 0) {
			charArr[pos] = "$";
			result[i] = "🟨";
		}
	}
	return result;
}

export function contractNum(n: number) {
	switch (n % 10) {
		case 1: return `${n}st`;
		case 2: return `${n}nd`;
		case 3: return `${n}rd`;
		default: return `${n}th`;
	}
}

export const keys = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

export const DELAY_INCREMENT = 200;

export const PRAISE = [
	"Genius",
	"Magnificent",
	"Impressive",
	"Splendid",
	"Great",
	"Phew",
];

export function createNewGame(state?: GameState): GameState {
	const word_number = state ? state.wordNumber + 1 : 0;
	const word = targets.words[word_number];
	return {
		active: true,
		guesses: 0,
		wordNumber: word_number,
		validHard: true,
		board: {
			words: Array(ROWS).fill(""),
			state: Array.from({ length: ROWS }, () => (Array(word.length).fill("🔳")))
		},
	};
}

export function createDefaultSettings(): Settings {
	return {
		hard: false,
		dark: false,
		colorblind: false,
		tutorial: 3,
	};
}

export function createDefaultStats(): Stats {
	const stats = {
		played: 0,
		lastGame: 0,
		guesses: {
			fail: 0,
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
			6: 0,
		}
	};

	return {
		...stats,
		streak: 0,
		maxStreak: 0,
	};
};

export function createLetterStates(): { [key: string]: LetterState; } {
	return {
		a: "🔳",
		b: "🔳",
		c: "🔳",
		d: "🔳",
		e: "🔳",
		f: "🔳",
		g: "🔳",
		h: "🔳",
		i: "🔳",
		j: "🔳",
		k: "🔳",
		l: "🔳",
		m: "🔳",
		n: "🔳",
		o: "🔳",
		p: "🔳",
		q: "🔳",
		r: "🔳",
		s: "🔳",
		t: "🔳",
		u: "🔳",
		v: "🔳",
		w: "🔳",
		x: "🔳",
		y: "🔳",
		z: "🔳",
	};
}

export function failed(s: GameState) {
	return !(s.active || (s.guesses > 0 && s.board.state[s.guesses - 1].join("") === "🟩".repeat(s.board.state[0].length)));
}