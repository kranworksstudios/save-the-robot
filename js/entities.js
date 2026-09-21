/**
 * entities.js — Classes e Lógica do Robô, Itens em Queda e Partículas
 * Robô em Recuperação — Trabalho Escolar
 */

class Player {
  constructor() {
    this.width = 84;
    this.height = 96;
    this.x = 480 - this.width / 2;
    this.y = 540 - this.height - 14; // Base do chão
    this.vx = 0;
    this.speed = 540; // Pixels por segundo base
    this.jumpOffset = 0;
    this.jumpTimer = 0;
    this.treadOffset = 0;
    this.wheelRot = 0;
    this.hoverTimer = 0;
    this.hoverBob = 0;
    this.tilt = 0;
    this.eyeLookX = 0;
    this.eyeLookY = -0.4;
    this.smokeTimer = 0;
  }

  reset() {
    this.x = 480 - this.width / 2;
    this.vx = 0;
    this.jumpOffset = 0;
    this.jumpTimer = 0;
    this.treadOffset = 0;
    this.wheelRot = 0;
    this.hoverTimer = 0;
    this.hoverBob = 0;
    this.tilt = 0;
    this.eyeLookX = 0;
  }

  update(dt, input) {
    const robotData = gameState.getSelectedRobotData();
    this.speed = 540 * (robotData ? robotData.speedMult : 1.0);

    // Animação de pulinho em comemoração
    if (gameState.scene === 'LEVEL_CLEAR' || gameState.scene === 'VICTORY') {
      this.jumpTimer += dt * 6;
      this.jumpOffset = -Math.abs(Math.sin(this.jumpTimer)) * 26;
      this.tilt = Math.sin(this.jumpTimer * 0.5) * 0.08;
      this.treadOffset = (this.treadOffset + dt * 20) % 16;
      this.wheelRot += dt * 8;
      return;
    } else {
      this.jumpOffset = 0;
      this.jumpTimer = 0;
    }

    const prevX = this.x;

    if (input.mouseActive) {
      // Movimento suave seguindo o cursor
      const targetX = input.mouseX - this.width / 2;
      const diff = targetX - this.x;
      this.x += diff * Math.min(1, dt * 14);
      this.vx = (this.x - prevX) / Math.max(dt, 0.001);
    } else {
      // Movimento via teclado
      let dir = 0;
      if (input.keys.left) dir -= 1;
      if (input.keys.right) dir += 1;

      this.vx = dir * this.speed;
      this.x += this.vx * dt;
    }

    // Trava de limites da tela
    if (this.x < 10) this.x = 10;
    if (this.x > 960 - this.width - 10) this.x = 960 - this.width - 10;

    // Atualiza rolamento de esteiras ou rodas com o deslocamento real
    const movedDist = this.x - prevX;
    this.treadOffset = (this.treadOffset + movedDist * 0.3) % 16;
    this.wheelRot += movedDist * 0.12;

    // Efeitos de levitação e partículas específicas por robô
    if (gameState.selectedRobot === 'HOVER') {
      this.hoverTimer += dt * 5;
      this.hoverBob = Math.sin(this.hoverTimer) * 4;

      // Solta partículas de plasma rosa do propulsor
      if (gameState.scene === 'PLAYING' && Math.random() < 0.35) {
        entityManager.particles.push(new Particle(
          this.x + this.width / 2 + (Math.random() - 0.5) * 22,
          this.y + this.height - 4,
          (Math.random() - 0.5) * 16,
          25 + Math.random() * 35,
          'rgba(236, 72, 153, 0.8)',
          2 + Math.random() * 2.5,
          0.3,
          'CIRCLE'
        ));
      }
    } else if (gameState.selectedRobot === 'PURPLE') {
      this.hoverTimer += dt * 4.5;
      this.hoverBob = Math.sin(this.hoverTimer) * 4.5;

      // Solta partículas de energia cósmica violeta dos orbes
      if (gameState.scene === 'PLAYING' && Math.random() < 0.35) {
        const sideX = Math.random() < 0.5 ? 22 : this.width - 22;
        entityManager.particles.push(new Particle(
          this.x + sideX + (Math.random() - 0.5) * 8,
          this.y + this.height - 4,
          (Math.random() - 0.5) * 12,
          18 + Math.random() * 25,
          'rgba(168, 85, 247, 0.85)',
          2 + Math.random() * 2.5,
          0.35,
          'CIRCLE'
        ));
      }
    } else if (gameState.selectedRobot === 'RED') {
      this.hoverBob = 0;
      // Solta faíscas e labaredas turbo dos bocais traseiros
      if (gameState.scene === 'PLAYING' && Math.random() < 0.45) {
        const sideX = Math.random() < 0.5 ? 20 : this.width - 20;
        entityManager.particles.push(new Particle(
          this.x + sideX + (Math.random() - 0.5) * 6,
          this.y + this.height - 2,
          (Math.random() - 0.5) * 14,
          30 + Math.random() * 40,
          Math.random() < 0.5 ? 'rgba(239, 68, 68, 0.85)' : 'rgba(249, 115, 22, 0.85)',
          2 + Math.random() * 2.8,
          0.25,
          'CIRCLE'
        ));
      }
    } else if (gameState.selectedRobot === 'ORANGE') {
      this.hoverTimer += dt * 8;
      this.hoverBob = Math.abs(Math.sin(this.hoverTimer)) * 1.5;
      if (gameState.scene === 'PLAYING' && Math.random() < 0.25) {
        entityManager.particles.push(new Particle(
          this.x + this.width / 2 + (Math.random() - 0.5) * 10,
          this.y + this.height - 2,
          (Math.random() - 0.5) * 12,
          12 + Math.random() * 20,
          'rgba(249, 115, 22, 0.7)',
          1.5 + Math.random() * 2,
          0.25,
          'CIRCLE'
        ));
      }
    } else if (gameState.selectedRobot === 'BLACK') {
      this.hoverBob = 0;
      if (gameState.scene === 'PLAYING' && Math.random() < 0.2) {
        entityManager.particles.push(new Particle(
          this.x + (Math.random() < 0.5 ? 12 : this.width - 12),
          this.y + this.height - 2,
          (Math.random() - 0.5) * 10,
          -10 - Math.random() * 15,
          'rgba(148, 163, 184, 0.45)',
          1.5 + Math.random() * 2,
          0.3,
          'CIRCLE'
        ));
      }
    } else if (gameState.selectedRobot === 'YELLOW') {
      this.hoverBob = 0;
      // Faíscas elétricas de alta voltagem amarelas
      if (gameState.scene === 'PLAYING' && Math.random() < 0.35) {
        const sideX = Math.random() < 0.5 ? 22 : this.width - 22;
        entityManager.particles.push(new Particle(
          this.x + sideX + (Math.random() - 0.5) * 8,
          this.y + this.height - 4,
          (Math.random() - 0.5) * 20,
          -5 - Math.random() * 25,
          Math.random() < 0.3 ? '#ffffff' : 'rgba(250, 204, 21, 0.9)',
          1.8 + Math.random() * 2,
          0.2,
          'SPARK'
        ));
      }
    } else {
      this.hoverBob = 0;
    }

    // Inclinação suave (tilt) ao andar
    const targetTilt = Math.max(-0.14, Math.min(0.14, this.vx * 0.0003));
    this.tilt += (targetTilt - this.tilt) * Math.min(1, dt * 10);

    // Olhar dinâmico
    const targetLookX = Math.max(-1, Math.min(1, this.vx / 280));
    this.eyeLookX += (targetLookX - this.eyeLookX) * Math.min(1, dt * 8);

    // No Nível 1: solta fumacinha sutil de defeito às vezes
    if (gameState.currentLevelIndex === 0 && gameState.scene === 'PLAYING') {
      this.smokeTimer += dt;
      if (this.smokeTimer > 0.4) {
        this.smokeTimer = 0;
        entityManager.particles.push(new Particle(
          this.x + 18, this.y + 14,
          (Math.random() - 0.5) * 15, -20 - Math.random() * 20,
          'rgba(120, 113, 108, 0.6)', 3 + Math.random() * 3, 0.6, 'CIRCLE'
        ));
      }
    }
  }

  getHitbox() {
    return {
      x: this.x + 12,
      y: this.y + this.jumpOffset + 12,
      width: this.width - 24,
      height: this.height - 20
    };
  }
}

class FallingItem {
  constructor(type, x, y, vy, size, hazardType = null) {
    this.type = type; // 'GEAR_COMMON' | 'GEAR_RARE' | 'HAZARD'
    this.x = x;
    this.y = y;
    this.vy = vy;
    this.size = size;
    this.hazardType = hazardType;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 4;
  }

  update(dt) {
    this.y += this.vy * dt;
    this.rotation += this.rotationSpeed * dt;
  }

  isOutOfBounds() {
    return this.y > 540 + this.size + 20;
  }

  checkCollision(hitbox) {
    // Colisão Círculo vs Retângulo
    const closestX = Math.max(hitbox.x, Math.min(this.x, hitbox.x + hitbox.width));
    const closestY = Math.max(hitbox.y, Math.min(this.y, hitbox.y + hitbox.height));
    const dx = this.x - closestX;
    const dy = this.y - closestY;
    return (dx * dx + dy * dy) < (this.size * this.size);
  }
}

class Particle {
  constructor(x, y, vx, vy, color, size, life, shape = 'CIRCLE') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.life = life;
    this.maxLife = life;
    this.shape = shape; // 'CIRCLE' | 'STAR' | 'CONFETTI'
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 8;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += 120 * dt; // Gravidade leve
    this.life -= dt;
    this.rotation += this.rotSpeed * dt;
  }
}

class EntityManager {
  constructor() {
    this.player = new Player();
    this.items = [];
    this.particles = [];
    this.spawnTimer = 0;
  }

  reset() {
    this.player.reset();
    this.items = [];
    this.particles = [];
    this.spawnTimer = 0;
  }

  spawnItems(dt, level) {
    this.spawnTimer += dt;
    if (this.spawnTimer >= level.spawnIntervalSeconds) {
      this.spawnTimer = 0;

      // Decide tipo de item
      const isHazard = Math.random() < level.hazardChance;
      const isRare = !isHazard && Math.random() < level.rareGearChance;

      const x = 40 + Math.random() * (960 - 80);
      const y = -30;
      const speed = level.dropSpeedMin + Math.random() * (level.dropSpeedMax - level.dropSpeedMin);

      if (isHazard) {
        this.items.push(new FallingItem('HAZARD', x, y, speed, 22, level.hazardName));
      } else if (isRare) {
        this.items.push(new FallingItem('GEAR_RARE', x, y, speed * 1.1, 26));
      } else {
        this.items.push(new FallingItem('GEAR_COMMON', x, y, speed, 20));
      }
    }
  }

  createSparks(x, y, color, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 160;
      this.particles.push(new Particle(
        x, y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        color,
        3 + Math.random() * 4,
        0.4 + Math.random() * 0.4,
        'CIRCLE'
      ));
    }
  }

  createConfetti() {
    const colors = ['#f59e0b', '#38bdf8', '#10b981', '#ec4899', '#8b5cf6', '#fbbf24'];
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 960;
      const y = -20 - Math.random() * 60;
      const vx = (Math.random() - 0.5) * 120;
      const vy = 80 + Math.random() * 150;
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push(new Particle(
        x, y, vx, vy, color, 6 + Math.random() * 6, 2.5 + Math.random() * 1.5, 'CONFETTI'
      ));
    }
  }

  update(dt, input) {
    this.player.update(dt, input);

    if (gameState.scene === 'PLAYING') {
      const level = gameState.getCurrentLevel();
      this.spawnItems(dt, level);

      // Atualiza e checa colisão de itens
      const hitbox = this.player.getHitbox();
      for (let i = this.items.length - 1; i >= 0; i--) {
        const item = this.items[i];
        item.update(dt);

        if (item.checkCollision(hitbox)) {
          this.handleItemPickup(item);
          this.items.splice(i, 1);
          continue;
        }

        if (item.isOutOfBounds()) {
          this.items.splice(i, 1);
        }
      }
    }

    // Atualiza partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update(dt);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  handleItemPickup(item) {
    if (item.type === 'GEAR_COMMON') {
      gameState.levelGears += 1;
      gameState.totalGearsCollected += 1;
      audioManager.playGear();
      this.createSparks(item.x, item.y, '#fbbf24', 10);
    } else if (item.type === 'GEAR_RARE') {
      gameState.levelGears += 3;
      gameState.totalGearsCollected += 3;
      audioManager.playRareGear();
      this.createSparks(item.x, item.y, '#38bdf8', 16);
    } else if (item.type === 'HAZARD') {
      if (!gameState.isInvulnerable) {
        const level = gameState.getCurrentLevel();
        const penalty = level.hazardPenalty;
        gameState.levelGears = Math.max(0, gameState.levelGears - penalty);
        gameState.sessionStats.gearsLostCount += penalty;
        gameState.sessionStats.hazardsHitCount += 1;

        gameState.isInvulnerable = true;
        gameState.invulnerabilityTimer = 0.45;
        gameState.screenShakeTimer = 0.18;

        audioManager.playHazard();
        this.createSparks(item.x, item.y, '#ef4444', 14);
      }
    }
  }
}

const entityManager = new EntityManager();
