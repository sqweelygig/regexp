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
});
