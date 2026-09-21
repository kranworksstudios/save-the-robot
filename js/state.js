/**
 * state.js — Gerenciador de Estado e Configurações dos Níveis
 * Robô em Recuperação — Trabalho Escolar
 */

const LEVELS = [
  {
    id: 1,
    name: "Ferro-Velho Abandonado",
    shortName: "NÍVEL 1: FERRO-VELHO",
    targetGears: 10,
    durationSeconds: 30,
    spawnIntervalSeconds: 0.95,
    dropSpeedMin: 140,
    dropSpeedMax: 200,
    hazardChance: 0.15,
    hazardPenalty: 1,
    rareGearChance: 0.0,
    hazardName: "Lata Enferrujada",
    robotEvolution: 1,
    theme: {
      bgTop: "#0f172a",
      bgBottom: "#1e1b18",
      accent: "#92400e",
      fogColor: "rgba(180, 83, 9, 0.05)",
      ambientLight: "#f59e0b"
    }
  },
  {
    id: 2,
    name: "Oficina Mecânica",
    shortName: "NÍVEL 2: OFICINA MECÂNICA",
    targetGears: 15,
    durationSeconds: 35,
    spawnIntervalSeconds: 0.85,
    dropSpeedMin: 180,
    dropSpeedMax: 240,
    hazardChance: 0.20,
    hazardPenalty: 1,
    rareGearChance: 0.0,
    hazardName: "Parafuso Quebrado & Graxa",
    robotEvolution: 2,
    theme: {
      bgTop: "#111827",
      bgBottom: "#1f2937",
      accent: "#475569",
      fogColor: "rgba(71, 85, 105, 0.08)",
      ambientLight: "#38bdf8"
    }
  },
  {
    id: 3,
    name: "Fábrica a Vapor",
    shortName: "NÍVEL 3: FÁBRICA A VAPOR",
    targetGears: 20,
    durationSeconds: 40,
    spawnIntervalSeconds: 0.75,
    dropSpeedMin: 220,
    dropSpeedMax: 280,
    hazardChance: 0.25,
    hazardPenalty: 2,
    rareGearChance: 0.10,
    hazardName: "Jato de Vapor Quente",
    robotEvolution: 3,
    theme: {
      bgTop: "#1a120b",
      bgBottom: "#2d1b0f",
      accent: "#ea580c",
      fogColor: "rgba(234, 88, 12, 0.08)",
      ambientLight: "#f97316"
    }
  },
  {
    id: 4,
    name: "Usina Elétrica",
    shortName: "NÍVEL 4: USINA ELÉTRICA",
    targetGears: 25,
    durationSeconds: 40,
    spawnIntervalSeconds: 0.65,
    dropSpeedMin: 260,
    dropSpeedMax: 320,
    hazardChance: 0.30,
    hazardPenalty: 2,
    rareGearChance: 0.12,
    hazardName: "Arco Voltaico / Raio",
    robotEvolution: 4,
    theme: {
      bgTop: "#091428",
      bgBottom: "#0b2239",
      accent: "#0284c7",
      fogColor: "rgba(14, 165, 233, 0.1)",
      ambientLight: "#38bdf8"
    }
  },
  {
    id: 5,
    name: "Laboratório Hi-Tech",
    shortName: "NÍVEL 5: LABORATÓRIO HI-TECH",
    targetGears: 30,
    durationSeconds: 45,
    spawnIntervalSeconds: 0.55,
    dropSpeedMin: 300,
    dropSpeedMax: 380,
    hazardChance: 0.35,
    hazardPenalty: 3,
    rareGearChance: 0.15,
    hazardName: "Orbe de Plasma",
    robotEvolution: 5,
    theme: {
      bgTop: "#0f0728",
      bgBottom: "#1e1045",
      accent: "#a855f7",
      fogColor: "rgba(168, 85, 247, 0.12)",
      ambientLight: "#c084fc"
    }
  }
];

const ROBOTS_DATA = {
  HOVER: {
    id: 'HOVER',
    name: 'Robô Rosa',
    subName: 'Hoverbot',
    icon: '🌸',
    badge: '🌸 Rosa • Planador',
    desc: 'Armadura rosa com propulsor flutuante e deslize macio.',
    speedMult: 1.05,
    accentColor: '#ec4899',
    colorTheme: 'PINK'
  },
  TRACKS: {
    id: 'TRACKS',
    name: 'Robô Azul',
    subName: 'Tratorzinho',
    icon: '🔷',
    badge: '🔷 Azul • Equilibrado',
    desc: 'Chassi azul tecnológico com esteiras de trator e firmeza máxima.',
    speedMult: 1.0,
    accentColor: '#38bdf8',
    colorTheme: 'BLUE'
  },
  WHEELS: {
    id: 'WHEELS',
    name: 'Robô Verde',
    subName: 'Sparky Veloz',
    icon: '🟢',
    badge: '🟢 Verde • Alta Vel.',
    desc: 'Visual verde esmeralda com rodas esportivas e arrancada rápida (+15%).',
    speedMult: 1.15,
    accentColor: '#10b981',
    colorTheme: 'GREEN'
  },
  ORANGE: {
    id: 'ORANGE',
    name: 'Robô Laranja',
    subName: 'Solar Gyro',
    icon: '🟠',
    badge: '🟠 Laranja • Monoroda',
    desc: 'Chassi laranja solar com monoroda giroscópica e alta estabilidade.',
    speedMult: 1.08,
    accentColor: '#f97316',
    colorTheme: 'ORANGE'
  },
  BLACK: {
    id: 'BLACK',
    name: 'Robô Preto',
    subName: 'Stealth Ônix',
    icon: '⚫',
    badge: '⚫ Preto • Stealth',
    desc: 'Blindagem ônix fosca com fibra de carbono e amortecimento silencioso.',
    speedMult: 1.02,
    accentColor: '#94a3b8',
    colorTheme: 'BLACK'
  },
  PURPLE: {
    id: 'PURPLE',
    name: 'Robô Roxo',
    subName: 'Cósmico Hi-Tech',
    icon: '🟣',
    badge: '🟣 Roxo • Cósmico',
    desc: 'Design violeta hi-tech com orbes gravitacionais de energia cósmica.',
    speedMult: 1.10,
    accentColor: '#a855f7',
    colorTheme: 'PURPLE'
  },
  RED: {
    id: 'RED',
    name: 'Robô Vermelho',
    subName: 'Turbo Rocket',
    icon: '🔴',
    badge: '🔴 Vermelho • Turbo',
    desc: 'Pintura esportiva vermelha com turbinas flamejantes e super arrancada.',
    speedMult: 1.18,
    accentColor: '#ef4444',
    colorTheme: 'RED'
  },
  YELLOW: {
    id: 'YELLOW',
    name: 'Robô Amarelo',
    subName: 'Volt Elétrico',
    icon: '🟡',
    badge: '🟡 Amarelo • Elétrico',
    desc: 'Chassi amarelo reluzente com bobinas de choque e condutores de alta voltagem.',
    speedMult: 1.12,
    accentColor: '#eab308',
    colorTheme: 'YELLOW'
  }
};

const gameState = {
  scene: 'MENU', // 'PLAYER_NAME' | 'MENU' | 'PLAYING' | 'LEVEL_CLEAR' | 'PAUSED' | 'GAME_OVER' | 'VICTORY' | 'RANKING' | 'ROBOT_SELECT'
  previousScene: 'MENU',
  playerName: 'Jogador',
  selectedRobot: 'TRACKS', // 'HOVER' | 'TRACKS' | 'WHEELS' | 'ORANGE' | 'BLACK' | 'PURPLE' | 'RED' | 'YELLOW'
  currentLevelIndex: 0,
  levelGears: 0,
  totalGearsCollected: 0,
  timeRemaining: 30,
  
  isInvulnerable: false,
  invulnerabilityTimer: 0,
  screenShakeTimer: 0,
  levelClearTimer: 0,
  
  isMuted: false,
  
  sessionStats: {
    startTime: 0,
    totalTimeElapsed: 0,
    hazardsHitCount: 0,
    gearsLostCount: 0
  },

  getSelectedRobotData() {
    return ROBOTS_DATA[this.selectedRobot] || ROBOTS_DATA.TRACKS;
  },

  setSelectedRobot(robotId) {
    if (ROBOTS_DATA[robotId]) {
      this.selectedRobot = robotId;
      try {
        localStorage.setItem('robo_selected_robot', robotId);
      } catch (e) {
        console.warn('Erro ao salvar robô no localStorage:', e);
      }
    }
  },

  initSelectedRobot() {
    try {
      const saved = localStorage.getItem('robo_selected_robot');
      if (saved && ROBOTS_DATA[saved]) {
        this.selectedRobot = saved;
      }
    } catch (e) {}
  },

  getCurrentLevel() {
    return LEVELS[this.currentLevelIndex] || LEVELS[0];
  },

  resetForLevel(levelIndex) {
    this.currentLevelIndex = levelIndex;
    const lvl = this.getCurrentLevel();
    this.levelGears = 0;
    this.timeRemaining = lvl.durationSeconds;
    this.isInvulnerable = false;
    this.invulnerabilityTimer = 0;
    this.screenShakeTimer = 0;
  },

  resetFullGame() {
    this.currentLevelIndex = 0;
    this.totalGearsCollected = 0;
    this.sessionStats = {
      startTime: performance.now(),
      totalTimeElapsed: 0,
      hazardsHitCount: 0,
      gearsLostCount: 0
    };
    this.resetForLevel(0);
  }
};
