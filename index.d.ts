export class FakeMediaStreamTrack extends MediaStreamTrack {
	/**
	 * Custom constructor.
	 */
	constructor(
		{
			kind,
			id,
			label
		}:
		{
			kind: 'audio' | 'video';
			id?: string;
			label?: string;
			isolated?: boolean
		}
	);

	/**
	 * Emulates a stop generated remotely. It will fired "ended" event if not
	 * already stopped.
	 */
	remoteStop(): void;

	/**
	 * Emulates a mute generated remotely. It will fired "mute" event if not
	 * already muted.
	 */
	remoteMute(): void;

	/**
	 * Emulates a unmute generated remotely. It will fired "unmute" event if not
	 * already unmuted.
	 */
	remoteUnmute(): void;
}
