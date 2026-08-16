interface TagProps {
  children: string;
}

export function Tag({ children }: TagProps) {
  return (
    <span className="mono border-2 border-line px-2 py-1 text-[0.6875rem] leading-none font-medium">
      {children}
    </span>
  );
}
