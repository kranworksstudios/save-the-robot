/**
 * input.js — Captura e Suavização de Entradas de Teclado, Mouse e Toque
 * Robô em Recuperação — Trabalho Escolar
 */

class InputManager {
  constructor() {
    this.keys = {
      left: false,
      right: false
    };
    this.mouseActive = false;
    this.mouseX = 480; // Centro padrão
    this.canvas = null;
    this.onPauseToggle = null;
    this.onMuteToggle = null;
  }

  init(canvasElement, onPauseCallback, onMuteCallback) {
    this.canvas = canvasElement;
    this.onPauseToggle = onPauseCallback;
    this.onMuteToggle = onMuteCallback;

    // Teclado
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));

    // Mouse
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseenter', () => { this.mouseActive = true; });

    // Toque em telas touchscreen (notebooks híbridos)
    this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    this.canvas.addEventListener('touchstart', (e) => this.handleTouchMove(e), { passive: false });

    // Auto-pausa ao perder o foco da janela
    window.addEventListener('blur', () => {
      this.keys.left = false;
      this.keys.right = false;
      if (gameState.scene === 'PLAYING' && this.onPauseToggle) {
        this.onPauseToggle();
      }
    });

    // Controles Virtuais de Toque para Celular
    const btnLeft = document.getElementById('btn-touch-left');
    const btnRight = document.getElementById('btn-touch-right');

    const setupTouchBtn = (btn, keyProp) => {
      if (!btn) return;
      const startPress = (e) => {
        if (e.cancelable) e.preventDefault();
        this.keys[keyProp] = true;
        this.mouseActive = false;
        btn.classList.add('active');
      };
      const endPress = (e) => {
        if (e.cancelable) e.preventDefault();
        this.keys[keyProp] = false;
        btn.classList.remove('active');
      };

      btn.addEventListener('touchstart', startPress, { passive: false });
      btn.addEventListener('touchend', endPress, { passive: false });
      btn.addEventListener('touchcancel', endPress, { passive: false });
      btn.addEventListener('mousedown', startPress);
      btn.addEventListener('mouseup', endPress);
      btn.addEventListener('mouseleave', endPress);
    };

    setupTouchBtn(btnLeft, 'left');
    setupTouchBtn(btnRight, 'right');
  }

  handleKeyDown(e) {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.keys.left = true;
      this.mouseActive = false;
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.keys.right = true;
      this.mouseActive = false;
    } else if (e.code === 'KeyP' || e.code === 'Escape') {
      if (this.onPauseToggle) this.onPauseToggle();
    } else if (e.code === 'KeyM') {
      if (this.onMuteToggle) this.onMuteToggle();
    }
  }

  handleKeyUp(e) {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.keys.left = false;
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.keys.right = false;
    }
  }

  handleMouseMove(e) {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    this.mouseX = (e.clientX - rect.left) * scaleX;
    this.mouseActive = true;
  }

  handleTouchMove(e) {
    if (!this.canvas || e.touches.length === 0) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    this.mouseX = (touch.clientX - rect.left) * scaleX;
    this.mouseActive = true;
  }
}

const inputManager = new InputManager();
