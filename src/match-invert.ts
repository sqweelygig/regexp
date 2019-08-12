import { MatchGroup } from "./regexp";

export class MatchInvert implements MatchGroup {
	constructor(private readonly matcher: MatchGroup) {}

	public test(needle: string): boolean {
		return !this.matcher.test(needle);
	}
}
