export type SceneSettings = {
  rotationSpeed: number;
  position: number[];
  color: string;
  glowIntensity: number;
  stars: number;
  showHelicopter: boolean;
  heliScale: number;
  heliSmoothness: number;
  showAxis: boolean;
};

export type ScenePreset = {
  id: 'default' | 'aurora' | 'minimal' | 'chaos' | 'random';
  label: string;
  blurb: string;
  /** undefined `settings` means "randomize". */
  settings?: Partial<SceneSettings>;
};

export const SCENE_PRESETS: ReadonlyArray<ScenePreset> = [
  {
    id: 'random',
    label: 'random',
    blurb: 'roll the dice',
    // No `settings` -> Simulation randomizes.
  },
  {
    id: 'default',
    label: 'default',
    blurb: 'cyan, calm',
    settings: {
      rotationSpeed: 0.2,
      position: [0, 0, 0],
      color: '#00ffff',
      glowIntensity: 0.5,
      stars: 1,
      showHelicopter: false,
      heliScale: 1.5,
      heliSmoothness: 0.1,
      showAxis: true,
    },
  },
  {
    id: 'aurora',
    label: 'aurora',
    blurb: 'warm + dreamy',
    settings: {
      rotationSpeed: 0.1,
      position: [0, 0, 0],
      color: '#ff9d6c',
      glowIntensity: 1.6,
      stars: 0.6,
      showHelicopter: false,
      showAxis: false,
    },
  },
  {
    id: 'minimal',
    label: 'minimal',
    blurb: 'almost still',
    settings: {
      rotationSpeed: 0.05,
      position: [0, 0, 0],
      color: '#ffffff',
      glowIntensity: 0.0,
      stars: 0.5,
      showHelicopter: false,
      showAxis: false,
    },
  },
  {
    id: 'chaos',
    label: 'chaos',
    blurb: 'everything on',
    settings: {
      rotationSpeed: 1.4,
      position: [0, 0, 0],
      color: '#ff00aa',
      glowIntensity: 2.4,
      stars: 5,
      showHelicopter: true,
      heliScale: 3.5,
      heliSmoothness: 0.18,
      showAxis: true,
    },
  },
];
