import {
  Camera,
  ChartColumnIncreasing,
  CircleUserRound,
  Compass,
  Mail,
  MessageCircle,
  Phone,
  Settings2,
  ShieldCheck,
} from 'lucide-react';

const iconTone = {
  browser: 'text-[#0a84ff]',
  profile: 'text-white/95',
  settings: 'text-white/95',
};

const glyphs = {
  messages: MessageCircle,
  mail: Mail,
  browser: Compass,
  phone: Phone,
  report: ChartColumnIncreasing,
  profile: CircleUserRound,
  practice: ShieldCheck,
  settings: Settings2,
  camera: Camera,
};

export default function AppGlyph({ name, compact = false }) {
  if (name === 'facebook') {
    return (
      <span
        aria-hidden="true"
        className={`font-sans font-semibold leading-none text-white ${
          compact ? 'text-[1.85rem]' : 'text-[2.85rem]'
        }`}
      >
        f
      </span>
    );
  }

  const Glyph = glyphs[name] ?? ShieldCheck;
  const tone = iconTone[name] ?? 'text-white';

  return (
    <Glyph
      aria-hidden="true"
      size={compact ? 25 : 39}
      strokeWidth={compact ? 2.45 : 2.35}
      absoluteStrokeWidth
      className={`${tone} drop-shadow-[0_2px_5px_rgba(15,23,42,0.22)]`}
    />
  );
}
