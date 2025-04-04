"use client";
import * as React from "react";
import  CustomerSidebar  from "../components/Customer/CustomerSidebar";
import  Avatar  from "../components/Shared_components/Avatar";



function FieldInfo() {
  const [fieldInfo, setFieldInfo] = React.useState<FieldInfo | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchFieldInfo = async () => {
      try {
        setLoading(true);
        const response = await getFieldInfo("field-id"); // Replace with actual field ID
        if (response.success) {
          setFieldInfo(response.data);
        } else {
          setError(response.error || "Failed to fetch field information");
        }
      } catch (err) {
        setError("An error occurred while fetching field information");
      } finally {
        setLoading(false);
      }
    };

    fetchFieldInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-neutral-100" space={60}>
      <div className="flex gap-5 max-md:flex-col max-md:">
        <div className="w-[16%] max-md:ml-0 max-md:w-full">
          <CustomerSidebar />
        </div>
        <div className="ml-5 w-[84%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col mt-9 w-full max-md:mt-10 max-md:max-w-full">
            <div className="flex flex-wrap gap-5 justify-between w-full max-w-[1125px] max-md:max-w-full">
              <div>
                <div className="text-xl font-semibold tracking-normal text-neutral-950">
                  Hello, Jonitha
                </div>
                <div className="text-sm tracking-wide text-neutral-500">
                  Have a nice day
                </div>
              </div>
              <div className="flex gap-6 items-center my-auto rotate-[-0.0010366505695354568rad] text-neutral-950">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/5a8897a303787c33adfc3f6a93b294368267db6b?placeholderIfAbsent=true&apiKey=47da06657b0341d7b84c9cc9467a69da"
                  className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                />
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/c6b30ed6daf85cf69067dcee6af814281b117ddb?placeholderIfAbsent=true&apiKey=47da06657b0341d7b84c9cc9467a69da"
                  className="object-contain shrink-0 self-stretch my-auto w-0 stroke-[1px] stroke-stone-300"
                />
                <div className="flex gap-4 items-center self-stretch pr-2 my-auto">
                  <Avatar />
                  <div className="flex gap-4 items-center self-stretch my-auto">
                    <div className="self-stretch my-auto w-[110px]">
                      <div className="text-base font-semibold tracking-wide">
                        Jonitha Roy
                      </div>
                      <div className="text-xs tracking-wide">User</div>
                    </div>
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/bd34411aa1b537509ba138408525bbd7a46eb3c3?placeholderIfAbsent=true&apiKey=47da06657b0341d7b84c9cc9467a69da"
                      className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-10 self-end mt-14 w-full max-w-[1171px] max-md:mt-10 max-md:max-w-full">
              <div className="flex-auto max-md:max-w-full" space={16}>
                <div className="flex gap-5 max-md:flex-col max-md:">
                  <div className="w-[34%] max-md:ml-0 max-md:w-full">
                    <div className="self-stretch my-auto w-full max-md:mt-10">
                      <div className="flex flex-col items-end py-8 pr-1.5 w-full bg-white rounded-[30px] shadow-[0px_0px_15px_rgba(0,0,0,0.15)]">
                        <div className="flex gap-2 max-w-full text-lg text-slate-800 w-[315px] max-md:mr-1">
                          <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a15a3baac20f68d94588dce7d605379edf84dd5c?placeholderIfAbsent=true&apiKey=47da06657b0341d7b84c9cc9467a69da"
                            className="object-contain shrink-0 self-start aspect-[0.79] w-[19px]"
                          />
                          <div className="flex flex-col grow shrink-0 basis-0 w-fit">
                            <div className="self-start">{fieldInfo?.name}</div>
                            <div className="flex flex-col px-px mt-2">
                              <img
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/94865d6dff9d0093d353e0c56f0773505d4215db?placeholderIfAbsent=true&apiKey=47da06657b0341d7b84c9cc9467a69da"
                                className="object-contain w-full aspect-[333.33]"
                              />
                              <div className="self-start mt-3 max-md:ml-2">
                                {fieldInfo?.phone}
                              </div>
                            </div>
                          </div>
                        </div>
                        <img
                          src={fieldInfo?.imageUrl}
                          className="object-contain self-stretch mt-6 w-full aspect-[333.33] max-md:mr-1"
                        />
                        <div className="flex gap-4 items-start mt-4 text-sm text-center">
                          <div className="flex flex-col">
                            <div className="self-start font-semibold uppercase text-stone-300">
                              Giá sân
                            </div>
                            <div className="mt-2 font-bold text-slate-800">
                              {fieldInfo?.price}
                            </div>
                          </div>
                          <div className="flex flex-col self-stretch">
                            <div className="self-center font-semibold uppercase text-stone-300">
                              Kiểu sân
                            </div>
                            <div className="mt-2.5 font-bold text-slate-800">
                              {fieldInfo?.type}
                            </div>
                          </div>
                          <div className="font-semibold uppercase text-stone-300">
                            Tình trạng
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-5 justify-between mt-5 text-base font-bold leading-none text-center text-white max-md:ml-2.5">
                        <button className="px-10 py-4 bg-amber-500 rounded-[34px] shadow-[0px_0px_41px_rgba(0,0,0,0.25)] max-md:px-5">
                          Đặt sân
                        </button>
                        <button className="px-9 py-4 bg-amber-500 rounded-[34px] shadow-[0px_0px_41px_rgba(0,0,0,0.25)] max-md:px-5">
                          Bình luận
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="ml-5 w-[66%] max-md:ml-0 max-md:w-full">
                    <div className="flex flex-wrap grow max-md:mt-4">
                      <div className="flex shrink-0 self-end bg-black bg-opacity-0 h-[25px] mt-[542px] w-[25px] max-md:mt-10" />
                      <div className="flex relative flex-col grow shrink-0 justify-center px-3.5 py-72 rounded-none basis-0 min-h-[626px] w-fit max-md:py-24 max-md:pr-5 max-md:max-w-full">
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/fb3d2853a0fc16002d4ec9c0f5f4843ad61e4791?placeholderIfAbsent=true&apiKey=47da06657b0341d7b84c9cc9467a69da"
                          className="object-cover absolute inset-0 size-full"
                        />
                        <div className="flex relative flex-wrap gap-5 justify-between max-md:max-w-full">
                          <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2edeed5233d7c3d2a10db51f92ab9069c566da49?placeholderIfAbsent=true&apiKey=47da06657b0341d7b84c9cc9467a69da"
                            className="object-contain shrink-0 w-6 aspect-[0.34]"
                          />
                          <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/299829980b22cfe17f9229c10c4b144fd18a2ee8?placeholderIfAbsent=true&apiKey=47da06657b0341d7b84c9cc9467a69da"
                            className="object-contain shrink-0 w-6 aspect-[0.34]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 self-end w-2 bg-black bg-opacity-0 h-[25px] mt-[541px] max-md:mt-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FieldInfo;
