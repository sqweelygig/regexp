import { MatchGroup } from "./regexp";

export class MatchCharacter implements MatchGroup {
	public constructor(private readonly pattern: string) {}

	public test(needle: string): boolean {
		return this.pattern === needle;
	}
}
