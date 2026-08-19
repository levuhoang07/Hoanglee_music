import { Track } from '../types/audio';
import { saveTrackToDB } from '../core/storage/db';

/**
 * Tạo một bản nhạc ngắn Lo-fi Synthwave Ambient mẫu (~15 giây) bằng Web Audio API
 * để người dùng có thể nghe thử ngay lập tức mà không cần chuẩn bị file nhạc trước.
 */
export async function createDemoTrack(): Promise<Track> {
  const sampleRate = 44100;
  const duration = 16; // 16 seconds
  const numChannels = 2;
  const totalFrames = sampleRate * duration;

  // Offline Audio Context to render audio fast in memory
  const offlineCtx = new OfflineAudioContext(numChannels, totalFrames, sampleRate);

  // Chords progression (Chill Lo-fi Cmaj7 - Am7 - Fmaj7 - G7)
  const chordNotes = [
    [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
    [220.00, 261.63, 329.63, 392.00], // Am7   (A3, C4, E4, G4)
    [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
    [196.00, 246.94, 293.66, 349.23], // G7    (G3, B3, D4, F4)
  ];

  const chordDuration = 4; // 4 seconds per chord

  // Create Synth Pads & Melody
  chordNotes.forEach((chord, chordIndex) => {
    const startTime = chordIndex * chordDuration;

    // Pad chords (warm triangle / sine wave with gentle fade in/out)
    chord.forEach((freq, noteIndex) => {
      const osc = offlineCtx.createOscillator();
      const gain = offlineCtx.createGain();

      osc.type = noteIndex % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      // Envelope (Attack - Sustain - Release)
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.8);
      gain.gain.setValueAtTime(0.08, startTime + chordDuration - 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + chordDuration);

      osc.connect(gain);
      gain.connect(offlineCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + chordDuration);
    });

    // Melody plucks (sparkly bells)
    [0, 1, 2, 2.5, 3].forEach((offset, step) => {
      const noteTime = startTime + offset;
      const noteFreq = chord[(step + chordIndex) % chord.length] * 2; // 1 octave higher

      const osc = offlineCtx.createOscillator();
      const gain = offlineCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, noteTime);

      gain.gain.setValueAtTime(0.12, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.7);

      osc.connect(gain);
      gain.connect(offlineCtx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.7);
    });
  });

  // Render the audio
  const renderedBuffer = await offlineCtx.startRendering();

  // Convert AudioBuffer to WAV Blob
  const wavBlob = audioBufferToWavBlob(renderedBuffer);

  const id = `demo_track_${Date.now()}`;
  const demoTrack: Track = {
    id,
    title: 'Aura Chill Vibes (Bản Nhạc Mẫu)',
    artist: 'AuraTunes Synth',
    album: 'Demo Album',
    duration: 16,
    fileSize: wavBlob.size,
    mimeType: 'audio/wav',
    sourceType: 'local',
    blobId: id,
    addedAt: Date.now(),
  };

  await saveTrackToDB(demoTrack, wavBlob);
  return demoTrack;
}

/**
 * Helper: Chuyển đổi AudioBuffer sang WAV Blob
 */
function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const length = buffer.length * blockAlign;
  const arrayBuffer = new ArrayBuffer(44 + length);
  const view = new DataView(arrayBuffer);

  // Write WAV header
  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, length, true);

  // Write PCM audio data
  const channelData: Float32Array[] = [];
  for (let i = 0; i < numChannels; i++) {
    channelData.push(buffer.getChannelData(i));
  }

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      let sample = channelData[channel][i];
      sample = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}
