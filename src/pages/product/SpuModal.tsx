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
import InputWithBotBorder from "@/components/InputWithBotBorder.tsx";

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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Chi tiết sản phẩm</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="info" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="flex">
            <div className={"space-y-4"}>
              <h2 className={"text-xl text-primary"}>{spu?.name}</h2>
              <img
                src={spu?.image?.url || "image-placeholder.png"}
                alt={"Hình sản phẩm"}
              />
            </div>
            <div className={"space-y-4"}>
              <InputWithBotBorder></InputWithBotBorder>
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
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
