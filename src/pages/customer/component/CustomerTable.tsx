import * as React from "react";
import { useEffect, useState } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MenuVisibilityColumnTable } from "@/components/ButtonVisibilityColumnTable.tsx";
import { Paging } from "@/types/paging";
import { CustomerItemTable } from "@/types/customer/customerItemTable.ts";
import { getCustomerById } from "@/pages/customer/api/customerApi.ts";
import { Customer } from "@/types/customer/customer";
import { DetailCustomerModal } from "@/pages/customer/component/DetailCustomerModal.tsx";

interface IColorMap {
  [key: number | string]: string;
}

interface IValueMap {
  [key: number | string]: string;
}

const colorMap: IColorMap = {
  1: "text-success",
  0: "text-error",
};

const valueMap: IValueMap = {
  0: "Ngưng hoạt động",
  1: "Hoạt động",
};

const genderMap: IValueMap = {
  female: "Nữ",
  male: "Nam",
  other: "Khác",
};

function CollorOrderRow({ status }: { status: number }) {
  return <div className={` ${colorMap[status]}`}>{valueMap[status]}</div>;
}

const columnsCustomer: ColumnDef<CustomerItemTable>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        onClick={(event) => event.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: () => {
      return <div className={"font-bold"}>Mã khách hàng</div>;
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => {
      return (
        <Button
          className={"p-0 font-bold"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Số điện thoại
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-4">
        <div className="">{row.getValue("phoneNumber")}</div>
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          className={"p-0 font-bold"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Địa chỉ
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue("address")}</div>,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          className={"p-0 font-bold"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Họ
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue("lastName")}</div>,
  },

  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          className={"p-0 font-bold"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue("firstName")}</div>,
  },

  {
    accessorKey: "dateOfBirth",
    header: ({ column }) => {
      return (
        <Button
          className={"p-0 font-bold"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày sinh
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateOfBirth = row.getValue("dateOfBirth") as string | number | null;
      return (
        <div className="ml-4">
          {dateOfBirth ? new Date(dateOfBirth).toLocaleDateString() : ""}
        </div>
      );
    },
  },

  {
    accessorKey: "paymentAmount",
    header: ({ column }) => {
      return (
        <Button
          className={"p-0 font-bold"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Số lần thanh toán
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-4">{row.getValue("paymentAmount")}</div>
    ),
  },

  {
    accessorKey: "discountPoint",
    header: ({ column }) => {
      return (
        <Button
          className={"p-0 font-bold"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Điểm giảm giá
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className=" ml-4">{row.getValue("discountPoint")}</div>
    ),
  },

  {
    accessorKey: "gender",
    header: ({ column }) => {
      return (
        <Button
          className={"p-0 font-bold"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Giới tính
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string;
      return (
        <div className="ml-4">{genderMap[gender] || "Không xác định"}</div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => {
      return <div className={"font-bold"}>Trạng thái</div>;
    },
    cell: ({ row }) => <CollorOrderRow status={row.getValue("status")} />,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          className={"p-0 font-bold"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cập nhập lần cuối
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-4">
        {new Date(row.getValue("updatedAt")).toLocaleDateString()}
      </div>
    ),
  },
];
interface CustomerTableProps {
  dataCustomer: CustomerItemTable[];
  columnVisible: MenuVisibilityColumnTable[];
  setPaging: (page: number) => void;
  paging: Paging;
  onRecordUpdated: () => void;
}
export function CustomerTable({
  dataCustomer,
  columnVisible,
  setPaging,
  paging,
  onRecordUpdated,
}: CustomerTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(
      columnVisible.reduce((acc, col) => {
        acc[col.key] = col.visible;
        return acc;
      }, {} as VisibilityState),
    );
  const [rowSelection, setRowSelection] = React.useState({});
  const [isOpenOrderModal, setIsOpenCustomerModal] = useState(false);

  const [selectedCustomerReport, setSelectedCustomerReport] = useState<
    CustomerItemTable | undefined
  >(undefined);
  const [customerReportDetails, setCustomerReportDetails] = useState<
    Customer | undefined
  >(undefined);

  const getCustomerDetails = async (id: number) => {
    try {
      const response = await getCustomerById(id);
      setCustomerReportDetails(response.data);
    } catch (error) {
      console.error("Error fetching order report details:", error);
    }
  };

  const handleClickPrevious = () => {
    if (paging.page === 1) return;
    setPaging(paging.page ? paging.page - 1 : 1);
  };

  const handleClickNext = () => {
    if (
      paging.total &&
      paging.limit &&
      paging.page === Math.ceil(paging.total / paging.limit)
    )
      return;
    setPaging(paging.page ? paging.page + 1 : 1);
  };

  const table = useReactTable<CustomerItemTable>({
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    data: dataCustomer,
    columns: columnsCustomer,
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
      <DetailCustomerModal
        isOpen={isOpenOrderModal}
        onClose={() => setIsOpenCustomerModal(false)}
        onSave={onRecordUpdated}
        customer={customerReportDetails}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
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
                    const selectedReport = row.original;
                    setSelectedCustomerReport(selectedReport);
                    console.log(selectedCustomerReport);
                    await getCustomerDetails(selectedReport.id);
                    setIsOpenCustomerModal(true);
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
                  colSpan={columnsCustomer.length}
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
            onClick={handleClickPrevious}
            disabled={paging.page === 1}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClickNext}
            disabled={
              paging.page ===
                Math.ceil((paging.total || 0) / (paging.limit || 20)) ||
              Math.ceil((paging.total || 0) / (paging.limit || 20)) === 0
            }
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}
