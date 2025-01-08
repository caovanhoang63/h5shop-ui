import Container from "@/layouts/components/Container.tsx";
import { Plus, Search } from "lucide-react";
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
import { useEffect, useState } from "react";
import PartnerDataTable from "@/pages/partner/components/PartnerDataTable.tsx";
import {
  ButtonVisibilityColumnTable,
  MenuVisibilityColumnTable,
} from "@/components/ButtonVisibilityColumnTable.tsx";
import NewPartnerModal from "@/pages/partner/components/NewPartnerModal.tsx";
import { listProvider } from "@/pages/partner/api/providerApi.ts";
import { Provider, ProviderFilter } from "@/types/provider.ts";
import { ExportButton } from "@/components/ExportButton.tsx";

export default function PartnerPage() {
  const [isOpenNewPartnerModal, setIsOpenNewPartnerModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [providerData, setProviderData] = useState<Provider[]>([]);
  const [providerFilter, setProviderFilter] = useState<ProviderFilter>({});
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [accordionOpen, setAccordionOpen] = useState<Set<string>>(new Set());
  const [selectedStatus, setSelectedStatus] = useState("option-one"); // New state for RadioGroup
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

  const handleFilterChange = (newFilter: Partial<ProviderFilter>) => {
    setProviderFilter((prevFilter) => ({
      ...prevFilter,
      ...newFilter,
    }));
  };

  const getProviderTableData = async () => {
    try {
      console.log("filter: ", providerFilter);
      const response = await listProvider(providerFilter);
      setProviderData(response.data);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error

      setError(error.response?.data?.message || "Lỗi khi tải dữ liệu.");
    }
  };

  useEffect(() => {
    getProviderTableData();
  }, [providerFilter]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container className={"grid grid-cols-5 gap-4 grid-flow-row"}>
      <NewPartnerModal
        refreshData={getProviderTableData}
        isOpen={isOpenNewPartnerModal}
        onOpenChange={setIsOpenNewPartnerModal}
      />
      <div className={"text-2xl col-span-1 font-bold"}>
        <p>Nhà cung cấp</p>
      </div>
      <div className={"col-span-4 w-full flex justify-between"}>
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
                getProviderTableData();
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
          <ExportButton data={providerData} fileName={"Provider"} />
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
                      <Label htmlFor="from">Từ</Label>
                      <Input
                        id="from"
                        placeholder="Giá trị"
                        value={filterFrom}
                        onChange={(e) => {
                          setFilterFrom(e.target.value);
                          handleFilterChange({
                            gt_debt: parseInt(e.target.value),
                          });
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            getProviderTableData();
                          }
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-2">
                      <Label htmlFor="to">Đến</Label>
                      <Input
                        id="to"
                        placeholder="Giá trị"
                        value={filterTo}
                        onChange={(e) => {
                          setFilterTo(e.target.value);
                          handleFilterChange({
                            lt_debt: parseInt(e.target.value),
                          });
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            getProviderTableData();
                          }
                        }}
                      />
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
                    value={selectedStatus}
                    onValueChange={(value) => {
                      setSelectedStatus(value);
                      if (value === "option-one") {
                        handleFilterChange({ lk_status: undefined });
                      } else if (value === "option-two") {
                        handleFilterChange({ lk_status: 1 });
                      } else if (value === "option-three") {
                        handleFilterChange({ lk_status: 0 });
                      }
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
          refreshData={getProviderTableData}
          providerTableData={providerData}
          columnVisible={fields}
        />
      </div>
    </Container>
  );
}
