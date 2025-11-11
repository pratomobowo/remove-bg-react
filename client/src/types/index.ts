export interface ImageData {
  original: string | null;
  processed: string | null;
}

export interface BackgroundColor {
  id: string;
  name: string;
  value: string;
}

export const PRESET_COLORS: BackgroundColor[] = [
  { id: 'transparent', name: 'Transparent', value: 'transparent' },
  { id: 'red', name: 'Merah Dokumen', value: '#DB1514' },
  { id: 'blue', name: 'Biru Dokumen', value: '#0000FF' },
  { id: 'custom', name: 'Custom', value: '#ffffff' },
];

export type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
