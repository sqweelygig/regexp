import { MatchGroup } from "./regexp";

export class MatchInvert implements MatchGroup {
	constructor(private readonly matchGroup: MatchGroup) {}

	public test(needle: string): boolean {
		return !this.matchGroup.test(needle);
	}
}
