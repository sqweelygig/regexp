import { MatchGroup } from "./regexp";

export class MatchEither implements MatchGroup {
	constructor(
		private readonly matchGroupA: MatchGroup,
		private readonly matchGroupB: MatchGroup,
	) {}

	public test(needle: string): boolean {
		return this.matchGroupA.test(needle) || this.matchGroupB.test(needle);
	}
}
