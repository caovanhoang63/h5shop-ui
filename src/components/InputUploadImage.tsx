import { Input } from "@/components/ui/input.tsx";
import { useEffect, useRef, useState } from "react";
import { CircleX } from "lucide-react";
import { uploadImage } from "@/pages/product/api/spuApi.ts";

export function InputUploadImage({
  width = "192px",
  height = "192px",
}: {
  width?: string;
  height?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>();

  useEffect(() => {}, []);

  const CallApiUpLoadImage = async (file: File) => {
    try {
      const res = uploadImage(file);
      console.log(res);
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  const handleClickUploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      CallApiUpLoadImage(file);
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
  };
  return (
    <div className={"flex flex-col items-center"}>
      <div
        className={"border-2 border-gray-300 rounded-lg relative group"}
        style={{
          width: width,
          height: height,
        }}
      >
        <img
          src={
            image
              ? image.toString()
              : "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="
          }
          alt={"preview"}
          className={"w-full h-full object-cover rounded-lg cursor-pointer"}
          onClick={handleClickUploadImage}
        />
        <Input
          ref={fileInputRef}
          type={"file"}
          onChange={handleUploadImage}
          className={"hidden"}
          accept={".jpg,.png,.webp"}
        />
        <div
          className="text-gray-500 absolute top-0 right-0 opacity-0 group-hover:opacity-100 cursor-pointer"
          style={{
            backgroundColor: "red",

            borderRadius: "10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            transform: "translate(50%, -50%)",
          }}
          onClick={handleDeleteImage}
        >
          <CircleX className={"w-5 h-5"} color={"white"} />
        </div>
      </div>
    </div>
  );
}
