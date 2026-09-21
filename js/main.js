/**
 * main.js — Ponto de Entrada, Loop de Jogo e Integração de Telas
 * Robô em Recuperação — Trabalho Escolar
 */

let lastFrameTime = performance.now();

// Elementos da Interface (DOM)
const dom = {
  hud: document.getElementById('game-hud'),
  hudLevelTitle: document.getElementById('hud-level-title'),
  hudGearsCount: document.getElementById('hud-gears-count'),
  hudProgressFill: document.getElementById('hud-progress-fill'),
  hudTimer: document.getElementById('hud-timer'),
  btnAudio: document.getElementById('btn-audio-toggle'),
  btnPause: document.getElementById('btn-pause-toggle'),
  mobileTouchControls: null, // removido — controles agora são externos
  externalControls: document.getElementById('external-controls'),

  screenPlayerName: document.getElementById('screen-player-name'),
  screenMenu: document.getElementById('screen-menu'),
  screenLevelClear: document.getElementById('screen-level-clear'),
  screenPause: document.getElementById('screen-pause'),
  screenGameOver: document.getElementById('screen-game-over'),
  screenVictory: document.getElementById('screen-victory'),
  screenRanking: document.getElementById('screen-ranking'),
  screenRobotSelect: document.getElementById('screen-robot-select'),

  btnMenuRobotSelect: document.getElementById('btn-menu-robot-select'),
  btnIntroRobotSelect: document.getElementById('btn-intro-robot-select'),
  menuRobotFrame: document.getElementById('menu-robot-frame'),
  btnConfirmRobotSelect: document.getElementById('btn-confirm-robot-select'),
  btnCloseRobotSelect: document.getElementById('btn-close-robot-select'),
  previewCardTracks: document.getElementById('preview-card-tracks'),
  previewCardHover: document.getElementById('preview-card-hover'),
  previewCardWheels: document.getElementById('preview-card-wheels'),
  previewCardOrange: document.getElementById('preview-card-orange'),
  previewCardBlack: document.getElementById('preview-card-black'),
  previewCardPurple: document.getElementById('preview-card-purple'),
  previewCardRed: document.getElementById('preview-card-red'),
  previewCardYellow: document.getElementById('preview-card-yellow'),

  nameRobotCanvas: document.getElementById('name-robot-canvas'),
  formPlayerName: document.getElementById('form-player-name'),
  inputPlayerName: document.getElementById('input-player-name'),
  btnSaveName: document.getElementById('btn-save-name'),
  btnIntroRanking: document.getElementById('btn-intro-ranking'),

  menuPlayerDisplay: document.getElementById('menu-player-display'),
  btnChangePlayer: document.getElementById('btn-change-player'),
  btnMenuRanking: document.getElementById('btn-menu-ranking'),

  rankingListContainer: document.getElementById('ranking-list-container'),
  btnCloseRanking: document.getElementById('btn-close-ranking'),
  btnClearRanking: document.getElementById('btn-clear-ranking'),
  btnGameOverRanking: document.getElementById('btn-game-over-ranking'),
  btnVictoryRanking: document.getElementById('btn-victory-ranking'),

  menuRobotCanvas: document.getElementById('menu-robot-canvas'),
  levelClearRobotCanvas: document.getElementById('level-clear-robot-canvas'),
  levelClearDesc: document.getElementById('level-clear-desc'),
  victoryRobotCanvas: document.getElementById('victory-robot-canvas'),
  gameOverMsg: document.getElementById('game-over-msg'),

  statTotalGears: document.getElementById('stat-total-gears'),
  statTotalTime: document.getElementById('stat-total-time'),

  btnStart: document.getElementById('btn-start-game'),
  btnNextLevel: document.getElementById('btn-next-level'),
  btnResume: document.getElementById('btn-resume-game'),
  btnRestart: document.getElementById('btn-restart-game'),
  btnRetry: document.getElementById('btn-retry-game'),
  btnPlayAgain: document.getElementById('btn-play-again'),
  btnGameOverMenu: document.getElementById('btn-game-over-menu'),
  btnVictoryMenu: document.getElementById('btn-victory-menu'),
  btnPauseMenu: document.getElementById('btn-pause-menu')
};

let levelClearCountdown = 0;
let isTransitioningLevel = false;
let hasSavedCurrentRun = false;

// Auxiliar para escapar caracteres HTML em textos dinâmicos
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

// Salva a pontuação da partida atual no ranking offline
function saveCurrentRunScore(won) {
  if (hasSavedCurrentRun) return;
  hasSavedCurrentRun = true;

  const totalSecs = Math.floor(gameState.sessionStats.totalTimeElapsed);
  const mins = String(Math.floor(totalSecs / 60)).padStart(2, '0');
  const secs = String(totalSecs % 60).padStart(2, '0');
  const timeFormatted = `${mins}:${secs}`;

  const currentLevel = gameState.getCurrentLevel();
  const lvlName = won ? 'Zerou o Jogo 🏆' : (currentLevel ? currentLevel.shortName : 'Nível 1');

  rankingManager.saveScore({
    name: gameState.playerName,
    robotId: gameState.selectedRobot || 'TRACKS',
    gears: gameState.totalGearsCollected,
    levelIndex: gameState.currentLevelIndex,
    levelName: lvlName,
    won: Boolean(won),
    timeSeconds: totalSecs,
    timeFormatted: timeFormatted
  });
}

// Abre a tela de Ranking preservando a cena anterior para retorno suave
function openRanking(fromScene) {
  gameState.previousScene = fromScene || gameState.scene || 'MENU';
  changeScene('RANKING');
}

// Fecha o Ranking e retorna à tela que o chamou
function closeRanking() {
  const returnTo = (gameState.previousScene && gameState.previousScene !== 'RANKING')
    ? gameState.previousScene
    : (rankingManager.hasPlayerName() ? 'MENU' : 'PLAYER_NAME');
  changeScene(returnTo);
}

// Abre a tela de Seleção de Robôs
function openRobotSelect(fromScene) {
  gameState.previousScene = fromScene || gameState.scene || 'MENU';
  changeScene('ROBOT_SELECT');
}

// Fecha a Seleção de Robôs e retorna à tela anterior
function closeRobotSelect() {
  const returnTo = (gameState.previousScene && gameState.previousScene !== 'ROBOT_SELECT')
    ? gameState.previousScene
    : 'MENU';
  changeScene(returnTo);
}

// Atualiza o destaque visual dos cards de robô
function updateRobotSelectionCards() {
  const current = gameState.selectedRobot || 'TRACKS';
  Object.keys(ROBOTS_DATA).forEach(id => {
    const card = document.getElementById(`card-robot-${id.toLowerCase()}`);
    if (card) {
      const isSelected = (id === current);
      if (isSelected) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
      const btn = card.querySelector ? card.querySelector('.btn-select-robot') : null;
      if (btn) {
        btn.textContent = isSelected ? '✔️ SELECIONADO' : 'ESCOLHER';
      }
    }
  });
}

// Seleciona um robô e atualiza miniaturas
function selectRobot(robotId) {
  if (!ROBOTS_DATA[robotId]) return;
  gameState.setSelectedRobot(robotId);
  updateRobotSelectionCards();
  if (gameRenderer) {
    if (dom.menuRobotCanvas) gameRenderer.renderRobotPreview(dom.menuRobotCanvas, 1, gameState.selectedRobot);
    if (dom.nameRobotCanvas) gameRenderer.renderRobotPreview(dom.nameRobotCanvas, 1, gameState.selectedRobot);
  }
}

// Renderiza as prévias dos robôs nos cards da tela de seleção
function renderRobotSelectPreviews() {
  if (!gameRenderer) return;
  Object.keys(ROBOTS_DATA).forEach(id => {
    const canvas = document.getElementById(`preview-card-${id.toLowerCase()}`);
    if (canvas) {
      gameRenderer.renderRobotPreview(canvas, 1, id);
    }
  });
}

// Renderiza os registros na tabela do ranking
function renderRankingTable() {
  if (!dom.rankingListContainer) return;
  const list = rankingManager.getRanking();

  if (!list || list.length === 0) {
    dom.rankingListContainer.innerHTML = `
      <div class="ranking-empty">
        Nenhuma pontuação registrada ainda.<br>
        Seja o primeiro a jogar e registrar seu nome na feira!
      </div>
    `;
    return;
  }

  const currentPlayer = (gameState.playerName || '').toLowerCase();

  dom.rankingListContainer.innerHTML = list.map((item, index) => {
    const pos = index + 1;
    let posBadge = `${pos}º`;
    let posClass = '';
    if (pos === 1) {
      posBadge = '🥇';
      posClass = 'ranking-pos-1';
    } else if (pos === 2) {
      posBadge = '🥈';
      posClass = 'ranking-pos-2';
    } else if (pos === 3) {
      posBadge = '🥉';
      posClass = 'ranking-pos-3';
    }

    const isCurrent = currentPlayer && item.name.toLowerCase() === currentPlayer;
    const highlightClass = isCurrent ? ' current-player' : '';
    const safeName = escapeHTML(item.name);
    const stageBadge = item.won ? '🏆 ZEROU' : escapeHTML(item.levelName || `Fase ${item.levelIndex + 1}`);

    const robotInfo = ROBOTS_DATA[item.robotId] || ROBOTS_DATA.TRACKS;
    const robotIcon = robotInfo.icon || '🚜';

    return `
      <div class="ranking-row${highlightClass}">
        <div class="ranking-pos ${posClass}">${posBadge}</div>
        <div class="ranking-name" title="${safeName}"><span class="ranking-robot-icon" title="${robotInfo.name}">${robotIcon}</span>${safeName}</div>
        <div class="ranking-level">${stageBadge} • ${item.timeFormatted || '00:00'}</div>
        <div class="ranking-score"><span>⚙️</span> ${item.gears}</div>
      </div>
    `;
  }).join('');
}

// Confirmação e limpeza do ranking
function handleClearRanking() {
  const confirmed = window.confirm('Deseja realmente zerar o placar da feira cultural?');
  if (confirmed) {
    rankingManager.clearRanking();
    renderRankingTable();
  }
}

// Submissão do formulário de nome do jogador
function submitPlayerName() {
  const raw = dom.inputPlayerName ? dom.inputPlayerName.value : '';
  const saved = rankingManager.setPlayerName(raw);
  gameState.playerName = saved;
  if (dom.menuPlayerDisplay) {
    dom.menuPlayerDisplay.textContent = saved;
  }
  changeScene('MENU');
}

// Transição de Cenas
function changeScene(scene) {
  gameState.scene = scene;

  // Oculta todas as telas modais
  if (dom.screenPlayerName) dom.screenPlayerName.classList.add('hidden');
  dom.screenMenu.classList.add('hidden');
  dom.screenLevelClear.classList.add('hidden');
  dom.screenPause.classList.add('hidden');
  dom.screenGameOver.classList.add('hidden');
  dom.screenVictory.classList.add('hidden');
  if (dom.screenRanking) dom.screenRanking.classList.add('hidden');
  if (dom.screenRobotSelect) dom.screenRobotSelect.classList.add('hidden');
  if (dom.externalControls) dom.externalControls.classList.add('hidden');

  if (scene === 'PLAYER_NAME') {
    levelClearCountdown = 0;
    dom.hud.classList.add('hidden');
    if (dom.screenPlayerName) {
      dom.screenPlayerName.classList.remove('hidden');
      if (dom.inputPlayerName) {
        dom.inputPlayerName.value = rankingManager.getPlayerName() || '';
        setTimeout(() => dom.inputPlayerName.focus(), 80);
      }
    }
    if (gameRenderer && dom.nameRobotCanvas) {
      gameRenderer.renderRobotPreview(dom.nameRobotCanvas, 1, gameState.selectedRobot);
    }
  } else if (scene === 'MENU') {
    levelClearCountdown = 0;
    dom.hud.classList.add('hidden');
    dom.screenMenu.classList.remove('hidden');
    if (dom.menuPlayerDisplay) {
      dom.menuPlayerDisplay.textContent = gameState.playerName || 'Jogador';
    }
    if (gameRenderer) {
      gameRenderer.renderRobotPreview(dom.menuRobotCanvas, 1, gameState.selectedRobot);
      gameRenderer.renderLegendPreviews();
    }
  } else if (scene === 'ROBOT_SELECT') {
    levelClearCountdown = 0;
    dom.hud.classList.add('hidden');
    if (dom.screenRobotSelect) {
      dom.screenRobotSelect.classList.remove('hidden');
      renderRobotSelectPreviews();
      updateRobotSelectionCards();
    }
  } else if (scene === 'RANKING') {
    levelClearCountdown = 0;
    dom.hud.classList.add('hidden');
    if (dom.screenRanking) {
      dom.screenRanking.classList.remove('hidden');
      renderRankingTable();
    }
  } else if (scene === 'PLAYING') {
    levelClearCountdown = 0;
    dom.hud.classList.remove('hidden');
    if (dom.externalControls) dom.externalControls.classList.remove('hidden');
  } else if (scene === 'LEVEL_CLEAR') {
    dom.hud.classList.remove('hidden');
    dom.screenLevelClear.classList.remove('hidden');

    const nextLvl = LEVELS[gameState.currentLevelIndex + 1];
    if (nextLvl && dom.levelClearDesc) {
      dom.levelClearDesc.textContent = `O robô recuperou mais energia e avançou para a ${nextLvl.name}!`;
    }

    const nextEvolution = Math.min(5, gameState.currentLevelIndex + 2);
    if (gameRenderer && dom.levelClearRobotCanvas) {
      gameRenderer.renderRobotPreview(dom.levelClearRobotCanvas, nextEvolution, gameState.selectedRobot);
    }

    // Inicia contagem para auto-avanço caso o jogador não clique
    levelClearCountdown = 3.0;
    if (dom.btnNextLevel) {
      dom.btnNextLevel.textContent = "AVANÇAR PARA O PRÓXIMO NÍVEL (3s)";
    }
  } else if (scene === 'PAUSED') {
    dom.screenPause.classList.remove('hidden');
    if (gameRenderer) {
      gameRenderer.renderLegendPreviews();
    }
  } else if (scene === 'GAME_OVER') {
    levelClearCountdown = 0;
    dom.hud.classList.add('hidden');
    dom.screenGameOver.classList.remove('hidden');
    const lvl = gameState.getCurrentLevel();
    if (dom.gameOverMsg) {
      dom.gameOverMsg.textContent = `Você coletou ${gameState.levelGears} de ${lvl.targetGears} engrenagens no ${lvl.name}.`;
    }
    saveCurrentRunScore(false);
    audioManager.playGameOver();
  } else if (scene === 'VICTORY') {
    levelClearCountdown = 0;
    dom.hud.classList.add('hidden');
    dom.screenVictory.classList.remove('hidden');

    // Renderiza robô glorioso no canvas de vitória
    if (gameRenderer && dom.victoryRobotCanvas) {
      gameRenderer.renderRobotPreview(dom.victoryRobotCanvas, 5, gameState.selectedRobot);
    }

    // Estatísticas da partida
    const totalSecs = Math.floor(gameState.sessionStats.totalTimeElapsed);
    const mins = String(Math.floor(totalSecs / 60)).padStart(2, '0');
    const secs = String(totalSecs % 60).padStart(2, '0');

    if (dom.statTotalGears) dom.statTotalGears.textContent = gameState.totalGearsCollected;
    if (dom.statTotalTime) dom.statTotalTime.textContent = `${mins}:${secs}`;

    saveCurrentRunScore(true);
    audioManager.playVictory();
  }
}

// Inicia um Nível Específico
function startLevel(levelIndex) {
  levelClearCountdown = 0;
  gameState.resetForLevel(levelIndex);
  entityManager.reset();
  updateHUD();
  changeScene('PLAYING');
}

// Atualização da Barra de HUD
function updateHUD() {
  const lvl = gameState.getCurrentLevel();
  if (dom.hudLevelTitle) dom.hudLevelTitle.textContent = lvl.shortName;
  if (dom.hudGearsCount) dom.hudGearsCount.textContent = `${gameState.levelGears} / ${lvl.targetGears}`;

  const pct = Math.min(100, Math.floor((gameState.levelGears / lvl.targetGears) * 100));
  if (dom.hudProgressFill) dom.hudProgressFill.style.width = `${pct}%`;

  const secs = Math.max(0, Math.ceil(gameState.timeRemaining));
  const minsStr = String(Math.floor(secs / 60)).padStart(2, '0');
  const secsStr = String(secs % 60).padStart(2, '0');
  if (dom.hudTimer) {
    dom.hudTimer.textContent = `${minsStr}:${secsStr}`;
    if (secs <= 5) {
      dom.hudTimer.classList.add('timer-urgent');
    } else {
      dom.hudTimer.classList.remove('timer-urgent');
    }
  }
}

// Avança para o Próximo Nível ou Vitória com proteção contra duplo clique
function proceedToNextLevel() {
  if (isTransitioningLevel) return;
  isTransitioningLevel = true;
  levelClearCountdown = 0;

  if (dom.btnNextLevel) {
    dom.btnNextLevel.textContent = "AVANÇAR PARA O PRÓXIMO NÍVEL";
  }

  if (gameState.currentLevelIndex >= LEVELS.length - 1) {
    changeScene('VICTORY');
  } else {
    startLevel(gameState.currentLevelIndex + 1);
  }

  setTimeout(() => {
    isTransitioningLevel = false;
  }, 250);
}

// Alterna Pausa
function togglePause() {
  if (gameState.scene === 'PLAYING') {
    changeScene('PAUSED');
  } else if (gameState.scene === 'PAUSED') {
    changeScene('PLAYING');
  }
}

// Retorna à tela inicial (Menu Principal)
function returnToMenu() {
  hasSavedCurrentRun = false;
  gameState.resetFullGame();
  changeScene('MENU');
}

// Inicia uma nova partida completa
function startNewGameRun() {
  hasSavedCurrentRun = false;
  audioManager.init();
  gameState.resetFullGame();
  startLevel(0);
}

// Loop Principal de Jogo com Proteção Total contra Falhas
function gameLoop(timestamp) {
  try {
    const dt = Math.min((timestamp - lastFrameTime) / 1000, 0.1);
    lastFrameTime = timestamp;

    // Atualiza timers do jogo
    if (gameState.scene === 'PLAYING') {
      gameState.sessionStats.totalTimeElapsed += dt;
      gameState.timeRemaining -= dt;

      if (gameState.invulnerabilityTimer > 0) {
        gameState.invulnerabilityTimer -= dt;
        if (gameState.invulnerabilityTimer <= 0) {
          gameState.isInvulnerable = false;
        }
      }

      if (gameState.screenShakeTimer > 0) {
        gameState.screenShakeTimer -= dt;
      }

      // Condição de Vitória do Nível
      const lvl = gameState.getCurrentLevel();
      if (gameState.levelGears >= lvl.targetGears) {
        if (gameState.currentLevelIndex >= LEVELS.length - 1) {
          // Vitória Final no Nível 5!
          changeScene('VICTORY');
        } else {
          audioManager.playLevelClear();
          changeScene('LEVEL_CLEAR');
        }
      } else if (gameState.timeRemaining <= 0) {
        // Tempo Esgotado -> Derrota
        changeScene('GAME_OVER');
      }

      updateHUD();
    } else if (gameState.scene === 'LEVEL_CLEAR') {
      // Contador suave para auto-avanço
      if (levelClearCountdown > 0) {
        levelClearCountdown -= dt;
        const secsLeft = Math.max(1, Math.ceil(levelClearCountdown));
        if (dom.btnNextLevel) {
          dom.btnNextLevel.textContent = `AVANÇAR PARA O PRÓXIMO NÍVEL (${secsLeft}s)`;
        }
        if (levelClearCountdown <= 0) {
          proceedToNextLevel();
        }
      }
    } else if (gameState.scene === 'VICTORY') {
      // Chuva contínua de confetes
      if (Math.random() < 0.3) {
        entityManager.createConfetti();
      }
    }

    // Atualiza física e entidades
    if (gameState.scene !== 'PAUSED') {
      entityManager.update(dt, inputManager);
    }

    // Renderiza quadro no Canvas
    if (gameRenderer) {
      gameRenderer.render(dt);
    }
  } catch (err) {
    console.error("Erro no gameLoop capturado com segurança:", err);
  } finally {
    requestAnimationFrame(gameLoop);
  }
}

// Inicialização do Jogo
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  gameRenderer = new GameRenderer(canvas);

  function toggleAudioMute() {
    const isMuted = audioManager.toggleMute();
    dom.btnAudio.textContent = isMuted ? '🔇' : '🔊';
  }

  inputManager.init(canvas, togglePause, toggleAudioMute);
  gameRenderer.renderRobotPreview(dom.menuRobotCanvas, 1);
  gameRenderer.renderLegendPreviews();

  // Configura Eventos de Identificação do Jogador e Ranking
  if (dom.formPlayerName) {
    dom.formPlayerName.addEventListener('submit', (e) => {
      e.preventDefault();
      submitPlayerName();
    });
  }

  if (dom.btnSaveName) {
    dom.btnSaveName.addEventListener('click', (e) => {
      e.preventDefault();
      submitPlayerName();
    });
  }

  if (dom.btnIntroRanking) {
    dom.btnIntroRanking.addEventListener('click', () => openRanking('PLAYER_NAME'));
  }

  if (dom.btnChangePlayer) {
    dom.btnChangePlayer.addEventListener('click', () => changeScene('PLAYER_NAME'));
  }

  if (dom.btnMenuRanking) {
    dom.btnMenuRanking.addEventListener('click', () => openRanking('MENU'));
  }

  if (dom.btnCloseRanking) {
    dom.btnCloseRanking.addEventListener('click', closeRanking);
  }

  if (dom.btnClearRanking) {
    dom.btnClearRanking.addEventListener('click', handleClearRanking);
  }

  if (dom.btnGameOverRanking) {
    dom.btnGameOverRanking.addEventListener('click', () => openRanking('GAME_OVER'));
  }

  if (dom.btnVictoryRanking) {
    dom.btnVictoryRanking.addEventListener('click', () => openRanking('VICTORY'));
  }

  // Configura Eventos de Botões do Jogo
  dom.btnStart.addEventListener('click', () => {
    startNewGameRun();
  });

  dom.btnNextLevel.addEventListener('click', () => {
    proceedToNextLevel();
  });

  dom.btnResume.addEventListener('click', () => {
    togglePause();
  });

  dom.btnRestart.addEventListener('click', () => {
    startNewGameRun();
  });

  dom.btnRetry.addEventListener('click', () => {
    startNewGameRun();
  });

  dom.btnPlayAgain.addEventListener('click', () => {
    startNewGameRun();
  });

  if (dom.btnGameOverMenu) {
    dom.btnGameOverMenu.addEventListener('click', returnToMenu);
  }

  if (dom.btnVictoryMenu) {
    dom.btnVictoryMenu.addEventListener('click', returnToMenu);
  }

  if (dom.btnPauseMenu) {
    dom.btnPauseMenu.addEventListener('click', returnToMenu);
  }

  dom.btnPause.addEventListener('click', () => {
    togglePause();
  });

  dom.btnAudio.addEventListener('click', () => {
    toggleAudioMute();
  });

  // Inicializa o robô salvo
  gameState.initSelectedRobot();

  // Configura Eventos de Seleção de Robôs
  document.querySelectorAll('.btn-select-robot').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const rId = btn.getAttribute('data-select');
      selectRobot(rId);
    });
  });

  document.querySelectorAll('.robot-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const rId = card.getAttribute('data-robot');
      selectRobot(rId);
    });
  });

  if (dom.btnMenuRobotSelect) {
    dom.btnMenuRobotSelect.addEventListener('click', () => openRobotSelect('MENU'));
  }

  if (dom.menuRobotFrame) {
    dom.menuRobotFrame.addEventListener('click', () => openRobotSelect('MENU'));
  }

  if (dom.btnIntroRobotSelect) {
    dom.btnIntroRobotSelect.addEventListener('click', () => openRobotSelect('PLAYER_NAME'));
  }

  if (dom.btnConfirmRobotSelect) {
    dom.btnConfirmRobotSelect.addEventListener('click', closeRobotSelect);
  }

  if (dom.btnCloseRobotSelect) {
    dom.btnCloseRobotSelect.addEventListener('click', closeRobotSelect);
  }

  // Atalhos de teclado no menu e telas
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      if (gameState.scene === 'ROBOT_SELECT') {
        closeRobotSelect();
      } else if (gameState.scene === 'RANKING') {
        closeRanking();
      }
    }
    if (e.code === 'Space' || e.code === 'Enter') {
      if (gameState.scene === 'PLAYER_NAME') {
        if (e.code === 'Enter') {
          submitPlayerName();
        }
      } else if (gameState.scene === 'ROBOT_SELECT') {
        closeRobotSelect();
      } else if (gameState.scene === 'RANKING') {
        closeRanking();
      } else if (gameState.scene === 'MENU') {
        startNewGameRun();
      } else if (gameState.scene === 'LEVEL_CLEAR') {
        proceedToNextLevel();
      } else if (gameState.scene === 'GAME_OVER' || gameState.scene === 'VICTORY') {
        startNewGameRun();
      }
    }
  });

  // Determina tela inicial: se já tem nome salvo vai para o MENU, senão para PLAYER_NAME
  if (rankingManager.hasPlayerName()) {
    gameState.playerName = rankingManager.getPlayerName();
    changeScene('MENU');
  } else {
    changeScene('PLAYER_NAME');
  }

  // Inicia o Loop de Renderização
  requestAnimationFrame(gameLoop);
});
