import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Fragment, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { BanIcon, FileInput, Plus, Trash2Icon } from "lucide-react";
import { ItemAttrSku } from "@/pages/product/ItemAttrSku.tsx";
import { ItemSku } from "@/pages/product/ItemSku.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { CardCategorySelect } from "@/pages/product/CategorySelect.tsx";
import { InputUploadImage } from "@/components/InputUploadImage.tsx";
import { Category } from "@/types/category/category.ts";
import { Brand } from "@/types/brand/brand.ts";
import {
  MetadataSpu,
  SkuAttrCreate,
  SkuCreate,
  SpuUpsert,
} from "@/types/spu/spuUpsert.ts";
import {
  deleteSpu,
  getSpuDetail,
  upsertSpuDetail,
} from "@/pages/product/api/spuApi.ts";
import { Image } from "@/types/image.ts";
import { SkuProvider, SpuDetail } from "@/types/spu/spuGetDetail.ts";
import { deleteSkuAttr } from "@/pages/product/api/skuAttrApi.ts";
import { deleteSku } from "@/pages/product/api/skuApi.ts";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation.tsx";
import { EnumTime } from "@/types/enumTime.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";

interface ISpuModalProps {
  isOpen: boolean;
  isAdd: boolean;
  onOpenChange: (isOpen: boolean) => void;
  listCategories: Category[];
  listBrands: Brand[];
  spuIdSelected?: number;
}

export default function SpuModal({
  isOpen,
  isAdd,
  onOpenChange,
  listCategories,
  listBrands,
  spuIdSelected,
}: ISpuModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [id, setId] = useState<number>();
  const [name, setName] = useState<string>("");
  const [brandId, setBrandId] = useState<number>();
  const [categoryId, setCategoryId] = useState<number>();
  const [description, setDescription] = useState<string>("");
  const [metadata, setMetadata] = useState<MetadataSpu>({ position: "" });
  const [skus, setSkus] = useState<SkuCreate[]>([]);
  const [attrs, setAttrs] = useState<SkuAttrCreate[]>([]);
  const [image, setImage] = useState<Image>();
  const [listProviders, setListProviders] = useState<SkuProvider[]>([]);
  const [typeTimeWarranty, setTypeTimeWarranty] = useState<EnumTime>(
    EnumTime.DAY,
  );
  const [typeTimeReturn, setTypeTimeReturn] = useState<EnumTime>(EnumTime.DAY);
  const [timeWarranty, setTimeWarranty] = useState<number>(0);
  const [timeReturn, setTimeReturn] = useState<number>(0);

  const [spuDetail, setSpuDetail] = useState<SpuDetail>();

  useEffect(() => {
    // clear data when open modal
    if (isOpen && isAdd) {
      setId(undefined);
      setName("");
      setBrandId(undefined);
      setCategoryId(undefined);
      setDescription("");
      setMetadata({ position: "" });
      setSkus([]);
      setAttrs([]);
      setImage(undefined);
      setSpuDetail(undefined);
      setDefaultWarrantyReturn();
      setListProviders([]);
    } else {
      if (spuIdSelected && spuIdSelected > 0) {
        fetchSpuDetail(spuIdSelected);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    setId(spuDetail?.id);
    setName(spuDetail?.name || "");
    setBrandId(spuDetail?.brandId || 0);
    setCategoryId(spuDetail?.categoryId || 0);
    setDescription(spuDetail?.description || "");
    setMetadata((spuDetail?.metadata as MetadataSpu) || { position: "" });
    setImage(spuDetail?.images?.[0]);
    setSkus((spuDetail?.skus as SkuCreate[]) || []);
    setAttrs((spuDetail?.attrs as SkuAttrCreate[]) || []);
    setListProviders(spuDetail?.providers || []);
  }, [spuDetail]);

  const CallApiUpsertSpuDetail = async (spu: SpuUpsert) => {
    try {
      setIsLoading(true);
      await upsertSpuDetail(spu);
      setIsLoading(false);
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  };

  const CallApiDeleteSkuAttr = async (id: number, index: number) => {
    try {
      await deleteSkuAttr(id, index);
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  };

  const CallApiDeleteSku = async (id: number) => {
    try {
      await deleteSku(id);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const fetchSpuDetail = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await getSpuDetail(id);
      console.log(response.data);
      setSpuDetail(response.data.spuDetail);
      setIsLoading(false);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const CallApiDeleteSpu = async (id: number) => {
    try {
      setIsLoading(true);
      await deleteSpu(id);
      setIsLoading(false);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleAddAttr = () => {
    setAttrs((prev) => [
      ...prev,
      {
        spuId: 0,
        dataType: "text",
        value: [""],
      } as SkuAttrCreate,
    ]);
  };

  const setDefaultWarrantyReturn = () => {
    setTimeWarranty(0);
    setTimeReturn(0);
    setTypeTimeReturn(EnumTime.DAY);
    setTypeTimeWarranty(EnumTime.DAY);
  };

  const handleDeleteAttr = (index: number) => {
    // neu co id thi goi api xoa
    if (attrs[index].id) {
      CallApiDeleteSkuAttr(attrs[index].id, index).then(() => {
        setAttrs((prev) => prev.filter((_, i) => i !== index));
        // Xoa skuTierIdx trong skus tuong ung
        setSkus((prev) =>
          prev.map((item) => {
            return {
              ...item,
              skuTierIdx: item.skuTierIdx?.filter((_, i) => i !== index),
            };
          }),
        );
      });
    } else {
      setAttrs((prev) => prev.filter((_, i) => i !== index));
      // Xoa skuTierIdx trong skus tuong ung
      setSkus((prev) =>
        prev.map((item) => {
          return {
            ...item,
            skuTierIdx: item.skuTierIdx?.filter((_, i) => i !== index),
          };
        }),
      );
    }
  };

  const handleDeleteSku = (index: number) => {
    if (skus[index].id) {
      CallApiDeleteSku(skus[index].id).then(() => {
        setSkus((prev) => prev.filter((_, i) => i !== index));
      });
    } else {
      setSkus((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSetTypeTimeWarranty = (value: string) => {
    setTypeTimeWarranty(value as EnumTime);
  };

  const handleSetTypeTimeReturn = (value: string) => {
    setTypeTimeReturn(value as EnumTime);
  };

  const handleAddSku = () => {
    setSkus((prev) => [
      ...prev,
      {
        spuId: 0,
        costPrice: 0,
        price: 0,
        stock: 0,
      } as SkuCreate,
    ]);
  };

  const handleSetCategory = (id: number | null) => {
    if (id) {
      setCategoryId(id);
    }
  };

  const mapSpuUpsert = () => {
    const spuTest = {
      id: id,
      name: name,
      description: description,
      categoryId: categoryId,
      brandId: brandId,
      images: [image],
      metadata: metadata,
      skus: skus,
      attrs: attrs,
    };
    console.log(spuTest);
    CallApiUpsertSpuDetail(spuTest as SpuUpsert)
      .then(() => {
        console.log("Success");
        alert("Thêm mới spu thành công");
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };

  return (
    <Fragment>
      {isLoading && <LoadingAnimation />}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-screen-xl min-h-[calc(100vh-30%)] flex flex-col">
          <DialogHeader>
            <DialogTitle>Chi tiết sản phẩm</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="spu" className="grow">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="spu">Thông tin chung</TabsTrigger>
              <TabsTrigger value="attr">Thuộc tính</TabsTrigger>
              <TabsTrigger value="sku">Sản phẩm</TabsTrigger>
            </TabsList>

            <TabsContent value="spu">
              <Card>
                <CardContent className="space-y-2 space-x-12 flex flex-row mt-6">
                  <div>
                    <InputUploadImage
                      height={"320px"}
                      width={"320px"}
                      image={image}
                      setImage={setImage}
                    />
                  </div>
                  <div className={"flex flex-col flex-1"}>
                    <div className={"flex flex-row space-x-14"}>
                      <div className={"flex flex-col flex-1 space-y-5"}>
                        <div className={"flex flex-row items-center"}>
                          <Label className={"w-5/12"} htmlFor="name">
                            Tên sản phẩm
                          </Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className={"flex flex-row items-center"}>
                          <Label className={"w-5/12"} htmlFor="name">
                            Thương hiệu
                          </Label>
                          <Select
                            onValueChange={(value) => {
                              console.log(value);
                              setBrandId(parseInt(value));
                            }}
                            value={brandId?.toString()}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={"Chọn thương hiệu"}>
                                {listBrands.find(
                                  (brand) => brand.id === brandId,
                                )?.name || "Chọn thương hiệu"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Thương hiệu</SelectLabel>
                                {listBrands.map((brand) => (
                                  <SelectItem
                                    value={brand.id.toString()}
                                    key={brand.id}
                                  >
                                    {brand.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className={"flex flex-row items-center"}>
                          <Label className={"w-5/12"} htmlFor="name">
                            Nhóm hàng
                          </Label>
                          <CardCategorySelect
                            listCategories={listCategories}
                            isAdd={true}
                            setParentId={handleSetCategory}
                            parentIdSelected={categoryId}
                          />
                        </div>
                      </div>
                      <div className={"flex flex-col space-y-5"}>
                        <div className={"flex flex-row items-center"}>
                          <Label className={"w-5/12"}>Vị trí</Label>
                          <Input
                            value={metadata.position}
                            onChange={(e) => {
                              setMetadata({
                                ...metadata,
                                position: e.target.value,
                              });
                            }}
                          />
                        </div>

                        <div className={"flex flex-row items-center"}>
                          <Label className={"w-5/12"}>Mô tả</Label>
                          <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={"flex flex-col mt-4 space-y-3"}>
                      <div
                        className={
                          "flex h-8 w-full items-center bg-gray-200 rounded"
                        }
                      >
                        <Label className={"ml-4"} style={{ fontSize: "16px" }}>
                          Bảo hành
                        </Label>
                      </div>

                      <div className={"flex flex-row flex-1 space-x-16"}>
                        <div
                          className={
                            "flex flex-row flex-1 items-center space-x-2"
                          }
                        >
                          <Label className={"w-10/12"}>
                            Thời gian bảo hành
                          </Label>
                          <Input
                            type={"number"}
                            style={{ width: "100px" }}
                            value={timeWarranty}
                            onChange={(e) =>
                              setTimeWarranty(parseInt(e.target.value))
                            }
                          />
                          <Select
                            defaultValue={EnumTime.DAY}
                            value={typeTimeWarranty.toString()}
                            onValueChange={(value) =>
                              handleSetTypeTimeWarranty(value)
                            }
                          >
                            <SelectTrigger style={{ width: "150px" }}>
                              <SelectValue></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={EnumTime.DAY}>Ngày</SelectItem>
                              <SelectItem value={EnumTime.MONTH}>
                                Tháng
                              </SelectItem>
                              <SelectItem value={EnumTime.YEAR}>Năm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div
                          className={
                            "flex flex-row flex-1 items-center space-x-2"
                          }
                        >
                          <Label className={"w-10/12"}>Thời gian đổi trả</Label>
                          <Input
                            id="name"
                            type={"number"}
                            style={{ width: "100px" }}
                            value={timeReturn}
                            onChange={(e) =>
                              setTimeReturn(parseInt(e.target.value))
                            }
                          />
                          <Select
                            defaultValue={EnumTime.DAY}
                            value={typeTimeReturn.toString()}
                            onValueChange={(value) =>
                              handleSetTypeTimeReturn(value)
                            }
                          >
                            <SelectTrigger style={{ width: "150px" }}>
                              <SelectValue></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={EnumTime.DAY}>Ngày</SelectItem>
                              <SelectItem value={EnumTime.MONTH}>
                                Tháng
                              </SelectItem>
                              <SelectItem value={EnumTime.YEAR}>Năm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className={"flex flex-col mt-4"}>
                      <div
                        className={
                          "flex h-8 w-full items-center bg-gray-200 rounded"
                        }
                      >
                        <Label className={"ml-4"} style={{ fontSize: "16px" }}>
                          Nhà cung cấp
                        </Label>
                      </div>

                      <Table className={"h-full"}>
                        <TableHeader>
                          <TableRow className={"gap-3"}>
                            <TableHead className="w-[50px]">STT</TableHead>
                            <TableHead>Tên nhà cung cấp</TableHead>
                            <TableHead>Số điện thoại</TableHead>
                            <TableHead className="text-center">Email</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {listProviders.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="text-blue-600">
                                {item.name}
                              </TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell className="text-center">
                                {item.phone}
                              </TableCell>
                              <TableCell className="text-center">
                                {item.email}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="attr">
              <Card>
                <CardHeader>
                  <Label style={{ fontSize: "16px" }}>
                    Danh sách thuộc tính
                  </Label>
                </CardHeader>
                <CardContent className="space-y-4">
                  {attrs.map((_, index) => (
                    <ItemAttrSku
                      key={index}
                      onDeleted={() => handleDeleteAttr(index)}
                      attribute={attrs[index]}
                      indexAttr={index}
                      setAttribute={(index, attribute) => {
                        setAttrs((prev) =>
                          prev.map((item, i) =>
                            i === index ? attribute : item,
                          ),
                        );
                      }}
                    />
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    className={"bg-green-500 hover:bg-green-600"}
                    onClick={() => handleAddAttr()}
                  >
                    <Plus />
                    Thêm thuộc tính
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="sku">
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách sản phẩm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-20">
                  <ScrollArea style={{ height: "360px" }}>
                    <div className={"flex flex-col p-4 space-y-20"}>
                      {skus.map((item, index) => (
                        <ItemSku
                          key={index}
                          onDeleted={() => handleDeleteSku(index)}
                          attribute={attrs}
                          indexSku={index}
                          sku={item}
                          setSku={(index, sku) => {
                            setSkus((prev) =>
                              prev.map((item, i) => (i === index ? sku : item)),
                            );
                          }}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <Button
                    className={"bg-green-500 hover:bg-green-600"}
                    onClick={() => handleAddSku()}
                  >
                    <Plus />
                    Thêm sản phẩm
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          <DialogFooter className="">
            <div className={"flex flex-row space-x-2 justify-end"}>
              {isAdd && (
                <Button
                  className={"bg-green-500 hover:bg-green-600"}
                  onClick={() => mapSpuUpsert()}
                >
                  <Plus />
                  Thêm mới
                </Button>
              )}
              {!isAdd && (
                <Button
                  className={"bg-green-500 hover:bg-green-600"}
                  onClick={() => mapSpuUpsert()}
                >
                  <FileInput />
                  Lưu
                </Button>
              )}
              {!isAdd && (
                <Button
                  className={"bg-red-500 hover:bg-red-600"}
                  onClick={() => {
                    if (spuIdSelected) {
                      CallApiDeleteSpu(spuIdSelected);
                    }
                  }}
                >
                  <Trash2Icon />
                  Xóa
                </Button>
              )}
              <Button
                className={"bg-gray-500 hover:bg-gray-600"}
                onClick={() => onOpenChange(false)}
              >
                <BanIcon />
                Bỏ qua
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
