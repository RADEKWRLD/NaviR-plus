interface SoftRectangleProps {
  size: number;
  color: string;
  opacity: number;
  rotation?: number;
}

export default function SoftRectangle({ size, color, opacity, rotation = 0 }: SoftRectangleProps) {
  return (
    <div
      className="absolute"
      style={{
        width: `${size}px`,
        height: `${size * 0.7}px`,
        backgroundColor: color,
        opacity,
        borderRadius: '24px',
        transform: `rotate(${rotation}deg)`,
        willChange: 'transform'
      }}
    />
  );
}
