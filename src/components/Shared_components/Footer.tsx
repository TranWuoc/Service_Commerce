import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
function Footer() {
  return (
    <div className=" bg-gray-900 text-white py-8 px-4">
      <div className="flex flex-row justify-around items-center mb-4">
        <div className="flex flex-col  mb-4">
          <h2 className="text-2xl text-orange-400 font-bold mb-4 gap-5">
            SupperBowl
          </h2>
          <p className="text-lg ">
            Theo dõi chúng tôi qua các nền tảng để <br />
            nhận được các thông tin mới nhất cũng như <br />
            các ưu đãi đối với khách hàng.
          </p>
          <div className="flex flex-row gap-4 mt-4">
            <Avatar>
              <AvatarImage src="/Logo_fb.png" />
              <AvatarFallback>FB</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="/Logo_In.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="/logo_ins.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="/Logo_twt.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="flex flex-col  mb-4">
          <h2 className="text-2xl text-white font-bold mb-4 gap-5">Pages</h2>
          <p className="text-lg ">About us</p>
          <p className="text-lg ">Contact Info</p>
          <p className="text-lg ">Track Location</p>
          <p className="text-lg ">Career</p>
        </div>
        <div className="flex flex-col  mb-4">
          <h2 className="text-2xl text-white font-bold mb-4 gap-5">
            Back Links
          </h2>
          <p className="text-lg ">Brand</p>
          <p className="text-lg ">Social Link</p>
          <p className="text-lg ">Company Registration</p>
          <p className="text-lg ">My Orders</p>
        </div>
        <div className="flex flex-col  mb-4">
          <h2 className="text-2xl text-white font-bold mb-4 gap-5">
            Work Hours
          </h2>
          <p className="text-lg ">
            <img
              src="/clock_footer.svg"
              alt="Clock"
              className="w-6 h-6 inline-block mr-2"
            />
            <span className="text-lg">Monday - Friday 24/7</span>
          </p>
          <p className="text-lg ">
            <img
              src="/phone_footer.svg"
              alt="Phone"
              className="w-6 h-6 inline-block mr-2"
            />
            <span className="text-lg">+84 702058551</span>
          </p>
          <p className="text-lg ">
            Our Support and Sales team is available <br />
            24 /7 to answer your queries
          </p>
        </div>
      </div>
      <hr className="border-gray-700 mb-4" />
      <div className="flex flex-row justify-around mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} Copyrights @ 2023 SuperBowl | Design
          by Bulonuocngot & Wuoc
        </p>
        <p>
          Teams of Use | Privacy Policy | Terms & Conditions | Refund
        </p>
      </div>
    </div>
  );
}

export default Footer;
