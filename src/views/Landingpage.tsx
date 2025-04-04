import React from "react";
import Headerbar from "../components/Headerbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { FindFieldForm } from "../components/FindFields";

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full min-h-screen ">
      {/* Header Section */} 
      <Headerbar /> {/* Sử dụng Headerbar */}
      {/* Main Content */}
      <hr className="border-t border-gray-300" />
      <div className="flex flex-col flex-1  bg-white ">
        <div className="flex flex-row justify-center w-full ">
          <div className="flex flex-row min-h-7 w-full gap-10 ">
            <div className="flex flex-col ">
              <div className="w-[557px] h-44  text-gray-700 text-8xl font-bold font-['Russo_One'] ml-20 mt-20">
                Let's play
                <br />
                Book fields
                <div className="w-[487px] h-7 justify-start text-gray-700 text-[14px] font-normal font-['Poppins']  mt-10">
                  Với công nghệ hiện đại, đặt sân chưa bao giờ dễ dàng đến thế.
                  Hãy đặt sân qua chúng tôi để được trải nghiệm các dịch vụ tốt
                  nhất!!
                </div>
                <div className="flex justify-center mt-10 gap-5">
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
              className="  w-full h-[600px]"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-around  w-full  bg-slate-950 pt-5 pb-5" >
        <img 
          src="/football-player-setting-ball-svgrepo-com.svg"
          alt="aaaaa"
          className="w-[150px] h-[150px]"
        />
        <img 
          src="/football-field-stadium-svgrepo-com.svg"
          alt="aaaaa"
          className="w-[150px] h-[150px]"
        />
        <img 
          src="/football-svgrepo-com.svg"
          alt="aaaaa"
          className="w-[150px] h-[150px]"
        />
      </div>
      <div className="flex flex-col items-center  w-full  bg-gray-500 pt-5 pb-5" >
        <FindFieldForm /> 
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
