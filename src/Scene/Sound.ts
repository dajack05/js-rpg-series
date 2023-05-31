import { Engine } from "../Engine";
import { Node } from "./Node";

export class SoundRegistry {
    static sounds: HTMLAudioElement[] = [];
    static currently_paused = false;
    static Register(sound: HTMLAudioElement) {
        if (this.currently_paused === true) {
            sound.pause();
        }
        if (!this.sounds.includes(sound)) {
            this.sounds.push(sound);
        }
    }

    static Pause() {
        this.currently_paused = true;
        for (const sound of this.sounds) {
            sound.pause();
        }
    }

    static Resume() {
        this.currently_paused = false;
        for (const sound of this.sounds) {
            sound.play();
        }
    }
}

export class Sound extends Node {
    private sound = new Audio();
    private playing = false;
    private looping = false;

    constructor(sound_path = "") {
        super();
        this.sound.addEventListener('ended', () => {
            if (!this.looping) {
                this.playing = false;
            }
        });
        if (sound_path.length > 0) {
            this.load(sound_path);
        }
        SoundRegistry.Register(this.sound);
        this.sound.preservesPitch = false;
    }

    override update(engine: Engine): void {
        super.update(engine);

        if (SoundRegistry.currently_paused) {
            if (!this.sound.paused) {
                this.sound.pause();
            }
        } else {
            if (this.sound.paused && this.playing) {
                this.sound.play();
            } else if (!this.sound.paused && !this.playing) {
                this.sound.pause();
            }
        }
    }

    setPlaybackSpeed(speed: number) {
        this.sound.playbackRate = Math.min(Math.max(speed, 0.08), 10);
    }

    setLooping(looping: boolean) {
        this.looping = looping;
    }

    load(sound_path: string) {
        this.sound.src = sound_path;
    }

    play() {
        this.playing = true;
    }

    pause() {
        this.playing = false;
    }

    stop() {
        this.playing = false;
        this.sound.currentTime = 0;
    }
}