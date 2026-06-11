"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface ColorPickerPopoverProps {
  value: string;
  onChange: (hex: string) => void;
}

// ─── Color utils ─────────────────────────────────────────────────────────────

function hexToHsv(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [Math.round(h), max === 0 ? 0 : d / max, max];
}

function hsvToHex(h: number, s: number, v: number): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${toHex(f(5))}${toHex(f(3))}${toHex(f(1))}`;
}

function isValidHex(hex: string) {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

function hueToHex(h: number) {
  return hsvToHex(h, 1, 1);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ColorPickerPopover({ value, onChange }: ColorPickerPopoverProps) {
  const safeHex = isValidHex(value) ? value : "#c9a96e";
  const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(safeHex));
  const [hexInput, setHexInput] = useState(safeHex);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<{ top: number; left: number } | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const [h, s, v] = hsv;
  const currentHex = hsvToHex(h, s, v);
  const hueColor = hueToHex(h);

  // Sync external value → internal
  useEffect(() => {
    if (isValidHex(value) && value !== currentHex) {
      const newHsv = hexToHsv(value);
      setHsv(newHsv);
      setHexInput(value);
    }
  }, [value]);

  const updateRect = useCallback(() => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setRect({ top: r.bottom + 8, left: Math.min(r.left, window.innerWidth - 260) });
  }, []);

  const openPicker = () => { updateRect(); setOpen(true); };

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (triggerRef.current?.contains(e.target as Node)) return;
      if (pickerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  // Gradient drag
  const handleGradientPointer = useCallback((e: PointerEvent | React.PointerEvent) => {
    if (!gradientRef.current) return;
    const r = gradientRef.current.getBoundingClientRect();
    const sx = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    const sy = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
    const newHsv: [number, number, number] = [h, sx, 1 - sy];
    setHsv(newHsv);
    const hex = hsvToHex(newHsv[0], newHsv[1], newHsv[2]);
    setHexInput(hex);
    onChange(hex);
  }, [h, onChange]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => { if (dragging.current) handleGradientPointer(e); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [handleGradientPointer]);

  const handleHue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newH = Number(e.target.value);
    const newHsv: [number, number, number] = [newH, s, v];
    setHsv(newHsv);
    const hex = hsvToHex(newH, s, v);
    setHexInput(hex);
    onChange(hex);
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    if (isValidHex(raw)) {
      const newHsv = hexToHsv(raw);
      setHsv(newHsv);
      onChange(raw);
    }
  };

  // Cursor position in gradient
  const cursorX = `${s * 100}%`;
  const cursorY = `${(1 - v) * 100}%`;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => open ? setOpen(false) : openPicker()}
        className="w-8 h-8 rounded-full shrink-0 border-2 transition-all duration-150"
        style={{
          backgroundColor: currentHex,
          borderColor: open ? currentHex : "transparent",
          outline: open ? `2px solid ${currentHex}` : "none",
          outlineOffset: "2px",
          boxShadow: "inset 0 0 0 1.5px rgba(0,0,0,0.08)",
        }}
        aria-label="Chọn màu"
      />

      {open && rect && typeof document !== "undefined" && createPortal(
        <div
          ref={pickerRef}
          style={{
            position: "fixed",
            top: rect.top,
            left: rect.left,
            width: 248,
            zIndex: 9999,
            background: "var(--color-bg, #fdfaf6)",
            borderRadius: 16,
            boxShadow: "0 16px 48px rgba(44,44,44,0.16), 0 0 0 1px rgba(44,44,44,0.06)",
            overflow: "hidden",
            padding: "12px",
          }}
          className="bg-warm-white"
        >
          {/* Gradient area */}
          <div
            ref={gradientRef}
            onPointerDown={(e) => { dragging.current = true; handleGradientPointer(e); }}
            style={{
              width: "100%",
              height: 160,
              borderRadius: 10,
              position: "relative",
              cursor: "crosshair",
              background: `
                linear-gradient(to bottom, transparent, #000),
                linear-gradient(to right, #fff, ${hueColor})
              `,
              marginBottom: 10,
              userSelect: "none",
            }}
          >
            {/* Cursor */}
            <div
              style={{
                position: "absolute",
                left: cursorX,
                top: cursorY,
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: "2.5px solid white",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.2)",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                backgroundColor: currentHex,
              }}
            />
          </div>

          {/* Hue slider */}
          <div style={{ marginBottom: 10 }}>
            <input
              type="range"
              min={0}
              max={359}
              value={h}
              onChange={handleHue}
              style={{
                width: "100%",
                height: 10,
                borderRadius: 99,
                appearance: "none",
                cursor: "pointer",
                background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
                outline: "none",
              }}
            />
          </div>

          {/* Preview + Hex input */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              backgroundColor: currentHex,
              border: "0.5px solid rgba(0,0,0,0.08)",
            }} />
            <input
              type="text"
              value={hexInput}
              onChange={handleHexInput}
              maxLength={7}
              spellCheck={false}
              placeholder="#c9a96e"
              style={{
                flex: 1,
                fontFamily: "monospace",
                fontSize: 13,
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid rgba(44,44,44,0.12)",
                background: "rgba(44,44,44,0.04)",
                color: "inherit",
                outline: "none",
                letterSpacing: "0.04em",
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
