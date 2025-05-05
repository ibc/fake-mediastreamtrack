import { FakeEvent } from './FakeEvent';

type FakeEventListener = (event: FakeEvent) => void;

export interface FakeListenerOptions {
	once?: boolean;
}

interface FakeListenerEntry {
	callback: FakeEventListener;
	once: boolean;
}

export class FakeEventTarget implements EventTarget {
	private listeners: Record<string, FakeListenerEntry[]> = {};

	addEventListener(
		type: string,
		callback: FakeEventListener,
		options: FakeListenerOptions = {}
	): void {
		if (!callback) {
			return;
		}

		this.listeners[type] ??= [];

		this.listeners[type].push({
			callback,
			once: options.once === true,
		});
	}

	removeEventListener(type: string, callback: FakeEventListener): void {
		if (!this.listeners[type]) {
			return;
		}

		this.listeners[type] = this.listeners[type].filter(
			listener => listener.callback !== callback
		);
	}

	dispatchEvent(event: Event): boolean {
		if (!event || typeof event.type !== 'string') {
			throw new Error('invalid event object');
		}

		const entries = this.listeners[event.type];

		if (!entries) {
			return true;
		}

		for (const listener of [...entries]) {
			try {
				listener.callback.call(this, event);
			} catch (error) {
				// Avoid that the error breaks the iteration.
				setTimeout(() => {
					throw error;
				}, 0);
			}

			if (listener.once) {
				this.removeEventListener(event.type, listener.callback);
			}
		}

		return !event.defaultPrevented;
	}
}
