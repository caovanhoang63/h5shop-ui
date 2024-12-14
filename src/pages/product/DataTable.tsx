"use client";

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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spu } from "@/types/spu.ts";
import { faker } from "@faker-js/faker/locale/en";
import StatusRow from "@/components/StatusRow.tsx";
import { Image } from "@/types/image.ts";
import SpuModal from "@/pages/product/SpuModal.tsx";
import { MenuVisibilityColumnTable } from "@/components/ButtonVisibilityColumnTable.tsx";

function generateMockSpus(count: number = 10): Spu[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    metadata:
      Math.random() > 0.5
        ? {
            color: faker.color.human(),
            size: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
          }
        : undefined,
    stock: faker.number.int({ min: 0, max: 100 }),
    categoryId: faker.number.int({ min: 1, max: 10 }),
    outOfStock: faker.datatype.boolean(),
    status: faker.helpers.arrayElement([0, 1, 2]),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    images: [
      {
        url: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?cs=srgb&dl=pexels-madebymath-90946.jpg",
        extension: "jpg",
      },
      {
        url: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?cs=srgb&dl=pexels-madebymath-90946.jpg",
        extension: "jpg",
      },
      {
        url: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?cs=srgb&dl=pexels-madebymath-90946.jpg",
        extension: "jpg",
      },
      {
        url: "https://img.freepik.com/free-photo/organic-cosmetic-product-with-dreamy-aesthetic-fresh-background_23-2151382816.jpg",
        extension: "jpg",
      },
      {
        url: "https://img.freepik.com/free-photo/organic-cosmetic-product-with-dreamy-aesthetic-fresh-background_23-2151382816.jpg",
        extension: "jpg",
      },
    ] as Image[],
  }));
}

// Example usage
const data = generateMockSpus(25);

export const columns: ColumnDef<Spu>[] = [
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
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Mã",
    cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
  },
  {
    id: "images",
    enableHiding: false,
    cell: ({ row }) => {
      const images = row.original.images;
      return (
        <img
          className={"w-8"}
          alt={"ảnh sản phẩm"}
          src={images?.[0].url || "image-placeholder.png"}
        ></img>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className={"p-0"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên sản phẩm
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button
          className="p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tồn kho
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("stock")}</div>,
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <StatusRow status={row.getValue("status")} />,
  },

  {
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
  },
];

interface DataTableDemoProps {
  columnVisible: MenuVisibilityColumnTable[];
}

export const DataTableDemo: React.FC<DataTableDemoProps> = ({
  columnVisible,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  // console.log(data?.[0].images?.[0].url);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(
      columnVisible.reduce((acc, col) => {
        acc[col.key] = col.visible;
        return acc;
      }, {} as VisibilityState),
    );
  const [rowSelection, setRowSelection] = React.useState({});
  const [isOpenSpuModal, setIsOpenSpuModal] = useState(false);

  const [selectedSpu, setSelectedSpu] = useState<Spu | undefined>(undefined);
  const table = useReactTable({
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    data,
    columns,
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
      <SpuModal
        isOpen={isOpenSpuModal}
        onOpenChange={setIsOpenSpuModal}
        spu={selectedSpu}
      ></SpuModal>
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
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setIsOpenSpuModal(true);
                    setSelectedSpu(row.original);
                    console.log("Open");
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
                  colSpan={columns.length}
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
};
