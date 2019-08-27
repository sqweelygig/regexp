import { expect } from "chai";
import "mocha";
import { RegExp as MyRegExp } from "../src/regexp";

describe("RegExp", () => {
	describe("public static parseFlags(flags: string)", () => {
		it("should parse an empty string into an empty flags object.", () => {
			const result = MyRegExp.parseFlags("");
			expect(result).to.deep.equal({
				dotAll: false,
				global: false,
				ignoreCase: false,
				multiline: false,
				unicode: false,
			});
		});
		it("should parse `igmsu` into a full flags object.", () => {
			const result = MyRegExp.parseFlags("igmsu");
			expect(result).to.deep.equal({
				dotAll: true,
				global: true,
				ignoreCase: true,
				multiline: true,
				unicode: true,
			});
		});
		it("should parse `igm` into a partial set of flags.", () => {
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
	describe("public static parseGroup(group: string)", () => {
		it("should parse a character into a group that matches just that character.", () => {
			const result = MyRegExp.parseGroup("a");
			expect(result.test("a")).to.equal(true);
			expect(result.test("b")).to.equal(false);
			expect(result.test("c")).to.equal(false);
			expect(result.test("d")).to.equal(false);
		});
		it("should parse two characters into a group that matches either character.", () => {
			const result = MyRegExp.parseGroup("ab");
			expect(result.test("a")).to.equal(true);
			expect(result.test("b")).to.equal(true);
			expect(result.test("c")).to.equal(false);
			expect(result.test("d")).to.equal(false);
		});
		it("should parse a range into a group that matches the range.", () => {
			const result = MyRegExp.parseGroup("a-c");
			expect(result.test("a")).to.equal(true);
			expect(result.test("b")).to.equal(true);
			expect(result.test("c")).to.equal(true);
			expect(result.test("d")).to.equal(false);
		});
		it("should parse two ranges into a group that matches either range.", () => {
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
	describe("public static parsePattern(pattern: string)", () => {
		it("should parse a character into an array with one group that matches the character.", () => {
			const result = MyRegExp.parsePattern("a");
			expect(result.length).to.equal(1);
			expect(result[0].test("a")).to.equal(true);
			expect(result[0].test("b")).to.equal(false);
			expect(result[0].test("c")).to.equal(false);
			expect(result[0].test("d")).to.equal(false);
		});
		it("should parse two characters into an array with two groups each matching their character.", () => {
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
		it("should parse a set into an array with one group that matches the characters.", () => {
			const result = MyRegExp.parsePattern("[ab]");
			expect(result.length).to.equal(1);
			expect(result[0].test("a")).to.equal(true);
			expect(result[0].test("b")).to.equal(true);
			expect(result[0].test("c")).to.equal(false);
			expect(result[0].test("d")).to.equal(false);
		});
		it("should parse an inverted set into an array with one group that matches other characters.", () => {
			const result = MyRegExp.parsePattern("[^ab]");
			expect(result.length).to.equal(1);
			expect(result[0].test("a")).to.equal(false);
			expect(result[0].test("b")).to.equal(false);
			expect(result[0].test("c")).to.equal(true);
			expect(result[0].test("d")).to.equal(true);
		});
		it("should parse a single character set into an array with one group that matches the character.", () => {
			const result = MyRegExp.parsePattern("[a]");
			expect(result.length).to.equal(1);
			expect(result[0].test("a")).to.equal(true);
			expect(result[0].test("b")).to.equal(false);
			expect(result[0].test("c")).to.equal(false);
			expect(result[0].test("d")).to.equal(false);
		});
		it("should parse two sets into an array with two groups each matching their characters.", () => {
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
		it("should parse a set then a character into an array with two groups each matching their character(s).", () => {
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
		it("should parse a character then a set into an array with two groups each matching their character(s).", () => {
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
	describe("public static testMatch(needle: MatchGroup[], haystack: string)", () => {
		const needles = ["a", "ab", "[ab]", "[]]", "[a-c]", "[^a-c]", "[a-cA-C]"];
		const haystacks = ["abba", "bc", "kebab", "bjorn", "agnetha"];
		needles.forEach((needle) => {
			haystacks.forEach((haystack) => {
				const regExp = new RegExp(needle);
				const expectation = regExp.test(haystack);
				const matches = expectation ? "matches" : "does not match";
				it(`should find that ${haystack} ${matches} ${needle}.`, () => {
					const pattern = MyRegExp.parsePattern(needle);
					const result = MyRegExp.testMatch(haystack, pattern);
					expect(result).to.equal(expectation);
				});
			});
		});
	});
	describe("public constructor(regExp: string)", () => {
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
	describe("public test(haystack: string)", () => {
		it("should find if strings match a simple pattern.", () => {
			const myRegExp = new MyRegExp("/ab/");
			expect(myRegExp.test("abba")).to.equal(true);
			expect(myRegExp.test("kebab")).to.equal(true);
			expect(myRegExp.test("bjorn")).to.equal(false);
			expect(myRegExp.test("agnetha")).to.equal(false);
		});
	});
});
