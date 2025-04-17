import React from "react";
import Headerbar from "../components/Headerbar";
import Footer from "../components/Shared_components/Footer";
import Button from "../components/Shared_components/Button";
import { FindFieldForm } from "../components/FindFields";
import { Badge } from "../components/ui/badge";
import { MainHeaderCard } from "../components/Field/MainHeaderCard";
const LandingPage: React.FC = () => {
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
        <Badge 
        variant="outline"
        className="bg-black text-white font-bold text-[20px] rounded-lg hover:bg-orange-400 cursor-pointer">Dưới 5km</Badge>
        <Badge 
        variant="outline"
        className="bg-black text-white font-bold text-[20px] rounded-lg hover:bg-orange-400 cursor-pointer">Sân 7</Badge>
        <Badge 
        variant="outline"        
        className="bg-black text-white font-bold text-[20px] rounded-lg hover:bg-orange-400 cursor-pointer">Sân 11</Badge>
        <Badge 
        variant="outline"        
        className="bg-black text-white font-bold text-[20px] rounded-lg hover:bg-orange-400 cursor-pointer">Từ 350k/90p</Badge>
        <Badge 
        variant="outline"
        className="bg-black text-white font-bold text-[20px] rounded-lg hover:bg-orange-400 cursor-pointer">Dưới 10km</Badge>
        <Badge 
        variant="outline"
        className="bg-black text-white font-bold text-[20px] rounded-lg hover:bg-orange-400 cursor-pointer">Sân cỏ tự nhiên </Badge>
        <Badge 
        variant="outline"
        className="bg-black text-white font-bold text-[20px] rounded-lg hover:bg-orange-400 cursor-pointer">Sân Futsal</Badge>
        </div>
        <div className="flex flex-row  gap-8">
        <MainHeaderCard 
        name="Sân Futsal Hà Đông"
        type="Sân 7"
        price={1.5}
        location="Hà Đông"
        status="Còn trống"
        usage={50}
        imageUrl="/football-field.jpg"
        />
        <MainHeaderCard
        name="Sân 2"
        type="Sân 11"
        price={2.0}
        location="Hà Nội"
        status="Đã đặt"
        usage={80}
        imageUrl="/football-field.jpg"
        />
        <MainHeaderCard
        name="Sân 3"
        type="Sân 7"
        price={1.0}
        location="Hà Nội"
        status="Còn trống"
        usage={30}
        imageUrl="/football-field.jpg"
        />
        <MainHeaderCard
        name="Sân 4"
        type="Sân 11"
        price={2.5}
        location="Hà Nội"
        status="Đã đặt"
        usage={90}
        imageUrl="/football-field.jpg"
        />
        </div>
      </div>
      {/* Main Content - Screen 4 */}
      <div className="flex flex-row justify-around items-center  w-full h-[500px] bg-stone-950 text-cyan-50 text-6xl font-bold font-['Russo_One'] gap-10">
      <h1>Đăng ký ngay để trở thành hội viên 
        <br/> 
        với nhiều ưu đãi</h1>
      <div className = "flex flex-row gap-8" >
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
