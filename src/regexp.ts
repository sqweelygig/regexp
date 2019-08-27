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
			return new MatchCharacter("\0");
		} else if (group.length === 1) {
			return new MatchCharacter(group);
		} else if (group.charAt(1) === "-" && group.length > 2) {
			const matchHead = new MatchRange(group.charAt(0), group.charAt(2));
			if (group.length === 3) {
				return matchHead;
			} else {
				const matchTail = RegExp.parseGroup(group.substring(3));
				return new MatchEither(matchHead, matchTail);
			}
		} else {
			const matchHead = new MatchCharacter(group.charAt(0));
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
				groupAccumulator = "";
				groupMode = true;
			} else if (groupMode && character === "]") {
				groupMode = false;
				if (groupAccumulator.charAt(0) === "^") {
					const baseMatch = RegExp.parseGroup(groupAccumulator.substring(1));
					returnValue.push(new MatchInvert(baseMatch));
				} else {
					returnValue.push(RegExp.parseGroup(groupAccumulator));
				}
			} else if (groupMode) {
				groupAccumulator += character;
			} else {
				returnValue.push(RegExp.parseGroup(character));
			}
		});
		return returnValue;
	}

	public static testMatch(haystack: string, needle: MatchGroup[]): boolean {
		return haystack.split("").some((character, start) => {
			return needle.every((matchGroup, offset) => {
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
