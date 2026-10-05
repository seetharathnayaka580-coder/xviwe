import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
  color: string;
}

interface Packet {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
}

const PALETTE = [
  { node: '#10b981', packet: '#34d399' }, // Emerald
  { node: '#06b6d4', packet: '#22d3ee' }, // Cyan
  { node: '#3b82f6', packet: '#60a5fa' }, // Sapphire
  { node: '#8b5cf6', packet: '#c084fc' }, // Violet
  { node: '#f59e0b', packet: '#fbbf24' }, // Amber
];

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}

export function LiveNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Multi-colored interconnected network nodes
    const nodeCount = Math.min(38, Math.floor((width * height) / 34000));
    const nodes: Node[] = Array.from({ length: nodeCount }, (_, i) => {
      const p = PALETTE[i % PALETTE.length];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1.8,
        pulsePhase: Math.random() * Math.PI * 2,
        color: p.node,
      };
    });

    const packets: Packet[] = [];
    const maxPackets = 14;
    const maxDistance = 180;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min(32, time - lastTime);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Update positions
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx * (dt / 16);
        node.y += node.vy * (dt / 16);
        node.pulsePhase += 0.035;

        if (node.x < 0) node.x = width;
        else if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        else if (node.y > height) node.y = 0;
      }

      // Draw multi-color dynamic network lines
      const activeEdges: [number, number, string][] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.18;
            
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(100, 160, 240, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            activeEdges.push([i, j, nodes[i].color]);
          }
        }
      }

      // Spawn multicolored packets
      if (activeEdges.length > 0 && packets.length < maxPackets && Math.random() < 0.07) {
        const edge = activeEdges[Math.floor(Math.random() * activeEdges.length)];
        packets.push({
          fromNode: edge[0],
          toNode: edge[1],
          progress: 0,
          speed: 0.008 + Math.random() * 0.01,
          color: edge[2],
        });
      }

      // Render traveling packets
      for (let p = packets.length - 1; p >= 0; p--) {
        const packet = packets[p];
        packet.progress += packet.speed * (dt / 16);

        if (packet.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }

        const n1 = nodes[packet.fromNode];
        const n2 = nodes[packet.toNode];
        if (!n1 || !n2) continue;

        const px = n1.x + (n2.x - n1.x) * packet.progress;
        const py = n1.y + (n2.y - n1.y) * packet.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = packet.color;
        ctx.shadowColor = packet.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw multi-colored glowing nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const pulse = Math.sin(node.pulsePhase) * 0.4 + 1;

        // Outer halo
        ctx.beginPath();
        ctx.arc(node.x, node.y, (node.radius + 3) * pulse, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(node.color, 0.15);
        ctx.fill();

        // Node core
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* ALL COLORS COMBINED IN LIVE AMBIENT AURORA ORBS */}
      {/* 1. Electric Cobalt Blue Orb */}
      <div className="absolute -top-20 -left-20 w-[550px] h-[550px] rounded-full bg-blue-600/15 blur-[160px] animate-pulse pointer-events-none" />
      
      {/* 2. Emerald Green Orb */}
      <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full bg-emerald-500/12 blur-[150px] pointer-events-none" />
      
      {/* 3. Vivid Cyan Orb */}
      <div className="absolute -bottom-24 left-1/4 w-[480px] h-[480px] rounded-full bg-cyan-500/12 blur-[150px] pointer-events-none" />
      
      {/* 4. Royal Violet Orb */}
      <div className="absolute bottom-10 right-10 w-[420px] h-[420px] rounded-full bg-purple-600/12 blur-[140px] pointer-events-none" />

      {/* 5. Subtle Signal Amber Core */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-amber-500/06 blur-[160px] pointer-events-none" />

      {/* Live Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-65"
      />
    </div>
  );
}
