/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useEffect, useRef } from "react";
import { Frequency, Synth, start } from "tone";

export function useSound() {
	const synthRef = useRef<Synth | null>(null);
	const bassRef = useRef<Synth | null>(null);
	const isInitializedRef = useRef(false);

	useEffect(() => {
		synthRef.current = new Synth({
			oscillator: { type: "sine" },
			envelope: {
				attack: 0.001,
				decay: 0.1,
				sustain: 0,
				release: 0.1,
			},
		}).toDestination();

		bassRef.current = new Synth({
			envelope: {
				attack: 0.01,
				decay: 0.2,
				sustain: 0,
				release: 0.2,
			},
		}).toDestination();

		synthRef.current.volume.value = -15;
		bassRef.current.volume.value = -10;

		return () => {
			synthRef.current?.dispose();
			bassRef.current?.dispose();
		};
	}, []);

	const initializeAudio = async () => {
		if (!isInitializedRef.current) {
			await start();
			isInitializedRef.current = true;
		}
	};

	const playVisitedSound = (index: number) => {
		const note = Frequency(400 + index * 2, "hz").toNote();
		synthRef.current?.triggerAttackRelease(note, "32n");
	};

	const playPathSound = (index: number) => {
		const note = Frequency(200 + index * 1, "hz").toNote();
		bassRef.current?.triggerAttackRelease(note, "16n");
	};

	const playSuccessChord = async () => {
		bassRef.current?.triggerAttackRelease("C3", "4n");
		await new Promise((resolve) => setTimeout(resolve, 100));
		bassRef.current?.triggerAttackRelease("E3", "4n");
		await new Promise((resolve) => setTimeout(resolve, 100));
		bassRef.current?.triggerAttackRelease("G3", "2n");
	};

	return {
		initializeAudio,
		playVisitedSound,
		playPathSound,
		playSuccessChord,
	};
}
