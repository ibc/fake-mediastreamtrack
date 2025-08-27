import { FakeEvent } from './FakeEvent';

export type FakeEventListener = (evt: FakeEvent) => void;

export interface FakeAddEventListenerOptions {
	capture?: boolean;
	once?: boolean;
	passive?: boolean;
	signal?: AbortSignal;
}

export interface FakeEventListenerOptions {
	capture?: boolean;
}
