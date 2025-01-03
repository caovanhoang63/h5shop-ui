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
import { useEffect, useState } from "react";
import {
  ButtonVisibilityColumnTable,
  MenuVisibilityColumnTable,
} from "@/components/ButtonVisibilityColumnTable.tsx";
import { ExportButton } from "@/components/ExportButton.tsx";
import { CheckBoxWithText } from "@/components/CheckBoxWithText.tsx";
import NewEmployeeModal from "@/pages/employee/component/NewEmployeeModal.tsx";
import { EmployeeTable } from "@/pages/employee/EmployeeTable.tsx";
import { Employee, EmployeeFilter } from "@/types/employee/employee.ts";
import { getEmployee } from "@/pages/employee/api/employeeApi.ts";

export function EmployeePage() {
  const [employeeData, setEmployeeData] = useState<Employee[]>();
  const [isOpenNewEmployeeModal, setIsOpenNewEmployeeModal] = useState(false);
  const [filters, setFilters] = useState<EmployeeFilter>({
    lk_first_name: null,
    status: [],
  });
  const [error] = useState<string | null>(null);
  const [fields, setFields] = useState<MenuVisibilityColumnTable[]>([
    { label: "Mã nhân viên", key: "id", visible: true },
    { label: "Tên nhân viên", key: "firstName", visible: true },
    { label: "Họ nhân viên", key: "lastName", visible: true },
    { label: "Số điện thoại", key: "phoneNumber", visible: true },
    { label: "Email", key: "email", visible: true },
    { label: "Ngày sinh", key: "dateOfBirth", visible: true },
    { label: "Giới tính", key: "gender", visible: true },
    { label: "Trạng thái", key: "status", visible: true },
    { label: "Action", key: "actions", visible: true },
  ]);

  const fetchEmployeeData = async () => {
    try {
      const response = await getEmployee(filters);
      console.log(response.data);
      setEmployeeData(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchEmployeeData();
  }, [filters]);

  const handleCheckField = (key: string, visible: boolean) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.key === key ? { ...field, visible } : field,
      ),
    );
  };

  const handleStatusChange = (status: number, isChecked: boolean) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setFilters((prevFilters) => {
      const newStatus = isChecked
        ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          [...prevFilters.status, status]
        : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          prevFilters.status.filter((s) => s !== status);
      return { ...prevFilters, status: newStatus };
    });
  };

  /*if (isLoading) {
    return <LoadingAnimation></LoadingAnimation>;
  }*/

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <Container className={"grid grid-cols-5 gap-4 grid-flow-row"}>
      <NewEmployeeModal
        isOpen={isOpenNewEmployeeModal}
        onOpenChange={setIsOpenNewEmployeeModal}
      />
      <div className={"text-2xl col-span-1 font-bold"}>
        <p>Nhân viên</p>
      </div>
      <div className={"col-span-4 w-full flex  justify-between"}>
        <div className="relative flex items-center max-w-80">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            className={"pl-9"}
            placeholder={"Theo tên nhân viên"}
            value={filters.lk_first_name || ""}
            onChange={(e) => {
              setFilters((prevFilters) => ({
                ...prevFilters,
                lk_first_name: e.target.value,
              }));
            }}
          />
        </div>
        <div className={"flex space-x-2"}>
          <Button
            className={"bg-green-500"}
            onClick={() => {
              setIsOpenNewEmployeeModal(true);
            }}
          >
            <Plus />
            Thêm nhân viên
          </Button>
          <ExportButton data={employeeData || []} fileName={`Employee`} />
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
                    id={"working"}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    onCheckChange={(value) => handleStatusChange(1, value)}
                  >
                    Đang làm việc
                  </CheckBoxWithText>
                  <CheckBoxWithText
                    id={"resigned"}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    onCheckChange={(value) => handleStatusChange(0, value)}
                  >
                    Đã nghỉ
                  </CheckBoxWithText>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
      <div className={"col-span-4"}>
        <EmployeeTable
          dataEmployee={employeeData || []}
          columnVisible={fields}
        ></EmployeeTable>
      </div>
    </Container>
  );
}
