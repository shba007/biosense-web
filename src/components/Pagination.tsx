export default function Pagination({
  page,
  className = '',
}: {
  page: number;
  className?: string;
}) {
  return (
    <ul className={`flex gap-[5px] justify-center items-center ${className}`}>
      <li
        className={`${
          page === 0 ? ' w-[10px] bg-black' : 'w-[8px] bg-primary-400'
        } aspect-square  rounded-full`}
      />
      <li className="w-[2px] aspect-square bg-primary-400 rounded-full" />
      <li className="w-[2px] aspect-square bg-primary-400 rounded-full" />
      <li className="w-[2px] aspect-square bg-primary-400 rounded-full" />
      <li className="w-[2px] aspect-square bg-primary-400 rounded-full" />
      <li className="w-[2px] aspect-square bg-primary-400 rounded-full" />
      <li
        className={`${
          page === 1 ? ' w-[10px] bg-black' : 'w-[8px] bg-primary-400'
        } aspect-square  rounded-full`}
      />
      <li className="w-[2px] aspect-square bg-primary-400 rounded-full" />
      <li className="w-[2px] aspect-square bg-primary-400 rounded-full" />
      <li className="w-[2px] aspect-square bg-primary-400 rounded-full" />
      <li className="w-[2px] aspect-square bg-primary-400 rounded-full" />
      <li className="w-[2px] aspect-square bg-primary-400 rounded-full" />
      <li
        className={`${
          page === 2 ? ' w-[10px] bg-black' : 'w-[8px] bg-primary-400'
        } aspect-square  rounded-full`}
      />
    </ul>
  );
}
