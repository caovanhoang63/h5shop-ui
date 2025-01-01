import Container from "@/layouts/components/Container.tsx";
import { Input } from "@/components/ui/input.tsx";
import { FileInput, FileOutputIcon, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import TriangleDown from "@/components/icons/TriangleDown.tsx";
import { DataTableDemo } from "@/pages/product/DataTable.tsx";
import {
  ButtonVisibilityColumnTable,
  MenuVisibilityColumnTable,
} from "@/components/ButtonVisibilityColumnTable.tsx";
import { Fragment, useEffect, useState } from "react";
import { CardCategoryFilter } from "@/pages/product/CardCategoryFilter.tsx";
import { CardBrandFilter } from "@/pages/product/CardBrandFilter.tsx";
import { getBrands } from "@/pages/product/api/brandApi.ts";
import { Brand } from "@/types/brand/brand.ts";
import { getCategories } from "@/pages/product/api/categoryApi.ts";
import { Category } from "@/types/category/category.ts";
import SpuModal from "@/pages/product/SpuModal.tsx";
import { SpuListTable } from "@/types/spu/spuListTable.ts";
import { getSpuListTable } from "@/pages/product/api/spuApi.ts";
import { SpuFilter } from "@/types/spu/spuFilter.ts";
import { Paging } from "@/types/paging.ts";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation.tsx";
import CategoryModal from "@/pages/product/CategoryModal.tsx";

export default function ProductPage() {
  const [fields, setFields] = useState<MenuVisibilityColumnTable[]>([
    { label: "Mã", key: "id", visible: true },
    { label: "Ảnh", key: "images", visible: true },
    { label: "Tên sản phẩm", key: "name", visible: true },
    { label: "Thương hiệu", key: "brandName", visible: true },
    { label: "Nhóm hàng", key: "categoryName", visible: true },
    { label: "Mô tả", key: "description", visible: true },
  ]);
  const [isOpenModalAdd, setIsOpenModalAdd] = useState<boolean>(false);
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState<boolean>(false);
  const [categoryUpdate, setCategoryUpdate] = useState<Category>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [brandSelected, setBrandSelected] = useState<string>("0");
  const [listBrands, setListBrands] = useState<Brand[]>([]);
  const [categorySelected, setCategorySelected] = useState<number>();
  const [listCategories, setListCategories] = useState<Category[]>([]);
  const [isOpenModalSpu, setIsOpenModalSpu] = useState<boolean>(false);
  const [spuList, setSpuList] = useState<SpuListTable[]>([]);
  const [spuIdSelected, setSpuIdSelected] = useState<number>();
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const [paging, setPaging] = useState<Paging>({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [spuFilter, setSpuFilter] = useState<SpuFilter>({
    name: "",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    setIsLoading(true);
    // Fetch data
    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSpuListTable();
    console.log(spuFilter);
    setPaging({ ...paging, page: spuFilter.page ?? 1 });
  }, [spuFilter]);

  const fetchBrands = async () => {
    try {
      const response = await getBrands();
      setListBrands(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const fetchSpuListTable = async () => {
    try {
      setIsLoading(true);
      const response = await getSpuListTable(spuFilter);
      console.log(response);
      setSpuList(response.data);
      setPaging(response.paging);
      setIsLoading(false);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      console.log(response);
      setListCategories(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleChangedBrand = (brandId: string) => {
    console.log(brandSelected);
    console.log(brandId);
    setBrandSelected(brandId);
    setSpuFilter({ ...spuFilter, brandId: Number(brandId), page: 1 });
  };

  const handleCheckField = (key: string, visible: boolean) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.key === key ? { ...field, visible } : field,
      ),
    );
  };

  const handleCloseModalSpu = () => {
    setIsOpenModalSpu(false);
  };

  const handleSelectItemTable = (spuId: number) => {
    setSpuIdSelected(spuId);
    setIsAdd(false);
    setIsOpenModalSpu(true);
  };

  const handleChangeCategory = (categoryId: number) => {
    console.log(categorySelected);
    setCategorySelected(categoryId);
    setSpuFilter({ ...spuFilter, categoryId: categoryId, page: 1 });
  };

  const handleSetPaging = (page: number) => {
    setPaging({ ...paging, page });
    setSpuFilter({ ...spuFilter, page });
  };

  const handleClickEditCategory = (item: Category) => {
    console.log(item);
    setCategoryUpdate(item);
    setIsOpenModalUpdate(true);
  };

  const handleCategoryActionSuccess = () => {
    fetchCategories();
  };

  const handleClickAddCategory = () => {
    setIsOpenModalAdd(true);
  };

  return (
    <Fragment>
      {isLoading && <LoadingAnimation></LoadingAnimation>}
      <Container className={"grid grid-cols-5 gap-4 grid-flow-row"}>
        <div className={"text-2xl col-span-1 font-bold"}>
          <p>Hàng hóa</p>
        </div>
        <div className={"col-span-4 w-full flex  justify-between"}>
          <div className="relative flex items-center max-w-80">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              className={"pl-9"}
              placeholder={"Theo mã, tên hàng"}
              value={spuFilter.name}
              onChange={(e) =>
                setSpuFilter({ ...spuFilter, name: e.target.value, page: 1 })
              }
            />
          </div>
          <div className={"flex space-x-2"}>
            <Button
              className={"bg-green-500"}
              onClick={() => {
                setIsOpenModalSpu(true);
                setIsAdd(true);
              }}
            >
              <Plus />
              Thêm mới
              <TriangleDown />
            </Button>
            <Button className={"bg-green-500"}>
              <FileInput />
              Import
            </Button>
            <Button className={"bg-green-500"}>
              <FileOutputIcon />
              Xuất file
            </Button>
            <ButtonVisibilityColumnTable
              menus={fields}
              onCheckChange={handleCheckField}
            />
          </div>
        </div>
        <div className={"col-span-1 space-y-4"}>
          <CardCategoryFilter
            listCategories={listCategories}
            setCategorySelected={(categoryId) =>
              handleChangeCategory(categoryId)
            }
            onClickEdit={handleClickEditCategory}
            onClickAdd={handleClickAddCategory}
          />
          <CardBrandFilter
            onChange={handleChangedBrand}
            listBrands={listBrands}
          />
        </div>
        <div className={"col-span-4"}>
          <DataTableDemo
            columnVisible={fields}
            spuListTable={spuList}
            onSelectedRow={handleSelectItemTable}
            paging={paging}
            setPaging={handleSetPaging}
          ></DataTableDemo>
        </div>
        <SpuModal
          isAdd={isAdd}
          isOpen={isOpenModalSpu}
          onOpenChange={handleCloseModalSpu}
          listCategories={listCategories}
          listBrands={listBrands}
          spuIdSelected={spuIdSelected}
        />
        <CategoryModal
          isOpen={isOpenModalAdd}
          onOpenChange={setIsOpenModalAdd}
          isAdd={true}
          listCategories={listCategories}
          actionSuccess={handleCategoryActionSuccess}
        />
        {/*Modal update*/}
        <CategoryModal
          isOpen={isOpenModalUpdate}
          onOpenChange={setIsOpenModalUpdate}
          isAdd={false}
          listCategories={listCategories}
          category={categoryUpdate}
          actionSuccess={handleCategoryActionSuccess}
        />
      </Container>
    </Fragment>
  );
}
