// Xử lý ảnh mới được chọn
import { toast } from "../hooks/use-toast";
export const handleImageSelection = (
    files: FileList | null,
    images: File[],
    setImages: React.Dispatch<React.SetStateAction<File[]>>,
    setPreviews: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (!files) return;
    const selected = Array.from(files).slice(0, 3 - images.length); // Max 3 images
  
    setImages((prev) => [...prev, ...selected]);
  
    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result)
          setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  // Xóa ảnh
  export const handleImageDeletion = (
    id: string,
    index: number,
    setFieldData: React.Dispatch<React.SetStateAction<any>>,
    setDeletedImageIds: React.Dispatch<React.SetStateAction<string[]>>,
    setPreviews: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setFieldData((prev: { images: { id: string }[] } | null) =>
      prev
        ? {
            ...prev,
            images: prev.images.filter((image: { id: string }) => image.id !== id),
          }
        : null
    );
    setDeletedImageIds((prev) => [...prev, id]);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Xử lý khi chọn ảnh mới
export const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    images: File[],
    setImages: React.Dispatch<React.SetStateAction<File[]>>,
    setPreviews: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    console.log("Image selected:", e.target.files);
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 3) {
        toast({
          title: "Error",
          description: "Bạn chỉ có thể thêm tối đa 3 ảnh.",
          variant: "destructive",
        });
        console.log("Số lượng ảnh vượt quá giới hạn: ", images.length + files.length);
        return;
      }
    const selected = files.slice(0, 3 - images.length); // Max 3 images
  
    setImages((prev) => [...prev, ...selected]);
  
    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result)
          setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Xử lý khi xóa ảnh
export const handleDeleteImage = (
    id: string,
    index: number,
    setFieldData: React.Dispatch<React.SetStateAction<any>>,
    setDeletedImageIds: React.Dispatch<React.SetStateAction<string[]>>,
    setPreviews: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setFieldData((prev: { images: { id: string }[] } | null) =>
      prev
        ? {
            ...prev,
            images: prev.images.filter((image: { id: string }) => image.id !== id),
          }
        : null
    );
    setDeletedImageIds((prev) => [...prev, id]);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };