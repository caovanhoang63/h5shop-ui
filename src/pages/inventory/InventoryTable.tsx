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
import {
  InventoryReport,
  InventoryReportDetails,
} from "@/types/inventory/inventoryReport.ts";
import InventoryReportDetailModal from "@/pages/inventory/InventoryReportDetailModal.tsx";
import { getInventoryReportDetailById } from "@/pages/inventory/api/reportApi.ts";
import { MenuVisibilityColumnTable } from "@/components/ButtonVisibilityColumnTable.tsx";
import { Paging } from "@/types/paging.ts";

interface IColorMap {
  [key: number]: string;
}

interface IStatusMap {
  [key: number]: string;
}

const colorMap: IColorMap = {
  1: "text-success",
  2: "text-warning",
  0: "text-error",
};

const statusMap: IStatusMap = {
  1: "Đã cân bằng kho",
  0: "Đã hủy",
  2: "Chưa cân băng kho",
};

function StatusInventoryRow({ status }: { status: number }) {
  return <div className={` ${colorMap[status]}`}>{statusMap[status]}</div>;
}

const columnsInventory: ColumnDef<InventoryReport>[] = [
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
      return <div className={"font-bold"}>Mã kiểm kho</div>;
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
          Thời gian cân bằng
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
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          className={"p-0 font-bold"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SL thực tế
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase ml-4">{row.getValue("amount")}</div>
    ),
  },
  {
    accessorKey: "inventoryDif",
    header: ({ column }) => {
      return (
        <Button
          className={"p-0 font-bold"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tổng chênh lệch
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase ml-4">{row.getValue("inventoryDif")}</div>
    ),
  },
  {
    accessorKey: "note",
    header: () => {
      return <div className={"font-bold"}>Ghi chú</div>;
    },
    cell: ({ row }) => (
      <div className="lowercase text-wrap w-[200px]">
        {row.getValue("note")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => {
      return <div className={"font-bold"}>Trạng thái</div>;
    },
    cell: ({ row }) => <StatusInventoryRow status={row.getValue("status")} />,
  },

  /*{
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;
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
                navigator.clipboard.writeText(payment.id.toString())
              }
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },*/
];
interface InventoryTableProps {
  dataInventory: InventoryReport[];
  columnVisible: MenuVisibilityColumnTable[];
  setPaging: (page: number) => void;
  paging: Paging;
}
export function InventoryTable({
  dataInventory,
  columnVisible,
  setPaging,
  paging,
}: InventoryTableProps) {
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
  const [isOpenStockTakesModal, setIsOpenStockTakesModal] = useState(false);

  const [selectedInventoryReport, setSelectedInventoryReport] = useState<
    InventoryReport | undefined
  >(undefined);
  const [inventoryReportDetails, setInventoryReportDetails] = useState<
    InventoryReportDetails | undefined
  >(undefined);

  const getInventoryReportDetails = async (id: number) => {
    try {
      const response = await getInventoryReportDetailById(id);
      setInventoryReportDetails(response.data);
    } catch (error) {
      console.error("Error fetching inventory report details:", error);
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
  const table = useReactTable<InventoryReport>({
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    data: dataInventory,
    columns: columnsInventory,
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
      <InventoryReportDetailModal
        isOpen={isOpenStockTakesModal}
        onOpenChange={setIsOpenStockTakesModal}
        inventoryItem={inventoryReportDetails}
      ></InventoryReportDetailModal>
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
                    setSelectedInventoryReport(selectedReport);
                    console.log(selectedInventoryReport);
                    await getInventoryReportDetails(selectedReport.id);
                    setIsOpenStockTakesModal(true);
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
                  colSpan={columnsInventory.length}
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
          {table.getFilteredSelectedRowModel().rows.length} trong{" "}
          {table.getFilteredRowModel().rows.length} hàng được chọn.
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
