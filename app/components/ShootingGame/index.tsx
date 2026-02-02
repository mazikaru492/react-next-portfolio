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
  type: "slime" | "skeleton" | "dragon";
  lastAttack: number;
  animPhase: number;
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

const MOVE_SPEED = 0.06;
const ROTATION_SPEED = 0.04;
const FOV = Math.PI / 3;

const ENEMY_TYPES = {
  slime: { health: 30, damage: 5, exp: 20, color: "#22c55e", name: "スライム" },
  skeleton: {
    health: 50,
    damage: 10,
    exp: 40,
    color: "#e2e8f0",
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
// Utility: Create brick texture pattern
// ==========================================
const createBrickPattern = (
  ctx: CanvasRenderingContext2D,
  baseColor: string,
  isDark: boolean,
): CanvasPattern | string => {
  const patternCanvas = document.createElement("canvas");
  patternCanvas.width = 32;
  patternCanvas.height = 32;
  const pCtx = patternCanvas.getContext("2d");
  if (!pCtx) return baseColor;

  // Base color
  pCtx.fillStyle = baseColor;
  pCtx.fillRect(0, 0, 32, 32);

  // Brick pattern
  pCtx.strokeStyle = isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.15)";
  pCtx.lineWidth = 1;

  // Horizontal lines
  pCtx.beginPath();
  pCtx.moveTo(0, 8);
  pCtx.lineTo(32, 8);
  pCtx.moveTo(0, 16);
  pCtx.lineTo(32, 16);
  pCtx.moveTo(0, 24);
  pCtx.lineTo(32, 24);
  pCtx.stroke();

  // Vertical lines (staggered)
  pCtx.beginPath();
  pCtx.moveTo(8, 0);
  pCtx.lineTo(8, 8);
  pCtx.moveTo(24, 0);
  pCtx.lineTo(24, 8);
  pCtx.moveTo(0, 8);
  pCtx.lineTo(0, 16);
  pCtx.moveTo(16, 8);
  pCtx.lineTo(16, 16);
  pCtx.moveTo(8, 16);
  pCtx.lineTo(8, 24);
  pCtx.moveTo(24, 16);
  pCtx.lineTo(24, 24);
  pCtx.moveTo(0, 24);
  pCtx.lineTo(0, 32);
  pCtx.moveTo(16, 24);
  pCtx.lineTo(16, 32);
  pCtx.stroke();

  // Add noise for texture
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 32;
    const y = Math.random() * 32;
    pCtx.fillStyle = `rgba(${Math.random() > 0.5 ? 255 : 0}, ${Math.random() > 0.5 ? 255 : 0}, ${Math.random() > 0.5 ? 255 : 0}, 0.03)`;
    pCtx.fillRect(x, y, 1, 1);
  }

  return ctx.createPattern(patternCanvas, "repeat") || baseColor;
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
  const patternsRef = useRef<{
    wall: CanvasPattern | string;
    wallDark: CanvasPattern | string;
    goal: CanvasPattern | string;
  } | null>(null);

  const [canvasSize, setCanvasSize] = useState({ width: 1000, height: 500 });
  const [gameState, setGameState] = useState<
    "title" | "playing" | "gameover" | "clear"
  >("title");
  const [message, setMessage] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [finalStats, setFinalStats] = useState({ level: 1, exp: 0 });

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

  // Initialize patterns
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && !patternsRef.current) {
      patternsRef.current = {
        wall: createBrickPattern(ctx, "#4338ca", false),
        wallDark: createBrickPattern(ctx, "#312e81", true),
        goal: createBrickPattern(ctx, "#b45309", false),
      };
    }
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
    itemsRef.current = [];

    MAP_DATA.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 2) {
          const types: Array<"slime" | "skeleton"> = ["slime", "skeleton"];
          const type = types[Math.floor(Math.random() * 2)];
          enemiesRef.current.push({
            id: idCounterRef.current++,
            x: x + 0.5,
            y: y + 0.5,
            health: ENEMY_TYPES[type].health,
            maxHealth: ENEMY_TYPES[type].health,
            type,
            lastAttack: 0,
            animPhase: Math.random() * Math.PI * 2,
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

  // Cast a single ray with texture coordinate
  const castRay = useCallback(
    (
      startX: number,
      startY: number,
      angle: number,
    ): { distance: number; wallType: number; side: number; texX: number } => {
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
      let wallX: number;

      if (side === 0) {
        distance = (mapX - startX + (1 - stepX) / 2) / rayDirX;
        wallX = startY + distance * rayDirY;
      } else {
        distance = (mapY - startY + (1 - stepY) / 2) / rayDirY;
        wallX = startX + distance * rayDirX;
      }
      wallX -= Math.floor(wallX);

      const wallType =
        mapY >= 0 &&
        mapY < MAP_DATA.length &&
        mapX >= 0 &&
        mapX < MAP_DATA[0].length
          ? MAP_DATA[mapY][mapX]
          : 1;

      return { distance: Math.max(0.1, distance), wallType, side, texX: wallX };
    },
    [],
  );

  // Draw enemy sprite
  const drawEnemy = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      enemy: Enemy,
      screenX: number,
      size: number,
      fogFactor: number,
      time: number,
    ) => {
      const enemyData = ENEMY_TYPES[enemy.type];
      const bounce = Math.sin(time * 0.005 + enemy.animPhase) * 3;

      ctx.save();
      ctx.globalAlpha = fogFactor;

      if (enemy.type === "slime") {
        // Slime body with gradient
        const gradient = ctx.createRadialGradient(
          screenX,
          ctx.canvas.height / 2 + bounce - size * 0.1,
          size * 0.1,
          screenX,
          ctx.canvas.height / 2 + bounce,
          size / 2,
        );
        gradient.addColorStop(0, "#4ade80");
        gradient.addColorStop(0.5, "#22c55e");
        gradient.addColorStop(1, "#15803d");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(
          screenX,
          ctx.canvas.height / 2 + bounce,
          size / 2,
          size / 2.5,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();

        // Shine
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.beginPath();
        ctx.ellipse(
          screenX - size / 5,
          ctx.canvas.height / 2 + bounce - size / 6,
          size / 8,
          size / 10,
          -0.3,
          0,
          Math.PI * 2,
        );
        ctx.fill();

        // Eyes
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.ellipse(
          screenX - size / 6,
          ctx.canvas.height / 2 + bounce - size / 10,
          size / 12,
          size / 10,
          0,
          0,
          Math.PI * 2,
        );
        ctx.ellipse(
          screenX + size / 6,
          ctx.canvas.height / 2 + bounce - size / 10,
          size / 12,
          size / 10,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();

        // Eye shine
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(
          screenX - size / 6 - 2,
          ctx.canvas.height / 2 + bounce - size / 10 - 2,
          size / 30,
          0,
          Math.PI * 2,
        );
        ctx.arc(
          screenX + size / 6 - 2,
          ctx.canvas.height / 2 + bounce - size / 10 - 2,
          size / 30,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      } else if (enemy.type === "skeleton") {
        // Skull
        const gradient = ctx.createRadialGradient(
          screenX,
          ctx.canvas.height / 2 - size * 0.2,
          size * 0.05,
          screenX,
          ctx.canvas.height / 2,
          size / 2,
        );
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(0.7, "#e2e8f0");
        gradient.addColorStop(1, "#94a3b8");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
          screenX,
          ctx.canvas.height / 2 - size * 0.15,
          size / 3,
          0,
          Math.PI * 2,
        );
        ctx.fill();

        // Eye sockets
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.ellipse(
          screenX - size / 8,
          ctx.canvas.height / 2 - size * 0.2,
          size / 10,
          size / 8,
          0,
          0,
          Math.PI * 2,
        );
        ctx.ellipse(
          screenX + size / 8,
          ctx.canvas.height / 2 - size * 0.2,
          size / 10,
          size / 8,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();

        // Red glowing eyes
        ctx.fillStyle = "#ef4444";
        ctx.shadowColor = "#ef4444";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(
          screenX - size / 8,
          ctx.canvas.height / 2 - size * 0.2,
          size / 20,
          0,
          Math.PI * 2,
        );
        ctx.arc(
          screenX + size / 8,
          ctx.canvas.height / 2 - size * 0.2,
          size / 20,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.shadowBlur = 0;

        // Nose
        ctx.fillStyle = "#475569";
        ctx.beginPath();
        ctx.moveTo(screenX, ctx.canvas.height / 2 - size * 0.1);
        ctx.lineTo(screenX - size / 20, ctx.canvas.height / 2);
        ctx.lineTo(screenX + size / 20, ctx.canvas.height / 2);
        ctx.fill();

        // Ribs/body
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = Math.max(2, size / 20);
        for (let i = 0; i < 4; i++) {
          const ribY = ctx.canvas.height / 2 + size * 0.1 + (i * size) / 10;
          ctx.beginPath();
          ctx.moveTo(screenX - size / 4, ribY);
          ctx.quadraticCurveTo(
            screenX,
            ribY + size / 30,
            screenX + size / 4,
            ribY,
          );
          ctx.stroke();
        }
      }

      // Health bar
      const barWidth = size * 0.9;
      const barHeight = Math.max(4, size / 15);
      const barY = ctx.canvas.height / 2 - size / 2 - 20;

      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(
        screenX - barWidth / 2 - 2,
        barY - 2,
        barWidth + 4,
        barHeight + 4,
      );
      ctx.fillStyle = "#374151";
      ctx.fillRect(screenX - barWidth / 2, barY, barWidth, barHeight);

      const healthPercent = enemy.health / enemy.maxHealth;
      const healthGradient = ctx.createLinearGradient(
        screenX - barWidth / 2,
        0,
        screenX - barWidth / 2 + barWidth * healthPercent,
        0,
      );
      healthGradient.addColorStop(
        0,
        healthPercent > 0.5
          ? "#22c55e"
          : healthPercent > 0.25
            ? "#eab308"
            : "#ef4444",
      );
      healthGradient.addColorStop(
        1,
        healthPercent > 0.5
          ? "#16a34a"
          : healthPercent > 0.25
            ? "#ca8a04"
            : "#dc2626",
      );
      ctx.fillStyle = healthGradient;
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
      const moveSpeed = MOVE_SPEED;
      const rotSpeed = ROTATION_SPEED;

      if (keysRef.current.has("ArrowUp") || keysRef.current.has("KeyW")) {
        const newX = player.x + Math.cos(player.angle) * moveSpeed;
        const newY = player.y + Math.sin(player.angle) * moveSpeed;
        if (!checkWallCollision(newX, player.y)) player.x = newX;
        if (!checkWallCollision(player.x, newY)) player.y = newY;
      }
      if (keysRef.current.has("ArrowDown") || keysRef.current.has("KeyS")) {
        const newX = player.x - Math.cos(player.angle) * moveSpeed;
        const newY = player.y - Math.sin(player.angle) * moveSpeed;
        if (!checkWallCollision(newX, player.y)) player.x = newX;
        if (!checkWallCollision(player.x, newY)) player.y = newY;
      }
      if (keysRef.current.has("ArrowLeft") || keysRef.current.has("KeyA")) {
        player.angle -= rotSpeed;
      }
      if (keysRef.current.has("ArrowRight") || keysRef.current.has("KeyD")) {
        player.angle += rotSpeed;
      }

      // Check goal
      const goalX = Math.floor(player.x);
      const goalY = Math.floor(player.y);
      if (MAP_DATA[goalY]?.[goalX] === 4) {
        setFinalStats({
          level: playerRef.current.level,
          exp: playerRef.current.exp,
        });
        setGameState("clear");
        return;
      }

      // Clear canvas
      ctx.fillStyle = "#050510";
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      // Draw sky with stars
      const skyGradient = ctx.createLinearGradient(
        0,
        0,
        0,
        canvasSize.height / 2,
      );
      skyGradient.addColorStop(0, "#0c0a1d");
      skyGradient.addColorStop(0.5, "#1e1b4b");
      skyGradient.addColorStop(1, "#312e81");
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height / 2);

      // Animated stars
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      for (let i = 0; i < 30; i++) {
        const x = (i * 73 + time * 0.002) % canvasSize.width;
        const y = (i * 17) % (canvasSize.height / 2);
        const size = 1 + Math.sin(time * 0.003 + i) * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw floor with perspective
      const floorGradient = ctx.createLinearGradient(
        0,
        canvasSize.height / 2,
        0,
        canvasSize.height,
      );
      floorGradient.addColorStop(0, "#1f2937");
      floorGradient.addColorStop(0.3, "#374151");
      floorGradient.addColorStop(1, "#111827");
      ctx.fillStyle = floorGradient;
      ctx.fillRect(
        0,
        canvasSize.height / 2,
        canvasSize.width,
        canvasSize.height / 2,
      );

      // Floor tiles pattern
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) {
        const y = canvasSize.height / 2 + i * 15 + ((time * 0.02) % 15);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasSize.width, y);
        ctx.stroke();
      }

      // Raycasting for walls
      const rayWidth = canvasSize.width / rayCount;
      const zBuffer: number[] = [];

      for (let i = 0; i < rayCount; i++) {
        const rayAngle = player.angle - FOV / 2 + (i / rayCount) * FOV;
        const { distance, wallType, side, texX } = castRay(
          player.x,
          player.y,
          rayAngle,
        );

        const correctedDistance = distance * Math.cos(rayAngle - player.angle);
        zBuffer[i] = correctedDistance;

        const wallHeight = Math.min(
          canvasSize.height * 1.2,
          (canvasSize.height / correctedDistance) * 0.9,
        );
        const wallTop = (canvasSize.height - wallHeight) / 2;

        // Wall shading based on distance and side
        const fogFactor = Math.max(0.15, 1 - correctedDistance / 12);
        const sideFactor = side === 0 ? 1 : 0.7;

        let r: number, g: number, b: number;
        if (wallType === 4) {
          // Goal - golden glow
          r = 251;
          g = 191;
          b = 36;
          ctx.shadowColor = "#fbbf24";
          ctx.shadowBlur = 20;
        } else {
          // Stone wall
          r = side === 0 ? 99 : 79;
          g = side === 0 ? 102 : 70;
          b = side === 0 ? 241 : 229;
        }

        // Apply fog
        r = Math.floor(r * fogFactor * sideFactor);
        g = Math.floor(g * fogFactor * sideFactor);
        b = Math.floor(b * fogFactor * sideFactor);

        // Draw wall stripe with vertical gradient for depth
        const wallGradient = ctx.createLinearGradient(
          0,
          wallTop,
          0,
          wallTop + wallHeight,
        );
        wallGradient.addColorStop(
          0,
          `rgb(${Math.min(255, r + 30)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 30)})`,
        );
        wallGradient.addColorStop(0.3, `rgb(${r}, ${g}, ${b})`);
        wallGradient.addColorStop(0.7, `rgb(${r}, ${g}, ${b})`);
        wallGradient.addColorStop(
          1,
          `rgb(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)})`,
        );

        ctx.fillStyle = wallGradient;
        ctx.fillRect(i * rayWidth, wallTop, rayWidth + 1, wallHeight);

        // Add brick texture lines
        if (correctedDistance < 5) {
          ctx.strokeStyle = `rgba(0, 0, 0, ${0.1 * fogFactor})`;
          ctx.lineWidth = 1;
          const brickHeight = wallHeight / 8;
          for (let j = 0; j < 8; j++) {
            const y = wallTop + j * brickHeight;
            ctx.beginPath();
            ctx.moveTo(i * rayWidth, y);
            ctx.lineTo(i * rayWidth + rayWidth, y);
            ctx.stroke();
          }
        }

        // Edge highlight
        if (i > 0 && Math.abs(zBuffer[i - 1] - correctedDistance) > 0.3) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * fogFactor})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(i * rayWidth, wallTop);
          ctx.lineTo(i * rayWidth, wallTop + wallHeight);
          ctx.stroke();
        }

        ctx.shadowBlur = 0;
      }

      // Draw enemies (sorted by distance)
      const enemiesWithDist = enemiesRef.current
        .map((enemy) => {
          const dx = enemy.x - player.x;
          const dy = enemy.y - player.y;
          return { enemy, distance: Math.sqrt(dx * dx + dy * dy) };
        })
        .sort((a, b) => b.distance - a.distance);

      enemiesWithDist.forEach(({ enemy, distance }) => {
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;

        let angle = Math.atan2(dy, dx) - player.angle;
        while (angle < -Math.PI) angle += Math.PI * 2;
        while (angle > Math.PI) angle -= Math.PI * 2;

        if (Math.abs(angle) < FOV / 2 + 0.1 && distance < 10) {
          const screenX =
            canvasSize.width / 2 + (angle / (FOV / 2)) * (canvasSize.width / 2);
          const size = Math.min(350, (canvasSize.height / distance) * 0.55);
          const fogFactor = Math.max(0.25, 1 - distance / 10);

          drawEnemy(ctx, enemy, screenX, size, fogFactor, time);

          // Enemy attacks player if close
          if (distance < 1.2 && now - enemy.lastAttack > 1000) {
            enemy.lastAttack = now;
            const enemyData = ENEMY_TYPES[enemy.type];
            playerRef.current.health -= enemyData.damage;
            setMessage(
              `${enemyData.name}の攻撃！ ${enemyData.damage}ダメージ！`,
            );

            if (playerRef.current.health <= 0) {
              setFinalStats({
                level: playerRef.current.level,
                exp: playerRef.current.exp,
              });
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
          const size = Math.min(80, (canvasSize.height / distance) * 0.25);
          const fogFactor = Math.max(0.3, 1 - distance / 6);

          ctx.globalAlpha = fogFactor;

          // Floating animation
          const floatY = Math.sin(time * 0.004 + item.id) * 5;

          // Glow effect
          const glowColor = item.type === "health" ? "#22c55e" : "#fbbf24";
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = 15;

          const itemGradient = ctx.createRadialGradient(
            screenX,
            canvasSize.height / 2 + size + floatY,
            0,
            screenX,
            canvasSize.height / 2 + size + floatY,
            size / 2,
          );
          itemGradient.addColorStop(
            0,
            item.type === "health" ? "#4ade80" : "#fcd34d",
          );
          itemGradient.addColorStop(1, glowColor);

          ctx.fillStyle = itemGradient;
          ctx.beginPath();
          ctx.arc(
            screenX,
            canvasSize.height / 2 + size + floatY,
            size / 2,
            0,
            Math.PI * 2,
          );
          ctx.fill();

          // Icon
          ctx.fillStyle = "#fff";
          ctx.font = `bold ${size / 2}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(
            item.type === "health" ? "+" : "★",
            screenX,
            canvasSize.height / 2 + size + floatY,
          );

          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;

          // Pickup
          if (distance < 0.8) {
            if (item.type === "health") {
              playerRef.current.health = Math.min(
                playerRef.current.maxHealth,
                playerRef.current.health + 30,
              );
              setMessage("体力を 30 回復した");
            } else {
              playerRef.current.exp += 50;
              setMessage("経験値を 50 獲得");
            }
            itemsRef.current.splice(index, 1);
          }
        }
      });

      // Attack (space key)
      if (keysRef.current.has("Space")) {
        keysRef.current.delete("Space");

        // Attack animation flash
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

        enemiesRef.current.forEach((enemy, index) => {
          const dx = enemy.x - player.x;
          const dy = enemy.y - player.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 1.5) {
            const damage = 20 + player.level * 5;
            enemy.health -= damage;
            setMessage(`${ENEMY_TYPES[enemy.type].name}に ${damage} ダメージ`);

            if (enemy.health <= 0) {
              const exp = ENEMY_TYPES[enemy.type].exp;
              playerRef.current.exp += exp;
              setMessage(
                `${ENEMY_TYPES[enemy.type].name}を倒した [EXP +${exp}]`,
              );
              enemiesRef.current.splice(index, 1);

              if (playerRef.current.exp >= playerRef.current.level * 100) {
                playerRef.current.level++;
                playerRef.current.maxHealth += 20;
                playerRef.current.health = playerRef.current.maxHealth;
                setMessage(`LEVEL UP - Lv.${playerRef.current.level}`);
              }
            }
          }
        });
      }

      // Draw UI
      // Status panel
      const panelWidth = isMobile ? 150 : 220;
      const panelHeight = isMobile ? 70 : 90;

      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.strokeStyle = "rgba(99, 102, 241, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(10, 10, panelWidth, panelHeight, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#fff";
      ctx.font = `bold ${isMobile ? 12 : 16}px sans-serif`;
      ctx.fillText(`Lv.${player.level}`, 20, isMobile ? 30 : 35);

      ctx.fillStyle = "#a5b4fc";
      ctx.font = `${isMobile ? 10 : 12}px sans-serif`;
      ctx.fillText(
        `EXP: ${player.exp}/${player.level * 100}`,
        isMobile ? 60 : 80,
        isMobile ? 30 : 35,
      );

      // Health bar
      const barY = isMobile ? 42 : 50;
      const barWidth = panelWidth - 20;
      const barHeight = isMobile ? 14 : 20;

      ctx.fillStyle = "#1f2937";
      ctx.beginPath();
      ctx.roundRect(20, barY, barWidth, barHeight, 4);
      ctx.fill();

      const healthPercent = player.health / player.maxHealth;
      const hpGradient = ctx.createLinearGradient(
        20,
        0,
        20 + barWidth * healthPercent,
        0,
      );
      hpGradient.addColorStop(
        0,
        healthPercent > 0.5
          ? "#22c55e"
          : healthPercent > 0.25
            ? "#eab308"
            : "#ef4444",
      );
      hpGradient.addColorStop(
        1,
        healthPercent > 0.5
          ? "#16a34a"
          : healthPercent > 0.25
            ? "#ca8a04"
            : "#dc2626",
      );

      ctx.fillStyle = hpGradient;
      ctx.beginPath();
      ctx.roundRect(20, barY, barWidth * healthPercent, barHeight, 4);
      ctx.fill();

      ctx.fillStyle = "#fff";
      ctx.font = `bold ${isMobile ? 10 : 13}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(
        `${player.health}/${player.maxHealth}`,
        20 + barWidth / 2,
        barY + barHeight / 2 + 4,
      );
      ctx.textAlign = "left";

      // Minimap
      const mapSize = isMobile ? 80 : 120;
      const mapScale = mapSize / MAP_DATA.length;
      const mapX = canvasSize.width - mapSize - 15;

      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.strokeStyle = "rgba(99, 102, 241, 0.5)";
      ctx.beginPath();
      ctx.roundRect(mapX - 5, 5, mapSize + 10, mapSize + 10, 8);
      ctx.fill();
      ctx.stroke();

      MAP_DATA.forEach((row, y) => {
        row.forEach((cell, x) => {
          const mx = mapX + x * mapScale;
          const my = 10 + y * mapScale;
          if (cell === 1) {
            ctx.fillStyle = "#4f46e5";
          } else if (cell === 4) {
            ctx.fillStyle = "#fbbf24";
          } else {
            ctx.fillStyle = "#1f2937";
          }
          ctx.fillRect(mx, my, mapScale - 0.5, mapScale - 0.5);
        });
      });

      // Player on minimap
      const pmx = mapX + player.x * mapScale;
      const pmy = 10 + player.y * mapScale;

      ctx.fillStyle = "#22d3ee";
      ctx.shadowColor = "#22d3ee";
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(pmx, pmy, isMobile ? 2 : 3, 0, Math.PI * 2);
      ctx.fill();

      // Direction
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pmx, pmy);
      ctx.lineTo(
        pmx + Math.cos(player.angle) * (isMobile ? 6 : 10),
        pmy + Math.sin(player.angle) * (isMobile ? 6 : 10),
      );
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Enemies on minimap
      enemiesRef.current.forEach((enemy) => {
        const emx = mapX + enemy.x * mapScale;
        const emy = 10 + enemy.y * mapScale;
        ctx.fillStyle = ENEMY_TYPES[enemy.type].color;
        ctx.beginPath();
        ctx.arc(emx, emy, isMobile ? 1.5 : 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Crosshair
      const cx = canvasSize.width / 2;
      const cy = canvasSize.height / 2;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy);
      ctx.lineTo(cx - 4, cy);
      ctx.moveTo(cx + 4, cy);
      ctx.lineTo(cx + 10, cy);
      ctx.moveTo(cx, cy - 10);
      ctx.lineTo(cx, cy - 4);
      ctx.moveTo(cx, cy + 4);
      ctx.lineTo(cx, cy + 10);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fill();

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [gameState, canvasSize, isMobile, checkWallCollision, castRay, drawEnemy]);

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
            <h3 className={styles.gameTitle}>DUNGEON QUEST</h3>
            <p className={styles.instructions}>
              {isMobile ? (
                <>
                  スワイプで移動・回転
                  <br />
                  攻撃ボタンで敵を攻撃
                </>
              ) : (
                <>
                  WASD / 矢印キーで移動
                  <br />
                  スペースキーで攻撃
                </>
              )}
            </p>
            <p className={styles.goal}>ゴールを目指して敵を倒せ</p>
            <button className={styles.startButton} onClick={initGame}>
              START
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div className={styles.overlay}>
            <h3 className={styles.gameOverTitle}>GAME OVER</h3>
            <p className={styles.finalScore}>LEVEL: {finalStats.level}</p>
            <button className={styles.startButton} onClick={initGame}>
              RETRY
            </button>
          </div>
        )}

        {gameState === "clear" && (
          <div className={styles.overlay}>
            <h3 className={styles.clearTitle}>STAGE CLEAR</h3>
            <p className={styles.finalScore}>
              LEVEL: {finalStats.level}
              <br />
              EXP: {finalStats.exp}
            </p>
            <button className={styles.startButton} onClick={initGame}>
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      {gameState === "playing" && (
        <>
          {message && <div className={styles.message}>{message}</div>}
          <div className={styles.mobileControls}>
            <div className={styles.touchPad}>
              <span>MOVE</span>
            </div>
            <button className={styles.attackButton} onClick={handleAttack}>
              ATTACK
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(DungeonRPG);
