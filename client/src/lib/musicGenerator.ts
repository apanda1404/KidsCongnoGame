// Simple music generator for creating cheerful background tracks
export class MusicGenerator {
  private audioContext: AudioContext;
  private gainNode: GainNode;

  constructor() {
    this.audioContext = new AudioContext();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    this.gainNode.gain.value = 0.1; // Low volume for background
  }

  // Generate a simple cheerful melody
  generateCheerfulMelody(): HTMLAudioElement {
    const duration = 30; // 30 seconds loop
    const sampleRate = 44100;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    // Create a simple pentatonic melody (happy sounding)
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00]; // C, D, E, G, A
    const tempo = 120; // BPM
    const noteLength = (60 / tempo) * sampleRate / 4; // Quarter notes

    for (let i = 0; i < data.length; i++) {
      const time = i / sampleRate;
      const noteIndex = Math.floor(time * 2) % notes.length;
      const frequency = notes[noteIndex];
      
      // Create a simple sine wave with envelope
      const envelope = Math.max(0, 1 - (time % 0.5) * 2); // Fade out each note
      data[i] = Math.sin(2 * Math.PI * frequency * time) * envelope * 0.3;
    }

    // Convert buffer to audio element
    return this.bufferToAudio(buffer);
  }

  // Generate upbeat playful music
  generatePlayfulTune(): HTMLAudioElement {
    const duration = 25;
    const sampleRate = 44100;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    // Playful jumping melody
    const notes = [349.23, 392.00, 440.00, 523.25, 587.33]; // F, G, A, C, D
    
    for (let i = 0; i < data.length; i++) {
      const time = i / sampleRate;
      const noteIndex = Math.floor(time * 3) % notes.length;
      const frequency = notes[noteIndex];
      
      // Mix of sine and triangle wave for richer sound
      const sine = Math.sin(2 * Math.PI * frequency * time);
      const triangle = 2 * Math.abs(2 * (time * frequency - Math.floor(time * frequency + 0.5))) - 1;
      
      const envelope = Math.sin(time * 0.5) * 0.5 + 0.5; // Gentle volume variation
      data[i] = (sine * 0.7 + triangle * 0.3) * envelope * 0.25;
    }

    return this.bufferToAudio(buffer);
  }

  // Generate calm learning music
  generateCalmMelody(): HTMLAudioElement {
    const duration = 40;
    const sampleRate = 44100;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    // Calm, soothing progression
    const notes = [220.00, 246.94, 261.63, 293.66, 329.63]; // A, B, C, D, E
    
    for (let i = 0; i < data.length; i++) {
      const time = i / sampleRate;
      const noteIndex = Math.floor(time * 0.8) % notes.length;
      const frequency = notes[noteIndex];
      
      // Soft sine wave with gentle attack
      const envelope = Math.min(1, time * 2) * Math.max(0, 1 - (time % 5) * 0.05);
      data[i] = Math.sin(2 * Math.PI * frequency * time) * envelope * 0.2;
    }

    return this.bufferToAudio(buffer);
  }

  private bufferToAudio(buffer: AudioBuffer): HTMLAudioElement {
    // Create a simple placeholder audio element
    // Note: This is a simplified approach - in a real implementation,
    // you'd encode the buffer to WAV/MP3 format
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.4;
    
    // For now, return the original background music as we can't easily
    // convert AudioBuffer to Audio element without additional libraries
    audio.src = '/sounds/background.mp3';
    return audio;
  }
}