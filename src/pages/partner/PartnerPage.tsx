import Container from "@/layouts/components/Container.tsx";
import { FileInput, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useCallback, useEffect, useState } from "react";
import PartnerDataTable from "@/pages/partner/components/PartnerDataTable.tsx";
import {
  ButtonVisibilityColumnTable,
  MenuVisibilityColumnTable,
} from "@/components/ButtonVisibilityColumnTable.tsx";
import NewPartnerModal from "@/pages/partner/components/NewPartnerModal.tsx";
import { listProvider } from "@/pages/partner/api/providerApi.ts";
import { Provider, ProviderFilter } from "@/types/provider.ts";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation.tsx";
import { ExportButton } from "@/components/ExportButton.tsx";

export default function PartnerPage() {
  const [isOpenNewPartnerModal, setIsOpenNewPartnerModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [providerData, setProviderData] = useState<Provider[]>([]);
  const [providerFilter, setProviderFilter] = useState<ProviderFilter>({});
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [accordionOpen, setAccordionOpen] = useState<Set<string>>(new Set());
  const [fields, setFields] = useState<MenuVisibilityColumnTable[]>([
    { label: "Mã nhà cung cấp", key: "id", visible: true },
    { label: "Tên nhà cung cấp", key: "name", visible: true },
    { label: "Địa chỉ", key: "address", visible: true },
    { label: "Số điện thoại", key: "phoneNumber", visible: true },
    { label: "Email", key: "email", visible: true },
    { label: "Nợ", key: "debt", visible: true },
    { label: "Trạng thái", key: "status", visible: true },
    { label: "Action", key: "actions", visible: true },
  ]);

  const handleCheckField = (key: string, visible: boolean) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.key === key ? { ...field, visible } : field,
      ),
    );
  };
  const refreshData = async () => {
    await getProviderTableData();
  };
  const handleFilterChange = (newFilter: Partial<ProviderFilter>) => {
    setProviderFilter((prevFilter) => ({
      ...prevFilter,
      ...newFilter,
    }));
  };

  const handleFilterApply = useCallback(() => {
    getProviderTableData();
  }, [providerFilter]);
  const getProviderTableData = async () => {
    setIsLoading(true);
    try {
      console.log("filter: ", providerFilter);
      const response = await listProvider(providerFilter);
      console.log(response);
      setProviderData(response.data);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getProviderTableData();
  }, []);
  if (isLoading) {
    return <LoadingAnimation></LoadingAnimation>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <Container className={"grid grid-cols-5 gap-4 grid-flow-row"}>
      <NewPartnerModal
        refreshData={refreshData}
        isOpen={isOpenNewPartnerModal}
        onOpenChange={setIsOpenNewPartnerModal}
      ></NewPartnerModal>
      <div className={"text-2xl col-span-1 font-bold"}>
        <p>Nhà cung cấp</p>
      </div>
      <div className={"col-span-4 w-full flex  justify-between"}>
        <div className="relative flex items-center max-w-80">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            className={"pl-9"}
            placeholder={"Theo tên nhà cung cấp"}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleFilterChange({ lk_name: e.target.value });
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleFilterApply();
              }
            }}
          />
        </div>
        <div className={"flex space-x-2"}>
          <Button
            className={"bg-green-500"}
            onClick={() => {
              setIsOpenNewPartnerModal(true);
            }}
          >
            <Plus />
            Nhà cung cấp
          </Button>
          <Button className={"bg-green-500"}>
            <FileInput />
            Import
          </Button>
          <ExportButton data={providerData} />
          <ButtonVisibilityColumnTable
            menus={fields}
            onCheckChange={handleCheckField}
          />
        </div>
      </div>
      <div className={"col-span-1 space-y-4"}>
        <Card>
          <CardContent>
            <Accordion
              type="multiple"
              value={Array.from(accordionOpen)}
              onValueChange={(value) => setAccordionOpen(new Set(value))}
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className={"hover:no-underline"}>
                  Nợ hiện tại
                </AccordionTrigger>
                <AccordionContent className={"py-1 px-1 flex flex-col gap-2"}>
                  <div className={"space-y-1"}>
                    <div className="grid grid-cols-4 items-center gap-2">
                      <Label htmlFor="maxWidth">Từ</Label>
                      <div
                        className={"border-b-[1px] col-span-3 bg-background"}
                      >
                        <Input
                          id="from"
                          placeholder="Giá trị"
                          className="border-0 focus-visible:ring-0  rounded-none shadow-none col-span-3 bg-background"
                          value={filterFrom}
                          onChange={(e) => {
                            setFilterFrom(e.target.value);
                            handleFilterChange({
                              gt_debt: parseInt(e.target.value),
                            });
                          }}
                          onKeyPress={(e) => {
                            e.stopPropagation(); // Ngăn sự kiện lan truyền

                            if (e.key === "Enter") {
                              handleFilterApply();
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-2">
                      <Label htmlFor="maxWidth">Đến</Label>
                      <div
                        className={"border-b-[1px] col-span-3 bg-background"}
                      >
                        <Input
                          id="to"
                          placeholder="Giá trị"
                          className="border-0 focus-visible:ring-0  rounded-none shadow-none col-span-3 bg-background"
                          value={filterTo}
                          onChange={(e) => {
                            setFilterTo(e.target.value);
                            handleFilterChange({
                              lt_debt: parseInt(e.target.value),
                            });
                          }}
                          onKeyPress={(e) => {
                            e.stopPropagation(); // Ngăn sự kiện lan truyền
                            if (e.key === "Enter") {
                              handleFilterApply();
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className={"hover:no-underline"}>
                  Trạng thái
                </AccordionTrigger>
                <AccordionContent className={"pb-2"}>
                  <RadioGroup
                    defaultValue="option-one"
                    onValueChange={(value) => {
                      const updatedFilter = { ...providerFilter }; // Giữ các giá trị hiện tại
                      if (value === "option-one") {
                        delete updatedFilter.lk_status; // Xóa bộ lọc trạng thái nếu chọn "Tất cả"
                      } else if (value === "option-two") {
                        updatedFilter.lk_status = 1; // Trạng thái "Đang hoạt động"
                      } else if (value === "option-three") {
                        updatedFilter.lk_status = 0; // Trạng thái "Ngừng hoạt động"
                      }
                      setProviderFilter(updatedFilter); // Cập nhật bộ lọc
                      getProviderTableData(); // Làm mới bảng dữ liệu
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one" className={"font-normal"}>
                        Tất cả
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two" className={"font-normal"}>
                        Đang hoạt động
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three" className={"font-normal"}>
                        Ngừng hoạt động
                      </Label>
                    </div>
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
      <div className={"col-span-4"}>
        <PartnerDataTable
          refreshData={refreshData}
          providerTableData={providerData}
          columnVisible={fields}
        ></PartnerDataTable>
      </div>
    </Container>
  );
}
