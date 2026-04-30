import AppGlyph from './AppGlyph.jsx';

export default function NotificationBanner({
  appName = 'SilverShield',
  icon,
  title = 'Practice alert',
  message = 'A new scenario will appear here.',
  time = 'now',
  accentClass = 'bg-blue-600 text-white',
  onClick,
  className = '',
}) {
  const Container = onClick ? 'button' : 'div';
  const initials = appName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Container
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`ios-glass-strong w-full rounded-[1.25rem] p-3 text-left text-white focus:outline-none focus:ring-4 focus:ring-white/45 ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[0.72rem] text-xs font-semibold shadow-sm ${accentClass}`}
        >
          <span className="relative z-10 flex h-full w-full items-center justify-center">
            {icon ? <AppGlyph name={icon} compact /> : initials}
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-2.5">
            <span className="min-w-0 truncate text-[15px] font-semibold leading-5 text-white">{title}</span>
            <span className="shrink-0 text-[15px] font-medium leading-5 text-white/76">{time}</span>
          </span>
          <span className="mt-0.5 block line-clamp-2 text-[14px] font-normal leading-[1.1rem] text-white/92">
            {message}
          </span>
        </span>
      </div>
    </Container>
  );
}
