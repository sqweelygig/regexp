import { expect } from "chai";
import "mocha";
import { RegExp as MyRegExp } from "../src/regexp";

/**
 * Tests for the RegExp class.
 * The regexp flavour is as per NodeJS v12.x native implementation.
 */
describe("Random Input Testing", () => {
	describe("RegExp", () => {
		describe("public static testMatch(needle: MatchGroup[], haystack: string)", () => {
			const haystackScope = "abc";
			// TODO: Merge these once I have support for ^ meaning beginning of string
			const startPatternScope = haystackScope + "[]-";
			const midPatternScope = startPatternScope + "^";
			const haystackChars = haystackScope.split("");
			const startChars = startPatternScope.split("");
			const midChars = midPatternScope.split("");
			const approxTests = Math.pow(2, 12);
			const maxPatternLength = Math.pow(2, 3);
			for (let i = 0; i < Math.ceil(Math.sqrt(approxTests)); i++) {
				let regExp;
				let pattern;
				const patternLength = Math.ceil(Math.random() * maxPatternLength);
				while (regExp === undefined) {
					const startIndex = Math.floor(Math.random() * startChars.length);
					pattern = startChars[startIndex];
					for (let j = 0; j < patternLength; j++) {
						const midIndex = Math.floor(Math.random() * midChars.length);
						pattern += midChars[midIndex];
					}
					try {
						regExp = new RegExp(pattern, "");
					} catch (error) {
						/* Intentionally left blank, the loop tries a new pattern */
					}
				}
				let myRegExp;
				it(`should construct using /${pattern}/`, () => {
					try {
						myRegExp = new MyRegExp(`/${pattern}/`);
					} catch (error) {
						// tslint:disable-next-line:no-console
						console.error(error);
					}
					expect(myRegExp).to.not.equal(undefined);
				});
				for (let k = 0; k < Math.floor(Math.sqrt(approxTests)); k++) {
					let haystack = "";
					const extraCharacters = Math.ceil(
						Math.random() * maxPatternLength * 2,
					);
					const haystackLength = patternLength + extraCharacters;
					for (let j = 0; j < haystackLength; j++) {
						const index = Math.floor(Math.random() * haystackChars.length);
						haystack += haystackChars[index];
					}
					const expectation = regExp.test(haystack);
					it(`should return ${expectation} for /${pattern}/ in ${haystack}`, () => {
						expect(myRegExp.test(haystack)).to.equal(expectation);
					});
				}
			}
		});
	});
});
