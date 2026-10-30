import type { Theme } from '../types';

const halloween: Theme = {
  id: 'halloween',
  name: 'Halloween',
  spaces: [
    { id: 'pumpkin', label: 'Pumpkin', color: '#ff7518', icon: '🎃' },
    // Outlined so it stays visible against the dark background.
    { id: 'ghost', label: 'Ghost', color: '#0a0a0a', icon: '👻', stroke: '#f2f2f2' },
    { id: 'witch', label: 'Witch', color: '#7b2fbe', icon: '🧙' },
    { id: 'bat', label: 'Bat', color: '#ffd400', icon: '🦇' },
  ],
  look: {
    background: '#1b1026',
    foreground: '#f7efe2',
    accent: '#ff7518',
    wheelBorder: '#ff7518',
    limbRing: ['#2d1a3f', '#3a2252'],
    limbText: '#f7efe2',
    fontFamily: "'Trebuchet MS', system-ui, sans-serif",
  },
};

export default halloween;
