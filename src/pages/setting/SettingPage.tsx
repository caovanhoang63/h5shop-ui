"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Setting, SettingUpdate } from "@/types/setting/setting";
import { getSetting, updateSetting } from "@/pages/setting/api/settingApi";
import Container from "@/layouts/components/Container.tsx";

export function SettingPage() {
  const [page, setPage] = useState(1);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number | string>("");
  const [totalPages, setTotalPages] = useState(1);

  async function fetchSettingData() {
    try {
      const response = await getSetting();
      console.log(response.data);
      setSettings(response.data);
      setTotalPages(Math.ceil(response.data.length / response.paging.limit));
    } catch (e) {
      console.error("Failed to fetch setting data: ", e);
    }
  }

  useEffect(() => {
    fetchSettingData();
  }, [page]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const handleEdit = (name: string, currentValue: number | string) => {
    setEditingName(name);
    setEditValue(currentValue);
  };

  const handleSave = async (name: string) => {
    try {
      const numericValue = Number(editValue);
      if (isNaN(numericValue)) {
        console.error("Invalid numeric value");
        return;
      }

      const response = await updateSetting(name, {
        value: numericValue,
      } as SettingUpdate);
      console.log(response.data);
      setEditingName(null);
      window.location.reload();
    } catch (e) {
      console.error("Error updating setting:", e);
    }
  };

  return (
    <Container>
      <div className="flex flex-col min-h-[800px]">
        <div className="flex-grow px-2 py-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settings.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    {editingName === item.name ? (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full"
                        type="number"
                        step="any"
                      />
                    ) : (
                      item.value
                    )}
                  </TableCell>

                  <TableCell>
                    {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      formatDate(item.createdAt)
                    }
                  </TableCell>
                  <TableCell>
                    {formatDate(
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      item.updatedAt,
                    )}
                  </TableCell>
                  <TableCell>
                    {item.status === 1 ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    {editingName === item.name ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSave(item.name)}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item.name, item.value)}
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between items-center mt-4 px-2 py-2">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </Container>
  );
}
