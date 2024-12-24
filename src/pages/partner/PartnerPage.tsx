import Container from "@/layouts/components/Container.tsx";
import { FileInput, FileOutputIcon, Plus, Search } from "lucide-react";
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
import { DatePickerWithRange } from "@/components/DatePickerWithRange.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { TimeDropdown } from "@/pages/partner/components/TimeDropdown.tsx";
import { useEffect, useState } from "react";
import PartnerDataTable from "@/pages/partner/components/PartnerDataTable.tsx";
import {
  ButtonVisibilityColumnTable,
  MenuVisibilityColumnTable,
} from "@/components/ButtonVisibilityColumnTable.tsx";
import NewPartnerModal from "@/pages/partner/components/NewPartnerModal.tsx";
import { listProvider } from "@/pages/partner/api/providerApi.ts";
import { Provider } from "@/types/provider.ts";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation.tsx";

export default function PartnerPage() {
  const [isOpenNewPartnerModal, setIsOpenNewPartnerModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState("Toàn thời gian");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [providerData, setProviderData] = useState<Provider[]>([]);
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
  const handleTimeSelect = (value: string) => {
    setSelectedTime(value);
  };
  const handleCheckField = (key: string, visible: boolean) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.key === key ? { ...field, visible } : field,
      ),
    );
  };
  const getProviderTableData = async () => {
    setIsLoading(true);
    try {
      const response = await listProvider();
      console.log(response);
      setProviderData(response.data);
    } catch (error) {
      setError(error.message);
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
        isOpen={isOpenNewPartnerModal}
        onOpenChange={setIsOpenNewPartnerModal}
      ></NewPartnerModal>
      <div className={"text-2xl col-span-1 font-bold"}>
        <p>Nhà cung cấp</p>
      </div>
      <div className={"col-span-4 w-full flex  justify-between"}>
        <div className="relative flex items-center max-w-80">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
          <Input className={"pl-9"} placeholder={"Theo mã, tên, điện thoại"} />
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
        <Card>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className={"hover:no-underline"}>
                  Tổng mua
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
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-2">
                      <Label htmlFor="maxWidth">Đến</Label>
                      <div
                        className={"border-b-[1px] col-span-3 bg-background"}
                      >
                        <Input
                          id="from"
                          placeholder="Giá trị"
                          className="border-0 focus-visible:ring-0  rounded-none shadow-none col-span-3 bg-background"
                        />
                      </div>
                    </div>
                  </div>
                  <RadioGroup defaultValue="option-one">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full font-normal flex justify-start "
                          >
                            {selectedTime}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[600px] p-0" align="start">
                          <TimeDropdown
                            selectedValue={selectedTime}
                            onSelect={handleTimeSelect}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <DatePickerWithRange
                        className={"w-full"}
                      ></DatePickerWithRange>
                    </div>
                  </RadioGroup>
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
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-2">
                      <Label htmlFor="maxWidth">Đến</Label>
                      <div
                        className={"border-b-[1px] col-span-3 bg-background"}
                      >
                        <Input
                          id="from"
                          placeholder="Giá trị"
                          className="border-0 focus-visible:ring-0  rounded-none shadow-none col-span-3 bg-background"
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
                  <RadioGroup defaultValue="option-one">
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
          providerTableData={providerData}
          columnVisible={fields}
        ></PartnerDataTable>
      </div>
    </Container>
  );
}
