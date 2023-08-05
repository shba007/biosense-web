import Image from 'next/image';

export default function AppActionButton({
  className,
  icon,
  flip = false,
  state = false,
  onToggle,
  onPress,
}: {
  className?: string;
  icon: string;
  flip?: boolean;
  state: boolean;
  onToggle?: Function;
  onPress?: Function;
}) {
  const onToggleHandler = () => {
    if (!onToggle) return false;
    onToggle();
  };
  const onPressHandler = () => {
    if (!onPress) return false;

    onPress(true);
    setTimeout(() => {
      onPress(false);
    }, 300);
  };
  return (
    <button
      className={`relative flex justify-center items-center gap-1 p-2 w-[92px] h-[192px] 
      ${className ?? ''} ${flip ? 'pr-0' : 'pl-0'} 
      ${state ? '' : 'drop-shadow-[0px_2px_4px_rgba(0,0,0,0.1)]'} 
      `}
      style={{
        clipPath: !flip
          ? "path('M90.7454 71.7993C107.161 84.6723 115.06 105.603 111.243 126.111L103.135 169.678C99.9175 186.964 84.8336 199.5 67.2508 199.5H0.5V1.02752L90.7454 71.7993Z')"
          : "path('M21.9445 71.7993C5.52921 84.6723 -2.36996 105.603 1.44695 126.111L9.55525 169.678C12.7724 186.964 27.8563 199.5 45.4391 199.5H112.19V1.02752L21.9445 71.7993Z')",
      }}
      onClick={() => onToggleHandler() || onPressHandler()}
    >
      <div
        className={`absolute w-full h-full bg-gradient-to-b  ${
          !flip ? 'scale-x-[-1]' : ''
        } ${
          state
            ? 'from-primary-400 shadow-[0px_12px_30px_0px_rgba(0,0,0,0.10)_inset]'
            : 'from-white to-primary-400/20 '
        }`}
        style={{
          clipPath:
            "path('M21.9445 71.7993C5.52921 84.6723 -2.36996 105.603 1.44695 126.111L9.55525 169.678C12.7724 186.964 27.8563 199.5 45.4391 199.5H112.19V1.02752L21.9445 71.7993Z')",
        }}
      />
      <Image
        src={`/icons/${icon}.svg`}
        alt={icon}
        width={64}
        height={64}
        className="translate-y-1/2"
      />
    </button>
  );
}
