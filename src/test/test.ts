import { FakeMediaStreamTrack } from '../';

const UuidV4Regex =
	/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('FakeMediaStreamTrack', () => {
	test('constructor with arguments', () => {
		const audioTrack = new FakeMediaStreamTrack({
			kind: 'audio',
			label: 'mic',
		});

		const videoTrack: FakeMediaStreamTrack<{ foo: number }> =
			new FakeMediaStreamTrack({
				kind: 'video',
				id: 'c9c15f1e-9ae3-4770-9d95-2ba6992bddc3',
				enabled: false,
				muted: true,
				appData: { foo: 123 },
			});

		expect(audioTrack.id).toEqual(expect.stringMatching(UuidV4Regex));
		expect(audioTrack.kind).toBe('audio');
		expect(audioTrack.label).toBe('mic');
		expect(audioTrack.enabled).toBe(true);
		expect(audioTrack.muted).toBe(false);
		expect(audioTrack.readyState).toBe('live');
		expect(audioTrack.appData).toEqual({});

		expect(videoTrack.id).toEqual(expect.stringMatching(UuidV4Regex));
		expect(videoTrack.id).toBe('c9c15f1e-9ae3-4770-9d95-2ba6992bddc3');
		expect(videoTrack.kind).toBe('video');
		expect(videoTrack.label).toBe('');
		expect(videoTrack.enabled).toBe(false);
		expect(videoTrack.muted).toBe(true);
		expect(videoTrack.readyState).toBe('live');
		expect(videoTrack.appData).toEqual({ foo: 123 });
	});

	test('track.clone()', () => {
		const track: FakeMediaStreamTrack<{ foo: number; bar: string }> =
			new FakeMediaStreamTrack({
				kind: 'video',
				id: 'c9c15f1e-9ae3-4770-9d95-2ba6992bddc3',
				muted: true,
				appData: { foo: 123, bar: 'baz' },
			});

		const clonedTrack1 = track.clone();

		expect(clonedTrack1.id).not.toBe('c9c15f1e-9ae3-4770-9d95-2ba6992bddc3');
		expect(clonedTrack1.id).toEqual(expect.stringMatching(UuidV4Regex));
		expect(clonedTrack1.kind).toBe('video');
		expect(clonedTrack1.label).toBe('');
		expect(clonedTrack1.enabled).toBe(true);
		expect(clonedTrack1.muted).toBe(true);
		expect(clonedTrack1.readyState).toBe('live');
		expect(clonedTrack1.appData).toEqual({ foo: 123, bar: 'baz' });

		// Assert that cloned appData is a different object.
		clonedTrack1.appData['foo'] = 666;

		expect(clonedTrack1.appData['foo']).toBe(666);
		expect(track.appData['foo']).toBe(123);

		const clonedTrack2 = track.clone<{ lalala: string }>({
			id: '4a552a2c-8568-4d01-906f-6800770846c3',
			appData: { lalala: 'foobar' },
		});

		expect(clonedTrack2.id).toBe('4a552a2c-8568-4d01-906f-6800770846c3');
		expect(clonedTrack2.kind).toBe('video');
		expect(clonedTrack2.label).toBe('');
		expect(clonedTrack2.enabled).toBe(true);
		expect(clonedTrack2.muted).toBe(true);
		expect(clonedTrack2.readyState).toBe('live');
		expect(clonedTrack2.appData).toEqual({ lalala: 'foobar' });
	});

	describe('events', () => {
		let track: FakeMediaStreamTrack;
		let dispatchEventSpy: jest.SpyInstance<boolean, [event: Event]>;

		beforeEach(() => {
			track = new FakeMediaStreamTrack({
				kind: 'audio',
			});

			dispatchEventSpy = jest.spyOn(track, 'dispatchEvent');
		});

		test(`track.enabled setter triggers custom 'enabledchange' event`, () => {
			track.enabled = false;

			expect(track.enabled).toBe(false);
			expect(dispatchEventSpy).toHaveBeenCalledWith(
				expect.objectContaining({ type: 'enabledchange' })
			);

			dispatchEventSpy.mockReset();

			// It's already false so it won't emit the event again.
			track.enabled = false;

			expect(dispatchEventSpy).not.toHaveBeenCalledWith(
				expect.objectContaining({ type: 'enabledchange' })
			);

			dispatchEventSpy.mockReset();

			track.enabled = true;

			expect(track.enabled).toBe(true);
			expect(dispatchEventSpy).toHaveBeenCalledWith(
				expect.objectContaining({ type: 'enabledchange' })
			);
		});

		test(`track.stop() triggers custom 'stopped' event`, () => {
			track.stop();

			expect(track.readyState).toBe('ended');
			expect(dispatchEventSpy).toHaveBeenCalledWith(
				expect.objectContaining({ type: 'stopped' })
			);

			dispatchEventSpy.mockReset();

			// It's already stopped so it won't emit the event again.
			track.stop();

			expect(dispatchEventSpy).not.toHaveBeenCalledWith(
				expect.objectContaining({ type: 'stopped' })
			);
		});

		test(`track.remoteStop() triggers custom 'stopped' event and 'ended' event`, () => {
			track.remoteStop();

			expect(track.readyState).toBe('ended');
			expect(dispatchEventSpy).toHaveBeenCalledWith(
				expect.objectContaining({ type: 'stopped' })
			);
			expect(dispatchEventSpy).toHaveBeenCalledWith(
				expect.objectContaining({ type: 'ended' })
			);

			dispatchEventSpy.mockReset();

			// It's already stopped so it won't emit the events again.
			track.remoteStop();

			expect(dispatchEventSpy).not.toHaveBeenCalledWith(
				expect.objectContaining({ type: 'stopped' })
			);
			expect(dispatchEventSpy).not.toHaveBeenCalledWith(
				expect.objectContaining({ type: 'ended' })
			);
		});

		test(`track.remoteMute() triggers 'mute' event`, () => {
			track.remoteMute();

			expect(track.muted).toBe(true);
			expect(dispatchEventSpy).toHaveBeenCalledWith(
				expect.objectContaining({ type: 'mute' })
			);

			dispatchEventSpy.mockReset();

			// It's already muted so it won't emit the event again.
			track.remoteMute();

			expect(dispatchEventSpy).not.toHaveBeenCalledWith(
				expect.objectContaining({ type: 'mute' })
			);
		});

		test(`track.remoteUnmute() triggers 'unmute' event`, () => {
			track.remoteMute();

			dispatchEventSpy.mockReset();

			track.remoteUnmute();

			expect(track.muted).toBe(false);
			expect(dispatchEventSpy).toHaveBeenCalledWith(
				expect.objectContaining({ type: 'unmute' })
			);

			dispatchEventSpy.mockReset();

			// It's already unmuted so it won't emit the event again.
			track.remoteUnmute();

			expect(dispatchEventSpy).not.toHaveBeenCalledWith(
				expect.objectContaining({ type: 'unmute' })
			);
		});
	});
});
