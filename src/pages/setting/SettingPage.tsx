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
import { Setting, SettingCreate, SettingUpdate } from "@/types/setting/setting";
import {
  deleteSetting,
  getSetting,
  updateSetting,
  createSetting,
} from "@/pages/setting/api/settingApi";
import Container from "@/layouts/components/Container";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea.tsx";

export function SettingPage() {
  const [page, setPage] = useState(1);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number | string>("");
  const [totalPages, setTotalPages] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSetting, setNewSetting] = useState<SettingCreate>({
    name: "",
    value: "",
    description: "",
  });

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
  }, [page, editingName]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const handleDelete = async (name: string) => {
    try {
      const response = await deleteSetting(name);
      console.log(response.data);
      toast.success("Xóa thành công");
      await fetchSettingData(); // Reload lại dữ liệu
    } catch (e) {
      console.error("Error deleting setting:", e);
      toast.error("Xóa thất bại");
    }
  };

  const handleEdit = (name: string, currentValue: number | string) => {
    setEditingName(name);
    setEditValue(currentValue);
  };

  const handleSave = async (name: string) => {
    try {
      const response = await updateSetting(name, {
        value: editValue,
      } as SettingUpdate);
      console.log(response.data);
      setEditingName(null);
      toast.success("Cập nhật thành công");
    } catch (e) {
      console.error("Error updating setting:", e);
      toast.error("Cập nhật thất bại");
    }
  };

  const handleAddSetting = async () => {
    try {
      const response = await createSetting(newSetting);
      console.log(response.data);
      setIsAddDialogOpen(false);
      setNewSetting({ name: "", value: "", description: "" });
      toast.success("Thêm setting thành công");
      await fetchSettingData(); // Reload lại dữ liệu
    } catch (e) {
      console.error("Error adding setting:", e);
      toast.error("Thêm setting thất bại");
    }
  };

  return (
    <Container>
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Settings</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Thêm Setting</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm Setting Mới</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newSetting.name}
                    onChange={(e) =>
                      setNewSetting({ ...newSetting, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    Value
                  </Label>
                  <Textarea
                    id="value"
                    value={newSetting.value}
                    onChange={(e) =>
                      setNewSetting({
                        ...newSetting,
                        value: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="value" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newSetting.description}
                    onChange={(e) =>
                      setNewSetting({
                        ...newSetting,
                        description: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleAddSetting}>Thêm</Button>
            </DialogContent>
          </Dialog>
        </div>
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
                      <Textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full"
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
                    {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      formatDate(item.updatedAt)
                    }
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
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.name)}
                    >
                      Delete
                    </Button>
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
