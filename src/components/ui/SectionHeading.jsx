export default function SectionHeading({
  label,
  title,
  description,
  align = 'center',
  className = '',
}) {
  const alignClass = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';
  const marginAuto = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto mr-0' : 'mr-auto ml-0';

  return (
    <div className={`section-heading mb-12 sm:mb-14 ${alignClass} ${className}`}>
      {label && (
        <span className="section-label inline-block font-semibold text-xs uppercase tracking-widest text-[#4B2E2B] dark:text-[#2563EB] mb-3 transition-colors">
          {label}
        </span>
      )}
      {title && (
        <h2 className={`section-title font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#241714] dark:text-[#FFFFFF] leading-tight tracking-tight max-w-3xl mb-4 transition-colors ${marginAuto}`}>
          {title}
        </h2>
      )}
      {description && (
        <div className={`section-description font-body text-base sm:text-lg leading-relaxed max-w-2xl text-[#5C4845] dark:text-[#94A3B8] transition-colors ${marginAuto}`}>
          {description}
        </div>
      )}
    </div>
  );
}
