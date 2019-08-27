import { expect } from "chai";
import "mocha";
import { MatchCharacter } from "../src/match-character";
import { MatchInvert } from "../src/match-invert";

describe("MatchInvert", () => {
	describe("public test(needle: string)", () => {
		it("should correctly invert a match.", () => {
			const matcher = new MatchCharacter("a");
			const invertedMatcher = new MatchInvert(matcher);
			expect(invertedMatcher.test("a")).to.equal(false);
			expect(invertedMatcher.test("b")).to.equal(true);
		});
	});
});
