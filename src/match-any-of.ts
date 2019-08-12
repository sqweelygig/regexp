import { MatchGroup } from "./regexp";

export class MatchAnyOf implements MatchGroup {
	constructor(private readonly matchers: MatchGroup[]) {}

	public test(needle: string): boolean {
		let returnValue = false;
		this.matchers.forEach((matcher) => {
			returnValue = returnValue || matcher.test(needle);
		});
		return returnValue;
	}
}
