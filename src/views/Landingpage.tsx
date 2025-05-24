import React, { useState, useEffect, use } from "react";
import Headerbar from "../components/Headerbar";
import Footer from "../components/Shared_components/Footer";
import { FindFieldForm } from "../components/FindFields";
import { MainHeaderCard } from "../components/Field/MainHeaderCard";
import Button from "../components/Shared_components/Button";
import { useNavigate } from "react-router-dom";
import { Field } from "../types/Field";
const LandingPage: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFields = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/fields");
        const result = await response.json(); // Lấy dữ liệu trả về từ API

        if (Array.isArray(result.data)) {
          const filteredFields = result.data.data.filter(
            (field: Field) => field.state?.id === "state-001",
          );
          console.log("Filtered fields:", filteredFields); // In ra dữ liệu đã lọc
          setFields(filteredFields);
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
                      text="Đặt sân ngay"
                      type="primary"
                      onClick={() => navigate("/login")}
                    />
                    <Button
                      text="Đăng ký"
                      type="primary"
                      onClick={() => navigate("/register")}
                    />
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
      <div className="flex justify-center bg-slate-500 items-center w-full h-[150px]">
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
      {/* <div className="flex flex-col justify-center items-center w-full h-[1250px] gap-6 bg-gray-800 ">
        <div className="flex flex-row">
          <FindFieldForm />
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
      </div> */}
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
            onClick={() => navigate("/register")}
          />
          <Button
            text="Đăng nhập"
            type="secondary"
            onClick={() => navigate("/login")}
          />
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
