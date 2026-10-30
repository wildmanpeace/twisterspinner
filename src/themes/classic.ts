import type { Theme } from '../types';

const classic: Theme = {
  id: 'classic',
  name: 'Classic',
  spaces: [
    { id: 'red', label: 'Red', color: '#e53935' },
    { id: 'blue', label: 'Blue', color: '#1e88e5' },
    { id: 'yellow', label: 'Yellow', color: '#fdd835' },
    { id: 'green', label: 'Green', color: '#43a047' },
  ],
  look: {
    background: '#f4f4f4',
    foreground: '#1a1a1a',
    accent: '#e53935',
    wheelBorder: '#ffffff',
    limbRing: ['#ffffff', '#ececec'],
    limbText: '#1a1a1a',
    fontFamily: "'Arial Rounded MT Bold', 'Helvetica Rounded', system-ui, sans-serif",
  },
};

export default classic;
