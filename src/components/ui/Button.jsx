import Link from 'next/link';

export default function Button({
  children,
  href,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'caramel'
  size = 'base', // 'small' | 'base'
  className = '',
  icon: Icon,
  external = false,
  type = 'button',
  disabled = false,
  ...props
}) {
  const variantStyles = {
    primary:
      'bg-espresso dark:bg-blue-600 text-cream dark:text-white border-espresso dark:border-blue-600 hover:bg-caramel dark:hover:bg-blue-500 hover:border-caramel dark:hover:border-blue-500 shadow-sm dark:shadow-blue-500/25',
    secondary:
      'bg-transparent text-espresso dark:text-gray-300 border-border-subtle dark:border-gray-600 hover:border-caramel dark:hover:border-blue-500 hover:text-caramel dark:hover:text-blue-400',
    caramel:
      'bg-caramel dark:bg-blue-600 text-white border-caramel dark:border-blue-600 hover:bg-caramel/90 dark:hover:bg-blue-500 shadow-sm dark:shadow-blue-500/25',
  };

  const sizeStyles = {
    small: 'text-xs px-4 py-2',
    base: 'text-sm px-6 py-3',
  };

  const classes = `inline-flex items-center justify-center gap-2 font-medium rounded-full border transition-all duration-200 hover:-translate-y-0.5 ${
    variantStyles[variant] || variantStyles.primary
  } ${sizeStyles[size] || sizeStyles.base} ${className}`.trim();

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...props}
        >
          {children}
          {Icon && <Icon size={16} />}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...props}>
        {children}
        {Icon && <Icon size={16} />}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
      suppressHydrationWarning
      {...props}
    >
      {children}
      {Icon && <Icon size={16} />}
    </button>
  );
}
