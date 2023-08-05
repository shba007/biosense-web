import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function AppButton({
  className,
  page,
  onClick,
}: {
  className?: string;
  page: number;
  onClick?: Function;
}) {
  const [icon, setIcon] = useState('chart');
  useEffect(() => {
    switch (page) {
      case 0:
        setIcon('grid');
        break;
      case 1:
        setIcon('chart');
        break;
      case 2:
        setIcon('camera');
        break;
    }
  }, [page]);

  return (
    <button
      className={`flex justify-center items-center gap-1 h-fit p-[0.875rem] ${className}`}
      onClick={() => onClick && onClick()}
    >
      <Image src={`/icons/${icon}.svg`} alt={icon} width={56} height={56} />
    </button>
  );
}
