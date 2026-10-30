import type { LimbSet } from './types';

export const limbSets: LimbSet[] = [
  {
    id: 'standard',
    name: 'Standard',
    limbs: [
      { id: 'left-hand', label: 'Left Hand', icon: '🫲' },
      { id: 'right-hand', label: 'Right Hand', icon: '🫱' },
      { id: 'left-foot', label: 'Left Foot', icon: '🦶' },
      { id: 'right-foot', label: 'Right Foot', icon: '🦶' },
    ],
  },
  {
    id: 'kids',
    name: 'Kids',
    limbs: [
      { id: 'hand', label: 'Hand', icon: '✋' },
      { id: 'foot', label: 'Foot', icon: '🦶' },
    ],
  },
];
