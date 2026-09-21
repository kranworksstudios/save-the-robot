/**
 * ranking.js — Sistema de Ranking e Identificação de Jogadores (100% Offline)
 * Robô em Recuperação — Trabalho Escolar / Feira Cultural
 */

class RankingManager {
  constructor() {
    this.STORAGE_KEY = 'robo_cultural_ranking';
    this.PLAYER_KEY = 'robo_player_name';
  }

  // Obtém o nome atual do jogador
  getPlayerName() {
    try {
      const name = localStorage.getItem(this.PLAYER_KEY);
      return name && name.trim() ? name.trim() : '';
    } catch (e) {
      return '';
    }
  }

  // Define e persiste o nome do jogador
  setPlayerName(name) {
    const cleanName = (name || '').trim().slice(0, 14) || 'Jogador';
    try {
      localStorage.setItem(this.PLAYER_KEY, cleanName);
    } catch (e) {
      console.warn('Erro ao salvar nome no localStorage:', e);
    }
    return cleanName;
  }

  // Verifica se o jogador já possui nome registrado
  hasPlayerName() {
    return Boolean(this.getPlayerName());
  }

  // Retorna a lista dos 10 melhores registros ordenados
  getRanking() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];
      const list = JSON.parse(data);
      return Array.isArray(list) ? list : [];
    } catch (e) {
      console.warn('Erro ao carregar ranking do localStorage:', e);
      return [];
    }
  }

  // Registra uma nova pontuação e retorna a colocação
  saveScore({ name, gears, levelIndex, levelName, won, timeSeconds, timeFormatted, robotId }) {
    const list = this.getRanking();
    const entry = {
      id: Date.now() + Math.random().toString(36).substring(2, 6),
      name: (name || this.getPlayerName() || 'Jogador').trim().slice(0, 14),
      robotId: robotId || 'TRACKS',
      gears: Number(gears) || 0,
      levelIndex: Number(levelIndex) || 0,
      levelName: levelName || 'Ferro-Velho',
      won: Boolean(won),
      // Nível efetivo para ordenação: se zerou, valor 6; senão, índice + 1
      rankScore: (won ? 6 : levelIndex + 1) * 1000 + (Number(gears) || 0),
      timeSeconds: Number(timeSeconds) || 0,
      timeFormatted: timeFormatted || '00:00',
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    };

    list.push(entry);

    // Ordenação estrita:
    // 1º: Maior pontuação de rank (Fase alcançada / Vitória)
    // 2º: Maior quantidade de engrenagens coletadas
    // 3º: Menor tempo decorrido (desempate de velocidade)
    list.sort((a, b) => {
      if (b.rankScore !== a.rankScore) {
        return b.rankScore - a.rankScore;
      }
      if (b.gears !== a.gears) {
        return b.gears - a.gears;
      }
      return a.timeSeconds - b.timeSeconds;
    });

    // Mantém apenas o Top 10
    const top10 = list.slice(0, 10);

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(top10));
    } catch (e) {
      console.warn('Erro ao salvar ranking no localStorage:', e);
    }

    const position = top10.findIndex(item => item.id === entry.id);
    return {
      position: position !== -1 ? position + 1 : null,
      isTop10: position !== -1,
      isFirstPlace: position === 0,
      entry
    };
  }

  // Limpa o placar da feira
  clearRanking() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }
}

const rankingManager = new RankingManager();
