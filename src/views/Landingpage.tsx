import React, { useState, useEffect, use } from "react";
import Headerbar from "../components/Headerbar";
import Footer from "../components/Shared_components/Footer";
import { Button } from "../components/ui/button";
// import Button from "../components/Shared_components/Button";
import { FindFieldForm } from "../components/FindFields";
import { Badge } from "../components/ui/badge";
import { MainHeaderCard } from "../components/Field/MainHeaderCard";



const LandingPage: React.FC = () => {
  const [fields, setFields] = useState([]); 
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    const fetchFields = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/fields");
        const result = await response.json(); // Lấy dữ liệu trả về từ API 
        // console.log(result); // In ra dữ liệu để kiểm tra
        // Truy cập vào `result.data` nếu API trả về dữ liệu trong thuộc tính `data`
        if (Array.isArray(result.data)) {
          setFields(result.data.slice(0, 4)); // Lấy 4 sân đầu tiên
        } else {
          console.error("Dữ liệu trả về không hợp lệ:");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sân bóng:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFields();
  }, []);

  
  const items = [
    "Dưới 5km",
    "Sân 7",
    "Sân 11",
    "Từ 350k/90p",
    "Dưới 10km",
    "Sân cỏ tự nhiên",
    "Sân Futsal",
  ];

  

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header Section */}
      <Headerbar />
      <hr className="border-t border-gray-300" />
      {/* Main Content - Screen 1 */}
      <div className="flex flex-col flex-1 bg-white h-screen">
        <div className="flex flex-row justify-center w-full h-full">
          <div className="flex flex-row min-h-7 w-full gap-10">
            <div className="flex flex-col">
              <div className="w-[557px] h-44 text-gray-700 text-8xl font-bold font-['Russo_One'] ml-20 mt-20">
                Let's play
                <br />
                Book fields
                <div className="w-[487px] h-7 justify-start text-gray-700 text-[20px] font-normal font-['Times New Roman'] mt-10">
                  Với công nghệ hiện đại, đặt sân chưa bao giờ dễ dàng đến thế.
                  Hãy đặt sân qua chúng tôi để được trải nghiệm các dịch vụ tốt
                  nhất!!
                  <div className="flex justify-center items-center mt-10 gap-5 w-full">
                    <Button
                      size={"lg"}
                      variant={"default"}
                      className="bg-gray-400 text-white hover:bg-gray-500"
                      onClick={() => alert("Đặt sân ngay")}
                    >
                      Đặt sân ngay
                    </Button>
                    <Button
                      size={"lg"}
                      variant={"secondary"}
                      className="bg-orange-400 text-white hover:bg-orange-500"
                      onClick={() => alert("Đăng ký tài khoản")}
                    >
                      Đăng ký tài khoản
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <img
              src="/pic-landingpage.png"
              alt="Landing Page"
              className="w-full h-[600px]"
            />
          </div>
        </div>
      </div>
      {/* Main Content - Screen 2 */}
      <div className="flex justify-center bg-black items-center w-full h-[150px]">
        <img
          src="/football-field-stadium-svgrepo-com.svg"
          alt="Stadium"
          className="w-[80%] h-[80%] object-contain"
        />
        <img
          src="/football-player-setting-ball-svgrepo-com.svg"
          alt="Player"
          className="w-[80%] h-[80%] object-contain"
        />
        <img
          src="/football-svgrepo-com.svg"
          alt="Player"
          className="w-[80%] h-[80%] object-contain"
        />
      </div>
      {/* Main Content - Screen 3 */}
      <div className="flex flex-col justify-center items-center w-full h-[1250px] gap-6 bg-gray-800 ">
        <div className="flex flex-row">
          <FindFieldForm />
        </div>
        <div className="flex flex-row justify-around items-center w-full h-[100px] gap-8">
          {[...items].map((label, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="bg-black text-white font-bold text-[20px] rounded-lg hover:bg-orange-400 cursor-pointer mx-4"
            >
              {label}
            </Badge>
          ))}
        </div>
        
        <div className="relative w-[1500px] overflow-hidden">
          <div className="flex animate-scroll-marquee w-max gap-3">
            {isLoading ? (
              <p>Đang tải dữ liệu...</p>
            ) : (
              fields.map((field, idx) => (
                <MainHeaderCard key={idx} field={field} />
              ))
            )}
          </div>
        </div>
      </div>
      {/* Main Content - Screen 4 */}
      <div className="flex flex-row justify-around items-center  w-full h-[500px] bg-stone-950 text-cyan-50 text-6xl font-bold font-['Russo_One'] gap-10">
        <h1>
          Đăng ký ngay để trở thành hội viên
          <br />
          với nhiều ưu đãi
        </h1>
        <div className="flex flex-row gap-8">
          <Button
            text="Đăng ký"
            type="primary"
            onClick={() => alert("Đăng ký ngay")}
            className="mt-5 w-[200px] h-[60px] text-2xl font-bold"
          />
          <Button
            text="Đăng nhập"
            type="secondary"
            onClick={() => alert("Đăng nhập")}
            className="mt-5 w-[200px] h-[60px] text-2xl font-bold"
          />
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
