import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  VisibilityState,
  SortingState,
  ColumnFiltersState,
  CellContext,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Employee } from "src/types/employee/employee";
import { MenuVisibilityColumnTable } from "@/components/ButtonVisibilityColumnTable.tsx";

import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import EmployeeEditModal from "@/pages/employee/component/EmployeeEditModal.tsx";
import { GenderMap, RoleMap } from "@/utils/constants.ts";
import { format } from "date-fns";

interface EmployeeTableProps {
  dataEmployee: Employee[];
  columnVisible: MenuVisibilityColumnTable[];
}

export function EmployeeTable({
  dataEmployee,
  columnVisible,
}: EmployeeTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    columnVisible.reduce((acc, col) => {
      acc[col.key] = col.visible;
      return acc;
    }, {} as VisibilityState),
  );
  const [rowSelection, setRowSelection] = useState({});
  const [isOpenEmployeeModal, setIsOpenEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<
    Employee | undefined
  >(undefined);
  const columnsEmployee: ColumnDef<Employee>[] = [
    {
      accessorKey: "id",
      header: "Mã nhân viên",

      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "firstName",
      header: "Tên",
      cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
    },
    {
      accessorKey: "lastName",
      header: "Họ",
      cell: ({ row }) => <div>{row.getValue("lastName")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",

      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phoneNumber",
      header: "Số điện thoại",
      cell: ({ row }) => <div>{row.getValue("phoneNumber")}</div>,
    },
    {
      accessorKey: "address",
      header: "Địa chỉ",

      cell: ({ row }) => <div>{row.getValue("address")}</div>,
    },
    {
      accessorKey: "gender",
      header: "Giới tính",

      cell: ({ row }) => (
        <div>{GenderMap[row.getValue("gender") as string]}</div>
      ),
    },
    {
      accessorKey: "dateOfBirth",
      header: "Ngày sinh",
      cell: ({ row }: CellContext<any, any>) => {
        const date = row.original.dateOfBirth;
        return <div>{date ? format(date, "dd-MM-yyyy") : ""}</div>;
      },
    },
    {
      accessorKey: "systemRole",
      header: "Quyền",
      cell: ({ row }) => {
        const role = row.original.systemRole;
        return <div>{RoleMap[role]}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <div className={status === 1 ? "text-green-500" : "text-red-500"}>
            {status === 1 ? "Đang làm việc" : "Đã nghỉ"}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,

      cell: ({ row }) => {
        const employee = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(employee.id.toString())
                }
              >
                Copy employee ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View employee details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable<Employee>({
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    data: dataEmployee,
    columns: columnsEmployee,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    setColumnVisibility(
      columnVisible.reduce((acc, col) => {
        acc[col.key] = col.visible;
        return acc;
      }, {} as VisibilityState),
    );
  }, [columnVisible]);

  return (
    <div className="w-full">
      {/*<EmployeeDetailModal
        isOpen={isOpenEmployeeModal}
        onOpenChange={setIsOpenEmployeeModal}
        employeeItem={employeeDetails}
      />*/}
      <EmployeeEditModal
        employee={selectedEmployee}
        isOpen={isOpenEmployeeModal}
        onOpenChange={setIsOpenEmployeeModal}
      ></EmployeeEditModal>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="cursor-pointer"
                  onClick={async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const selectedEmployee = row.original;
                    setIsOpenEmployeeModal(true);
                    setSelectedEmployee(selectedEmployee);
                  }}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnsEmployee.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
