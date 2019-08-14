import { expect } from "chai";
import "mocha";
import { RegExp } from "../src/regexp";

/**
 * Tests for the RegExp class.
 * The regexp flavour is as per NodeJS v12.x native implementation.
 */
describe("RegExp", () => {
	describe("parseFlags", () => {
		it("should parse an empty flags object.", () => {
			const result = RegExp.parseFlags("");
			expect(result).to.deep.equal({
				dotAll: false,
				global: false,
				ignoreCase: false,
				multiline: false,
				unicode: false,
			});
		});
		it("should parse a full flags object.", () => {
			const result = RegExp.parseFlags("igmsu");
			expect(result).to.deep.equal({
				dotAll: true,
				global: true,
				ignoreCase: true,
				multiline: true,
				unicode: true,
			});
		});
		it("should parse an example part set of flags.", () => {
			const result = RegExp.parseFlags("igm");
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
			const result = RegExp.parseGroup("a");
			expect(result.test("a")).to.equal(true);
			expect(result.test("b")).to.equal(false);
			expect(result.test("c")).to.equal(false);
			expect(result.test("d")).to.equal(false);
		});
		it("should parse a group of two characters.", () => {
			const result = RegExp.parseGroup("ab");
			expect(result.test("a")).to.equal(true);
			expect(result.test("b")).to.equal(true);
			expect(result.test("c")).to.equal(false);
			expect(result.test("d")).to.equal(false);
		});
		it("should parse an inverted group.", () => {
			const result = RegExp.parseGroup("^ab");
			expect(result.test("a")).to.equal(false);
			expect(result.test("b")).to.equal(false);
			expect(result.test("c")).to.equal(true);
			expect(result.test("d")).to.equal(true);
		});
		it("should parse a range.", () => {
			const result = RegExp.parseGroup("a-c");
			expect(result.test("a")).to.equal(true);
			expect(result.test("b")).to.equal(true);
			expect(result.test("c")).to.equal(true);
			expect(result.test("d")).to.equal(false);
		});
		it("should parse an inverted range.", () => {
			const result = RegExp.parseGroup("^a-c");
			expect(result.test("a")).to.equal(false);
			expect(result.test("b")).to.equal(false);
			expect(result.test("c")).to.equal(false);
			expect(result.test("d")).to.equal(true);
		});
		it("should parse a group of two ranges.", () => {
			const result = RegExp.parseGroup("a-cA-C");
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
			const result = RegExp.parsePattern("a");
			expect(result.length).to.equal(1);
			expect(result[0].test("a")).to.equal(true);
			expect(result[0].test("b")).to.equal(false);
			expect(result[0].test("c")).to.equal(false);
			expect(result[0].test("d")).to.equal(false);
		});
		it("should parse two simple characters.", () => {
			const result = RegExp.parsePattern("ab");
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
			const result = RegExp.parsePattern("[ab]");
			expect(result.length).to.equal(1);
			expect(result[0].test("a")).to.equal(true);
			expect(result[0].test("b")).to.equal(true);
			expect(result[0].test("c")).to.equal(false);
			expect(result[0].test("d")).to.equal(false);
		});
		it("should parse two simple sets.", () => {
			const result = RegExp.parsePattern("[ab][bc]");
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
			const result = RegExp.parsePattern("[ab]c");
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
			const result = RegExp.parsePattern("a[bc]");
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
});
