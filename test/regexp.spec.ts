import { expect } from "chai";
import "mocha";
import { RegExp as MyRegExp } from "../src/regexp";

/**
 * Tests for the RegExp class.
 * The regexp flavour is as per NodeJS v12.x native implementation.
 */
describe("RegExp", () => {
	describe("parseFlags", () => {
		it("should parse an empty flags object.", () => {
			const result = MyRegExp.parseFlags("");
			expect(result).to.deep.equal({
				dotAll: false,
				global: false,
				ignoreCase: false,
				multiline: false,
				unicode: false,
			});
		});
		it("should parse a full flags object.", () => {
			const result = MyRegExp.parseFlags("igmsu");
			expect(result).to.deep.equal({
				dotAll: true,
				global: true,
				ignoreCase: true,
				multiline: true,
				unicode: true,
			});
		});
		it("should parse an example part set of flags.", () => {
			const result = MyRegExp.parseFlags("igm");
			expect(result).to.deep.equal({
				dotAll: false,
				global: true,
				ignoreCase: true,
				multiline: true,
				unicode: false,
			});
		});
	});
	describe("parseGroup", () => {
		it("should parse an example character.", () => {
			const result = MyRegExp.parseGroup("a");
			expect(result.test("a")).to.equal(true);
			expect(result.test("b")).to.equal(false);
			expect(result.test("c")).to.equal(false);
			expect(result.test("d")).to.equal(false);
		});
		it("should parse a group of two characters.", () => {
			const result = MyRegExp.parseGroup("ab");
			expect(result.test("a")).to.equal(true);
			expect(result.test("b")).to.equal(true);
			expect(result.test("c")).to.equal(false);
			expect(result.test("d")).to.equal(false);
		});
		it("should parse a range.", () => {
			const result = MyRegExp.parseGroup("a-c");
			expect(result.test("a")).to.equal(true);
			expect(result.test("b")).to.equal(true);
			expect(result.test("c")).to.equal(true);
			expect(result.test("d")).to.equal(false);
		});
		it("should parse a group of two ranges.", () => {
			const result = MyRegExp.parseGroup("a-cA-C");
			expect(result.test("a")).to.equal(true);
			expect(result.test("b")).to.equal(true);
			expect(result.test("c")).to.equal(true);
			expect(result.test("d")).to.equal(false);
			expect(result.test("A")).to.equal(true);
			expect(result.test("B")).to.equal(true);
			expect(result.test("C")).to.equal(true);
			expect(result.test("D")).to.equal(false);
		});
	});
	describe("parsePattern", () => {
		it("should parse a single character.", () => {
			const result = MyRegExp.parsePattern("a");
			expect(result.length).to.equal(1);
			expect(result[0].test("a")).to.equal(true);
			expect(result[0].test("b")).to.equal(false);
			expect(result[0].test("c")).to.equal(false);
			expect(result[0].test("d")).to.equal(false);
		});
		it("should parse two simple characters.", () => {
			const result = MyRegExp.parsePattern("ab");
			expect(result.length).to.equal(2);
			expect(result[0].test("a")).to.equal(true);
			expect(result[0].test("b")).to.equal(false);
			expect(result[0].test("c")).to.equal(false);
			expect(result[0].test("d")).to.equal(false);
			expect(result[1].test("a")).to.equal(false);
			expect(result[1].test("b")).to.equal(true);
			expect(result[1].test("c")).to.equal(false);
			expect(result[1].test("d")).to.equal(false);
		});
		it("should parse a simple set.", () => {
			const result = MyRegExp.parsePattern("[ab]");
			expect(result.length).to.equal(1);
			expect(result[0].test("a")).to.equal(true);
			expect(result[0].test("b")).to.equal(true);
			expect(result[0].test("c")).to.equal(false);
			expect(result[0].test("d")).to.equal(false);
		});
		it("should parse a single character set.", () => {
			const result = MyRegExp.parsePattern("[a]");
			expect(result.length).to.equal(1);
			expect(result[0].test("a")).to.equal(true);
			expect(result[0].test("b")).to.equal(false);
			expect(result[0].test("c")).to.equal(false);
			expect(result[0].test("d")).to.equal(false);
		});
		it("should parse two simple sets.", () => {
			const result = MyRegExp.parsePattern("[ab][bc]");
			expect(result.length).to.equal(2);
			expect(result[0].test("a")).to.equal(true);
			expect(result[0].test("b")).to.equal(true);
			expect(result[0].test("c")).to.equal(false);
			expect(result[0].test("d")).to.equal(false);
			expect(result[1].test("a")).to.equal(false);
			expect(result[1].test("b")).to.equal(true);
			expect(result[1].test("c")).to.equal(true);
			expect(result[1].test("d")).to.equal(false);
		});
		it("should parse a set then a character.", () => {
			const result = MyRegExp.parsePattern("[ab]c");
			expect(result.length).to.equal(2);
			expect(result[0].test("a")).to.equal(true);
			expect(result[0].test("b")).to.equal(true);
			expect(result[0].test("c")).to.equal(false);
			expect(result[0].test("d")).to.equal(false);
			expect(result[1].test("a")).to.equal(false);
			expect(result[1].test("b")).to.equal(false);
			expect(result[1].test("c")).to.equal(true);
			expect(result[1].test("d")).to.equal(false);
		});
		it("should parse a character then a set.", () => {
			const result = MyRegExp.parsePattern("a[bc]");
			expect(result.length).to.equal(2);
			expect(result[0].test("a")).to.equal(true);
			expect(result[0].test("b")).to.equal(false);
			expect(result[0].test("c")).to.equal(false);
			expect(result[0].test("d")).to.equal(false);
			expect(result[1].test("a")).to.equal(false);
			expect(result[1].test("b")).to.equal(true);
			expect(result[1].test("c")).to.equal(true);
			expect(result[1].test("d")).to.equal(false);
		});
	});
	describe("test (static)", () => {
		it("should find a simple pattern in a string.", () => {
			const needle = MyRegExp.parsePattern("ab");
			expect(MyRegExp.test(needle, "abba")).to.equal(true);
			expect(MyRegExp.test(needle, "kebab")).to.equal(true);
			expect(MyRegExp.test(needle, "bjorn")).to.equal(false);
			expect(MyRegExp.test(needle, "agnetha")).to.equal(false);
		});
	});
	describe("constructor (errors found during random tests)", () => {
		it("should construct using the regexp /[]]/", () => {
			let myRegExp;
			try {
				myRegExp = new MyRegExp("/[]]/");
			} catch (error) {
				// tslint:disable-next-line:no-console
				console.error(error);
			}
			expect(myRegExp).to.not.equal(undefined);
		});
	});
	describe("test (stateful)", () => {
		it("should find a simple pattern in a string.", () => {
			const myRegExp = new MyRegExp("/ab/");
			expect(myRegExp.test("abba")).to.equal(true);
			expect(myRegExp.test("kebab")).to.equal(true);
			expect(myRegExp.test("bjorn")).to.equal(false);
			expect(myRegExp.test("agnetha")).to.equal(false);
		});
	});
	describe("test (errors found during random tests)", () => {
		const tests = [
			{ needle: "[]", haystack: "abba" },
			{ needle: "[^]", haystack: "abba" },
			{ needle: "[^b^b]", haystack: "abba" },
		];
		tests.forEach((test) => {
			const regExp = new RegExp(test.needle);
			const expectation = regExp.test(test.haystack);
			const match = expectation ? "a match" : "no match";
			it(`should find ${match} for /${test.needle}/ in ${test.haystack}`, () => {
				const myRegExp = new MyRegExp(`/${test.needle}/`);
				expect(myRegExp.test(test.haystack)).to.equal(expectation);
			});
		});
	});
	describe("test (random input strings)", () => {
		const haystackScope = "abc";
		// TODO: Merge these once I have support for ^ meaning beginning of string
		const startPatternScope = haystackScope + "[]-";
		const midPatternScope = startPatternScope + "^";
		const haystackChars = haystackScope.split("");
		const startChars = startPatternScope.split("");
		const midChars = midPatternScope.split("");
		const approxTests = Math.pow(2, 12);
		const maxLength = 16;
		for (let i = 0; i < Math.ceil(Math.sqrt(approxTests)); i++) {
			let regExp;
			let pattern;
			const patternLength = Math.ceil(Math.random() * maxLength);
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
				const extraCharacters = Math.ceil(Math.random() * maxLength * 2);
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
