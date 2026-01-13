/*--------------------------------------------------------------------------------------------------
 *                       Copyright (c) Ayyoub EL Kouri. All rights reserved
 *     Becoming an expert won't happen overnight, but with a bit of patience, you'll get there
 *------------------------------------------------------------------------------------------------*/

import { useEffect, useRef } from "react";
import { Frequency, Synth, start } from "tone";

interface SoundEffectReturns {
	/**
	 * Initializes the audio context (required before any sound playback).
	 */
	initializeAudio: () => Promise<void>;

	/**
	 * Plays a high-pitched sound for visited nodes.
	 *
	 * @param index The node index, used to adjust the pitch (higher index = higher pitch)
	 */
	playVisitedSound: (index: number) => void;

	/**
	 * Plays a low-pitched sound for path nodes.
	 *
	 * @param index The node index, used to adjust the pitch (higher index = slightly higher pitch)
	 */
	playPathSound: (index: number) => void;

	/**
	 * Plays a victory chord when the algorithm finds a solution.
	 */
	playSuccessChord: () => Promise<void>;
}

/**
 * @hook useSound
 * @brief Provides sound effects for algorithm visualizations.
 * @description This hook creates and manages audio synthesizers for algorithm visualization
 *              sound effects, including visited nodes, path nodes, and success chords.
 *
 * @return SoundHookReturns - Functions to initialize audio and play various sound effects
 *
 * @dependencies
 *  - Tone.js: Audio synthesis library for generating sounds
 *  - React Hooks: Uses useEffect for setup/cleanup and useRef for audio instance management
 *
 * @example
 * ```tsx
 * const { initializeAudio, playVisitedSound, playPathSound, playSuccessChord } = useSound();
 * 
 * // Initialize audio on user interaction
 * await initializeAudio();
 * 
 * // Play sounds during algorithm execution
 * playVisitedSound(5);
 * playPathSound(3);
 * await playSuccessChord();
 * ```
 *
 * @throws
 *  - initializeAudio: May throw if the browser's AudioContext cannot be started (e.g., due to user denying permission)
 */
export function useSoundEffect(): SoundEffectReturns {
	const synthRef = useRef<Synth | null>(null);
	const bassRef = useRef<Synth | null>(null);
	const isInitializedRef = useRef(false);

	/**
	 * Creates and configures audio synthesizers.
	 */
	const setupSynthesizers = () => {
		// High-frequency synth for visited nodes (quick beeps)
		synthRef.current = new Synth({
			oscillator: { type: "sine" },
			envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
		}).toDestination();

		// Low-frequency synth for path and success sounds (bass tones)
		bassRef.current = new Synth({
			envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 },
		}).toDestination();

		// Adjust volume levels for balanced sound
		synthRef.current.volume.value = -15; // Softer high sounds
		bassRef.current.volume.value = -10; // Louder bass sounds
	};

	/**
	 * Cleans up audio resources to prevent memory leaks.
	 */
	const cleanupSynthesizers = () => {
		synthRef.current?.dispose();
		bassRef.current?.dispose();
	};

	// Initialize audio synthesizers on component mount
	useEffect(() => {
		try {
			setupSynthesizers();
			return cleanupSynthesizers;
		} catch (error) {
			console.error("Failed to initialize audio synthesizers:", error);
			// Continue without sound effects if audio initialization fails
		}
	}, []);

	/**
	 * Initializes the audio context (required by browser autoplay policies).
	 */
	const initializeAudio = async (): Promise<void> => {
		if (isInitializedRef.current) {
			return;
		}

		try {
			await start();
			isInitializedRef.current = true;
		} catch (error) {
			console.error("Failed to start audio context:", error);
			throw new Error("Audio initialization failed. Please check browser permissions.");
		}
	};

	/**
	 * Plays a high-pitched sound for visited nodes.
	 */
	const playVisitedSound = (index: number): void => {
		if (!synthRef.current) {
			console.warn("Visited sound synth not initialized");
			return;
		}

		const note = Frequency(400 + index * 2, "hz").toNote();
		synthRef.current.triggerAttackRelease(note, "32n");
	};

	/**
	 * Plays a low-pitched sound for path nodes.
	 */
	const playPathSound = (index: number): void => {
		if (!bassRef.current) {
			console.warn("Path sound synth not initialized");
			return;
		}

		const note = Frequency(200 + index * 1, "hz").toNote();
		bassRef.current.triggerAttackRelease(note, "16n");
	};

	/**
	 * Plays a C major chord (C3, E3, G3) for algorithm success.
	 */
	const playSuccessChord = async (): Promise<void> => {
		if (!bassRef.current) {
			console.warn("Success chord synth not initialized");
			return;
		}

		try {
			bassRef.current.triggerAttackRelease("C3", "4n");
			await new Promise((resolve) => setTimeout(resolve, 100));
			bassRef.current.triggerAttackRelease("E3", "4n");
			await new Promise((resolve) => setTimeout(resolve, 100));
			bassRef.current.triggerAttackRelease("G3", "2n");
		} catch (error) {
			console.error("Failed to play success chord:", error);
		}
	};

	return {
		initializeAudio,
		playVisitedSound,
		playPathSound,
		playSuccessChord,
	};
}