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
 * The features I aspire to implement are:
 * * `Common Tokens` from regex101.com for the pattern.
 *   [abc], [^abc], [a-z], [^a-z], [a-zA-Z],
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
		if (group.length === 1) {
			return new MatchCharacter(group);
		} else if (group.charAt(0) === "^") {
			const matcher = RegExp.parseGroup(group.substring(1));
			return new MatchInvert(matcher);
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

	public readonly flags: Flags;
	public readonly pattern: string;

	public constructor(private readonly regExp: string) {
		// TODO This should check that the string is in the format /\/.*\/[a-z]*/
		const flagIndex = regExp.lastIndexOf("/");
		const flagString = regExp.substr(flagIndex);
		this.flags = RegExp.parseFlags(flagString);
		this.pattern = regExp.substr(1, flagIndex - 1);
	}
}
