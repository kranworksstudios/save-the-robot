/**
 * renderer.js — Renderização Gráfica dos 5 Cenários, Robô Evolutivo e Itens
 * Robô em Recuperação — Trabalho Escolar (Canvas 2D Procedural)
 */

// Polyfill para ctx.roundRect garantindo 100% de compatibilidade em qualquer navegador
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
    if (!radii) radii = 0;
    let r = typeof radii === 'number' ? radii : (Array.isArray(radii) ? radii[0] : 0);
    r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
}

class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.animTime = 0;
  }

  render(dt) {
    this.animTime += dt;
    const ctx = this.ctx;

    ctx.save();

    // Aplica Screen Shake se ativo
    if (gameState.screenShakeTimer > 0) {
      const shakeMag = (gameState.screenShakeTimer / 0.18) * 6;
      const ox = (Math.random() - 0.5) * shakeMag;
      const oy = (Math.random() - 0.5) * shakeMag;
      ctx.translate(ox, oy);
    }

    // 1. Desenha Cenário
    const level = gameState.getCurrentLevel();
    this.drawBackground(level);

    // 2. Desenha Itens em Queda
    this.drawItems();

    // 3. Desenha o Robô
    this.drawRobot(entityManager.player, level.robotEvolution);

    // 4. Desenha Partículas
    this.drawParticles();

    ctx.restore();
  }

  // ==========================================
  // CENÁRIOS TEMÁTICOS (1 A 5)
  // ==========================================
  drawBackground(level) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Gradiente de fundo principal
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, level.theme.bgTop);
    grad.addColorStop(1, level.theme.bgBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (level.id === 1) {
      // NÍVEL 1: Ferro-Velho Abandonado
      this.drawScrapYard(w, h);
    } else if (level.id === 2) {
      // NÍVEL 2: Oficina Mecânica
      this.drawWorkshop(w, h);
    } else if (level.id === 3) {
      // NÍVEL 3: Fábrica a Vapor
      this.drawSteamFactory(w, h);
    } else if (level.id === 4) {
      // NÍVEL 4: Usina Elétrica
      this.drawPowerPlant(w, h);
    } else if (level.id === 5) {
      // NÍVEL 5: Laboratório Hi-Tech
      this.drawHiTechLab(w, h);
    }

    // Chão Universal com linha de destaque
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(0, h - 22, w, 22);
    ctx.strokeStyle = level.theme.ambientLight;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, h - 22);
    ctx.lineTo(w, h - 22);
    ctx.stroke();
  }

  drawScrapYard(w, h) {
    const ctx = this.ctx;
    // Silhuetas de montanhas de sucata ao fundo
    ctx.fillStyle = "#171412";
    ctx.beginPath();
    ctx.moveTo(0, h - 22);
    ctx.lineTo(120, h - 140);
    ctx.lineTo(260, h - 70);
    ctx.lineTo(440, h - 170);
    ctx.lineTo(600, h - 90);
    ctx.lineTo(760, h - 150);
    ctx.lineTo(960, h - 80);
    ctx.lineTo(960, h - 22);
    ctx.closePath();
    ctx.fill();

    // Silhueta de primeiro plano mais escura
    ctx.fillStyle = "#0c0a09";
    ctx.beginPath();
    ctx.moveTo(0, h - 22);
    ctx.lineTo(180, h - 90);
    ctx.lineTo(380, h - 40);
    ctx.lineTo(540, h - 110);
    ctx.lineTo(720, h - 60);
    ctx.lineTo(900, h - 100);
    ctx.lineTo(960, h - 22);
    ctx.closePath();
    ctx.fill();
  }

  drawWorkshop(w, h) {
    const ctx = this.ctx;
    ctx.strokeStyle = "rgba(100, 116, 139, 0.25)";
    ctx.lineWidth = 12;

    // Vigas industriais metálicas
    for (let x = 120; x < w; x += 220) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h - 22);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(0, 80);
    ctx.lineTo(w, 80);
    ctx.moveTo(0, 160);
    ctx.lineTo(w, 160);
    ctx.stroke();

    // Prateleira de ferramentas ao fundo
    ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
    ctx.fillRect(200, 200, 560, 100);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.strokeRect(200, 200, 560, 100);
  }

  drawSteamFactory(w, h) {
    const ctx = this.ctx;
    // Canos horizontais e verticais de cobre
    ctx.fillStyle = "#451a03";
    ctx.fillRect(80, 0, 36, h - 22);
    ctx.fillRect(w - 116, 0, 36, h - 22);
    ctx.fillRect(0, 120, w, 28);

    // Conexões douradas
    ctx.fillStyle = "#b45309";
    ctx.fillRect(72, 114, 52, 40);
    ctx.fillRect(w - 124, 114, 52, 40);

    // Efeito de vapor pulsante
    const steamAlpha = 0.05 + Math.sin(this.animTime * 3) * 0.03;
    ctx.fillStyle = `rgba(255, 237, 213, ${steamAlpha})`;
    ctx.beginPath();
    ctx.arc(98, 220, 70, 0, Math.PI * 2);
    ctx.arc(w - 98, 280, 80, 0, Math.PI * 2);
    ctx.fill();
  }

  drawPowerPlant(w, h) {
    const ctx = this.ctx;
    // Torres elétricas nas laterais
    ctx.fillStyle = "#0c4a6e";
    ctx.fillRect(30, 140, 40, h - 162);
    ctx.fillRect(w - 70, 140, 40, h - 162);

    // Esferas condutoras
    ctx.fillStyle = "#0284c7";
    ctx.beginPath();
    ctx.arc(50, 140, 24, 0, Math.PI * 2);
    ctx.arc(w - 50, 140, 24, 0, Math.PI * 2);
    ctx.fill();

    // Arcos de eletricidade sutil
    if (Math.sin(this.animTime * 12) > 0.4) {
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 140);
      ctx.lineTo(90 + Math.random() * 20, 130 + Math.random() * 20);
      ctx.lineTo(130, 140);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(w - 50, 140);
      ctx.lineTo(w - 90 - Math.random() * 20, 130 + Math.random() * 20);
      ctx.lineTo(w - 130, 140);
      ctx.stroke();
    }
  }

  drawHiTechLab(w, h) {
    const ctx = this.ctx;
    // Grade futurista no fundo
    ctx.strokeStyle = "rgba(168, 85, 247, 0.12)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h - 22);
      ctx.stroke();
    }
    for (let y = 0; y < h - 22; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Painéis holográficos
    ctx.fillStyle = "rgba(147, 51, 234, 0.08)";
    ctx.fillRect(160, 60, 240, 120);
    ctx.fillRect(560, 60, 240, 120);
    ctx.strokeStyle = "rgba(192, 132, 252, 0.3)";
    ctx.strokeRect(160, 60, 240, 120);
    ctx.strokeRect(560, 60, 240, 120);
  }

  renderRobotPreview(targetCanvas, stage, robotType) {
    if (!targetCanvas) return;
    const previewCtx = targetCanvas.getContext('2d');
    previewCtx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

    const type = robotType || gameState.selectedRobot || 'TRACKS';

    const fakePlayer = {
      x: (targetCanvas.width - 84) / 2,
      y: (targetCanvas.height - 96) / 2,
      jumpOffset: 0,
      hoverBob: 0,
      tilt: 0,
      treadOffset: 0,
      wheelRot: 0,
      eyeLookX: 0,
      eyeLookY: 0,
      width: 84,
      height: 96,
      robotType: type
    };

    const savedCtx = this.ctx;
    this.ctx = previewCtx;
    this.drawRobot(fakePlayer, stage, type);
    this.ctx = savedCtx;
  }

  // ==========================================
  // PRÉVIA DOS ITENS NA LEGENDA (MENU E PAUSA)
  // ==========================================
  renderLegendPreviews() {
    const renderOne = (canvasId, drawFn) => {
      const el = document.getElementById(canvasId);
      if (!el) return;
      const previewCtx = el.getContext('2d');
      previewCtx.clearRect(0, 0, el.width, el.height);
      previewCtx.save();
      previewCtx.translate(el.width / 2, el.height / 2);
      drawFn(previewCtx);
      previewCtx.restore();
    };

    const drawCommon = (ctx) => {
      this.drawGear(ctx, 10, '#f59e0b', '#fbbf24', '#78350f', false);
    };

    const drawRare = (ctx) => {
      this.drawGear(ctx, 11, '#0284c7', '#38bdf8', '#0c4a6e', true);
    };

    const drawScrap = (ctx) => {
      this.drawHazardItem(ctx, { size: 9, hazardType: 'Sucata' });
    };

    const drawBolt = (ctx) => {
      this.drawHazardItem(ctx, { size: 9, hazardType: 'Raio' });
    };

    // Ícones da Legenda no Menu Principal
    renderOne('legend-gear-common', drawCommon);
    renderOne('legend-gear-rare', drawRare);
    renderOne('legend-hazard-scrap', drawScrap);
    renderOne('legend-hazard-bolt', drawBolt);

    // Ícones da Legenda na Tela de Pausa
    renderOne('pause-gear-common', drawCommon);
    renderOne('pause-gear-rare', drawRare);
    renderOne('pause-hazard-scrap', drawScrap);
    renderOne('pause-hazard-bolt', drawBolt);
  }

  // ==========================================
  // O ROBÔ EVOLUTIVO (ESTÁGIOS 1 A 5 — 3 MODELOS EXCLUSIVOS)
  // ==========================================
  drawRobot(player, stage, robotType) {
    const ctx = this.ctx;
    const type = robotType || player.robotType || gameState.selectedRobot || 'TRACKS';
    const x = player.x;
    const y = player.y + (player.jumpOffset || 0) + (player.hoverBob || 0);
    const w = player.width || 84;
    const h = player.height || 96;

    ctx.save();
    
    // Ponto de ancoragem na base para inclinação (tilt) suave
    ctx.translate(x + w / 2, y + h);
    ctx.rotate(player.tilt || 0);
    ctx.translate(-w / 2, -h);

    // Efeito de Invulnerabilidade / Dano (Piscada Vermelha)
    if (gameState.isInvulnerable) {
      if (Math.floor(this.animTime * 20) % 2 === 0) {
        ctx.globalAlpha = 0.55;
      }
    }

    // Paletas e detalhes por estágio de evolução (Rosa, Azul ou Verde)
    let isSad = (stage === 1);
    let isSmiling = (stage === 3 || stage === 4);
    let isSuperHappy = (stage === 5);
    let hasGlint = (stage === 5);

    let hullGradColor1 = "#6b7280";
    let hullGradColor2 = "#4b5563";
    let hullBorder = "#374151";
    let eyeColor = "#38bdf8";
    let eyeGlow = null;
    let trackRubber = "#1c1917";
    let trackWheel = "#44403c";
    let auraColor = "#38bdf8";

    if (type === 'HOVER') {
      // ==========================================
      // 🌸 ROBÔ ROSA (HOVERBOT)
      // ==========================================
      auraColor = "#ec4899";
      trackRubber = "#2d1222";
      trackWheel = "#ec4899";

      if (stage === 1) {
        // Estágio 1: Rosa desgastado, ferrugem avermelhada
        hullGradColor1 = "#7c3a4d";
        hullGradColor2 = "#4a212e";
        hullBorder = "#3b1320";
        eyeColor = "#f472b6";
        eyeGlow = "rgba(244, 114, 182, 0.35)";
      } else if (stage === 2) {
        // Estágio 2: Rosa metálico limpo
        hullGradColor1 = "#f472b6";
        hullGradColor2 = "#db2777";
        hullBorder = "#9d174d";
        eyeColor = "#fecdd3";
        eyeGlow = "rgba(244, 63, 94, 0.5)";
      } else if (stage === 3) {
        // Estágio 3: Rosa coral aquecido
        hullGradColor1 = "#fb7185";
        hullGradColor2 = "#e11d48";
        hullBorder = "#881337";
        eyeColor = "#ffe4e6";
        eyeGlow = "rgba(251, 113, 133, 0.75)";
      } else if (stage === 4) {
        // Estágio 4: Magenta cibernético e neon brilhante
        hullGradColor1 = "#f472b6";
        hullGradColor2 = "#c026d3";
        hullBorder = "#701a75";
        eyeColor = "#fbcfe8";
        eyeGlow = "rgba(244, 114, 182, 0.95)";
      } else if (stage === 5) {
        // Estágio 5: Branco estelar com reflexos pérola e magenta
        hullGradColor1 = "#ffffff";
        hullGradColor2 = "#fbcfe8";
        hullBorder = "#db2777";
        eyeColor = "#ec4899";
        eyeGlow = "rgba(236, 72, 153, 1)";
        trackWheel = "#fbbf24";
      }

    } else if (type === 'WHEELS') {
      // ==========================================
      // 🟢 ROBÔ VERDE (SPARKY)
      // ==========================================
      auraColor = "#10b981";
      trackRubber = "#14291c";
      trackWheel = "#10b981";

      if (stage === 1) {
        // Estágio 1: Verde oliva enferrujado
        hullGradColor1 = "#4d5b41";
        hullGradColor2 = "#2e3b25";
        hullBorder = "#1f2918";
        eyeColor = "#4ade80";
        eyeGlow = "rgba(74, 222, 128, 0.3)";
      } else if (stage === 2) {
        // Estágio 2: Verde esmeralda limpo
        hullGradColor1 = "#34d399";
        hullGradColor2 = "#059669";
        hullBorder = "#047857";
        eyeColor = "#a7f3d0";
        eyeGlow = "rgba(52, 211, 153, 0.5)";
      } else if (stage === 3) {
        // Estágio 3: Verde jade vibrante
        hullGradColor1 = "#10b981";
        hullGradColor2 = "#047857";
        hullBorder = "#064e3b";
        eyeColor = "#d1fae5";
        eyeGlow = "rgba(16, 185, 129, 0.75)";
      } else if (stage === 4) {
        // Estágio 4: Verde limão e esmeralda neon elétrico
        hullGradColor1 = "#22c55e";
        hullGradColor2 = "#15803d";
        hullBorder = "#14532d";
        eyeColor = "#86efac";
        eyeGlow = "rgba(34, 197, 94, 0.95)";
      } else if (stage === 5) {
        // Estágio 5: Branco estelar com reflexos verde menta e ouro
        hullGradColor1 = "#ffffff";
        hullGradColor2 = "#bbf7d0";
        hullBorder = "#10b981";
        eyeColor = "#059669";
        eyeGlow = "rgba(16, 185, 129, 1)";
        trackWheel = "#fbbf24";
      }

    } else if (type === 'ORANGE') {
      // ==========================================
      // 🟠 ROBÔ LARANJA (SOLAR GYRO)
      // ==========================================
      auraColor = "#f97316";
      trackRubber = "#291508";
      trackWheel = "#ea580c";

      if (stage === 1) {
        hullGradColor1 = "#7c2d12";
        hullGradColor2 = "#431407";
        hullBorder = "#270a04";
        eyeColor = "#fb923c";
        eyeGlow = "rgba(251, 146, 60, 0.35)";
      } else if (stage === 2) {
        hullGradColor1 = "#f97316";
        hullGradColor2 = "#c2410c";
        hullBorder = "#7c2d12";
        eyeColor = "#fed7aa";
        eyeGlow = "rgba(249, 115, 22, 0.55)";
      } else if (stage === 3) {
        hullGradColor1 = "#fb923c";
        hullGradColor2 = "#ea580c";
        hullBorder = "#9a3412";
        eyeColor = "#ffedd5";
        eyeGlow = "rgba(251, 146, 60, 0.75)";
      } else if (stage === 4) {
        hullGradColor1 = "#fdba74";
        hullGradColor2 = "#f97316";
        hullBorder = "#c2410c";
        eyeColor = "#fff7ed";
        eyeGlow = "rgba(249, 115, 22, 0.95)";
      } else if (stage === 5) {
        hullGradColor1 = "#ffffff";
        hullGradColor2 = "#ffedd5";
        hullBorder = "#ea580c";
        eyeColor = "#f59e0b";
        eyeGlow = "rgba(245, 158, 11, 1)";
        trackWheel = "#fbbf24";
      }

    } else if (type === 'BLACK') {
      // ==========================================
      // ⚫ ROBÔ PRETO (STEALTH ÔNIX)
      // ==========================================
      auraColor = "#94a3b8";
      trackRubber = "#0a0a0a";
      trackWheel = "#262626";

      if (stage === 1) {
        hullGradColor1 = "#262626";
        hullGradColor2 = "#171717";
        hullBorder = "#0f0f0f";
        eyeColor = "#f87171";
        eyeGlow = "rgba(248, 113, 113, 0.35)";
      } else if (stage === 2) {
        hullGradColor1 = "#334155";
        hullGradColor2 = "#1e293b";
        hullBorder = "#0f172a";
        eyeColor = "#94a3b8";
        eyeGlow = "rgba(148, 163, 184, 0.55)";
      } else if (stage === 3) {
        hullGradColor1 = "#1e293b";
        hullGradColor2 = "#0f172a";
        hullBorder = "#020617";
        eyeColor = "#facc15";
        eyeGlow = "rgba(250, 204, 21, 0.75)";
      } else if (stage === 4) {
        hullGradColor1 = "#18181b";
        hullGradColor2 = "#09090b";
        hullBorder = "#3f3f46";
        eyeColor = "#ef4444";
        eyeGlow = "rgba(239, 68, 68, 0.95)";
      } else if (stage === 5) {
        hullGradColor1 = "#09090b";
        hullGradColor2 = "#18181b";
        hullBorder = "#f8fafc";
        eyeColor = "#ffffff";
        eyeGlow = "rgba(255, 255, 255, 1)";
        trackWheel = "#f8fafc";
      }

    } else if (type === 'PURPLE') {
      // ==========================================
      // 🟣 ROBÔ ROXO (CÓSMICO HI-TECH)
      // ==========================================
      auraColor = "#a855f7";
      trackRubber = "#1c0b2b";
      trackWheel = "#9333ea";

      if (stage === 1) {
        hullGradColor1 = "#3b184b";
        hullGradColor2 = "#220930";
        hullBorder = "#170521";
        eyeColor = "#c084fc";
        eyeGlow = "rgba(192, 132, 252, 0.35)";
      } else if (stage === 2) {
        hullGradColor1 = "#9333ea";
        hullGradColor2 = "#6b21a8";
        hullBorder = "#581c87";
        eyeColor = "#e9d5ff";
        eyeGlow = "rgba(147, 51, 234, 0.55)";
      } else if (stage === 3) {
        hullGradColor1 = "#a855f7";
        hullGradColor2 = "#7e22ce";
        hullBorder = "#4c1d95";
        eyeColor = "#f3e8ff";
        eyeGlow = "rgba(168, 85, 247, 0.75)";
      } else if (stage === 4) {
        hullGradColor1 = "#c084fc";
        hullGradColor2 = "#9333ea";
        hullBorder = "#6b21a8";
        eyeColor = "#faf5ff";
        eyeGlow = "rgba(192, 132, 252, 0.95)";
      } else if (stage === 5) {
        hullGradColor1 = "#ffffff";
        hullGradColor2 = "#f3e8ff";
        hullBorder = "#9333ea";
        eyeColor = "#a855f7";
        eyeGlow = "rgba(168, 85, 247, 1)";
        trackWheel = "#fbbf24";
      }

    } else if (type === 'RED') {
      // ==========================================
      // 🔴 ROBÔ VERMELHO (TURBO ROCKET)
      // ==========================================
      auraColor = "#ef4444";
      trackRubber = "#290808";
      trackWheel = "#dc2626";

      if (stage === 1) {
        hullGradColor1 = "#5e1414";
        hullGradColor2 = "#330b0b";
        hullBorder = "#200606";
        eyeColor = "#fca5a5";
        eyeGlow = "rgba(252, 165, 165, 0.35)";
      } else if (stage === 2) {
        hullGradColor1 = "#dc2626";
        hullGradColor2 = "#991b1b";
        hullBorder = "#7f1d1d";
        eyeColor = "#fee2e2";
        eyeGlow = "rgba(220, 38, 38, 0.55)";
      } else if (stage === 3) {
        hullGradColor1 = "#ef4444";
        hullGradColor2 = "#b91c1c";
        hullBorder = "#991b1b";
        eyeColor = "#fef2f2";
        eyeGlow = "rgba(239, 68, 68, 0.75)";
      } else if (stage === 4) {
        hullGradColor1 = "#f87171";
        hullGradColor2 = "#dc2626";
        hullBorder = "#b91c1c";
        eyeColor = "#fff1f2";
        eyeGlow = "rgba(248, 113, 113, 0.95)";
      } else if (stage === 5) {
        hullGradColor1 = "#ffffff";
        hullGradColor2 = "#fee2e2";
        hullBorder = "#ef4444";
        eyeColor = "#dc2626";
        eyeGlow = "rgba(220, 38, 38, 1)";
        trackWheel = "#fbbf24";
      }

    } else if (type === 'YELLOW') {
      // ==========================================
      // 🟡 ROBÔ AMARELO (VOLT ELÉTRICO)
      // ==========================================
      auraColor = "#eab308";
      trackRubber = "#292108";
      trackWheel = "#ca8a04";

      if (stage === 1) {
        hullGradColor1 = "#715612";
        hullGradColor2 = "#422006";
        hullBorder = "#291403";
        eyeColor = "#fde047";
        eyeGlow = "rgba(253, 224, 71, 0.35)";
      } else if (stage === 2) {
        hullGradColor1 = "#facc15";
        hullGradColor2 = "#ca8a04";
        hullBorder = "#854d0e";
        eyeColor = "#fef9c3";
        eyeGlow = "rgba(250, 204, 21, 0.55)";
      } else if (stage === 3) {
        hullGradColor1 = "#fde047";
        hullGradColor2 = "#eab308";
        hullBorder = "#a16207";
        eyeColor = "#ffffff";
        eyeGlow = "rgba(250, 204, 21, 0.8)";
      } else if (stage === 4) {
        hullGradColor1 = "#fef08a";
        hullGradColor2 = "#facc15";
        hullBorder = "#ca8a04";
        eyeColor = "#38bdf8";
        eyeGlow = "rgba(56, 189, 248, 0.95)";
      } else if (stage === 5) {
        hullGradColor1 = "#ffffff";
        hullGradColor2 = "#fef9c3";
        hullBorder = "#eab308";
        eyeColor = "#facc15";
        eyeGlow = "rgba(234, 179, 8, 1)";
        trackWheel = "#fbbf24";
      }

    } else {
      // ==========================================
      // 🔷 ROBÔ AZUL (TRATORZINHO)
      // ==========================================
      auraColor = "#38bdf8";
      trackRubber = "#0f172a";
      trackWheel = "#0284c7";

      if (stage === 1) {
        // Estágio 1: Azul acinzentado enferrujado
        hullGradColor1 = "#3b4856";
        hullGradColor2 = "#242e39";
        hullBorder = "#17202a";
        eyeColor = "#38bdf8";
        eyeGlow = "rgba(56, 189, 248, 0.3)";
        trackRubber = "#1c1917";
        trackWheel = "#57534e";
      } else if (stage === 2) {
        // Estágio 2: Azul celeste brilhante
        hullGradColor1 = "#60a5fa";
        hullGradColor2 = "#2563eb";
        hullBorder = "#1d4ed8";
        eyeColor = "#bfdbfe";
        eyeGlow = "rgba(96, 165, 250, 0.5)";
      } else if (stage === 3) {
        // Estágio 3: Azul elétrico
        hullGradColor1 = "#38bdf8";
        hullGradColor2 = "#0284c7";
        hullBorder = "#0369a1";
        eyeColor = "#e0f2fe";
        eyeGlow = "rgba(56, 189, 248, 0.75)";
      } else if (stage === 4) {
        // Estágio 4: Ciano neon profundo
        hullGradColor1 = "#38bdf8";
        hullGradColor2 = "#0369a1";
        hullBorder = "#075985";
        eyeColor = "#38bdf8";
        eyeGlow = "rgba(56, 189, 248, 0.95)";
      } else if (stage === 5) {
        // Estágio 5: Armadura cromada reluzente com reflexos celestes e ouro
        hullGradColor1 = "#ffffff";
        hullGradColor2 = "#c7d2fe";
        hullBorder = "#3b82f6";
        eyeColor = "#06b6d4";
        eyeGlow = "rgba(6, 182, 212, 1)";
        trackWheel = "#fbbf24";
      }
    }

    // Aura de energia máxima no Nível 5
    if (stage === 5) {
      ctx.save();
      ctx.shadowColor = auraColor;
      ctx.shadowBlur = 24;
      ctx.strokeStyle = auraColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, w * 0.6, h * 0.55, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // ==========================================
    // 1. SISTEMA DE LOCOMOÇÃO (ESTEIRAS / PROPULSOR / RODAS)
    // ==========================================
    const baseY = h - 22;
    const baseH = 20;

    if (type === 'HOVER') {
      // ----------------------------------------
      // PROPULSOR ANTIGRAVITACIONAL (HOVERBOT)
      // ----------------------------------------
      ctx.fillStyle = hullBorder;
      ctx.beginPath();
      ctx.moveTo(24, baseY - 2);
      ctx.lineTo(32, baseY + 6);
      ctx.lineTo(w - 32, baseY + 6);
      ctx.lineTo(w - 24, baseY - 2);
      ctx.closePath();
      ctx.fill();

      // Bocal central do propulsor
      const nozzleW = 38;
      const nozzleH = 10;
      const nozzleX = w / 2 - nozzleW / 2;
      const nozzleY = baseY + 2;

      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = hullBorder;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(nozzleX, nozzleY, nozzleW, nozzleH, 5);
      ctx.fill();
      ctx.stroke();

      // Chama de plasma pulsante (Rosa / Magenta Vibrante)
      ctx.save();
      ctx.shadowColor = (stage === 1) ? "rgba(239, 68, 68, 0.6)" : "rgba(236, 72, 153, 0.95)";
      ctx.shadowBlur = (stage === 1) ? 6 : 16;

      const flameLen = (stage === 1) ? 8 : (14 + Math.sin(this.animTime * 18) * 4);
      const flameGrad = ctx.createLinearGradient(w / 2, nozzleY + nozzleH, w / 2, nozzleY + nozzleH + flameLen);
      if (stage === 1) {
        flameGrad.addColorStop(0, "rgba(239, 68, 68, 0.85)");
        flameGrad.addColorStop(1, "rgba(239, 68, 68, 0)");
      } else {
        flameGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        flameGrad.addColorStop(0.35, "rgba(244, 114, 182, 0.9)");
        flameGrad.addColorStop(1, "rgba(219, 39, 119, 0)");
      }

      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(nozzleX + 4, nozzleY + nozzleH);
      ctx.lineTo(w / 2, nozzleY + nozzleH + flameLen);
      ctx.lineTo(nozzleX + nozzleW - 4, nozzleY + nozzleH);
      ctx.closePath();
      ctx.fill();

      // Mini jatos laterais estabilizadores
      const drawMiniJet = (jx) => {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(jx - 4, baseY + 1, 8, 5);
        ctx.fillStyle = (stage === 1) ? "rgba(239, 68, 68, 0.4)" : "rgba(244, 114, 182, 0.8)";
        ctx.beginPath();
        ctx.arc(jx, baseY + 7, 3, 0, Math.PI);
        ctx.fill();
      };
      drawMiniJet(18);
      drawMiniJet(w - 18);
      ctx.restore();

    } else if (type === 'PURPLE') {
      // ----------------------------------------
      // ORBES GRAVITACIONAIS CÓSMICOS (ROBÔ ROXO)
      // ----------------------------------------
      const orbY = baseY + 7;
      const drawCosmicOrb = (ox) => {
        ctx.save();
        ctx.translate(ox, orbY);
        // Anel elíptico de plasma violeta girando
        const ringRot = (this.animTime * 4) + (ox > w / 2 ? 1 : 0);
        ctx.save();
        ctx.rotate(ringRot);
        ctx.strokeStyle = (stage === 1) ? "#581c87" : "#c084fc";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#a855f7";
        ctx.shadowBlur = (stage === 1) ? 4 : 10;
        ctx.beginPath();
        ctx.ellipse(0, 0, 13, 5, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Esfera central do orbe
        if (ctx.createRadialGradient) {
          const orbGrad = ctx.createRadialGradient(-2, -2, 2, 0, 0, 7.5);
          orbGrad.addColorStop(0, "#ffffff");
          orbGrad.addColorStop(0.4, (stage === 1) ? "#7e22ce" : "#a855f7");
          orbGrad.addColorStop(1, "#3b0764");
          ctx.fillStyle = orbGrad;
        } else {
          ctx.fillStyle = (stage === 1) ? "#7e22ce" : "#a855f7";
        }
        ctx.beginPath();
        ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = hullBorder;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      };
      drawCosmicOrb(22);
      drawCosmicOrb(w - 22);

      // Suporte de suspensão magnética
      ctx.fillStyle = hullBorder;
      ctx.fillRect(18, baseY, w - 36, 4);

    } else if (type === 'ORANGE') {
      // ----------------------------------------
      // MONORODA GIROSCÓPICA CENTRAL (ROBÔ LARANJA)
      // ----------------------------------------
      const wheelR = 14;
      const wheelX = w / 2;
      const wheelY = baseY + 8;

      // Braços de suspensão duplos amortecidos
      ctx.strokeStyle = hullBorder;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 18, baseY);
      ctx.lineTo(wheelX - 4, wheelY);
      ctx.moveTo(w / 2 + 18, baseY);
      ctx.lineTo(wheelX + 4, wheelY);
      ctx.stroke();

      // Pneu reforçado da monoroda
      ctx.save();
      ctx.translate(wheelX, wheelY);
      ctx.fillStyle = (stage === 1) ? "#431407" : "#1c1917";
      ctx.strokeStyle = hullBorder;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, wheelR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Aro e raios solares giratórios
      ctx.fillStyle = (stage === 1) ? "#7c2d12" : trackWheel;
      ctx.beginPath();
      ctx.arc(0, 0, wheelR - 3.5, 0, Math.PI * 2);
      ctx.fill();

      const rot = player.wheelRot || player.treadOffset || 0;
      ctx.rotate(rot);
      ctx.strokeStyle = (stage === 1) ? "#9a3412" : (stage >= 4 ? "#fbbf24" : "#fdba74");
      ctx.lineWidth = 2;
      for (let a = 0; a < 6; a++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a * Math.PI / 3) * (wheelR - 4), Math.sin(a * Math.PI / 3) * (wheelR - 4));
        ctx.stroke();
      }

      // Calota solar central
      ctx.fillStyle = (stage >= 4) ? "#ffffff" : "#ea580c";
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Sapatas estabilizadoras laterais
      ctx.fillStyle = hullBorder;
      ctx.fillRect(8, baseY + 6, 8, 4);
      ctx.fillRect(w - 16, baseY + 6, 8, 4);

    } else if (type === 'RED') {
      // ----------------------------------------
      // TURBO ROCKETS FLAMEJANTES DUPLOS (ROBÔ VERMELHO)
      // ----------------------------------------
      const drawTurboThruster = (tx) => {
        const jetW = 16;
        const jetH = 11;
        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = hullBorder;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(tx - jetW / 2, baseY + 2, jetW, jetH, 4);
        ctx.fill();
        ctx.stroke();

        // Chama turbo de corrida pulsante
        ctx.save();
        ctx.shadowColor = "rgba(239, 68, 68, 0.9)";
        ctx.shadowBlur = 14;
        const flameLen = 12 + Math.sin(this.animTime * 24 + tx) * 6;
        const flameGrad = ctx.createLinearGradient(tx, baseY + 2 + jetH, tx, baseY + 2 + jetH + flameLen);
        flameGrad.addColorStop(0, "#ffffff");
        flameGrad.addColorStop(0.3, "#facc15");
        flameGrad.addColorStop(0.65, "#f97316");
        flameGrad.addColorStop(1, "rgba(239, 68, 68, 0)");
        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(tx - 6, baseY + 2 + jetH);
        ctx.lineTo(tx, baseY + 2 + jetH + flameLen);
        ctx.lineTo(tx + 6, baseY + 2 + jetH);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };
      drawTurboThruster(20);
      drawTurboThruster(w - 20);

      // Rodas esportivas rebaixadas de apoio
      const axleY = baseY + 8;
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = hullBorder;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(36, axleY, 7, 0, Math.PI * 2);
      ctx.arc(w - 36, axleY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

    } else if (type === 'BLACK') {
      // ----------------------------------------
      // ESTEIRAS STEALTH DE CARBONO (ROBÔ PRETO)
      // ----------------------------------------
      const trackY = baseY + 2;
      const trackH = baseH - 2;

      ctx.fillStyle = "#050505";
      ctx.fillRect(16, trackY + 2, w - 32, 10);

      const drawStealthTrack = (tx, tw) => {
        ctx.fillStyle = "#18181b";
        ctx.strokeStyle = hullBorder;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(tx, trackY, tw, trackH, 6);
        ctx.fill();
        ctx.stroke();

        // Roletes internos stealth
        for (let i = 0; i < 3; i++) {
          const wx = tx + 7 + i * ((tw - 14) / 2);
          const wy = trackY + trackH / 2;
          ctx.fillStyle = (stage === 1) ? "#27272a" : trackWheel;
          ctx.beginPath();
          ctx.arc(wx, wy, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#09090b";
          ctx.beginPath();
          ctx.arc(wx, wy, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Blindagem angular externa trapezoidal
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.beginPath();
        ctx.moveTo(tx + 2, trackY + 1);
        ctx.lineTo(tx + tw - 2, trackY + 1);
        ctx.lineTo(tx + tw - 6, trackY + 5);
        ctx.lineTo(tx + 6, trackY + 5);
        ctx.closePath();
        ctx.fill();
      };
      drawStealthTrack(6, 30);
      drawStealthTrack(w - 36, 30);
    } else if (type === 'YELLOW') {
      // ----------------------------------------
      // BOBINAS MAGNÉTICAS ELÉTRICAS (ROBÔ AMARELO)
      // ----------------------------------------
      const drawElectricSkate = (sx) => {
        const skateW = 28;
        const skateH = 12;
        const sy = baseY + 6;

        // Barra de base magnética dourada
        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = hullBorder;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(sx - skateW / 2, sy, skateW, skateH, 5);
        ctx.fill();
        ctx.stroke();

        // 3 anéis da bobina de choque amarela/cobre
        for (let i = 0; i < 3; i++) {
          const cx = sx - 7 + i * 7;
          ctx.fillStyle = (stage === 1) ? "#854d0e" : "#facc15";
          ctx.beginPath();
          ctx.arc(cx, sy + skateH / 2, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(cx, sy + skateH / 2, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Faísca elétrica animada na ponta
        if (Math.sin(this.animTime * 20 + sx) > 0.2) {
          ctx.strokeStyle = (stage === 1) ? "#ca8a04" : "#fef08a";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(sx - 10, sy + skateH);
          ctx.lineTo(sx - 4, sy + skateH + 4);
          ctx.lineTo(sx + 2, sy + skateH + 1);
          ctx.lineTo(sx + 8, sy + skateH + 5);
          ctx.stroke();
        }
      };

      drawElectricSkate(22);
      drawElectricSkate(w - 22);

      // Conector horizontal dourado com indicador de voltagem
      ctx.fillStyle = hullBorder;
      ctx.fillRect(16, baseY, w - 32, 5);
      ctx.fillStyle = (stage === 1) ? "#715612" : "#facc15";
      ctx.fillRect(w / 2 - 8, baseY + 1, 16, 3);

    } else if (type === 'WHEELS') {
      // ----------------------------------------
      // RODAS DUPLAS ESPORTIVAS (SPARKY)
      // ----------------------------------------
      const axleY = baseY + 9;

      // Eixo reforçado ligando as rodas
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = hullBorder;
      ctx.lineWidth = 2;
      ctx.fillRect(16, axleY - 3, w - 32, 6);
      ctx.strokeRect(16, axleY - 3, w - 32, 6);

      const drawSportWheel = (wx) => {
        const wheelR = 12;
        ctx.save();
        ctx.translate(wx, axleY);

        // Pneu de borracha exterior
        ctx.fillStyle = (stage === 1) ? "#292524" : "#0f172a";
        ctx.strokeStyle = hullBorder;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, wheelR, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Aro de liga leve
        ctx.fillStyle = (stage === 1) ? "#57534e" : trackWheel;
        ctx.beginPath();
        ctx.arc(0, 0, wheelR - 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Raios giratórios com rotação da roda (Verde Neon)
        const rot = player.wheelRot || player.treadOffset || 0;
        ctx.rotate(rot);
        ctx.strokeStyle = (stage === 1) ? "#44403c" : (stage >= 4 ? "#22c55e" : "#34d399");
        ctx.lineWidth = 2;
        for (let a = 0; a < 4; a++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a * Math.PI / 2) * (wheelR - 4), Math.sin(a * Math.PI / 2) * (wheelR - 4));
          ctx.stroke();
        }

        // Calota central
        ctx.fillStyle = (stage >= 4) ? "#fbbf24" : "#0f172a";
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Para-lama protetor superior
        ctx.strokeStyle = hullBorder;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(wx, axleY, wheelR + 3, Math.PI * 1.05, Math.PI * 1.95);
        ctx.stroke();
      };

      drawSportWheel(16);
      drawSportWheel(w - 16);

    } else {
      // ----------------------------------------
      // ESTEIRAS DE TRATOR ORIGINAIS (TRACKS)
      // ----------------------------------------
      const trackY = baseY;
      const trackH = baseH;

      ctx.fillStyle = "#0f172a";
      ctx.fillRect(18, trackY + 4, w - 36, 12);

      const drawTrack = (tx, tw) => {
        ctx.fillStyle = trackRubber;
        ctx.strokeStyle = hullBorder;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(tx, trackY, tw, trackH, 8);
        ctx.fill();
        ctx.stroke();

        const wheelCount = 3;
        const wheelR = 5.5;
        const wheelSpacing = (tw - 16) / (wheelCount - 1);

        for (let i = 0; i < wheelCount; i++) {
          const wx = tx + 8 + i * wheelSpacing;
          const wy = trackY + trackH / 2;

          ctx.fillStyle = trackWheel;
          ctx.beginPath();
          ctx.arc(wx, wy, wheelR, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#0f172a";
          ctx.beginPath();
          ctx.arc(wx, wy, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        const offset = (player.treadOffset || 0) % 8;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1.5;
        for (let gx = tx + 4 + offset; gx < tx + tw - 4; gx += 8) {
          ctx.beginPath();
          ctx.moveTo(gx, trackY + 1);
          ctx.lineTo(gx, trackY + 4);
          ctx.moveTo(gx, trackY + trackH - 4);
          ctx.lineTo(gx, trackY + trackH - 1);
          ctx.stroke();
        }
      };

      drawTrack(4, 32);
      drawTrack(w - 36, 32);
    }

    // ==========================================
    // 2. CORPO ARREDONDADO E AMIGÁVEL (TORSO)
    // ==========================================
    const torsoY = 38;
    const torsoH = 40;
    const torsoW = w - 24;
    const torsoX = 12;

    const bodyGrad = ctx.createLinearGradient(torsoX, torsoY, torsoX + torsoW, torsoY + torsoH);
    bodyGrad.addColorStop(0, hullGradColor1);
    bodyGrad.addColorStop(1, hullGradColor2);
    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = hullBorder;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(torsoX, torsoY, torsoW, torsoH, 18);
    ctx.fill();
    ctx.stroke();

    // Brilho de volume 3D na parte superior do torso
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(torsoX + 4, torsoY + 3, torsoW - 8, 8, 4);
    ctx.stroke();

    // Detalhes: pequenos parafusos cromados nas curvas do corpo
    ctx.fillStyle = hullBorder;
    ctx.beginPath();
    ctx.arc(torsoX + 6, torsoY + 8, 2, 0, Math.PI * 2);
    ctx.arc(torsoX + torsoW - 6, torsoY + 8, 2, 0, Math.PI * 2);
    ctx.fill();

    // ==========================================
    // 3. MOSTRADOR DE ENERGIA NO PEITO (BATERIA / REATOR)
    // ==========================================
    const chestX = w / 2 - 16;
    const chestY = torsoY + 12;
    const chestW = 32;
    const chestH = 16;

    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.roundRect(chestX, chestY, chestW, chestH, 6);
    ctx.fill();
    ctx.strokeStyle = hullBorder;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (stage === 1) {
      // Nível 1: Bateria fraca piscando vermelho
      const blink = Math.sin(this.animTime * 6) > 0;
      ctx.fillStyle = blink ? "#ef4444" : "#450a0a";
      ctx.fillRect(chestX + 4, chestY + 4, 6, 8);
    } else if (stage === 2) {
      // Nível 2: 2 barrinhas amarelas
      ctx.fillStyle = "#eab308";
      ctx.fillRect(chestX + 4, chestY + 4, 6, 8);
      ctx.fillRect(chestX + 12, chestY + 4, 6, 8);
    } else if (stage === 3) {
      // Nível 3: Barras verdes e relógio de vapor
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(chestX + 4, chestY + 4, 6, 8);
      ctx.fillRect(chestX + 12, chestY + 4, 6, 8);
      ctx.fillRect(chestX + 20, chestY + 4, 6, 8);
    } else if (stage === 4) {
      // Nível 4: Reator de Arco Ciano
      ctx.save();
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(w / 2, chestY + chestH / 2, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (stage === 5) {
      // Nível 5: Coração de Energia Estelar Radiante
      ctx.save();
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(w / 2, chestY + chestH / 2, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(w / 2, chestY + chestH / 2, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // ==========================================
    // 4. BRAÇOS AMIGÁVEIS E GARRINHAS ARTICULADAS
    // ==========================================
    const armSwing = Math.sin(this.animTime * 6) * 3;
    const drawArm = (isLeft) => {
      const ax = isLeft ? torsoX - 5 : torsoX + torsoW - 3;
      const ay = torsoY + 8;

      ctx.save();
      ctx.translate(ax, ay);

      // Ombro com junta esférica
      ctx.fillStyle = hullBorder;
      ctx.beginPath();
      ctx.arc(4, 4, 5, 0, Math.PI * 2);
      ctx.fill();

      // Braço arredondado
      ctx.fillStyle = bodyGrad;
      ctx.strokeStyle = hullBorder;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(isLeft ? -4 : 0, 4, 8, 18 + armSwing * (isLeft ? 1 : -1), 4);
      ctx.fill();
      ctx.stroke();

      // Garrinha mecânica na ponta (aberta para cima aparando peças)
      const handY = 22 + armSwing * (isLeft ? 1 : -1);
      ctx.strokeStyle = hullBorder;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      if (isLeft) {
        ctx.arc(-1, handY, 5, Math.PI * 0.2, Math.PI * 1.2, true);
      } else {
        ctx.arc(8, handY, 5, Math.PI * 0.8, -Math.PI * 0.2);
      }
      ctx.stroke();

      ctx.restore();
    };

    drawArm(true);
    drawArm(false);

    // ==========================================
    // 5. CABEÇA ARREDONDADA E VISOR CURVO
    // ==========================================
    const headOffsetY = isSad ? 5 : 0;
    const headW = w - 30;
    const headH = 34;
    const headX = 15;
    const headY = 6 + headOffsetY;

    // Fones / Parafusos laterais da cabeça (orelhas)
    ctx.fillStyle = hullBorder;
    ctx.beginPath();
    ctx.arc(headX, headY + headH / 2, 5, 0, Math.PI * 2);
    ctx.arc(headX + headW, headY + headH / 2, 5, 0, Math.PI * 2);
    ctx.fill();

    // Capacete arredondado amigável
    const headGrad = ctx.createLinearGradient(headX, headY, headX + headW, headY + headH);
    headGrad.addColorStop(0, hullGradColor1);
    headGrad.addColorStop(1, hullGradColor2);
    ctx.fillStyle = headGrad;
    ctx.strokeStyle = hullBorder;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(headX, headY, headW, headH, 16);
    ctx.fill();
    ctx.stroke();

    // ==========================================
    // 6. ANTENA / CRISTA (PERSONALIZADO POR ROBÔ)
    // ==========================================
    ctx.save();
    if (type === 'HOVER') {
      // Hoverbot: Crista aerodinâmica / barbatana com sensor
      const crestW = 22;
      const crestH = 10;
      ctx.fillStyle = hullBorder;
      ctx.beginPath();
      ctx.moveTo(w / 2 - crestW / 2, headY);
      ctx.lineTo(w / 2 - 4, headY - crestH);
      ctx.lineTo(w / 2 + 4, headY - crestH);
      ctx.lineTo(w / 2 + crestW / 2, headY);
      ctx.closePath();
      ctx.fill();

      // Sensor central reluzente na crista
      if (eyeGlow) {
        ctx.shadowColor = eyeColor;
        ctx.shadowBlur = 8;
      }
      ctx.fillStyle = (stage === 1) ? '#64748b' : eyeColor;
      ctx.beginPath();
      ctx.arc(w / 2, headY - 4, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'WHEELS') {
      // Sparky: Antenas duplas esportivas inclinadas
      const drawSportAntenna = (isLeft) => {
        const sign = isLeft ? -1 : 1;
        const baseX = w / 2 + sign * 14;
        ctx.strokeStyle = hullBorder;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(baseX, headY);
        ctx.lineTo(baseX + sign * 6, headY - 12);
        ctx.stroke();

        if (eyeGlow) {
          ctx.shadowColor = eyeColor;
          ctx.shadowBlur = 8;
        }
        ctx.fillStyle = (stage === 1) ? '#283321' : (isLeft ? '#4ade80' : '#22c55e');
        ctx.beginPath();
        ctx.arc(baseX + sign * 6, headY - 13, 3, 0, Math.PI * 2);
        ctx.fill();
      };
      drawSportAntenna(true);
      drawSportAntenna(false);
    } else if (type === 'PURPLE') {
      // Robô Roxo: Auréola cósmica quântica flutuante
      ctx.save();
      const haloY = headY - 10;
      ctx.strokeStyle = (stage === 1) ? "#7e22ce" : "#c084fc";
      ctx.lineWidth = 2.5;
      if (eyeGlow) {
        ctx.shadowColor = "#a855f7";
        ctx.shadowBlur = 12;
      }
      ctx.beginPath();
      ctx.ellipse(w / 2, haloY, 14, 5, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Esfera estelar flutuante no centro
      ctx.fillStyle = (stage === 1) ? "#c084fc" : "#ffffff";
      ctx.beginPath();
      ctx.arc(w / 2, haloY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

    } else if (type === 'ORANGE') {
      // Robô Laranja: Receptor solar giratório âmbar
      ctx.save();
      ctx.strokeStyle = hullBorder;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(w / 2, headY);
      ctx.lineTo(w / 2, headY - 8);
      ctx.stroke();

      // Disco solar giratório
      ctx.translate(w / 2, headY - 11);
      ctx.rotate(this.animTime * 2.5);
      ctx.fillStyle = (stage === 1) ? "#c2410c" : "#f97316";
      ctx.strokeStyle = hullBorder;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 4 raios solares
      ctx.strokeStyle = (stage === 1) ? "#ea580c" : "#fde047";
      ctx.lineWidth = 2;
      for (let a = 0; a < 4; a++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a * Math.PI / 2) * 8, Math.sin(a * Math.PI / 2) * 8);
        ctx.stroke();
      }
      ctx.restore();

    } else if (type === 'RED') {
      // Robô Vermelho: Aerofólio traseiro e escapamentos turbo duplos
      const drawTurboFin = (isLeft) => {
        const sign = isLeft ? -1 : 1;
        const fx = w / 2 + sign * 16;
        ctx.fillStyle = (stage === 1) ? "#7f1d1d" : hullBorder;
        ctx.beginPath();
        ctx.moveTo(fx, headY);
        ctx.lineTo(fx + sign * 8, headY - 12);
        ctx.lineTo(fx + sign * 12, headY - 12);
        ctx.lineTo(fx + sign * 4, headY);
        ctx.closePath();
        ctx.fill();

        // Ponta de escape incandescente
        ctx.fillStyle = (stage === 1) ? "#ef4444" : "#facc15";
        ctx.beginPath();
        ctx.arc(fx + sign * 10, headY - 12, 2.5, 0, Math.PI * 2);
        ctx.fill();
      };
      drawTurboFin(true);
      drawTurboFin(false);

    } else if (type === 'BLACK') {
      // Robô Preto: Antenas duplas stealth em ângulo afiado
      const drawStealthFin = (isLeft) => {
        const sign = isLeft ? -1 : 1;
        const bx = w / 2 + sign * 12;
        ctx.fillStyle = "#18181b";
        ctx.strokeStyle = hullBorder;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx, headY);
        ctx.lineTo(bx + sign * 5, headY - 14);
        ctx.lineTo(bx + sign * 9, headY - 10);
        ctx.lineTo(bx + sign * 4, headY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Laser sensor stealth no ápice
        ctx.fillStyle = (stage === 1) ? "#f87171" : "#ef4444";
        ctx.beginPath();
        ctx.arc(bx + sign * 5, headY - 14, 2, 0, Math.PI * 2);
        ctx.fill();
      };
      drawStealthFin(true);
      drawStealthFin(false);

    } else if (type === 'YELLOW') {
      // Robô Amarelo: Antena em zigue-zague de raio elétrico com centelha pulsante
      ctx.save();
      ctx.strokeStyle = hullBorder;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(w / 2, headY);
      ctx.lineTo(w / 2 - 4, headY - 6);
      ctx.lineTo(w / 2 + 3, headY - 10);
      ctx.lineTo(w / 2 - 1, headY - 15);
      ctx.stroke();

      // Esfera de choque de alta voltagem no topo
      if (eyeGlow) {
        ctx.shadowColor = "#facc15";
        ctx.shadowBlur = 10;
      }
      ctx.fillStyle = (stage === 1) ? "#ca8a04" : "#fef08a";
      ctx.beginPath();
      ctx.arc(w / 2 - 1, headY - 15, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Centelha de choque que pisca
      if (Math.sin(this.animTime * 18) > 0.3) {
        ctx.strokeStyle = (stage === 1) ? "#facc15" : "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(w / 2 - 1, headY - 19);
        ctx.lineTo(w / 2 - 1, headY - 15);
        ctx.lineTo(w / 2 + 4, headY - 16);
        ctx.stroke();
      }
      ctx.restore();

    } else {
      // TRACKS: Antena clássica com esfera de LED ou fio defeituoso
      if (stage === 1) {
        ctx.strokeStyle = "#44403c";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(w / 2, headY);
        ctx.quadraticCurveTo(w / 2 - 8, headY - 8, w / 2 - 4, headY - 14);
        ctx.stroke();

        if (Math.sin(this.animTime * 14) > 0.3) {
          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.arc(w / 2 - 4, headY - 14, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.strokeStyle = hullBorder;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(w / 2, headY);
        ctx.lineTo(w / 2, headY - 12);
        ctx.stroke();

        if (eyeGlow) {
          ctx.shadowColor = eyeColor;
          ctx.shadowBlur = 10;
        }
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.arc(w / 2, headY - 13, 5, 0, Math.PI * 2);
        ctx.fill();

        if (stage === 5) {
          ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(w / 2, headY - 13, 9, Math.PI * 1.2, Math.PI * 1.8);
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    // ==========================================
    // 7. VISOR DE VIDRO CURVO (TELA FACIAL)
    // ==========================================
    const screenW = headW - 14;
    const screenH = headH - 12;
    const screenX = headX + 7;
    const screenY = headY + 6;

    ctx.fillStyle = "#090d16"; // Preto azulado profundo de tela
    ctx.beginPath();
    ctx.roundRect(screenX, screenY, screenW, screenH, 10);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Reflexo curvo no canto superior do visor de vidro
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.beginPath();
    ctx.ellipse(screenX + screenW * 0.3, screenY + 4, screenW * 0.25, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // ==========================================
    // 8. OLHOS EXPRESSIVOS DE LED (DINÂMICOS)
    // ==========================================
    const lookX = (player.eyeLookX || 0) * 3;
    const lookY = (player.eyeLookY || 0) * 2;
    const eyeLeftX = screenX + 11 + lookX;
    const eyeRightX = screenX + screenW - 11 + lookX;
    const eyeY = screenY + 8 + lookY;

    ctx.save();
    if (eyeGlow) {
      ctx.shadowColor = eyeColor;
      ctx.shadowBlur = 12;
    }
    ctx.fillStyle = eyeColor;
    ctx.strokeStyle = eyeColor;

    if (isSuperHappy) {
      // Olhos em arcos felizes ^ ^
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(eyeLeftX, eyeY + 1, 5, Math.PI, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(eyeRightX, eyeY + 1, 5, Math.PI, 0);
      ctx.stroke();

      // Bochechas coradinhas de felicidade brilhante
      ctx.fillStyle = "rgba(244, 114, 182, 0.6)";
      ctx.beginPath();
      ctx.arc(eyeLeftX - 1, eyeY + 7, 3, 0, Math.PI * 2);
      ctx.arc(eyeRightX + 1, eyeY + 7, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (isSad) {
      // Olhos semicerrados, caídos e tristes
      ctx.beginPath();
      ctx.ellipse(eyeLeftX, eyeY + 1, 4.5, 3, -0.2, 0, Math.PI * 2);
      ctx.ellipse(eyeRightX, eyeY + 1, 4.5, 3, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Pálpebra caída
      ctx.fillStyle = "#090d16";
      ctx.fillRect(eyeLeftX - 6, eyeY - 4, 12, 3);
      ctx.fillRect(eyeRightX - 6, eyeY - 4, 12, 3);
    } else {
      // Olhos ovais luminosos e atentos
      ctx.beginPath();
      ctx.ellipse(eyeLeftX, eyeY, 4.5, 5.5, 0, 0, Math.PI * 2);
      ctx.ellipse(eyeRightX, eyeY, 4.5, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ponto de brilho na pupila
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(eyeLeftX - 1.5, eyeY - 2, 1.5, 0, Math.PI * 2);
      ctx.arc(eyeRightX - 1.5, eyeY - 2, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // ==========================================
    // 9. BOCA / EXPRESSÃO FACIAL DE LED
    // ==========================================
    ctx.strokeStyle = eyeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    if (isSad) {
      // Boca triste :(
      ctx.arc(w / 2, screenY + 17, 4, Math.PI * 1.15, Math.PI * 1.85);
    } else if (isSmiling || isSuperHappy) {
      // Sorriso amigável :)
      ctx.arc(w / 2, screenY + 13, 5, 0.15, Math.PI - 0.15);
    } else {
      // Neutro
      ctx.moveTo(w / 2 - 4, screenY + 16);
      ctx.lineTo(w / 2 + 4, screenY + 16);
    }
    ctx.stroke();

    // ==========================================
    // 10. BRILHO ESPECULAR (GLINT) NO NÍVEL 5
    // ==========================================
    if (hasGlint) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.beginPath();
      ctx.arc(headX + 6, headY + 8, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(torsoX + 8, torsoY + 10, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // ==========================================
  // ITENS EM QUEDA (ENGRENAGENS E PERIGOS)
  // ==========================================
  drawItems() {
    const ctx = this.ctx;
    const items = entityManager.items;

    for (const item of items) {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rotation);

      if (item.type === 'GEAR_COMMON') {
        this.drawGear(ctx, item.size, '#f59e0b', '#fbbf24', '#78350f');
      } else if (item.type === 'GEAR_RARE') {
        this.drawGear(ctx, item.size, '#0284c7', '#38bdf8', '#0c4a6e', true);
      } else if (item.type === 'HAZARD') {
        this.drawHazardItem(ctx, item);
      }

      ctx.restore();
    }
  }

  drawGear(ctx, radius, baseColor, lightColor, darkColor, isGlowing = false) {
    if (isGlowing) {
      ctx.shadowColor = lightColor;
      ctx.shadowBlur = 14;
    }

    // Dentes da engrenagem
    const teeth = 8;
    ctx.fillStyle = baseColor;
    for (let i = 0; i < teeth; i++) {
      const angle = (i / teeth) * Math.PI * 2;
      ctx.save();
      ctx.rotate(angle);
      ctx.fillRect(-radius * 0.25, -radius * 1.15, radius * 0.5, radius * 0.4);
      ctx.restore();
    }

    // Círculo principal
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = lightColor;
    ctx.fill();
    ctx.strokeStyle = darkColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Furo central
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.38, 0, Math.PI * 2);
    ctx.fillStyle = darkColor;
    ctx.fill();
  }

  drawHazardItem(ctx, item) {
    const s = item.size;

    if (item.hazardType && item.hazardType.includes("Raio")) {
      // Ícone de Raio Elétrico
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.moveTo(-s * 0.2, -s);
      ctx.lineTo(s * 0.6, -s * 0.1);
      ctx.lineTo(0, 0);
      ctx.lineTo(s * 0.4, s);
      ctx.lineTo(-s * 0.6, s * 0.1);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();
    } else if (item.hazardType && item.hazardType.includes("Plasma")) {
      // Orbe de Plasma Instável
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 16;
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.arc(0, 0, s, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f87171";
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Sucata ou Parafuso com Graxa
      ctx.fillStyle = "#451a03";
      ctx.strokeStyle = "#991b1b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-s, -s * 0.5);
      ctx.lineTo(s * 0.4, -s);
      ctx.lineTo(s, s * 0.3);
      ctx.lineTo(-s * 0.2, s);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Ponto de ferrugem
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ==========================================
  // PARTÍCULAS (FAÍSCAS E CONFETES)
  // ==========================================
  drawParticles() {
    const ctx = this.ctx;
    const particles = entityManager.particles;

    for (const p of particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);

      if (p.shape === 'CONFETTI') {
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }
}

let gameRenderer = null;
