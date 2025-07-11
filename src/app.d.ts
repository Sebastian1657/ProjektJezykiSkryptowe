// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				_id: string;
				name?: string;
				surname?: string;
				picture?: string;
				birthdate?: string;
				email: string;
				favoriteColor?: string;
				createdAt?: string;
				exp?: number;
			} | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
