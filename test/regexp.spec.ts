import { expect } from "chai";
import "mocha";
import { RegExp } from "../src/regexp";

/**
 * Tests for the RegExp class.
 * The NodeJS v12.x native implementation should be considered authoritative.
 */

describe("Flags Parser", () => {
	it("should calculate an empty flags object", () => {
		const regExp = new RegExp(/a/.toString());
		const result = regExp.flags;
		expect(result).to.deep.equal({
			dotAll: false,
			global: false,
			ignoreCase: false,
			multiline: false,
			unicode: false,
		});
	});
	it("should calculate a full flags object", () => {
		const regExp = new RegExp(/a/igmsu.toString());
		const result = regExp.flags;
		expect(result).to.deep.equal({
			dotAll: true,
			global: true,
			ignoreCase: true,
			multiline: true,
			unicode: true,
		});
	});
	it("should calculate an example part set of flags", () => {
		const regExp = new RegExp(/a/igm.toString());
		const result = regExp.flags;
		expect(result).to.deep.equal({
			dotAll: false,
			global: true,
			ignoreCase: true,
			multiline: true,
			unicode: false,
		});
	});
});
