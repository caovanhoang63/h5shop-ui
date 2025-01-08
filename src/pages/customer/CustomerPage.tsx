import { Plus } from "lucide-react";
// import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { CheckBoxWithText } from "@/components/CheckBoxWithText.tsx";
import Container from "@/layouts/components/Container.tsx";
import { useEffect, useState } from "react";
import {
  ButtonVisibilityColumnTable,
  MenuVisibilityColumnTable,
} from "@/components/ButtonVisibilityColumnTable.tsx";
import { toast } from "react-toastify";
import { Paging } from "@/types/paging.ts";
import { ExportButton } from "@/components/ExportButton.tsx";
import { CustomerItemTable } from "@/types/customer/customerItemTable.ts";
import { CustomerListFilter } from "@/types/customer/customerListFilter.ts";
import { CustomerTable } from "@/pages/customer/component/CustomerTable.tsx";
import { getCustomerTableApi } from "@/pages/customer/api/customerApi.ts";
import { CreateCustomerModal } from "@/pages/customer/component/CreateCustomerModal.tsx";

export const CustomerPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [customerReport, setCustomerReport] = useState<CustomerItemTable[]>([]);
  const [filters, setFilters] = useState<CustomerListFilter>({
    lkPhoneNumber: null,
    gtCreatedAt: null,
    ltCreatedAt: null,
    gtUpdatedAt: null,
    ltUpdatedAt: null,
    status: [],
  });
  const [paging, setPaging] = useState<Paging>({
    limit: 10,
    page: 1,
  });
  // const [search, setSearch] = useState<string>();
  const handleStatusChange = (value: number, checked: boolean) => {
    setFilters((prevFilters) => {
      const updatedStatus = checked
        ? [...prevFilters.status!, value]
        : prevFilters.status!.filter((item) => item !== value);

      return {
        ...prevFilters,
        status: updatedStatus,
      };
    });
  };
  // const handleSearchChange = (value: string) => {
  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     lk_Id: value.trim() === "" ? null : value,
  //   }));
  // };
  useEffect(() => {
    getCustomerTableApi(filters, paging)
      .then((response) => {
        setCustomerReport(response.data);
        console.log(response);
      })
      .catch((error) => {
        toast.error("Lỗi hệ thống!");
        console.log(error);
      });
  }, [filters, paging]);
  const [fields, setFields] = useState<MenuVisibilityColumnTable[]>([
    { label: "Mã khách hàng", key: "id", visible: true },
    { label: "Số điện thoại", key: "phoneNumber", visible: true },
    { label: "Địa chỉ", key: "address", visible: true },
    { label: "Họ", key: "lastName", visible: true },
    { label: "Tên", key: "firstName", visible: true },
    { label: "Ngày sinh", key: "dateOfBirth", visible: true },
    { label: "Số lần thanh toán", key: "paymentAmount", visible: true },
    { label: "Điểm giảm giá", key: "discountPoint", visible: true },
    { label: "Trạng thái", key: "status", visible: true },
    { label: "Cập nhập lần cuối", key: "updatedAt", visible: true },
  ]);
  const handleCheckField = (key: string, visible: boolean) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.key === key ? { ...field, visible } : field,
      ),
    );
  };
  console.log("filter", filters);
  console.log("paging", paging);

  return (
    <Container className={"grid grid-cols-5 gap-4 grid-flow-row"}>
      <div className={"text-2xl col-span-1 font-bold"}>
        <p>Khách hàng</p>
      </div>
      <div className={"col-span-4 w-full flex justify-between"}>
        <div className="relative flex items-center max-w-80">
          {/*<Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />*/}
          {/*<Input*/}
          {/*  value={search}*/}
          {/*  onChange={(e) => {*/}
          {/*    setSearch(e.target.value);*/}
          {/*    handleSearchChange(e.target.value);*/}
          {/*  }}*/}
          {/*  className={"pl-9"}*/}
          {/*  placeholder={"Theo số điện thoại"}*/}
          {/*/>*/}
        </div>
        <div className={"flex space-x-2"}>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className={"bg-green-500"}
          >
            <Plus />
            Thêm khách hàng
          </Button>
          <ExportButton data={customerReport} fileName={"Customer"} />
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
                  Trạng thái
                </AccordionTrigger>
                <AccordionContent className={"pb-2 space-y-2"}>
                  <CheckBoxWithText
                    id={"service"}
                    onCheckChange={(value) => handleStatusChange(1, !!value)}
                  >
                    Hoạt động
                  </CheckBoxWithText>
                  <CheckBoxWithText
                    id={"service"}
                    onCheckChange={(value) => handleStatusChange(0, !!value)}
                  >
                    Ngừng hoạt động
                  </CheckBoxWithText>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
      <div className={"col-span-4"}>
        <CustomerTable
          columnVisible={fields}
          dataCustomer={customerReport}
          onRecordUpdated={() => {
            getCustomerTableApi(filters, paging)
              .then((response) => {
                setCustomerReport(response.data);
                console.log(response);
              })
              .catch((error) => {
                toast.error("Lỗi hệ thống!");
                console.log(error);
              });
          }}
          setPaging={setPaging}
          paging={paging}
        ></CustomerTable>
      </div>
      <CreateCustomerModal
        onSave={() => {
          getCustomerTableApi(filters, paging)
            .then((response) => {
              setCustomerReport(response.data);
              console.log(response);
            })
            .catch((error) => {
              toast.error("Lỗi hệ thống!");
              console.log(error);
            });
        }}
        onClose={() => setIsCreateModalOpen(false)}
        isOpen={isCreateModalOpen}
      />
    </Container>
  );
};
