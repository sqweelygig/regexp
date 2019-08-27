import { MatchCharacter } from "./match-character";
import { MatchEither } from "./match-either";
import { MatchInvert } from "./match-invert";
import { MatchRange } from "./match-range";

export interface Flags {
	dotAll: boolean;
	global: boolean;
	ignoreCase: boolean;
	multiline: boolean;
	unicode: boolean;
}

export interface MatchGroup {
	test(needle: string): boolean;
}

/**
 * A class for the matching of a string against a Regular Expression.
 * NodeJS v12.x native is the reference implementation.
 * It currently supports:
 * * Simple characters; `a`, `ab`
 * * Simple sets; `[ab]`, `[a-c]`, `[^a-c]`, `[a-cA-C]`
 * The features I aspire towards are:
 * * `Common Tokens` from regex101.com for the pattern.
 *   \s, \S, \d, \D, \w, \W, \b, \B, .,
 *   a?, a*, a+, a{3}, a{3,}, a{3,6},
 *   (...), (a|b), ^, $
 * * `sigmu` from mdn web docs for the flags.
 */
export class RegExp {
	public static parseFlags(flags: string): Flags {
		// TODO This should check that the string is in the format /[sgimu]*/
		return {
			dotAll: flags.includes("s"),
			global: flags.includes("g"),
			ignoreCase: flags.includes("i"),
			multiline: flags.includes("m"),
			unicode: flags.includes("u"),
		};
	}

	public static parseGroup(group: string): MatchGroup {
		if (group.length === 0) {
			// Match the null character, ie `[]` in NodeJS native implementation
			return new MatchCharacter("\0");
		} else if (group.length === 1) {
			// Match a single character
			return new MatchCharacter(group);
		} else if (group.charAt(1) === "-" && group.length > 2) {
			// Check if our group begins with a range, eg `a-z`
			const matchHead = new MatchRange(group.charAt(0), group.charAt(2));
			if (group.length === 3) {
				// The group is only the range from above
				return matchHead;
			} else {
				// Recurse upon the rest of the group, matching head or tail
				const matchTail = RegExp.parseGroup(group.substring(3));
				return new MatchEither(matchHead, matchTail);
			}
		} else {
			// The first part of the group therefore must be a character
			const matchHead = new MatchCharacter(group.charAt(0));
			// Recurse upon the rest of the group, matching head or tail
			const matchTail = RegExp.parseGroup(group.substring(1));
			return new MatchEither(matchHead, matchTail);
		}
	}

	public static parsePattern(pattern: string): MatchGroup[] {
		let groupMode = false;
		let groupAccumulator = "";
		const returnValue = [];
		pattern.split("").forEach((character) => {
			if (!groupMode && character === "[") {
				// Switch into group mode
				groupAccumulator = "";
				groupMode = true;
			} else if (groupMode && character === "]") {
				groupMode = false;
				if (groupAccumulator.charAt(0) === "^") {
					// The group we gathered begins `^` so should be inverted
					const baseMatch = RegExp.parseGroup(groupAccumulator.substring(1));
					returnValue.push(new MatchInvert(baseMatch));
				} else {
					// Analyse the group we gathered
					returnValue.push(RegExp.parseGroup(groupAccumulator));
				}
			} else if (groupMode) {
				// Grow the group, if in group mode
				groupAccumulator += character;
			} else {
				// We've a single character group, so can analyse that
				returnValue.push(RegExp.parseGroup(character));
			}
		});
		return returnValue;
	}

	public static testMatch(haystack: string, needle: MatchGroup[]): boolean {
		// If any part of the haystack matches ...
		return haystack.split("").some((character, start) => {
			// ... every part of the needle ...
			return needle.every((matchGroup, offset) => {
				// ... tested character-by-character
				return (
					haystack.length > start + offset &&
					matchGroup.test(haystack.charAt(start + offset))
				);
			});
		});
	}

	private readonly flags: Flags;
	private readonly matchGroups: MatchGroup[];

	public constructor(regExp: string) {
		// TODO This should check that the string is in the format /\/.*\/[a-z]*/
		const flagIndex = regExp.lastIndexOf("/");
		const flagString = regExp.substr(flagIndex);
		const pattern = regExp.substr(1, flagIndex - 1);
		this.flags = RegExp.parseFlags(flagString);
		this.matchGroups = RegExp.parsePattern(pattern);
	}

	public test(haystack: string): boolean {
		return RegExp.testMatch(haystack, this.matchGroups);
	}
}
