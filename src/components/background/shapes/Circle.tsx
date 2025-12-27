interface CircleProps {
  size: number;
  color: string;
  opacity: number;
}

export default function Circle({ size, color, opacity }: CircleProps) {
  return (
    <div
      className="rounded-full absolute"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        opacity,
        willChange: 'transform'
      }}
    />
  );
}
