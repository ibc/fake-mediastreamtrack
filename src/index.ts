import { v4 as uuidv4 } from 'uuid';
import { FakeEventTarget } from './fakeEvents/FakeEventTarget';
import {
	FakeAddEventListenerOptions,
	FakeEventListenerOptions,
} from './fakeEvents/FakeEventListener';
import { FakeEvent } from './fakeEvents/FakeEvent';
import { clone } from './utils';

export type AppData = {
	[key: string]: unknown;
};

export type FakeMediaStreamTrackOptions<
	FakeMediaStreamTrackAppData extends AppData = AppData,
> = {
	kind: string;
	id?: string;
	label?: string;
	contentHint?: string;
	enabled?: boolean;
	muted?: boolean;
	readyState?: MediaStreamTrackState;
	capabilities?: MediaTrackCapabilities;
	constraints?: MediaTrackConstraints;
	settings?: MediaTrackSettings;
	data?: FakeMediaStreamTrackAppData;
};

export interface FakeMediaStreamTrackEventMap extends MediaStreamTrackEventMap {
	stopped: FakeEvent;
	enabledchange: FakeEvent;
}

export class FakeMediaStreamTrack<
		FakeMediaStreamTrackAppData extends AppData = AppData,
	>
	extends FakeEventTarget
	implements MediaStreamTrack
{
	readonly #id: string;
	readonly #kind: string;
	readonly #label: string;
	#readyState: MediaStreamTrackState;
	#enabled: boolean;
	#muted: boolean;
	#contentHint: string;
	#capabilities: MediaTrackCapabilities;
	#constraints: MediaTrackConstraints;
	#settings: MediaTrackSettings;
	#data: FakeMediaStreamTrackAppData;
	// Events.
	#onmute: ((this: MediaStreamTrack, ev: FakeEvent) => void) | null = null;
	#onunmute: ((this: MediaStreamTrack, ev: FakeEvent) => void) | null = null;
	#onended: ((this: MediaStreamTrack, ev: FakeEvent) => void) | null = null;
	// Custom events.
	#onenabledchange: ((this: MediaStreamTrack, ev: FakeEvent) => void) | null =
		null;
	#onstopped: ((this: MediaStreamTrack, ev: FakeEvent) => void) | null = null;

	constructor({
		kind,
		id,
		label,
		contentHint,
		enabled,
		muted,
		readyState,
		capabilities,
		constraints,
		settings,
		data,
	}: FakeMediaStreamTrackOptions<FakeMediaStreamTrackAppData>) {
		super();

		this.#id = id ?? uuidv4();
		this.#kind = kind;
		this.#label = label ?? '';
		this.#contentHint = contentHint ?? '';
		this.#enabled = enabled ?? true;
		this.#muted = muted ?? false;
		this.#readyState = readyState ?? 'live';
		this.#capabilities = capabilities ?? {};
		this.#constraints = constraints ?? {};
		this.#settings = settings ?? {};
		this.#data = data ?? ({} as FakeMediaStreamTrackAppData);
	}

	get id(): string {
		return this.#id;
	}

	get kind(): string {
		return this.#kind;
	}

	get label(): string {
		return this.#label;
	}

	get contentHint(): string {
		return this.#contentHint;
	}

	set contentHint(contentHint: string) {
		this.#contentHint = contentHint;
	}

	get enabled(): boolean {
		return this.#enabled;
	}

	/**
	 * Changes `enabled` member value and fires a custom "enabledchange" event.
	 */
	set enabled(enabled: boolean) {
		const changed = this.#enabled !== enabled;

		this.#enabled = enabled;

		if (changed) {
			this.dispatchEvent(new FakeEvent('enabledchange'));
		}
	}

	get muted(): boolean {
		return this.#muted;
	}

	get readyState(): MediaStreamTrackState {
		return this.#readyState;
	}

	/**
	 * Application custom data getter.
	 */
	get data(): FakeMediaStreamTrackAppData {
		return this.#data;
	}

	/**
	 * Application custom data setter.
	 */
	set data(data: FakeMediaStreamTrackAppData) {
		this.#data = data;
	}

	get onmute(): ((this: MediaStreamTrack, ev: FakeEvent) => void) | null {
		return this.#onmute;
	}

	set onmute(
		handler: ((this: MediaStreamTrack, ev: FakeEvent) => void) | null
	) {
		if (this.#onmute) {
			this.removeEventListener('mute', this.#onmute);
		}

		this.#onmute = handler;

		if (handler) {
			this.addEventListener('mute', handler);
		}
	}

	get onunmute(): ((this: MediaStreamTrack, ev: FakeEvent) => void) | null {
		return this.#onunmute;
	}

	set onunmute(
		handler: ((this: MediaStreamTrack, ev: FakeEvent) => void) | null
	) {
		if (this.#onunmute) {
			this.removeEventListener('unmute', this.#onunmute);
		}

		this.#onunmute = handler;

		if (handler) {
			this.addEventListener('unmute', handler);
		}
	}

	get onended(): ((this: MediaStreamTrack, ev: FakeEvent) => void) | null {
		return this.#onended;
	}

	set onended(
		handler: ((this: MediaStreamTrack, ev: FakeEvent) => void) | null
	) {
		if (this.#onended) {
			this.removeEventListener('ended', this.#onended);
		}

		this.#onended = handler;

		if (handler) {
			this.addEventListener('ended', handler);
		}
	}

	get onenabledchange():
		| ((this: MediaStreamTrack, ev: FakeEvent) => void)
		| null {
		return this.#onenabledchange;
	}

	set onenabledchange(
		handler: ((this: MediaStreamTrack, ev: FakeEvent) => void) | null
	) {
		if (this.#onenabledchange) {
			this.removeEventListener('enabledchange', this.#onenabledchange);
		}

		this.#onenabledchange = handler;

		if (handler) {
			this.addEventListener('enabledchange', handler);
		}
	}

	get onstopped(): ((this: MediaStreamTrack, ev: FakeEvent) => void) | null {
		return this.#onstopped;
	}

	set onstopped(
		handler: ((this: MediaStreamTrack, ev: FakeEvent) => void) | null
	) {
		if (this.#onstopped) {
			this.removeEventListener('stopped', this.#onstopped);
		}

		this.#onstopped = handler;

		if (handler) {
			this.addEventListener('stopped', handler);
		}
	}

	override addEventListener<K extends keyof FakeMediaStreamTrackEventMap>(
		type: K,
		listener: (
			this: FakeMediaStreamTrack<AppData>,
			ev: FakeMediaStreamTrackEventMap[K]
		) => void,
		options?: boolean | FakeAddEventListenerOptions
	): void {
		super.addEventListener(type, listener, options);
	}

	override removeEventListener<K extends keyof FakeMediaStreamTrackEventMap>(
		type: K,
		listener: (
			this: FakeMediaStreamTrack<AppData>,
			ev: FakeMediaStreamTrackEventMap[K]
		) => void,
		options?: boolean | FakeEventListenerOptions
	): void {
		super.removeEventListener(type, listener, options);
	}

	/**
	 * Changes `readyState` member to "ended" and fires a custom "stopped" event
	 * (if not already stopped).
	 */
	stop(): void {
		if (this.#readyState === 'ended') {
			return;
		}

		this.#readyState = 'ended';

		this.dispatchEvent(new FakeEvent('stopped'));
	}

	/**
	 * Clones current track into another FakeMediaStreamTrack. `id` and `data`
	 * can be optionally given.
	 */
	clone<
		ClonedFakeMediaStreamTrackAppData extends
			AppData = FakeMediaStreamTrackAppData,
	>({
		id,
		data,
	}: {
		id?: string;
		data?: ClonedFakeMediaStreamTrackAppData;
	} = {}): FakeMediaStreamTrack<ClonedFakeMediaStreamTrackAppData> {
		return new FakeMediaStreamTrack<ClonedFakeMediaStreamTrackAppData>({
			id: id ?? uuidv4(),
			kind: this.#kind,
			label: this.#label,
			contentHint: this.#contentHint,
			enabled: this.#enabled,
			muted: this.#muted,
			readyState: this.#readyState,
			capabilities: clone(this.#capabilities),
			constraints: clone(this.#constraints),
			settings: clone(this.#settings),
			data: data! ?? clone(this.#data),
		});
	}

	getCapabilities(): MediaTrackCapabilities {
		return this.#capabilities;
	}

	getConstraints(): MediaTrackConstraints {
		return this.#constraints;
	}

	async applyConstraints(
		constraints: MediaTrackConstraints = {}
	): Promise<void> {
		this.#constraints = constraints;

		// To make it be "more" async so ESLint doesn't complain.
		return Promise.resolve();
	}

	getSettings(): MediaTrackSettings {
		return this.#settings;
	}

	/**
	 * Simulates a remotely triggered stop. It fires a custom "stopped" event and
	 * the standard "ended" event (if the track was not already stopped).
	 */
	remoteStop(): void {
		if (this.#readyState === 'ended') {
			return;
		}

		this.#readyState = 'ended';

		this.dispatchEvent(new FakeEvent('stopped'));
		this.dispatchEvent(new FakeEvent('ended'));
	}

	/**
	 * Simulates a remotely triggered mute. It fires a "mute" event (if the track
	 * was not already muted).
	 */
	remoteMute(): void {
		if (this.#muted) {
			return;
		}

		this.#muted = true;

		this.dispatchEvent(new FakeEvent('mute'));
	}

	/**
	 * Simulates a remotely triggered unmute. It fires an "unmute" event (if the
	 * track was muted).
	 */
	remoteUnmute(): void {
		if (!this.#muted) {
			return;
		}

		this.#muted = false;

		this.dispatchEvent(new FakeEvent('unmute'));
	}
}
