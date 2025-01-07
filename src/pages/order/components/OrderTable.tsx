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
import { OrderItemTable } from "@/types/order/orderItemTable.ts";
import { Paging } from "@/types/paging";
import { OrderGetDetail } from "@/types/order/orderGetDetail.ts";
import { getOrderById } from "@/pages/order/api/orderApi.ts";
import OrderDetailModal from "@/pages/order/components/OrderDetailModal.tsx";

interface IColorMap {
  [key: number | string]: string;
}

interface IValueMap {
  [key: number | string]: string;
}

const colorMap: IColorMap = {
  2: "text-success",
  1: "text-warning",
  0: "text-error",
  retail: "text-success",
  wholesale: "text-warning",
};

const valueMap: IValueMap = {
  0: "Đã hủy",
  1: "Đang bán",
  2: "Đã hoàn thành",
  retail: "Bán lẻ",
  wholesale: "Bán sỉ",
};

function CollorOrderRow({ status }: { status: number }) {
  return <div className={` ${colorMap[status]}`}>{valueMap[status]}</div>;
}

const columnsOrder: ColumnDef<OrderItemTable>[] = [
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
      return <div className={"font-bold"}>Mã hoá đơn</div>;
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
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
  {
    accessorKey: "customerName",
    header: ({ column }) => {
      return (
        <Button
          className={"p-0 font-bold"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên khách hàng
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase ml-4">{row.getValue("customerName")}</div>
    ),
  },
  {
    accessorKey: "customerPhone",
    header: ({ column }) => {
      return (
        <Button
          className={"p-0 font-bold"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Số điên thoại khách hàng
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase ml-4">{row.getValue("customerPhone")}</div>
    ),
  },

  {
    accessorKey: "sellerName",
    header: ({ column }) => {
      return (
        <Button
          className={"p-0 font-bold"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên người bán
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase ml-4">{row.getValue("sellerName")}</div>
    ),
  },

  {
    accessorKey: "orderType",
    header: () => {
      return <div className={"font-bold"}>Loại hoá đơn</div>;
    },
    cell: ({ row }) => <CollorOrderRow status={row.getValue("orderType")} />,
  },

  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <Button
          className={"p-0 font-bold"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tổng giá trị
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase ml-4">{row.getValue("totalAmount")}</div>
    ),
  },

  {
    accessorKey: "discountAmount",
    header: ({ column }) => {
      return (
        <Button
          className={"p-0 font-bold"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Giảm giá
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase ml-4">{row.getValue("discountAmount")}</div>
    ),
  },

  {
    accessorKey: "finalAmount",
    header: ({ column }) => {
      return (
        <Button
          className={"p-0 font-bold"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Giá cuối
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase ml-4">{row.getValue("finalAmount")}</div>
    ),
  },

  {
    accessorKey: "pointUsed",
    header: ({ column }) => {
      return (
        <Button
          className={"p-0 font-bold"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Điểm sử dụng
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase ml-4">{row.getValue("pointUsed")}</div>
    ),
  },

  {
    accessorKey: "status",
    header: () => {
      return <div className={"font-bold"}>Trạng thái</div>;
    },
    cell: ({ row }) => <CollorOrderRow status={row.getValue("status")} />,
  },
];
interface OrderTableProps {
  dataOrder: OrderItemTable[];
  columnVisible: MenuVisibilityColumnTable[];
  setPaging: React.Dispatch<React.SetStateAction<Paging>>;
  paging: Paging;
}
export function OrderTable({
  dataOrder,
  columnVisible,
  setPaging,
  paging,
}: OrderTableProps) {
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
  const [isOpenOrderModal, setIsOpenOrderModal] = useState(false);

  const [selectedOrderReport, setSelectedOrderReport] = useState<
    OrderItemTable | undefined
  >(undefined);
  const [orderReportDetails, setOrderReportDetails] = useState<
    OrderGetDetail | undefined
  >(undefined);

  const getOrderDetails = async (id: number) => {
    try {
      const response = await getOrderById(id);
      setOrderReportDetails(response.data);
    } catch (error) {
      console.error("Error fetching order report details:", error);
    }
  };

  const handleClickPrevious = () => {
    if (paging.page === 1) return;
    setPaging({ limit: 10, page: paging.page ? paging.page - 1 : 1 });
  };

  const handleClickNext = () => {
    if (
      paging.total &&
      paging.limit &&
      paging.page === Math.ceil(paging.total / paging.limit)
    )
      return;
    setPaging({ limit: 10, page: paging.page ? paging.page + 1 : 1 });
  };

  const table = useReactTable<OrderItemTable>({
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    data: dataOrder,
    columns: columnsOrder,
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
      <OrderDetailModal
        isOpen={isOpenOrderModal}
        onOpenChange={setIsOpenOrderModal}
        order={orderReportDetails}
      ></OrderDetailModal>
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
                    setSelectedOrderReport(selectedReport);
                    console.log(selectedOrderReport);
                    await getOrderDetails(selectedReport.id);
                    setIsOpenOrderModal(true);
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
                  colSpan={columnsOrder.length}
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
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClickNext}
            //eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            disabled={
              /*!table.getCanNextPage()*/ paging.total &&
              paging.limit &&
              paging.page === Math.ceil(paging.total / paging.limit)
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
