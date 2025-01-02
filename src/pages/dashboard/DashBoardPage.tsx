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
import { vi } from "date-fns/locale";

import {
  getAudit,
  getRevenue,
  IAuditFilter,
  Revenue,
} from "@/pages/dashboard/api.ts";
import { useEffect, useState } from "react";
import { Audit } from "@/types/auditLog.ts";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

interface IAuditMap {
  [action: string]: string;
}

const AuditMap: IAuditMap = {
  "CREATE+inventory": "Kiểm hàng",
  "PAYORDER+order": "bán hàng",
};

const AuditMessage = (audit: Audit) => {
  const key = audit.action + "+" + audit.objectType;
  if (audit.action === "PAYORDER") {
    return (
      AuditMap[key] +
      " với giá trị " +
      Intl.NumberFormat("de-DE").format(audit.newValues?.finalAmount) +
      " vnd"
    );
  } else {
    return AuditMap[key];
  }
};

export const DashBoardPage = () => {
  const [filter, setFilter] = useState<IAuditFilter>({
    action: [],
    objectType: ["order", "inventory"],
  });
  const [currentRevenue, setCurrentRevenue] = useState<Revenue[]>([]);
  const [lastRevenue, setLastRevenue] = useState<Revenue[]>([]);
  const [revenueSelect, setRevenueSelect] = useState<string>("current");
  const [currentTotalRevenue, setCurrentTotalRevenue] = useState<number>(0);
  const [lastTotalRevenue, setLastTotalRevenue] = useState<number>(0);

  const [todayOrder, setTodayOrder] = useState<number>(0);
  const [todayRevenue, setTodayRevenue] = useState<number>(0);

  const [lastTodayRevenue, setLastTodayOrder] = useState<number>(0);
  const compare = caculateCompare(todayRevenue, lastTodayRevenue);

  const [auditLog, setAuditLog] = useState<Audit[]>([]);

  useEffect(() => {
    getRevenue(getFirstDayOfCurrentMonth(), new Date()).then((r) => {
      let total = 0;
      r.data.data.forEach((a) => {
        if (new Date(a.date).getDate() == new Date().getDate()) {
          setTodayRevenue(a.revenue);
          setTodayOrder(a.totalOrder);
        }
        total += parseFloat(a.revenue.toString());
      });
      setCurrentTotalRevenue(total);

      setCurrentRevenue(r.data.data);
    });

    const { firstDay, lastDay } = getFirstAndLastDayOfPreviousMonth();
    getRevenue(firstDay, lastDay).then((r) => {
      let total = 0;
      r.data.data.forEach((a) => {
        if (new Date(a.date).getDate() == new Date().getDate()) {
          setLastTodayOrder(a.revenue);
        }
        total += parseFloat(a.revenue.toString());
      });
      setLastTotalRevenue(total);
      setLastRevenue(r.data.data);
    });
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFilter((a) => {
        const newGtCreatedAt =
          auditLog.length > 0 ? auditLog[0].createdAt : undefined;
        return {
          ...a,
          gtCreatedAt: newGtCreatedAt,
        };
      });
    }, 5000);
    return () => clearInterval(intervalId);
  }, [auditLog]);

  useEffect(() => {
    getAudit(filter, { limit: 20 })
      .then((res) => {
        const audit = res.data.data;
        setAuditLog((a) => [...audit, ...a]);
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  }, [filter]);

  return (
    <div className="flex space-x-5 p-5">
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
              <p>{todayOrder} hóa đơn</p>
              <p className={"text-primary text-4xl"}>
                {Intl.NumberFormat("de-DE").format(todayRevenue / 1000000)} tr
              </p>
              <p className={"text-gray-400"}>Doanh thu</p>
            </div>
            <Separator orientation="vertical" />
            <img
              className={"size-14"}
              src={compare > 0 ? "/icons/GreenUp.svg" : "/icons/RedDown.svg"}
              alt={"Dollar Icon"}
            />
            <div>
              <p
                className={`${compare > 0 ? "text-success" : "text-red-500  "} text-4xl`}
              >
                {compare} %
              </p>
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
                <p className={"text-primary contain-content"}>
                  {Intl.NumberFormat("de-DE").format(
                    revenueSelect == "current"
                      ? currentTotalRevenue
                      : lastTotalRevenue,
                  )}{" "}
                  vnd
                </p>
              </div>
              <div className={"text-primary"}>
                <Select
                  defaultValue={"current"}
                  onValueChange={(v) => setRevenueSelect(v)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Thời điểm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Thời điểm</SelectLabel>
                      <SelectItem value="current">Tháng này</SelectItem>
                      <SelectItem value="last">Tháng trước</SelectItem>
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
                  <BarChart
                    accessibilityLayer
                    data={
                      revenueSelect == "current" ? currentRevenue : lastRevenue
                    }
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) =>
                        new Date(value).getDate().toString()
                      }
                    />
                    <YAxis
                      unit={"tr"}
                      tickFormatter={(value) => (value / 1000000).toString()}
                    />
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
                  data={currentRevenue}
                  layout={"vertical"}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis type={"number"} dataKey={"revenue"} unit={"tr"} />
                  <YAxis
                    dataKey="date"
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
      <Card
        className={
          "max-w-80 max-h-screen sticky top-0 h-screen overflow-y-auto"
        }
      >
        <CardHeader>
          <CardTitle className="uppercase">Các hoạt đông gần đây</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          {auditLog.map((item) => (
            <ActionCard audit={item} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const getFirstAndLastDayOfPreviousMonth = (): {
  firstDay: Date;
  lastDay: Date;
} => {
  const now = new Date();
  const previousMonth = now.getMonth() - 1;
  const year = now.getFullYear();
  const firstDay = new Date(year, previousMonth, 1);
  const lastDay = new Date(year, previousMonth + 1, 0);
  return { firstDay, lastDay };
};
const getFirstDayOfCurrentMonth = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const caculateCompare = (cur: number, last: number) => {
  if (last == 0) return 100;
  else return (cur - last) / last;
};
const ActionCard = ({ audit }: { audit: Audit }) => {
  return (
    <div className={"p-2 text-lg"}>
      <p>
        <span className={"text-primary"}>
          {audit.user?.firstName} {audit.user?.lastName}
        </span>{" "}
        vừa <span className={"text-primary"}>{AuditMessage(audit)}</span>
      </p>
      <p>
        {audit.createdAt &&
          formatDistanceToNow(new Date(audit.createdAt), {
            addSuffix: true,
            locale: vi,
          })}
      </p>
    </div>
  );
};

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#2563eb",
  },
} satisfies ChartConfig;
