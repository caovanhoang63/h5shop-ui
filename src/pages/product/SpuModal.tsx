import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Spu } from "@/types/spu.ts";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

interface ISpuModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  spu?: Spu;
}

export default function SpuModal({
  isOpen,
  spu,
  onOpenChange,
}: ISpuModalProps) {
  const [imgIndex, setImgIndex] = useState<number>(0);
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-xl min-h-[calc(100vh-10%)] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chi tiết sản phẩm</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="info" className="grow">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="space-y-2">
            <div>
              <h2 className={"text-xl text-primary"}>{spu?.name}</h2>
            </div>
            <div className={"flex space-x-5"}>
              <div className={"flex space-x-2"}>
                <img
                  className={"size-80 border-gray-400 border-2"}
                  src={spu?.images?.[imgIndex].url || "image-placeholder.png"}
                  alt={"Hình sản phẩm"}
                />
                <ScrollArea className="max-h-80 pr-4">
                  <ul className={"space-y-1 "}>
                    {spu?.images?.map((image, index) => {
                      return (
                        <li
                          className={`hover:opacity-50 border-gray-400 border-2 cursor-pointer ${index == imgIndex ? "opacity-50" : ""} `}
                          onClick={() => setImgIndex(index)}
                        >
                          <img className={"size-20"} src={image.url} alt="" />
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>
              </div>
              <div className={"space-y-4"}>
                <Input></Input>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        <DialogFooter className="">
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
