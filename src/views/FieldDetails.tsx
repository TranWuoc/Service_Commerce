"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FieldInfo from "../components/Field/FieldInfo";
import FieldPictureGallery from "../components/Field/FieldPictureGallery";

const FieldDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [field, setField] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchField = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/fields/${id}`);
        if (!res.ok) throw new Error("Không thể lấy dữ liệu sân");
        const json = await res.json();
        setField(json.data);
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    };

    fetchField();
  }, [id]);

  if (loading)
    return <div className="text-center py-10 text-gray-600">Đang tải dữ liệu sân...</div>;

  if (error || !field)
    return (
      <div className="text-center py-10 text-red-600 font-semibold">
        {error || "Không tìm thấy sân"}
      </div>
    );

  const fieldImages = field.images?.length
    ? field.images.map((img: any) => ({
        id: img.id,
        image_url: `http://localhost:8000/${img.image_url}`,
      }))
    : [
        {
          id: "1",
          image_url:
            "https://images.unsplash.com/photo-1543351611-58f69d7c1781?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "2",
          image_url:
            "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
          id: "3",
          image_url:
            "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        },
        {
          id: "4",
          image_url:
            "https://images.pexels.com/photos/863105/pexels-photo-863105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        },
        {
          id: "5",
          image_url:
            "https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        },
      ];

  return (
    <div className="overflow-hidden h-[80vh] bg-neutral-100 py-6 px-4">
      <div className="flex flex-col w-full max-w-[1000px] mx-auto">
        <div className="flex w-full gap-8 max-md:flex-col max-md:gap-4 items-center">
          <div className="flex-shrink-0 w-[30%] max-md:w-full max-md:mb-4">
            <FieldInfo field={field} />
          </div>
          <div className="flex-grow w-full h-[80vh]">
            <FieldPictureGallery images={fieldImages} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetails;
