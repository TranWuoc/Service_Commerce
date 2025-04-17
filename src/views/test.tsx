import React from "react";
import { get } from "react-hook-form";
import { Badge } from "../components/ui/badge";
import { FieldCard } from "../components/Customer/FieldCard";
export const TestPage: React.FC = () => {
  const getAnimationDelay = (
    index: number,
    totalItems: number,
    durationInSeconds = 10,
  ) => {
    const delay = (durationInSeconds / totalItems) * (totalItems - index) * -1;
    return `${delay}s`;
  };

  const items = [
    "Dưới 5km",
    "Sân 7",
    "Sân 11",
    "Từ 350k/90p",
    "Dưới 10km",
    "Sân cỏ tự nhiên",
    "Sân Futsal",
  ];

  const itemsfieldcard = [
    {
      name: "Sân Futsal Hà Đông",
      type: "Sân 7",
      area: 1.5,
      status: "Còn trống",
      usage: 50,
      imageUrl: "/football-field.jpg",
    },
    {
      name: "Sân 2",
      type: "Sân 11",
      area: 2.0,
      status: "Đã đặt",
      usage: 80,
      imageUrl: "/football-field.jpg",
    },
    {
      name: "Sân 3",
      type: "Sân 7",
      area: 1.0,
      status: "Còn trống",
      usage: 30,
      imageUrl: "/football-field.jpg",
    },
    {
      name: "Sân 4",
      type: "Sân 11",
      area: 2.5,
      status: "Đã đặt",
      usage: 90,
      imageUrl: "/football-field.jpg",
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div
        className="rounded-lg w-90% max-w-[1536] ml-[200px] 
        mr-[200px] relative h-[100px] mt-[5rem] overflow-hidden "
        style={{
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0)",
        }}
      >
        <div
          className="w-[200px] h-[100px] bg-red-700 rounded-xl absolute left-[100%] animate-scroll-left"
          style={{
            animationDelay: getAnimationDelay(1, 8),
          }}
        ></div>
        <div
          className="w-[200px] h-[100px] bg-red-700 rounded-xl absolute left-[100%] animate-scroll-left"
          style={{
            animationDelay: getAnimationDelay(2, 8),
          }}
        ></div>
        <div
          className="w-[200px] h-[100px] bg-red-700 rounded-xl absolute left-[100%] animate-scroll-left"
          style={{
            animationDelay: getAnimationDelay(3, 8),
          }}
        ></div>
        <div
          className="w-[200px] h-[100px] bg-red-700 rounded-xl absolute left-[100%] animate-scroll-left"
          style={{
            animationDelay: getAnimationDelay(4, 8),
          }}
        ></div>
        <div
          className="w-[200px] h-[100px] bg-red-700 rounded-xl absolute left-[100%] animate-scroll-left"
          style={{
            animationDelay: getAnimationDelay(5, 8),
          }}
        ></div>
        <div
          className="w-[200px] h-[100px] bg-red-700 rounded-xl absolute left-[100%] animate-scroll-left"
          style={{
            animationDelay: getAnimationDelay(6, 8),
          }}
        ></div>
        <div
          className="w-[200px] h-[100px] bg-red-700 rounded-xl absolute left-[100%] animate-scroll-left"
          style={{
            animationDelay: getAnimationDelay(7, 8),
          }}
        ></div>
        <div
          className="w-[200px] h-[100px] bg-red-700 rounded-xl absolute left-[100%] animate-scroll-left"
          style={{
            animationDelay: getAnimationDelay(8, 8),
          }}
        ></div>
      </div>
      <div
        className="rounded-lg w-90% max-w-[1536px] ml-[200px] mr-[200px] relative h-[100px] mt-[5rem] overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0))",
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0))",
        }}
      >
        {[...items].map((label, idx) => (
          console.log(label, idx),
          <div
            key={idx}
            className="absolute left-[100%] animate-scroll-left"
            style={{
              animationDelay: getAnimationDelay(idx, items.length),
            }}
          >
            <Badge
              variant="outline"
              className="bg-black text-white font-bold text-[20px] text-center w-32 hover:bg-orange-400 cursor-pointer mx-4 "
            >
              {label}
            </Badge>
          </div>
          
        ))}
        
      </div>
      <div
        className="rounded-lg  max-w-[1536px] h-auto ml-[200px] mr-[200px] relative mt-[5rem] overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0))",
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0))",
        }}
      >
        <div className="flex animate-scroll-left w-max gap-3">
                  {[...itemsfieldcard].map((field, idx) => (
                    <div 
                      key={idx}
                      className="rounded-lg shadow-lg"
                      style={{
                        animationDelay: getAnimationDelay(idx, itemsfieldcard.length),
                      }}>
                    <FieldCard
                      key={idx}
                      name={field.name}
                      type={field.type}
                      area={field.area}
                      status={field.status}
                      usage={field.usage}
                      imageUrl={field.imageUrl}
                    />
                    </div>
                  ))}
                  </div>
          </div>
    </div>
  );
};
