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
		it("should parse an example character", () => {
			const result = RegExp.parseGroup("a");
			expect(result.test("a")).to.equal(true);
			expect(result.test("b")).to.equal(false);
			expect(result.test("c")).to.equal(false);
			expect(result.test("d")).to.equal(false);
		});
		it("should parse a group of two characters", () => {
			const result = RegExp.parseGroup("ab");
			expect(result.test("a")).to.equal(true);
			expect(result.test("b")).to.equal(true);
			expect(result.test("c")).to.equal(false);
			expect(result.test("d")).to.equal(false);
		});
		it("should parse an inverted group", () => {
			const result = RegExp.parseGroup("^ab");
			expect(result.test("a")).to.equal(false);
			expect(result.test("b")).to.equal(false);
			expect(result.test("c")).to.equal(true);
			expect(result.test("d")).to.equal(true);
		});
		it("should parse a range", () => {
			const result = RegExp.parseGroup("a-c");
			expect(result.test("a")).to.equal(true);
			expect(result.test("b")).to.equal(true);
			expect(result.test("c")).to.equal(true);
			expect(result.test("d")).to.equal(false);
		});
		it("should parse an inverted range", () => {
			const result = RegExp.parseGroup("^a-c");
			expect(result.test("a")).to.equal(false);
			expect(result.test("b")).to.equal(false);
			expect(result.test("c")).to.equal(false);
			expect(result.test("d")).to.equal(true);
		});
		it("should parse a group of two ranges", () => {
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
});
