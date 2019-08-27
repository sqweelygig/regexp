import { expect } from "chai";
import "mocha";
import { MatchCharacter } from "../src/match-character";
import { MatchEither } from "../src/match-either";

describe("MatchEither", () => {
	describe("public test(needle: string)", () => {
		it("should correctly match one of a character set.", () => {
			const matchA = new MatchCharacter("a");
			const matchB = new MatchCharacter("b");
			const matchEither = new MatchEither(matchA, matchB);
			expect(matchEither.test("a")).to.equal(true);
			expect(matchEither.test("b")).to.equal(true);
			expect(matchEither.test("c")).to.equal(false);
		});
	});
});
