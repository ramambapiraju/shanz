// Web Audio API utility for generating buzzer sounds
let audioContext: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let gainNode: GainNode | null = null;

export const initAudio = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const playBuzzerSound = (frequency: number = 1000) => {
  const context = initAudio();
  
  // Stop any existing sound
  stopBuzzerSound();
  
  // Create oscillator for beep sound
  oscillator = context.createOscillator();
  gainNode = context.createGain();
  
  oscillator.type = 'square'; // Square wave for buzzer-like sound
  oscillator.frequency.value = frequency;
  
  // Set volume
  gainNode.gain.value = 0.3;
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  
  // Start the sound
  oscillator.start();
};

export const stopBuzzerSound = () => {
  if (oscillator) {
    oscillator.stop();
    oscillator.disconnect();
    oscillator = null;
  }
  if (gainNode) {
    gainNode.disconnect();
    gainNode = null;
  }
};

export const playBeepPattern = (frequency: number, duration: number) => {
  playBuzzerSound(frequency);
  setTimeout(() => {
    stopBuzzerSound();
  }, duration);
};
