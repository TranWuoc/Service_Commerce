import React from "react";
import Headerbar from "../components/Headerbar";
import Footer from "../components/Shared_components/Footer";
import Button from "../components/Button";
import { FindFieldForm } from "../components/FindFields";

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header Section */}
      <Headerbar />

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
                  Hãy đặt sân qua chúng tôi để được trải nghiệm các dịch vụ tốt nhất!!
                </div>
                <div className="flex justify-center items-center mt-10 gap-5 w-full">
                  <Button
                    text="Đặt sân ngay"
                    type="primary"
                    onClick={() => alert("Đặt sân ngay")}
                  />
                  <Button
                    text="Đăng ký tài khoản"
                    type="secondary"
                    onClick={() => alert("Đăng ký tài khoản")}
                  />
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

      <div className="flex flex-row w-full min-h-screen bg-gray-500">
  {/* Left Section */}
  <div className="flex justify-center items-center w-3/5 h-full">
    <div className="w-full h-full flex justify-center items-center">
      <FindFieldForm />
    </div>
  </div>

  {/* Right Section */}
  <div className="flex justify-center items-center w-2/5 h-full">
    <img
      src="/football-field-stadium-svgrepo-com.svg"
      alt="Stadium"
      className="w-[80%] h-[80%] object-contain"
    />
  </div>
</div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;