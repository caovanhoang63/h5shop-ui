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

export default function PartnerPage() {
  const [isOpenNewPartnerModal, setIsOpenNewPartnerModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState("Toàn thời gian");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [providerData, setProviderData] = useState<Provider[]>([]);
  const [fields, setFields] = useState<MenuVisibilityColumnTable[]>([
    { label: "Mã nhà cung cấp", key: "id", visible: true },
    { label: "Tên nhà cung cấp", key: "name", visible: true },
    { label: "Số điện thoại", key: "phone_number", visible: true },
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
    return (
      <div className=" fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[999999]">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
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
