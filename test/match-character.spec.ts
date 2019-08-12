import { expect } from "chai";
import "mocha";
import { MatchCharacter } from "../src/match-character";

describe("MatchCharacter", () => {
	describe("match", () => {
		it("should match a single character", () => {
			const matchCharacter = new MatchCharacter("a");
			expect(matchCharacter.test("a")).to.equal(true);
			expect(matchCharacter.test("b")).to.equal(false);
		});
	});
});
