import { expect } from "chai";
import "mocha";
import { MatchAnyOf } from "../src/match-any-of";
import { MatchCharacter } from "../src/match-character";

describe("MatchAnyOf", () => {
	describe("match", () => {
		it("should match one of a character set.", () => {
			const matchA = new MatchCharacter("a");
			const matchB = new MatchCharacter("b");
			const matchAnyOf = new MatchAnyOf([matchA, matchB]);
			expect(matchAnyOf.test("a")).to.equal(true);
			expect(matchAnyOf.test("b")).to.equal(true);
			expect(matchAnyOf.test("c")).to.equal(false);
		});
	});
});
