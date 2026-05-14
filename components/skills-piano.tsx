"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { isMusicPlaying, subscribe } from "@/components/audio-analyser";

const ROWS = [
  ["数据标注","SFT对话","图片理解","ASR语音","文生图评测","内容审核","数据清洗"],
  ["项目管理","需求分析","SOP制定","质量管控","Badcase管理","进度跟踪","团队协作"],
  ["工具技术","Prompt Engineering","Coze","Trae","飞书","Python","Excel"],
];

const KB = [["1","2","3","4","5","6","7"],["q","w","e","r","t","y","u"],["a","s","d","f","g","h","j"]];
const TONE_FREQ = [
  [1046.50,1174.66,1318.51,1396.91,1567.98,1760.00,1975.53],
  [523.25,587.33,659.25,698.46,783.99,880.00,987.77],
  [261.63,293.66,329.63,349.23,392.00,440.00,493.88],
];
const RIPPLE_C = ["rgba(78,143,173,0.5)","rgba(201,163,78,0.5)","rgba(123,94,167,0.5)"];

// Row wave offsets: row0 leads, row1 trails by ~1.5 keys, row2 trails by ~3 keys
const ROW_WAVE_OFFSET = [0, -1.5, -3];
const WAVE_SPEED = 0.004; // keys per ms (~2.5 keys/sec → full sweep ~2.8s)

function playTone(row: number, idx: number) {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const f = TONE_FREQ[row][idx];
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const o2 = ctx.createOscillator();
  const g = ctx.createGain();
  const g2 = ctx.createGain();
  o.type = "triangle"; o2.type = "sine";
  o.frequency.value = f; o2.frequency.value = f * 2;
  g.gain.setValueAtTime(0.18, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
  g2.gain.setValueAtTime(0.04, t);
  g2.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
  o.connect(g); g.connect(ctx.destination);
  o2.connect(g2); g2.connect(ctx.destination);
  o.start(); o2.start();
  o.stop(t + 0.7); o2.stop(t + 0.4);
  setTimeout(() => ctx.close(), 1000);
}

interface KeyData {
  row: number;
  col: number;
  btn: HTMLButtonElement;
}

const COLS = 7;

export function SkillsPiano() {
  const containerRef = useRef<HTMLDivElement>(null);
  const keyMapRef = useRef<Record<string, KeyData>>({});
  const allKeysRef = useRef<KeyData[]>([]);
  const [sequencerOn, setSequencerOn] = useState(false);
  const sequencerRef = useRef(false);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const hintRef = useRef<HTMLDivElement>(null);
  const musicBtnRef = useRef<HTMLButtonElement>(null);

  // ─── Wave sequencer: RAF-driven smooth wave ───
  const startSequencer = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const allKeys = allKeysRef.current;
    startTimeRef.current = performance.now();
    sequencerRef.current = true;

    function tick(now: number) {
      if (!sequencerRef.current) return;
      const elapsed = now - startTimeRef.current;
      const wavePos = (elapsed * WAVE_SPEED) % COLS;

      allKeys.forEach(({ row, col, btn }) => {
        // each row's wave is shifted by its offset, wrapped into [0, COLS)
        let rowWave = wavePos + ROW_WAVE_OFFSET[row];
        rowWave = ((rowWave % COLS) + COLS) % COLS;

        // distance from this key's column to the wave front
        const dist = Math.abs(col - rowWave);
        // wrap-around distance (wave wraps at col 7)
        const wrapDist = COLS - dist;
        const minDist = Math.min(dist, wrapDist);
        // Gaussian brightness
        const brightness = Math.exp(-minDist * minDist / 1.2);

        if (brightness > 0.02) {
          const ba = (0.07 + brightness * 0.58).toFixed(2);
          const bg2 = Math.round(brightness * 55);
          btn.classList.add("beat");
          btn.style.setProperty("--ba", ba);
          btn.style.setProperty("--bg2", String(bg2));
        } else {
          btn.classList.remove("beat");
          btn.style.removeProperty("--ba");
          btn.style.removeProperty("--bg2");
        }
      });

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopSequencer = useCallback(() => {
    sequencerRef.current = false;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
    allKeysRef.current.forEach(({ btn }) => {
      btn.classList.remove("beat");
      btn.style.removeProperty("--ba");
      btn.style.removeProperty("--bg2");
    });
  }, []);

  // ─── Auto start/stop when site music plays/pauses ───
  useEffect(() => {
    let wasPlaying = false;
    return subscribe(() => {
      const playing = !!isMusicPlaying();
      if (playing && !wasPlaying) {
        sequencerRef.current = false;
        setSequencerOn(true);
        startSequencer();
      } else if (!playing && wasPlaying) {
        stopSequencer();
        setSequencerOn(false);
      }
      wasPlaying = playing;
    });
  }, [startSequencer, stopSequencer]);

  const toggleSequencer = useCallback(() => {
    if (sequencerRef.current) {
      stopSequencer();
      setSequencerOn(false);
    } else {
      setSequencerOn(true);
      startSequencer();
    }
  }, [startSequencer, stopSequencer]);

  const hit = useCallback((row: number, col: number, btn: HTMLButtonElement) => {
    playTone(row, col);
    btn.classList.toggle("lit");
    const savedTransform = btn.style.transform;
    btn.style.animationPlayState = "paused";
    btn.style.transform = ((btn as any)._base || "") + " scale(0.92)";
    setTimeout(() => {
      btn.style.transform = savedTransform;
      btn.style.animationPlayState = "";
    }, 140);
    const rect = btn.getBoundingClientRect();
    const r = document.createElement("div");
    r.className = "sp-ripple";
    r.style.left = (rect.left + rect.width / 2) + "px";
    r.style.top = (rect.top + rect.height / 2) + "px";
    r.style.background = RIPPLE_C[row];
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 460);
  }, []);

  const handleHintClick = useCallback(() => {
    hintRef.current?.classList.toggle("lit");
  }, []);

  // ─── Build keys + scatter + float ───
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rows = container.querySelectorAll(".sp-row");
    rows.forEach((r) => { r.innerHTML = ""; });

    const keyMap: Record<string, KeyData> = {};
    const allKeys: KeyData[] = [];
    ROWS.forEach((labels, ri) => {
      const rowEl = rows[ri] as HTMLElement;
      if (!rowEl) return;
      labels.forEach((label, ci) => {
        const b = document.createElement("button");
        b.className = ci === 0 ? "sp-key sp-key-title" : "sp-key";
        b.textContent = label;
        b.addEventListener("pointerdown", (e) => {
          e.preventDefault();
          hit(ri, ci, b);
        });
        rowEl.appendChild(b);
        keyMap[KB[ri][ci]] = { row: ri, col: ci, btn: b };
        allKeys.push({ row: ri, col: ci, btn: b });
      });
    });
    keyMapRef.current = keyMap;
    allKeysRef.current = allKeys;

    const allBtns = container.querySelectorAll<HTMLButtonElement>(".sp-key");
    allBtns.forEach((btn) => {
      const dy = (Math.random() - 0.5) * 40;
      const rot = (Math.random() - 0.5) * 10;
      const mx = (Math.random() - 0.5) * 12;
      btn.style.transform = `translateY(${dy}px) rotate(${rot}deg)`;
      btn.style.marginLeft = mx + "px";
      btn.style.marginRight = mx + "px";
      (btn as any)._base = `translateY(${dy}px) rotate(${rot}deg)`;
      const fy = (6 + Math.random() * 6) * (Math.random() > 0.5 ? -1 : 1);
      const dur = 2.5 + Math.random() * 2;
      btn.style.setProperty("--float-y", fy + "px");
      btn.style.animation = `sp-float ${dur}s ${Math.random() * -dur}s ease-in-out infinite`;
    });

    const hintEl = hintRef.current;
    if (hintEl) {
      hintEl.style.transform = `translateY(${(Math.random() - 0.5) * 10}px) rotate(${(Math.random() - 0.5) * 3}deg)`;
      hintEl.style.setProperty("--float-y", (3 + Math.random() * 3) * (Math.random() > 0.5 ? -1 : 1) + "px");
      const hd = 3 + Math.random() * 2;
      hintEl.style.animation = `sp-float ${hd}s ${Math.random() * -hd}s ease-in-out infinite`;
    }

    const mBtn = musicBtnRef.current;
    if (mBtn) {
      mBtn.style.transform = `translateY(${(Math.random() - 0.5) * 8}px) rotate(${(Math.random() - 0.5) * 2}deg)`;
      mBtn.style.setProperty("--float-y", (2 + Math.random() * 3) * (Math.random() > 0.5 ? -1 : 1) + "px");
      const md = 3 + Math.random() * 2;
      mBtn.style.animation = `sp-float ${md}s ${Math.random() * -md}s ease-in-out infinite`;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const m = keyMapRef.current[e.key.toLowerCase()];
      if (m) { e.preventDefault(); hit(m.row, m.col, m.btn); }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      stopSequencer();
    };
  }, [hit, stopSequencer]);

  return (
    <div ref={containerRef} className="sp-container">
      <style>{`
        @keyframes sp-float { 0%,100% { translate: 0 0; } 50% { translate: 0 var(--float-y); } }
        @keyframes sp-ripple-kf { 0% { transform: translate(-50%,-50%) scale(0.3); opacity: 0.5; } 100% { transform: translate(-50%,-50%) scale(1.8); opacity: 0; } }

        .sp-container { display: flex; flex-direction: column; align-items: center; gap: 12px; user-select: none; -webkit-user-select: none; }

        .sp-row { display: flex; gap: 7px; justify-content: center; align-items: center; height: 110px; }

        .sp-key {
          height: 54px; border: none; border-radius: 8px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Noto Sans SC', sans-serif; font-size: 13px; font-weight: 500;
          letter-spacing: 0.5px; white-space: nowrap; padding: 0 18px;
          transition: background 0.10s, box-shadow 0.10s, border-color 0.10s, color 0.10s, text-shadow 0.10s;
          -webkit-tap-highlight-color: transparent; position: relative;
        }
        .sp-key-title { font-weight: 700; letter-spacing: 1.5px; }
        .sp-key-title::before {
          content: ''; position: absolute; left: 0; top: 14px; bottom: 14px;
          width: 3px; border-radius: 0 2px 2px 0;
        }

        .r1 .sp-key { background: rgba(78,143,173,0.10); color: #4e8fad; border: 1px solid rgba(78,143,173,0.22); }
        .r1 .sp-key:hover { background: rgba(78,143,173,0.22); box-shadow: 0 0 26px rgba(78,143,173,0.4); border-color: rgba(78,143,173,0.5); }
        .r1 .sp-key.lit { background: rgba(78,143,173,0.6); box-shadow: 0 0 50px rgba(78,143,173,0.8), 0 0 100px rgba(78,143,173,0.35), inset 0 0 24px rgba(78,143,173,0.3); border-color: rgba(120,200,240,0.85); color: #d8f2ff; text-shadow: 0 0 14px rgba(78,143,173,1); }
        .r1 .sp-key-title::before { background: #4e8fad; }
        .r1 .sp-key.beat { transition: none; background: rgba(78,143,173, var(--ba)); box-shadow: 0 0 calc(var(--bg2) * 1px) rgba(78,143,173, var(--ba)), 0 0 calc(var(--bg2) * 2px) rgba(78,143,173, calc(var(--ba) * 0.4)); border-color: rgba(78,143,173, var(--ba)); color: rgba(216,242,255, var(--ba)); text-shadow: 0 0 calc(var(--bg2) * 0.4px) rgba(78,143,173, var(--ba)); }

        .r2 .sp-key { background: rgba(201,163,78,0.10); color: #c9a34e; border: 1px solid rgba(201,163,78,0.22); }
        .r2 .sp-key:hover { background: rgba(201,163,78,0.22); box-shadow: 0 0 26px rgba(201,163,78,0.4); border-color: rgba(201,163,78,0.5); }
        .r2 .sp-key.lit { background: rgba(201,163,78,0.6); box-shadow: 0 0 50px rgba(201,163,78,0.8), 0 0 100px rgba(201,163,78,0.35), inset 0 0 24px rgba(201,163,78,0.3); border-color: rgba(255,220,120,0.85); color: #fff8e0; text-shadow: 0 0 14px rgba(201,163,78,1); }
        .r2 .sp-key-title::before { background: #c9a34e; }
        .r2 .sp-key.beat { transition: none; background: rgba(201,163,78, var(--ba)); box-shadow: 0 0 calc(var(--bg2) * 1px) rgba(201,163,78, var(--ba)), 0 0 calc(var(--bg2) * 2px) rgba(201,163,78, calc(var(--ba) * 0.4)); border-color: rgba(201,163,78, var(--ba)); color: rgba(255,248,224, var(--ba)); text-shadow: 0 0 calc(var(--bg2) * 0.4px) rgba(201,163,78, var(--ba)); }

        .r3 .sp-key { background: rgba(123,94,167,0.10); color: #7b5ea7; border: 1px solid rgba(123,94,167,0.22); }
        .r3 .sp-key:hover { background: rgba(123,94,167,0.22); box-shadow: 0 0 26px rgba(123,94,167,0.4); border-color: rgba(123,94,167,0.5); }
        .r3 .sp-key.lit { background: rgba(123,94,167,0.6); box-shadow: 0 0 50px rgba(123,94,167,0.8), 0 0 100px rgba(123,94,167,0.35), inset 0 0 24px rgba(123,94,167,0.3); border-color: rgba(190,158,234,0.85); color: #f0e4ff; text-shadow: 0 0 14px rgba(123,94,167,1); }
        .r3 .sp-key-title::before { background: #7b5ea7; }
        .r3 .sp-key.beat { transition: none; background: rgba(123,94,167, var(--ba)); box-shadow: 0 0 calc(var(--bg2) * 1px) rgba(123,94,167, var(--ba)), 0 0 calc(var(--bg2) * 2px) rgba(123,94,167, calc(var(--ba) * 0.4)); border-color: rgba(123,94,167, var(--ba)); color: rgba(240,228,255, var(--ba)); text-shadow: 0 0 calc(var(--bg2) * 0.4px) rgba(123,94,167, var(--ba)); }

        .sp-bottom { display: flex; align-items: center; gap: 12px; margin-top: 6px; }
        .sp-hint {
          font-size: 11px; color: rgba(255,255,255,0.5); letter-spacing: 1.5px;
          cursor: pointer; padding: 8px 20px; border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
          transition: background 0.25s, box-shadow 0.25s, color 0.25s, border-color 0.25s;
          -webkit-tap-highlight-color: transparent;
        }
        .sp-hint:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); }
        .sp-hint.lit { background: rgba(201,163,78,0.15); box-shadow: 0 0 30px rgba(201,163,78,0.3); border-color: rgba(201,163,78,0.5); color: #c9a34e; text-shadow: 0 0 10px rgba(201,163,78,0.5); }

        .sp-music-btn {
          font-size: 11px; color: rgba(255,255,255,0.5); letter-spacing: 1px;
          cursor: pointer; padding: 8px 16px; border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1); background: none;
          font-family: 'Noto Sans SC', sans-serif;
          transition: all 0.25s; display: flex; align-items: center; gap: 6px;
          -webkit-tap-highlight-color: transparent;
        }
        .sp-music-btn:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); }
        .sp-music-btn.active { background: rgba(201,163,78,0.18); box-shadow: 0 0 30px rgba(201,163,78,0.3); border-color: rgba(201,163,78,0.5); color: #c9a34e; }
        .sp-music-btn .sp-icon { font-size: 14px; }
        .sp-music-btn.active .sp-icon { animation: sp-pulse 1s infinite; }
        @keyframes sp-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .sp-ripple {
          position: fixed; width: 50px; height: 50px; border-radius: 50%;
          pointer-events: none; z-index: 9999;
          animation: sp-ripple-kf 0.45s ease-out forwards;
        }

        @media (max-width: 768px) {
          .sp-row { gap: 4px; height: auto; flex-wrap: wrap; padding: 0 4px; }
          .sp-key { height: 44px; font-size: 11px; padding: 0 10px; }
          .sp-bottom { flex-direction: column; align-items: center; }
        }
      `}</style>

      <div className="sp-row r1" />
      <div className="sp-row r2" />
      <div className="sp-row r3" />

      <div className="sp-bottom">
        <div ref={hintRef} className="sp-hint" onPointerDown={(e) => { e.preventDefault(); handleHintClick(); }}>
          键盘 1~7 数据标注 · Q~U 项目管理 · A~J 工具技术
        </div>
        <button
          ref={musicBtnRef}
          className={`sp-music-btn${sequencerOn ? " active" : ""}`}
          onClick={toggleSequencer}
          title="律动循环"
        >
          <span className="sp-icon">♪</span>律动
        </button>
      </div>
    </div>
  );
}
