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
  1: "Hoạt động",
  0: "Đã xóa",
  2: "Khóa",
};

export default function StatusRow({ status }: { status: number }) {
  return (
    <div className={`lowercase ${colorMap[status]}`}>{statusMap[status]}</div>
  );
}
