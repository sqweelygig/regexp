export interface Flags {
	dotAll: boolean;
	global: boolean;
	ignoreCase: boolean;
	multiline: boolean;
	unicode: boolean;
}

/*
 * This format is exactly the arguments of <String>.substring() for now.
 * It is open for revision, especially around whether to include length and
 * substring properties.
 */
export interface Match {
	end: number;
	start: number;
}

// TODO This should understand flags.  For the moment I am assuming /g.
export type Matcher = (haystack: string) => Match[];

/**
 * A class for the matching of a string against a Regular Expression.
 * The features I aspire to implement are:
 * * `Common Tokens` from regex101.com for the pattern.
 *   [abc], [^abc], [a-z], [^a-z], [a-zA-Z], .,
 *   \s, \S, \d, \D, \w, \W, \b, \B,
 *   a?, a*, a+, a{3}, a{3,}, a{3,6},
 *   (...), (a|b), ^, $
 * * `sigmu` from mdn web docs for the flags.
 */
export class RegExp {
	public static parseFlagsArray(flags: string): Flags {
		// TODO This should check that the string is in the format /[sgimu]*/
		return {
			dotAll: flags.includes("s"),
			global: flags.includes("g"),
			ignoreCase: flags.includes("i"),
			multiline: flags.includes("m"),
			unicode: flags.includes("u"),
		};
	}

	public static matchString(needle: string): Matcher {
		return (haystack: string) => {
			const returnValue = [] as Match[];
			// TODO This should terminate once there are too few characters left
			for (let i = 0; i < haystack.length; i++) {
				if (haystack.substr(i, needle.length) === needle) {
					returnValue.push({
						end: i + needle.length,
						start: i,
					});
				}
			}
			return returnValue;
		};
	}

	public readonly flags: Flags;
	public readonly pattern: string;

	public constructor(private readonly regExp: string) {
		// TODO This should check that the string is in the format /\/.*\/[a-z]*/
		const flagIndex = regExp.lastIndexOf("/");
		const flagString = regExp.substr(flagIndex);
		this.flags = RegExp.parseFlagsArray(flagString);
		this.pattern = regExp.substr(1, flagIndex - 1);
	}
}
