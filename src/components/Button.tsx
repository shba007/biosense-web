import Image from 'next/image';

export default function AppButton({
  className,
  title,
  icon,
  onToggle,
  onPress,
}: {
  className?: string;
  title?: string;
  icon: string;
  onToggle?: Function;
  onPress?: Function;
}) {
  const onPressHandler = () => {
    if (!onPress) return;

    onPress(true);
    setTimeout(() => onPress(false), 300);
  };

  return (
    <button
      className={`flex justify-center items-center gap-1 h-fit ${
        title ? 'px-[1.875rem] py-5' : 'p-[0.875rem]'
      } rounded-full bg-[#FBFDFF] shadow-button ${className}`}
      onClick={() => (onToggle && onToggle()) || onPressHandler()}
    >
      <Image
        src={`/icons/${icon}.svg`}
        alt={icon}
        width={title ? 24 : 36}
        height={title ? 24 : 36}
      />
      {title && <span>{title}</span>}
    </button>
  );
}
