import React, { useRef, useEffect, useState } from "react";

type FieldCardProps = {
  name: string;
  type: string;
  area: number;
  status: string;
  usage: number;
  imageUrl: string;
};

interface InfiniteScrollProps {
  items: FieldCardProps[];
  renderItem: (item: FieldCardProps, index: number) => React.ReactNode;
  speed?: number; // pixel per frame
}

export const InfiniteHorizontalScroll: React.FC<InfiniteScrollProps> = ({
  items,
  renderItem,
  speed = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let pos = 0;
    let animationFrameId: number;

    const animate = () => {
      if (!trackRef.current) return;

      pos -= speed;
      const totalWidth = trackRef.current.scrollWidth / 2;

      if (Math.abs(pos) >= totalWidth) {
        pos = 0; // reset mà không khựng vì phần tử lặp lại y hệt
      }

      trackRef.current.style.transform = `translateX(${pos}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [speed]);

  return (
    <div ref={containerRef} className="overflow-hidden w-full">
      <div
        ref={trackRef}
        className="flex w-fit gap-4 will-change-transform"
        style={{ transform: "translateX(0)" }}
      >
        {[...items, ...items].map((item, index) => renderItem(item, index))}
      </div>
    </div>
  );
};
