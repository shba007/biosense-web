import Image from 'next/image';

export default function AppButton({
  className,
  icon,
  onClick,
}: {
  className?: string;
  icon: string;
  onClick?: Function;
}) {
  return (
    <button
      className={`flex justify-center items-center gap-1 h-fit p-[0.875rem] ${className}`}
      onClick={() => onClick && onClick()}
    >
      <Image src={`/icons/${icon}.svg`} alt={icon} width={56} height={56} />
    </button>
  );
}
