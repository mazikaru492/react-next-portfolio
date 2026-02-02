"use client";

import { useCallback, useEffect, useRef, useState, memo } from "react";
import styles from "./index.module.css";

// ==========================================
// Types & Constants
// ==========================================

interface Position {
  x: number;
  y: number;
}

interface Player {
  x: number;
  y: number;
  angle: number; // 向いている方向（ラジアン）
  health: number;
  maxHealth: number;
  level: number;
  exp: number;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  type: "slime" | "skeleton" | "dragon";
  lastAttack: number;
}

interface Item {
  id: number;
  x: number;
  y: number;
  type: "health" | "exp" | "key";
}

// マップ定義（1=壁、0=通路、2=敵スポーン、3=アイテム、4=ゴール）
const MAP_DATA = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 3, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 4, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const TILE_SIZE = 64;
const MOVE_SPEED = 0.08;
const ROTATION_SPEED = 0.06;
const FOV = Math.PI / 3; // 60度の視野角
const RAY_COUNT = 120;

const ENEMY_TYPES = {
  slime: { health: 30, damage: 5, exp: 20, color: "#22c55e", name: "スライム" },
  skeleton: {
    health: 50,
    damage: 10,
    exp: 40,
    color: "#f8fafc",
    name: "スケルトン",
  },
  dragon: {
    health: 100,
    damage: 20,
    exp: 100,
    color: "#ef4444",
    name: "ドラゴン",
  },
};

// ==========================================
// Main Component
// ==========================================

const DungeonRPG = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());
  const idCounterRef = useRef<number>(0);

  const [canvasSize, setCanvasSize] = useState({ width: 1000, height: 500 });
  const [gameState, setGameState] = useState<
    "title" | "playing" | "gameover" | "clear"
  >("title");
  const [message, setMessage] = useState<string>("");

  const playerRef = useRef<Player>({
    x: 1.5,
    y: 1.5,
    angle: 0,
    health: 100,
    maxHealth: 100,
    level: 1,
    exp: 0,
  });

  const enemiesRef = useRef<Enemy[]>([]);
  const itemsRef = useRef<Item[]>([]);

  // Resize handler
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = Math.min(containerRef.current.offsetWidth - 32, 1200);
        const height = Math.min(600, width * 0.5);
        setCanvasSize({ width, height });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Initialize game
  const initGame = useCallback(() => {
    playerRef.current = {
      x: 1.5,
      y: 1.5,
      angle: 0,
      health: 100,
      maxHealth: 100,
      level: 1,
      exp: 0,
    };

    // 敵を配置
    enemiesRef.current = [];
    itemsRef.current = [];

    MAP_DATA.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 2) {
          const types: Array<"slime" | "skeleton" | "dragon"> = [
            "slime",
            "skeleton",
            "dragon",
          ];
          const type = types[Math.floor(Math.random() * 2)]; // スライムかスケルトン
          enemiesRef.current.push({
            id: idCounterRef.current++,
            x: x + 0.5,
            y: y + 0.5,
            health: ENEMY_TYPES[type].health,
            maxHealth: ENEMY_TYPES[type].health,
            type,
            lastAttack: 0,
          });
        } else if (cell === 3) {
          itemsRef.current.push({
            id: idCounterRef.current++,
            x: x + 0.5,
            y: y + 0.5,
            type: Math.random() > 0.5 ? "health" : "exp",
          });
        }
      });
    });

    setMessage("");
    setGameState("playing");
  }, []);

  // Check collision with walls
  const checkWallCollision = useCallback((x: number, y: number): boolean => {
    const mapX = Math.floor(x);
    const mapY = Math.floor(y);
    if (
      mapY < 0 ||
      mapY >= MAP_DATA.length ||
      mapX < 0 ||
      mapX >= MAP_DATA[0].length
    ) {
      return true;
    }
    return MAP_DATA[mapY][mapX] === 1;
  }, []);

  // Cast a single ray
  const castRay = useCallback(
    (
      startX: number,
      startY: number,
      angle: number,
    ): { distance: number; wallType: number; side: number } => {
      const rayDirX = Math.cos(angle);
      const rayDirY = Math.sin(angle);

      let mapX = Math.floor(startX);
      let mapY = Math.floor(startY);

      const deltaDistX = Math.abs(1 / rayDirX);
      const deltaDistY = Math.abs(1 / rayDirY);

      let stepX: number, stepY: number;
      let sideDistX: number, sideDistY: number;

      if (rayDirX < 0) {
        stepX = -1;
        sideDistX = (startX - mapX) * deltaDistX;
      } else {
        stepX = 1;
        sideDistX = (mapX + 1 - startX) * deltaDistX;
      }

      if (rayDirY < 0) {
        stepY = -1;
        sideDistY = (startY - mapY) * deltaDistY;
      } else {
        stepY = 1;
        sideDistY = (mapY + 1 - startY) * deltaDistY;
      }

      let hit = false;
      let side = 0;

      while (!hit) {
        if (sideDistX < sideDistY) {
          sideDistX += deltaDistX;
          mapX += stepX;
          side = 0;
        } else {
          sideDistY += deltaDistY;
          mapY += stepY;
          side = 1;
        }

        if (
          mapY >= 0 &&
          mapY < MAP_DATA.length &&
          mapX >= 0 &&
          mapX < MAP_DATA[0].length
        ) {
          if (MAP_DATA[mapY][mapX] >= 1) {
            hit = true;
          }
        } else {
          hit = true;
        }
      }

      let distance: number;
      if (side === 0) {
        distance = (mapX - startX + (1 - stepX) / 2) / rayDirX;
      } else {
        distance = (mapY - startY + (1 - stepY) / 2) / rayDirY;
      }

      const wallType =
        mapY >= 0 &&
        mapY < MAP_DATA.length &&
        mapX >= 0 &&
        mapX < MAP_DATA[0].length
          ? MAP_DATA[mapY][mapX]
          : 1;

      return { distance: Math.max(0.1, distance), wallType, side };
    },
    [],
  );

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const player = playerRef.current;
      const now = Date.now();

      // Handle input
      if (keysRef.current.has("ArrowUp") || keysRef.current.has("KeyW")) {
        const newX = player.x + Math.cos(player.angle) * MOVE_SPEED;
        const newY = player.y + Math.sin(player.angle) * MOVE_SPEED;
        if (!checkWallCollision(newX, player.y)) player.x = newX;
        if (!checkWallCollision(player.x, newY)) player.y = newY;
      }
      if (keysRef.current.has("ArrowDown") || keysRef.current.has("KeyS")) {
        const newX = player.x - Math.cos(player.angle) * MOVE_SPEED;
        const newY = player.y - Math.sin(player.angle) * MOVE_SPEED;
        if (!checkWallCollision(newX, player.y)) player.x = newX;
        if (!checkWallCollision(player.x, newY)) player.y = newY;
      }
      if (keysRef.current.has("ArrowLeft") || keysRef.current.has("KeyA")) {
        player.angle -= ROTATION_SPEED;
      }
      if (keysRef.current.has("ArrowRight") || keysRef.current.has("KeyD")) {
        player.angle += ROTATION_SPEED;
      }

      // Check goal
      const goalX = Math.floor(player.x);
      const goalY = Math.floor(player.y);
      if (MAP_DATA[goalY]?.[goalX] === 4) {
        setGameState("clear");
        return;
      }

      // Clear canvas
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      // Draw ceiling
      const gradient = ctx.createLinearGradient(0, 0, 0, canvasSize.height / 2);
      gradient.addColorStop(0, "#1e1b4b");
      gradient.addColorStop(1, "#312e81");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height / 2);

      // Draw floor
      const floorGradient = ctx.createLinearGradient(
        0,
        canvasSize.height / 2,
        0,
        canvasSize.height,
      );
      floorGradient.addColorStop(0, "#1f2937");
      floorGradient.addColorStop(1, "#111827");
      ctx.fillStyle = floorGradient;
      ctx.fillRect(
        0,
        canvasSize.height / 2,
        canvasSize.width,
        canvasSize.height / 2,
      );

      // Raycasting for walls
      const rayWidth = canvasSize.width / RAY_COUNT;

      for (let i = 0; i < RAY_COUNT; i++) {
        const rayAngle = player.angle - FOV / 2 + (i / RAY_COUNT) * FOV;
        const { distance, wallType, side } = castRay(
          player.x,
          player.y,
          rayAngle,
        );

        // Fix fisheye effect
        const correctedDistance = distance * Math.cos(rayAngle - player.angle);
        const wallHeight = Math.min(
          canvasSize.height,
          (canvasSize.height / correctedDistance) * 0.8,
        );

        const wallTop = (canvasSize.height - wallHeight) / 2;

        // Wall colors
        let baseColor: string;
        if (wallType === 4) {
          baseColor = side === 0 ? "#fbbf24" : "#f59e0b"; // ゴール（金色）
        } else {
          baseColor = side === 0 ? "#6366f1" : "#4f46e5"; // 通常の壁
        }

        // Distance fog
        const fogFactor = Math.max(0.2, 1 - correctedDistance / 10);

        ctx.fillStyle = baseColor;
        ctx.globalAlpha = fogFactor;
        ctx.fillRect(i * rayWidth, wallTop, rayWidth + 1, wallHeight);
        ctx.globalAlpha = 1;

        // Wall edge highlight
        if (i > 0) {
          const prevRay = castRay(
            player.x,
            player.y,
            player.angle - FOV / 2 + ((i - 1) / RAY_COUNT) * FOV,
          );
          if (Math.abs(prevRay.distance - distance) > 0.5) {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(i * rayWidth, wallTop);
            ctx.lineTo(i * rayWidth, wallTop + wallHeight);
            ctx.stroke();
          }
        }
      }

      // Draw enemies (billboard sprites)
      enemiesRef.current.forEach((enemy) => {
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Check if enemy is in view
        let angle = Math.atan2(dy, dx) - player.angle;
        while (angle < -Math.PI) angle += Math.PI * 2;
        while (angle > Math.PI) angle -= Math.PI * 2;

        if (Math.abs(angle) < FOV / 2 + 0.1 && distance < 10) {
          const screenX =
            canvasSize.width / 2 + (angle / (FOV / 2)) * (canvasSize.width / 2);
          const size = Math.min(400, (canvasSize.height / distance) * 0.6);

          const enemyData = ENEMY_TYPES[enemy.type];
          const fogFactor = Math.max(0.3, 1 - distance / 8);

          ctx.globalAlpha = fogFactor;
          ctx.fillStyle = enemyData.color;
          ctx.beginPath();
          ctx.arc(screenX, canvasSize.height / 2, size / 2, 0, Math.PI * 2);
          ctx.fill();

          // Enemy eyes
          ctx.fillStyle = "#000";
          const eyeSize = size / 8;
          ctx.beginPath();
          ctx.arc(
            screenX - size / 5,
            canvasSize.height / 2 - size / 8,
            eyeSize,
            0,
            Math.PI * 2,
          );
          ctx.arc(
            screenX + size / 5,
            canvasSize.height / 2 - size / 8,
            eyeSize,
            0,
            Math.PI * 2,
          );
          ctx.fill();

          // Health bar
          const barWidth = size * 0.8;
          const barHeight = 6;
          const barY = canvasSize.height / 2 - size / 2 - 15;
          ctx.fillStyle = "#374151";
          ctx.fillRect(screenX - barWidth / 2, barY, barWidth, barHeight);
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(
            screenX - barWidth / 2,
            barY,
            barWidth * (enemy.health / enemy.maxHealth),
            barHeight,
          );

          ctx.globalAlpha = 1;

          // Enemy attacks player if close
          if (distance < 1.2 && now - enemy.lastAttack > 1000) {
            enemy.lastAttack = now;
            playerRef.current.health -= enemyData.damage;
            setMessage(
              `${enemyData.name}の攻撃！ ${enemyData.damage}ダメージ！`,
            );

            if (playerRef.current.health <= 0) {
              setGameState("gameover");
            }
          }
        }
      });

      // Draw items
      itemsRef.current.forEach((item, index) => {
        const dx = item.x - player.x;
        const dy = item.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let angle = Math.atan2(dy, dx) - player.angle;
        while (angle < -Math.PI) angle += Math.PI * 2;
        while (angle > Math.PI) angle -= Math.PI * 2;

        if (Math.abs(angle) < FOV / 2 && distance < 8 && distance > 0.3) {
          const screenX =
            canvasSize.width / 2 + (angle / (FOV / 2)) * (canvasSize.width / 2);
          const size = Math.min(100, (canvasSize.height / distance) * 0.3);
          const fogFactor = Math.max(0.3, 1 - distance / 6);

          ctx.globalAlpha = fogFactor;
          ctx.fillStyle = item.type === "health" ? "#22c55e" : "#fbbf24";
          ctx.beginPath();
          ctx.arc(
            screenX,
            canvasSize.height / 2 + size,
            size / 2,
            0,
            Math.PI * 2,
          );
          ctx.fill();

          // ピックアップ
          if (distance < 0.8) {
            if (item.type === "health") {
              playerRef.current.health = Math.min(
                playerRef.current.maxHealth,
                playerRef.current.health + 30,
              );
              setMessage("体力を30回復した！");
            } else {
              playerRef.current.exp += 50;
              setMessage("経験値を50獲得！");
            }
            itemsRef.current.splice(index, 1);
          }

          ctx.globalAlpha = 1;
        }
      });

      // Attack (space key)
      if (keysRef.current.has("Space")) {
        keysRef.current.delete("Space");
        enemiesRef.current.forEach((enemy, index) => {
          const dx = enemy.x - player.x;
          const dy = enemy.y - player.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 1.5) {
            const damage = 20 + player.level * 5;
            enemy.health -= damage;
            setMessage(`${ENEMY_TYPES[enemy.type].name}に${damage}ダメージ！`);

            if (enemy.health <= 0) {
              const exp = ENEMY_TYPES[enemy.type].exp;
              playerRef.current.exp += exp;
              setMessage(
                `${ENEMY_TYPES[enemy.type].name}を倒した！ EXP+${exp}`,
              );
              enemiesRef.current.splice(index, 1);

              // Level up check
              if (playerRef.current.exp >= playerRef.current.level * 100) {
                playerRef.current.level++;
                playerRef.current.maxHealth += 20;
                playerRef.current.health = playerRef.current.maxHealth;
                setMessage(`レベルアップ！ Lv.${playerRef.current.level}`);
              }
            }
          }
        });
      }

      // Draw UI overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(10, 10, 200, 80);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.strokeRect(10, 10, 200, 80);

      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(
        `Lv.${player.level}  EXP: ${player.exp}/${player.level * 100}`,
        20,
        35,
      );

      // Health bar
      ctx.fillStyle = "#374151";
      ctx.fillRect(20, 50, 180, 16);
      ctx.fillStyle = player.health > 30 ? "#22c55e" : "#ef4444";
      ctx.fillRect(20, 50, 180 * (player.health / player.maxHealth), 16);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(`HP: ${player.health}/${player.maxHealth}`, 25, 63);

      // Minimap
      const mapSize = 120;
      const mapScale = mapSize / MAP_DATA.length;
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(
        canvasSize.width - mapSize - 20,
        10,
        mapSize + 10,
        mapSize + 10,
      );

      MAP_DATA.forEach((row, y) => {
        row.forEach((cell, x) => {
          const mx = canvasSize.width - mapSize - 15 + x * mapScale;
          const my = 15 + y * mapScale;
          if (cell === 1) {
            ctx.fillStyle = "#4f46e5";
          } else if (cell === 4) {
            ctx.fillStyle = "#fbbf24";
          } else {
            ctx.fillStyle = "#1f2937";
          }
          ctx.fillRect(mx, my, mapScale - 1, mapScale - 1);
        });
      });

      // Player on minimap
      const pmx = canvasSize.width - mapSize - 15 + player.x * mapScale;
      const pmy = 15 + player.y * mapScale;
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.arc(pmx, pmy, 3, 0, Math.PI * 2);
      ctx.fill();

      // Direction indicator
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pmx, pmy);
      ctx.lineTo(
        pmx + Math.cos(player.angle) * 8,
        pmy + Math.sin(player.angle) * 8,
      );
      ctx.stroke();

      // Enemies on minimap
      enemiesRef.current.forEach((enemy) => {
        const emx = canvasSize.width - mapSize - 15 + enemy.x * mapScale;
        const emy = 15 + enemy.y * mapScale;
        ctx.fillStyle = ENEMY_TYPES[enemy.type].color;
        ctx.beginPath();
        ctx.arc(emx, emy, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [gameState, canvasSize, checkWallCollision, castRay]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(
          e.code,
        )
      ) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Touch controls
  const [touchStart, setTouchStart] = useState<Position | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;

    keysRef.current.delete("KeyW");
    keysRef.current.delete("KeyS");
    keysRef.current.delete("KeyA");
    keysRef.current.delete("KeyD");

    if (dy < -30) keysRef.current.add("KeyW");
    if (dy > 30) keysRef.current.add("KeyS");
    if (dx < -30) keysRef.current.add("KeyA");
    if (dx > 30) keysRef.current.add("KeyD");
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
    keysRef.current.clear();
  };

  const handleAttack = () => {
    keysRef.current.add("Space");
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <h2 className={styles.sectionTitle}>ダンジョン探索</h2>

      <div className={styles.canvasWrapper}>
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className={styles.canvas}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {gameState === "title" && (
          <div className={styles.overlay}>
            <h3 className={styles.gameTitle}>ダンジョン RPG</h3>
            <p className={styles.instructions}>
              PC: WASD / 矢印キーで移動、スペースで攻撃
              <br />
              スマホ: スワイプで移動、攻撃ボタンで攻撃
            </p>
            <p className={styles.goal}>
              ゴールを目指して敵を倒しながら進もう！
            </p>
            <button className={styles.startButton} onClick={initGame}>
              冒険を始める
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div className={styles.overlay}>
            <h3 className={styles.gameOverTitle}>ゲームオーバー</h3>
            <p className={styles.finalScore}>
              到達レベル: {playerRef.current.level}
            </p>
            <button className={styles.startButton} onClick={initGame}>
              もう一度挑戦
            </button>
          </div>
        )}

        {gameState === "clear" && (
          <div className={styles.overlay}>
            <h3 className={styles.clearTitle}>クリア！</h3>
            <p className={styles.finalScore}>
              最終レベル: {playerRef.current.level}
              <br />
              獲得EXP: {playerRef.current.exp}
            </p>
            <button className={styles.startButton} onClick={initGame}>
              もう一度プレイ
            </button>
          </div>
        )}
      </div>

      {gameState === "playing" && (
        <>
          {message && <div className={styles.message}>{message}</div>}
          <div className={styles.mobileControls}>
            <button className={styles.attackButton} onClick={handleAttack}>
              ⚔️ 攻撃
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(DungeonRPG);
