import { expect } from "chai";
import "mocha";
import { MatchRange } from "../src/match-range";

describe("MatchRange", () => {
	describe("public test(needle: string)", () => {
		it("should correctly match characters in a range", () => {
			const matchRange = new MatchRange("a", "c");
			expect(matchRange.test("a")).to.equal(true);
			expect(matchRange.test("b")).to.equal(true);
			expect(matchRange.test("c")).to.equal(true);
			expect(matchRange.test("d")).to.equal(false);
		});
	});
});
