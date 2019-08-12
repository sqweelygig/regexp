import { MatchGroup } from "./regexp";

export class MatchRange implements MatchGroup {
	constructor(private readonly start: string, private readonly end: string) {}

	public test(needle: string): boolean {
		return (
			this.start.charCodeAt(0) <= needle.charCodeAt(0) &&
			needle.charCodeAt(0) <= this.end.charCodeAt(0)
		);
	}
}
