import { expect } from "chai";
import "mocha";
import { RegExp as MyRegExp } from "../src/regexp";

/**
 * Tests for the RegExp class.
 * The regexp flavour is as per NodeJS v12.x native implementation.
 */
describe("Random Input Testing", () => {
	describe("RegExp", () => {
		const endStackPushing = Date.now() + 50;
		const haystackScope = "abc";
		// TODO: Merge these once I have support for ^ meaning beginning of string
		const startPatternScope = haystackScope + "[]-";
		const midPatternScope = startPatternScope + "^";
		const haystackChars = haystackScope.split("");
		const startChars = startPatternScope.split("");
		const midChars = midPatternScope.split("");
		const maxPatternLength = Math.pow(2, 3);
		while (Date.now() < endStackPushing) {
			const patternLength = Math.floor(Math.random() * maxPatternLength);
			let regExp;
			let pattern;
			// Build random patterns until a valid pattern is found
			while (regExp === undefined) {
				const startIndex = Math.floor(Math.random() * startChars.length);
				pattern = startChars[startIndex];
				for (let i = 0; i < patternLength; i++) {
					const midIndex = Math.floor(Math.random() * midChars.length);
					pattern += midChars[midIndex];
				}
				try {
					regExp = new RegExp(pattern, "");
				} catch (error) {
					/* Intentionally left blank, the loop tries a new pattern */
				}
			}
			describe(pattern, () => {
				describe("public constructor(regExp: string)", () => {
					it("should construct.", () => {
						const myRegExp = new MyRegExp(`/${pattern}/`);
						expect(myRegExp).to.not.equal(undefined);
					});
				});
				describe("public static testMatch(needle: MatchGroup[], haystack: string)", () => {
					const needle = MyRegExp.parsePattern(pattern);
					for (let j = 0; j < 16; j++) {
						const haystackPicks = [];
						const haystackLength = Math.ceil(
							Math.random() * maxPatternLength * 3,
						);
						for (let k = 0; k < haystackLength; k++) {
							const index = Math.floor(Math.random() * haystackChars.length);
							haystackPicks.push(haystackChars[index]);
						}
						const haystack = haystackPicks.join("");
						const expectation = regExp.test(haystack);
						const matches = expectation ? "matches" : "does not match";
						it(`should find that ${haystack} ${matches}.`, () => {
							const result = MyRegExp.testMatch(haystack, needle);
							expect(result).to.equal(expectation);
						});
					}
				});
			});
		}
	});
});
