import { Card } from "@/components/ui/card.tsx";
import { ImageIcon } from "lucide-react";
import { SkuGetDetail } from "@/types/sku/skuGetDetail.ts";
import { formatCurrency } from "@/utils/convert.ts";

export function SkuCard({ name, price, images }: SkuGetDetail): JSX.Element {
  return (
    <Card className="px-2 py-3 flex flex-wrap items-center gap-2 w-48 h-24 hover:border-primary">
      {/* Image Section */}
      <div className="w-16 h-16 flex-shrink-0 bg-gray-200 flex items-center justify-center rounded">
        {images && images.length > 0 ? (
          <img
            src={images[0].url}
            alt={name}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <ImageIcon className="text-gray-400 w-8 h-8" />
        )}
      </div>

      {/* Name and Price Section */}
      <div className="flex flex-col flex-grow">
        {/* Product Name */}
        <div className="text-sm font-medium max-w-24 text-gray-800 line-clamp-2">
          {name}
        </div>
        {/* Product Price */}
        <div className="text-sm font-semibold text-primary mt-2">
          {formatCurrency(price)}
        </div>
      </div>
    </Card>
  );
}

// export function SpuCard2({ name, price, imageUrl }: SpuCardProps): JSX.Element {
//   return (
//     <Card className="flex flex-col items-center w-36 h-44 bg-white shadow hover:border-primary p-2 rounded-md">
//       {/* Image Section */}
//       <div className="relative w-full h-28 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
//         {imageUrl ? (
//           <img
//             src={imageUrl}
//             alt={name}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <ImageIcon className="text-gray-400 w-12 h-12" />
//         )}
//         {/* Price on top of the image */}
//         <div className="absolute bottom-2 left-2 bg-white bg-opacity-80 px-2 py-1 rounded-sm shadow text-primary font-bold text-sm">
//           {price.toLocaleString("vi-VN")}
//         </div>
//       </div>
//
//       {/* Name Section */}
//       <div className="mt-2 text-center text-sm font-medium text-gray-800 line-clamp-2">
//         {name}
//       </div>
//     </Card>
//   );
// }
