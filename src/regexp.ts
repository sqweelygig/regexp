export interface Flags {
	dotAll: boolean;
	global: boolean;
	ignoreCase: boolean;
	multiline: boolean;
	unicode: boolean;
}

export class RegExp {
	public static makeFlagsArray(flags: string): Flags {
		return {
			dotAll: flags.includes("s"),
			global: flags.includes("g"),
			ignoreCase: flags.includes("i"),
			multiline: flags.includes("m"),
			unicode: flags.includes("u")
		}
	}

	public readonly flags: Flags;

	public constructor(private readonly source: string) {
		const flagString = source.split("/").pop();
		this.flags = RegExp.makeFlagsArray(flagString);
	}
}

