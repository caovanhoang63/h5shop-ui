import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { ArrowRightCircle } from "lucide-react";
import { ChartConfig, ChartContainer } from "@/components/ui/chart.tsx";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

export const DashBoardPage = () => {
  return (
    <div className="flex space-x-5 p-5 relative">
      <div className={"space-y-5 flex-grow "}>
        {/*Result today*/}
        <Card>
          <CardHeader className={"py-5"}>
            <CardTitle className="uppercase">kết quả hôm này</CardTitle>
          </CardHeader>
          <CardContent className={"flex space-x-5 items-center "}>
            <img
              className={"size-14"}
              src={"/icons/BlueCircleDollar.svg"}
              alt={"Dollar Icon"}
            />
            <div>
              <p>0 hóa đơn</p>
              <p className={"text-primary text-4xl"}>0</p>
              <p className={"text-gray-400"}>Doanh thu</p>
            </div>
            <Separator orientation="vertical" />
            <img
              className={"size-14"}
              src={"/icons/YellowReturn.svg"}
              alt={"Dollar Icon"}
            />
            <div>
              <p>0 hóa đơn</p>
              <p className={"text-yellow-500 text-4xl"}>0</p>
              <p className={"text-gray-400"}>Trả hàng</p>
            </div>
            <Separator orientation="vertical" />
            <img
              className={"size-14"}
              src={"/icons/RedDown.svg"}
              alt={"Dollar Icon"}
            />
            <div>
              <p>0 hóa đơn</p>
              <p className={"text-red-500 text-4xl"}>-7.42%</p>
              <p className={"text-gray-400"}>So với cùng kỳ tháng trước</p>
            </div>
          </CardContent>
        </Card>
        {/*Monthly profit*/}
        <Card>
          <CardHeader className={"py-5"}>
            <CardTitle className="uppercase flex justify-between">
              <div className={" flex items-center space-x-2"}>
                <p className={"content-center"}>Doanh thu thuần tháng này</p>
                <ArrowRightCircle size={20} />
                <p className={"text-primary contain-content"}>73,988,000</p>
              </div>
              <div className={"text-primary"}>
                <Select defaultValue={"apple"}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Thời điểm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Thời điểm</SelectLabel>
                      <SelectItem value="apple">Tháng này</SelectItem>
                      <SelectItem value="banana">Tháng trước</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <p className={"py-1"}>Theo ngày</p>
              <div>
                <ChartContainer className={"h-80 w-full"} config={chartConfig}>
                  <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis unit={"tr"} />
                    <Bar
                      dataKey="revenue"
                      fill="var(--color-revenue)"
                      radius={4}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>
        {/*Top seller*/}
        <Card>
          <CardHeader>
            <CardTitle className="uppercase">
              <div className={"flex justify-between w-full"}>
                <div className={" flex items-center space-x-2"}>
                  <p className={"content-center"}>
                    Top 10 Hàng hóa bán chạy tháng này
                  </p>
                  <div className={"text-primary"}>
                    <Select defaultValue={"apple"}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Cách tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Loại doanh thu </SelectLabel>
                          <SelectItem value="apple">
                            Theo doanh thu thuần
                          </SelectItem>
                          <SelectItem value="banana">
                            Theo lợi nhuận ròng
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className={"text-primary"}>
                  <Select defaultValue={"apple"}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Thời điểm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Thời điểm</SelectLabel>
                        <SelectItem value="apple">Tháng này</SelectItem>
                        <SelectItem value="banana">Tháng trước</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <ChartContainer className={"h-96 w-full"} config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  layout={"vertical"}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis type={"number"} dataKey={"revenue"} unit={"tr"} />
                  <YAxis
                    dataKey="day"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="var(--color-revenue)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      {/*Audit log0*/}
      <Card className={"max-w-80 sticky top-0 right-0 max-h-screen"}>
        <CardHeader>
          <CardTitle className="uppercase">Các hoạt đông gần đây</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <ActionCard />
          <ActionCard />
          <ActionCard />
          <ActionCard />
          <ActionCard />
          <ActionCard />
          <ActionCard />
          <ActionCard />
          <ActionCard />
          <ActionCard />
          <ActionCard />
        </CardContent>
      </Card>
    </div>
  );
};

// const AuditData = [
//   "user"
// ];

const ActionCard = () => {
  return (
    <div className={"p-2 text-lg"}>
      <p>
        <span className={"text-primary"}>Nguyễn Huỳnh Duy Hiếu</span> vừa{" "}
        <span className={"text-primary"}>thực hiện kiểm hàng</span>
      </p>
      <p>11 phút trước</p>
    </div>
  );
};

const chartData = [
  { day: "1", revenue: 186 },
  { day: "2", revenue: 305 },
  { day: "3", revenue: 237 },
  { day: "4", revenue: 73 },
  { day: "5", revenue: 209 },
  { day: "6", revenue: 2 },
  { day: "7", revenue: 209 },
  { day: "8", revenue: 209 },
  { day: "9", revenue: 214 },
  { day: "19", revenue: 214 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#2563eb",
  },
} satisfies ChartConfig;
