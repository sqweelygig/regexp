import { expect } from "chai";
import "mocha";
import { RegExp } from "../src/regexp";

/**
 * Tests for the RegExp class.
 * The regexp flavour is as per NodeJS v12.x native implementation.
 */
describe("RegExp", () => {
	describe("parseFlagsArray", () => {
		it("should parse an empty flags object.", () => {
			const result = RegExp.parseFlagsArray("");
			expect(result).to.deep.equal({
				dotAll: false,
				global: false,
				ignoreCase: false,
				multiline: false,
				unicode: false,
			});
		});
		it("should parse a full flags object.", () => {
			const result = RegExp.parseFlagsArray("igmsu");
			expect(result).to.deep.equal({
				dotAll: true,
				global: true,
				ignoreCase: true,
				multiline: true,
				unicode: true,
			});
		});
		it("should parse an example part set of flags.", () => {
			const result = RegExp.parseFlagsArray("igm");
			expect(result).to.deep.equal({
				dotAll: false,
				global: true,
				ignoreCase: true,
				multiline: true,
				unicode: false,
			});
		});
	});
	describe("matchString", () => {
		it("should locate a character within a string.", () => {
			const matcher = RegExp.matchString("a");
			expect(matcher("b")).to.deep.equal([]);
			expect(matcher("a")).to.deep.equal([
				{
					end: 1,
					start: 0,
				},
			]);
		});
		it("should locate a character repeated in a string.", () => {
			const matcher = RegExp.matchString("a");
			expect(matcher("bjorn")).to.deep.equal([]);
			expect(matcher("abba")).to.deep.equal([
				{
					end: 1,
					start: 0,
				},
				{
					end: 4,
					start: 3,
				},
			]);
		});
		it("should locate a string within a string.", () => {
			const matcher = RegExp.matchString("ab");
			expect(matcher("bar")).to.deep.equal([]);
			expect(matcher("abba")).to.deep.equal([
				{
					end: 2,
					start: 0,
				},
			]);
		});
	});
});
