/*--------------------------------------------------------------------------------------------------
 *                     Copyright (c) 2026 Ayyoub EL Kouri. All rights reserved.
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useEffect, useRef } from "react";
import { Frequency, Synth, start } from "tone";

interface SoundReturns {
	/**
	 * Initialize audio context on user interaction
	 */
	initializeAudio: () => Promise<void>;

	/**
	 * Play sound when algorithm visits a node
	 */
	playVisitedSound: (index: number) => void;

	/**
	 * Play sound when node is part of the final path
	 */
	playPathSound: (index: number) => void;

	/**
	 * Play a success chord when the algorithm finds a solution
	 */
	playSuccessChord: () => Promise<void>;
}

/**
 * @hook useSound
 * Manages audio feedback for pathfinding visualization using Tone.js.
 */
export function useSound(): SoundReturns {
	const synthRef = useRef<Synth | null>(null); // High sounds for visited nodes
	const bassRef = useRef<Synth | null>(null); // Low sounds for path and success
	const isInitializedRef = useRef(false); // Track if audio is ready

	// Setup audio synthesizers once when component loads
	useEffect(() => {
		// Visited node sound - quick high beep
		synthRef.current = new Synth({
			oscillator: { type: "sine" },
			envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
		}).toDestination();

		// Path sound - deeper bass tone
		bassRef.current = new Synth({
			envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 },
		}).toDestination();

		// Adjust volumes
		synthRef.current.volume.value = -15; // Softer
		bassRef.current.volume.value = -10; // Louder

		// Cleanup on unmount
		return () => {
			synthRef.current?.dispose();
			bassRef.current?.dispose();
		};
	}, []);

	// Call this first - browser needs user permission for audio
	const initializeAudio = async () => {
		if (!isInitializedRef.current) {
			await start();
			isInitializedRef.current = true;
		}
	};

	// Play when algorithm visits a node (gets higher with index)
	const playVisitedSound = (index: number) => {
		const note = Frequency(400 + index * 2, "hz").toNote();
		synthRef.current?.triggerAttackRelease(note, "32n");
	};

	// Play when node is part of final path
	const playPathSound = (index: number) => {
		const note = Frequency(200 + index * 1, "hz").toNote();
		bassRef.current?.triggerAttackRelease(note, "16n");
	};

	// Victory chord when algorithm finds solution
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
