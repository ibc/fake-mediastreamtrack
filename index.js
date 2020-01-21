const { EventTarget, defineEventAttribute } = require('event-target-shim');
const uuidv4 = require('uuid/v4');

class FakeMediaStreamTrack extends EventTarget
{
	constructor({ kind, id, label, isolated } = {})
	{
		super();

		if (!kind)
			throw new TypeError('missing kind');

		// Id.
		// @readonly
		// @type {string}
		this.id = id || uuidv4();

		// Kind ('audio' or 'video').
		// @readonly
		// @type {string}
		this.kind = kind;

		// Label.
		// @readonly
		// @type {string}
		this.label = label | '';

		// Isolated.
		// @readonly
		// @type {boolean}
		this.isolated = isolated | false;

		// Enabled flag.
		// @type {boolean}
		this.enabled = true;

		// Muted flag.
		// @readonly
		// @type {boolean}
		this.muted = false;

		// Ready state ('live' or 'ended').
		// @readonly
		// @type {string}
		this.readyState = 'live';

		// Custom data.
		// @type {any}
		this.data = null;
	}

	clone({ id } = {})
	{
		const newTrack = new FakeMediaStreamTrack(
			{
				id         : id || uuidv4(),
				kind       : this.kind,
				label      : this.label,
				enabled    : this.enabled,
				muted      : this.muted,
				readyState : this.readyState,
				data       : this.data
			});

		return newTrack;
	}

	stop()
	{
		if (this.readyState === 'ended')
			return;

		this.readyState = 'ended';
	}

	remoteStop()
	{
		if (this.readyState === 'ended')
			return;

		this.readyState = 'ended';

		this.dispatchEvent({ type: 'ended' });
	}

	remoteMute()
	{
		if (this.muted)
			return;

		this.muted = true;

		this.dispatchEvent({ type: 'mute' });
	}

	remoteUnmute()
	{
		if (!this.muted)
			return;

		this.muted = false;

		this.dispatchEvent({ type: 'unmute' });
	}
}

// Define EventTarget properties
defineEventAttribute(FakeMediaStreamTrack.prototype, 'ended');
defineEventAttribute(FakeMediaStreamTrack.prototype, 'mute');
defineEventAttribute(FakeMediaStreamTrack.prototype, 'unmute');
// NOTE: These are not implemented/dispatched.
defineEventAttribute(FakeMediaStreamTrack.prototype, 'isolationchange');
defineEventAttribute(FakeMediaStreamTrack.prototype, 'overconstrained');

exports.FakeMediaStreamTrack = FakeMediaStreamTrack;
