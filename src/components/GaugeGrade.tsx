const TOTAL = 20;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const start = polar(cx, cy, r, from);
  const end = polar(cx, cy, r, to);
  return `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;
}

export function GaugeGrade({ grade }: { grade: number }) {
  const cx = 200;
  const cy = 185;
  const r = 145;
  const gap = 1.4;
  const step = 180 / TOTAL;

  const pointerAngle = 180 + (grade - 0.5) * step;
  const tip = polar(cx, cy, r - 34, pointerAngle);

  return (
    <svg viewBox="0 0 400 215" className="w-full max-w-[420px]" role="img"
      aria-label={`Grade ${grade} de ${TOTAL}`}>
      {Array.from({ length: TOTAL }, (_, i) => {
        const from = 180 + i * step + gap / 2;
        const to = 180 + (i + 1) * step - gap / 2;
        const t = i / (TOTAL - 1);
        const lightness = 0.88 - t * 0.46;
        const chroma = 0.045 + t * 0.095;
        const active = i + 1 === grade;
        return (
          <path
            key={i}
            d={arcPath(cx, cy, r, from, to)}
            stroke={`oklch(${lightness} ${chroma} 252)`}
            strokeWidth={active ? 30 : 20}
            strokeLinecap="butt"
            fill="none"
            opacity={i + 1 <= grade ? 1 : 0.35}
          />
        );
      })}

      <line
        x1={cx}
        y1={cy}
        x2={tip.x}
        y2={tip.y}
        stroke="var(--color-navy)"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={9} fill="var(--color-navy)" />

      <text
        x={22}
        y={210}
        className="text-eyebrow"
        fill="var(--color-muted-foreground)"
        fontSize={11}
      >
        1
      </text>
      <text
        x={362}
        y={210}
        className="text-eyebrow"
        fill="var(--color-muted-foreground)"
        fontSize={11}
      >
        20
      </text>
    </svg>
  );
}
