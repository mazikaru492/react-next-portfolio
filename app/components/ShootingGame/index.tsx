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
  angle: number;
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
  type: "ghost" | "demon" | "reaper";
  lastAttack: number;
  animPhase: number;
  targetX: number;
  targetY: number;
}

interface Projectile {
  id: number;
  x: number;
  y: number;
  angle: number;
  isEnemy: boolean;
  damage: number;
}

interface BloodSplatter {
  x: number;
  y: number;
  size: number;
  alpha: number;
}

interface Item {
  id: number;
  x: number;
  y: number;
  type: "health" | "exp";
}

// ホラーマップ（1=壁、0=通路、2=敵スポーン、3=アイテム、4=ゴール）
const MAP_DATA = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 2, 0, 0, 1, 0, 1, 3, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 3, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 2, 2, 0, 0, 0, 4, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const MOVE_SPEED = 0.03;
const ROTATION_SPEED = 0.025;
const FOV = Math.PI / 3;
const PROJECTILE_SPEED = 0.15;
const ATTACK_RANGE = 6;
const ATTACK_COOLDOWN = 500;
const ENEMY_DETECTION_RANGE = 5; // 敵がプレイヤーを追跡する距離

// ホラー敵タイプ
const ENEMY_TYPES = {
  ghost: {
    health: 40,
    damage: 12,
    exp: 30,
    color: "#94a3b8",
    name: "亡霊",
    speed: 0.012,
    attackRange: 4,
    attackCooldown: 2500,
  },
  demon: {
    health: 70,
    damage: 18,
    exp: 60,
    color: "#dc2626",
    name: "悪魔",
    speed: 0.018,
    attackRange: 3.5,
    attackCooldown: 2000,
  },
  reaper: {
    health: 120,
    damage: 30,
    exp: 120,
    color: "#1e1b4b",
    name: "死神",
    speed: 0.01,
    attackRange: 5,
    attackCooldown: 3000,
  },
};

// ==========================================
// Main Component
// ==========================================

const HorrorDungeon = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());
  const idCounterRef = useRef<number>(0);
  const lastAttackRef = useRef<number>(0);

  const [canvasSize, setCanvasSize] = useState({ width: 1000, height: 500 });
  const [gameState, setGameState] = useState<
    "title" | "playing" | "gameover" | "clear"
  >("title");
  const [message, setMessage] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [finalStats, setFinalStats] = useState({ level: 1, exp: 0 });
  const [screenFlash, setScreenFlash] = useState<string | null>(null);

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
  const projectilesRef = useRef<Projectile[]>([]);
  const bloodRef = useRef<BloodSplatter[]>([]);
  const itemsRef = useRef<Item[]>([]);

  // Resize handler
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 32;
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);

        const width = Math.min(containerWidth, mobile ? 600 : 1200);
        const height = mobile
          ? Math.min(350, width * 0.6)
          : Math.min(550, width * 0.5);
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

    enemiesRef.current = [];
    projectilesRef.current = [];
    bloodRef.current = [];
    itemsRef.current = [];

    MAP_DATA.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 2) {
          const types: Array<"ghost" | "demon" | "reaper"> = [
            "ghost",
            "demon",
            "reaper",
          ];
          const rand = Math.random();
          const type = rand < 0.5 ? "ghost" : rand < 0.85 ? "demon" : "reaper";
          enemiesRef.current.push({
            id: idCounterRef.current++,
            x: x + 0.5,
            y: y + 0.5,
            health: ENEMY_TYPES[type].health,
            maxHealth: ENEMY_TYPES[type].health,
            type,
            lastAttack: 0,
            animPhase: Math.random() * Math.PI * 2,
            targetX: x + 0.5,
            targetY: y + 0.5,
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

  // Check wall collision
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

  // Cast ray
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

  // Player attack (ranged)
  const playerAttack = useCallback(() => {
    const now = Date.now();
    if (now - lastAttackRef.current < ATTACK_COOLDOWN) return;

    lastAttackRef.current = now;
    const player = playerRef.current;
    const damage = 25 + player.level * 8;

    projectilesRef.current.push({
      id: idCounterRef.current++,
      x: player.x,
      y: player.y,
      angle: player.angle,
      isEnemy: false,
      damage,
    });

    setScreenFlash("rgba(139, 0, 0, 0.2)");
    setTimeout(() => setScreenFlash(null), 50);
  }, []);

  // Draw horror enemy
  const drawEnemy = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      enemy: Enemy,
      screenX: number,
      size: number,
      fogFactor: number,
      time: number,
    ) => {
      const float = Math.sin(time * 0.003 + enemy.animPhase) * 4;
      const centerY = ctx.canvas.height / 2 + float;

      ctx.save();
      ctx.globalAlpha = fogFactor;

      if (enemy.type === "ghost") {
        // 亡霊 - 透明な幽霊
        const gradient = ctx.createRadialGradient(
          screenX,
          centerY - size * 0.1,
          0,
          screenX,
          centerY,
          size / 2,
        );
        gradient.addColorStop(0, "rgba(200, 200, 220, 0.8)");
        gradient.addColorStop(0.5, "rgba(148, 163, 184, 0.5)");
        gradient.addColorStop(1, "rgba(100, 116, 139, 0.2)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(screenX, centerY, size / 2, size / 1.8, 0, 0, Math.PI * 2);
        ctx.fill();

        // 空洞の目
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.ellipse(
          screenX - size / 5,
          centerY - size / 8,
          size / 10,
          size / 7,
          0,
          0,
          Math.PI * 2,
        );
        ctx.ellipse(
          screenX + size / 5,
          centerY - size / 8,
          size / 10,
          size / 7,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();

        // 叫ぶ口
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.ellipse(
          screenX,
          centerY + size / 6,
          size / 8,
          size / 5,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      } else if (enemy.type === "demon") {
        // 悪魔 - 赤い肌、角
        const gradient = ctx.createRadialGradient(
          screenX,
          centerY,
          0,
          screenX,
          centerY,
          size / 2,
        );
        gradient.addColorStop(0, "#ef4444");
        gradient.addColorStop(0.7, "#dc2626");
        gradient.addColorStop(1, "#7f1d1d");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(screenX, centerY, size / 2.2, 0, Math.PI * 2);
        ctx.fill();

        // 角
        ctx.fillStyle = "#1c1917";
        ctx.beginPath();
        ctx.moveTo(screenX - size / 3, centerY - size / 3);
        ctx.lineTo(screenX - size / 5, centerY - size / 1.5);
        ctx.lineTo(screenX - size / 6, centerY - size / 3);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(screenX + size / 3, centerY - size / 3);
        ctx.lineTo(screenX + size / 5, centerY - size / 1.5);
        ctx.lineTo(screenX + size / 6, centerY - size / 3);
        ctx.fill();

        // 光る目
        ctx.fillStyle = "#fbbf24";
        ctx.shadowColor = "#fbbf24";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(
          screenX - size / 6,
          centerY - size / 10,
          size / 12,
          0,
          Math.PI * 2,
        );
        ctx.arc(
          screenX + size / 6,
          centerY - size / 10,
          size / 12,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.shadowBlur = 0;

        // 牙
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.moveTo(screenX - size / 8, centerY + size / 8);
        ctx.lineTo(screenX - size / 12, centerY + size / 3);
        ctx.lineTo(screenX - size / 20, centerY + size / 8);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(screenX + size / 8, centerY + size / 8);
        ctx.lineTo(screenX + size / 12, centerY + size / 3);
        ctx.lineTo(screenX + size / 20, centerY + size / 8);
        ctx.fill();
      } else if (enemy.type === "reaper") {
        // 死神 - 黒いローブ
        const gradient = ctx.createRadialGradient(
          screenX,
          centerY,
          0,
          screenX,
          centerY,
          size / 2,
        );
        gradient.addColorStop(0, "#1e1b4b");
        gradient.addColorStop(0.5, "#0f0e23");
        gradient.addColorStop(1, "#000");

        // ローブ
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(screenX, centerY - size / 2);
        ctx.quadraticCurveTo(
          screenX + size / 1.5,
          centerY,
          screenX + size / 2,
          centerY + size / 2,
        );
        ctx.lineTo(screenX - size / 2, centerY + size / 2);
        ctx.quadraticCurveTo(
          screenX - size / 1.5,
          centerY,
          screenX,
          centerY - size / 2,
        );
        ctx.fill();

        // フード内の闇
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.ellipse(
          screenX,
          centerY - size / 6,
          size / 4,
          size / 3,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();

        // 光る目
        ctx.fillStyle = "#ef4444";
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(
          screenX - size / 8,
          centerY - size / 5,
          size / 15,
          0,
          Math.PI * 2,
        );
        ctx.arc(
          screenX + size / 8,
          centerY - size / 5,
          size / 15,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Health bar
      const barWidth = size * 0.9;
      const barHeight = Math.max(4, size / 15);
      const barY = centerY - size / 2 - 20;

      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(
        screenX - barWidth / 2 - 2,
        barY - 2,
        barWidth + 4,
        barHeight + 4,
      );
      ctx.fillStyle = "#1f2937";
      ctx.fillRect(screenX - barWidth / 2, barY, barWidth, barHeight);

      const healthPercent = enemy.health / enemy.maxHealth;
      ctx.fillStyle = "#dc2626";
      ctx.fillRect(
        screenX - barWidth / 2,
        barY,
        barWidth * healthPercent,
        barHeight,
      );

      ctx.restore();
    },
    [],
  );

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const rayCount = isMobile ? 80 : 120;

    const gameLoop = (time: number) => {
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
      if (keysRef.current.has("Space")) {
        keysRef.current.delete("Space");
        playerAttack();
      }

      // Check goal
      const goalX = Math.floor(player.x);
      const goalY = Math.floor(player.y);
      if (MAP_DATA[goalY]?.[goalX] === 4) {
        setFinalStats({ level: player.level, exp: player.exp });
        setGameState("clear");
        return;
      }

      // Clear canvas - dark horror theme
      ctx.fillStyle = "#0a0505";
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      // Blood red sky
      const skyGradient = ctx.createLinearGradient(
        0,
        0,
        0,
        canvasSize.height / 2,
      );
      skyGradient.addColorStop(0, "#0a0000");
      skyGradient.addColorStop(0.5, "#1a0505");
      skyGradient.addColorStop(1, "#2a0a0a");
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height / 2);

      // Dark floor
      const floorGradient = ctx.createLinearGradient(
        0,
        canvasSize.height / 2,
        0,
        canvasSize.height,
      );
      floorGradient.addColorStop(0, "#1a1010");
      floorGradient.addColorStop(1, "#050202");
      ctx.fillStyle = floorGradient;
      ctx.fillRect(
        0,
        canvasSize.height / 2,
        canvasSize.width,
        canvasSize.height / 2,
      );

      // Raycasting
      const rayWidth = canvasSize.width / rayCount;

      for (let i = 0; i < rayCount; i++) {
        const rayAngle = player.angle - FOV / 2 + (i / rayCount) * FOV;
        const { distance, wallType, side } = castRay(
          player.x,
          player.y,
          rayAngle,
        );

        const correctedDistance = distance * Math.cos(rayAngle - player.angle);
        const wallHeight = Math.min(
          canvasSize.height * 1.2,
          (canvasSize.height / correctedDistance) * 0.9,
        );
        const wallTop = (canvasSize.height - wallHeight) / 2;

        const fogFactor = Math.max(0.1, 1 - correctedDistance / 10);
        const sideFactor = side === 0 ? 1 : 0.7;

        let r: number, g: number, b: number;
        if (wallType === 4) {
          // ゴール - 暗い金色
          r = 180;
          g = 130;
          b = 20;
        } else {
          // ホラー壁 - 暗い赤/茶色
          r = side === 0 ? 60 : 45;
          g = side === 0 ? 20 : 15;
          b = side === 0 ? 20 : 15;
        }

        r = Math.floor(r * fogFactor * sideFactor);
        g = Math.floor(g * fogFactor * sideFactor);
        b = Math.floor(b * fogFactor * sideFactor);

        const wallGradient = ctx.createLinearGradient(
          0,
          wallTop,
          0,
          wallTop + wallHeight,
        );
        wallGradient.addColorStop(0, `rgb(${r + 15}, ${g + 10}, ${b + 10})`);
        wallGradient.addColorStop(0.5, `rgb(${r}, ${g}, ${b})`);
        wallGradient.addColorStop(
          1,
          `rgb(${Math.max(0, r - 20)}, ${Math.max(0, g - 10)}, ${Math.max(0, b - 10)})`,
        );

        ctx.fillStyle = wallGradient;
        ctx.fillRect(i * rayWidth, wallTop, rayWidth + 1, wallHeight);
      }

      // Update and render enemies with AI
      enemiesRef.current.forEach((enemy) => {
        const enemyData = ENEMY_TYPES[enemy.type];
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distToPlayer = Math.sqrt(dx * dx + dy * dy);

        // 視線チェック - 敵とプレイヤーの間に壁があるか
        const canSeePlayer = (() => {
          const steps = Math.ceil(distToPlayer * 4);
          for (let i = 1; i < steps; i++) {
            const checkX = enemy.x + (dx / steps) * i;
            const checkY = enemy.y + (dy / steps) * i;
            if (checkWallCollision(checkX, checkY)) return false;
          }
          return true;
        })();

        // AI: 移動 - 視線が通り、検知距離内の場合のみ追尾
        const shouldChase =
          canSeePlayer &&
          distToPlayer < ENEMY_DETECTION_RANGE &&
          distToPlayer > 1.2;

        if (shouldChase) {
          const moveAngle = Math.atan2(dy, dx);
          const newX = enemy.x + Math.cos(moveAngle) * enemyData.speed;
          const newY = enemy.y + Math.sin(moveAngle) * enemyData.speed;

          if (!checkWallCollision(newX, enemy.y)) enemy.x = newX;
          if (!checkWallCollision(enemy.x, newY)) enemy.y = newY;
        }

        // AI: 攻撃 - 遠距離攻撃
        if (
          distToPlayer < enemyData.attackRange &&
          now - enemy.lastAttack > enemyData.attackCooldown
        ) {
          enemy.lastAttack = now;
          const attackAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.2;

          projectilesRef.current.push({
            id: idCounterRef.current++,
            x: enemy.x,
            y: enemy.y,
            angle: attackAngle,
            isEnemy: true,
            damage: enemyData.damage,
          });
        }

        // 描画
        let angle = Math.atan2(dy, dx) - player.angle;
        while (angle < -Math.PI) angle += Math.PI * 2;
        while (angle > Math.PI) angle -= Math.PI * 2;

        if (Math.abs(angle) < FOV / 2 + 0.1 && distToPlayer < 10) {
          const screenX =
            canvasSize.width / 2 + (angle / (FOV / 2)) * (canvasSize.width / 2);
          const size = Math.min(350, (canvasSize.height / distToPlayer) * 0.55);
          const fogFactor = Math.max(0.2, 1 - distToPlayer / 10);

          drawEnemy(ctx, enemy, screenX, size, fogFactor, time);
        }
      });

      // Update projectiles
      projectilesRef.current = projectilesRef.current.filter((proj) => {
        proj.x += Math.cos(proj.angle) * PROJECTILE_SPEED;
        proj.y += Math.sin(proj.angle) * PROJECTILE_SPEED;

        // 壁との衝突
        if (checkWallCollision(proj.x, proj.y)) return false;

        // プレイヤーの弾 -> 敵
        if (!proj.isEnemy) {
          for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
            const enemy = enemiesRef.current[i];
            const dist = Math.sqrt(
              (proj.x - enemy.x) ** 2 + (proj.y - enemy.y) ** 2,
            );

            if (dist < 0.5) {
              enemy.health -= proj.damage;
              bloodRef.current.push({
                x: enemy.x,
                y: enemy.y,
                size: 20,
                alpha: 1,
              });

              setMessage(
                `${ENEMY_TYPES[enemy.type].name}に ${proj.damage} ダメージ`,
              );

              if (enemy.health <= 0) {
                const exp = ENEMY_TYPES[enemy.type].exp;
                playerRef.current.exp += exp;
                setMessage(
                  `${ENEMY_TYPES[enemy.type].name}を倒した [+${exp} EXP]`,
                );
                enemiesRef.current.splice(i, 1);

                if (playerRef.current.exp >= playerRef.current.level * 100) {
                  playerRef.current.level++;
                  playerRef.current.maxHealth += 15;
                  playerRef.current.health = playerRef.current.maxHealth;
                  setMessage(`LEVEL UP - Lv.${playerRef.current.level}`);
                }
              }
              return false;
            }
          }
        }

        // 敵の弾 -> プレイヤー
        if (proj.isEnemy) {
          const dist = Math.sqrt(
            (proj.x - player.x) ** 2 + (proj.y - player.y) ** 2,
          );

          if (dist < 0.4) {
            playerRef.current.health -= proj.damage;
            setScreenFlash("rgba(200, 0, 0, 0.4)");
            setTimeout(() => setScreenFlash(null), 100);
            setMessage(`${proj.damage} ダメージを受けた`);

            if (playerRef.current.health <= 0) {
              setFinalStats({ level: player.level, exp: player.exp });
              setGameState("gameover");
            }
            return false;
          }
        }

        // 弾丸を描画（視界内の場合）
        const dx = proj.x - player.x;
        const dy = proj.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let projAngle = Math.atan2(dy, dx) - player.angle;
        while (projAngle < -Math.PI) projAngle += Math.PI * 2;
        while (projAngle > Math.PI) projAngle -= Math.PI * 2;

        if (Math.abs(projAngle) < FOV / 2 && dist < 10 && dist > 0.3) {
          const screenX =
            canvasSize.width / 2 +
            (projAngle / (FOV / 2)) * (canvasSize.width / 2);
          const size = Math.min(30, (canvasSize.height / dist) * 0.1);

          ctx.fillStyle = proj.isEnemy ? "#ef4444" : "#fbbf24";
          ctx.shadowColor = proj.isEnemy ? "#ef4444" : "#fbbf24";
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(screenX, canvasSize.height / 2, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        return dist < 15;
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
          const size = Math.min(60, (canvasSize.height / distance) * 0.2);
          const fogFactor = Math.max(0.3, 1 - distance / 6);
          const floatY = Math.sin(time * 0.004 + item.id) * 5;

          ctx.globalAlpha = fogFactor;
          ctx.fillStyle = item.type === "health" ? "#22c55e" : "#fbbf24";
          ctx.shadowColor = item.type === "health" ? "#22c55e" : "#fbbf24";
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(
            screenX,
            canvasSize.height / 2 + size + floatY,
            size / 2,
            0,
            Math.PI * 2,
          );
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;

          if (distance < 0.8) {
            if (item.type === "health") {
              playerRef.current.health = Math.min(
                playerRef.current.maxHealth,
                playerRef.current.health + 40,
              );
              setMessage("HP +40");
            } else {
              playerRef.current.exp += 60;
              setMessage("EXP +60");
            }
            itemsRef.current.splice(index, 1);
          }
        }
      });

      // Vignette effect
      const vignette = ctx.createRadialGradient(
        canvasSize.width / 2,
        canvasSize.height / 2,
        canvasSize.height * 0.3,
        canvasSize.width / 2,
        canvasSize.height / 2,
        canvasSize.width * 0.7,
      );
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.7)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      // Screen flash
      if (screenFlash) {
        ctx.fillStyle = screenFlash;
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
      }

      // UI - Status
      const panelWidth = isMobile ? 140 : 200;
      const panelHeight = isMobile ? 60 : 80;

      ctx.fillStyle = "rgba(20, 5, 5, 0.85)";
      ctx.strokeStyle = "rgba(139, 0, 0, 0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(10, 10, panelWidth, panelHeight, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#dc2626";
      ctx.font = `bold ${isMobile ? 11 : 14}px sans-serif`;
      ctx.fillText(`LV.${player.level}`, 20, isMobile ? 28 : 32);

      ctx.fillStyle = "#9ca3af";
      ctx.font = `${isMobile ? 9 : 11}px sans-serif`;
      ctx.fillText(
        `EXP ${player.exp}/${player.level * 100}`,
        isMobile ? 55 : 70,
        isMobile ? 28 : 32,
      );

      // HP Bar
      const hpBarY = isMobile ? 38 : 48;
      const hpBarWidth = panelWidth - 20;
      const hpBarHeight = isMobile ? 12 : 16;

      ctx.fillStyle = "#1c1917";
      ctx.fillRect(20, hpBarY, hpBarWidth, hpBarHeight);

      const hpPercent = player.health / player.maxHealth;
      const hpGradient = ctx.createLinearGradient(
        20,
        0,
        20 + hpBarWidth * hpPercent,
        0,
      );
      hpGradient.addColorStop(0, "#dc2626");
      hpGradient.addColorStop(1, "#7f1d1d");
      ctx.fillStyle = hpGradient;
      ctx.fillRect(20, hpBarY, hpBarWidth * hpPercent, hpBarHeight);

      ctx.fillStyle = "#fff";
      ctx.font = `bold ${isMobile ? 9 : 11}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(
        `${player.health}/${player.maxHealth}`,
        20 + hpBarWidth / 2,
        hpBarY + hpBarHeight - 3,
      );
      ctx.textAlign = "left";

      // Minimap
      const mapSize = isMobile ? 70 : 100;
      const mapScale = mapSize / MAP_DATA.length;
      const mapX = canvasSize.width - mapSize - 15;

      ctx.fillStyle = "rgba(20, 5, 5, 0.9)";
      ctx.strokeStyle = "rgba(139, 0, 0, 0.5)";
      ctx.beginPath();
      ctx.roundRect(mapX - 5, 5, mapSize + 10, mapSize + 10, 6);
      ctx.fill();
      ctx.stroke();

      MAP_DATA.forEach((row, y) => {
        row.forEach((cell, x) => {
          const mx = mapX + x * mapScale;
          const my = 10 + y * mapScale;
          if (cell === 1) {
            ctx.fillStyle = "#3f1515";
          } else if (cell === 4) {
            ctx.fillStyle = "#b45309";
          } else {
            ctx.fillStyle = "#1a0a0a";
          }
          ctx.fillRect(mx, my, mapScale - 0.5, mapScale - 0.5);
        });
      });

      // Player & enemies on minimap
      const pmx = mapX + player.x * mapScale;
      const pmy = 10 + player.y * mapScale;
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.arc(pmx, pmy, 2, 0, Math.PI * 2);
      ctx.fill();

      enemiesRef.current.forEach((enemy) => {
        const emx = mapX + enemy.x * mapScale;
        const emy = 10 + enemy.y * mapScale;
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(emx, emy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Crosshair
      const cx = canvasSize.width / 2;
      const cy = canvasSize.height / 2;
      ctx.strokeStyle = "rgba(220, 38, 38, 0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy);
      ctx.lineTo(cx - 5, cy);
      ctx.moveTo(cx + 5, cy);
      ctx.lineTo(cx + 15, cy);
      ctx.moveTo(cx, cy - 15);
      ctx.lineTo(cx, cy - 5);
      ctx.moveTo(cx, cy + 5);
      ctx.lineTo(cx, cy + 15);
      ctx.stroke();

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [
    gameState,
    canvasSize,
    isMobile,
    checkWallCollision,
    castRay,
    drawEnemy,
    playerAttack,
    screenFlash,
  ]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "Space",
          "KeyW",
          "KeyA",
          "KeyS",
          "KeyD",
        ].includes(e.code)
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

    if (dy < -20) keysRef.current.add("KeyW");
    if (dy > 20) keysRef.current.add("KeyS");
    if (dx < -20) keysRef.current.add("KeyA");
    if (dx > 20) keysRef.current.add("KeyD");
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
    keysRef.current.clear();
  };

  const handleAttack = () => {
    playerAttack();
  };

  return (
    <div ref={containerRef} className={styles.horrorContainer}>
      <h2 className={styles.horrorTitle}>ESCAPE FROM DARKNESS</h2>

      <div className={styles.horrorCanvasWrapper}>
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
          <div className={styles.horrorOverlay}>
            <h3 className={styles.horrorGameTitle}>ESCAPE FROM DARKNESS</h3>
            <p className={styles.horrorInstructions}>
              {isMobile ? (
                <>
                  スワイプで移動
                  <br />
                  SHOOTボタンで攻撃
                </>
              ) : (
                <>
                  WASD / 矢印キーで移動
                  <br />
                  スペースキーで攻撃
                </>
              )}
            </p>
            <p className={styles.horrorWarning}>闇から逃げ出せ...</p>
            <button className={styles.horrorStartButton} onClick={initGame}>
              ENTER
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div className={styles.horrorOverlay}>
            <h3 className={styles.horrorDeathTitle}>YOU DIED</h3>
            <p className={styles.horrorFinalScore}>LEVEL: {finalStats.level}</p>
            <button className={styles.horrorStartButton} onClick={initGame}>
              TRY AGAIN
            </button>
          </div>
        )}

        {gameState === "clear" && (
          <div className={styles.horrorOverlay}>
            <h3 className={styles.horrorClearTitle}>ESCAPED</h3>
            <p className={styles.horrorFinalScore}>
              LEVEL: {finalStats.level}
              <br />
              EXP: {finalStats.exp}
            </p>
            <button className={styles.horrorStartButton} onClick={initGame}>
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      {gameState === "playing" && (
        <>
          {message && <div className={styles.horrorMessage}>{message}</div>}
          <div className={styles.horrorMobileControls}>
            <div className={styles.horrorTouchPad}>
              <span>MOVE</span>
            </div>
            <button
              className={styles.horrorAttackButton}
              onClick={handleAttack}
            >
              SHOOT
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(HorrorDungeon);
