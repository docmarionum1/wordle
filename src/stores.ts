import { writable } from "svelte/store";
import { createDefaultSettings, createLetterStates } from "./utils";


export const letterStates = writable(createLetterStates());

export const settings = writable(createDefaultSettings());