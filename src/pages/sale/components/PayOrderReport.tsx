export const payOrderReport = `
<html  lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Báo cáo bán hàng cuối ngày</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
  
          .container {
              margin: 20px auto;
              padding: 20px;
              max-width: 800px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
  
          .header {
              text-align: center;
              margin-bottom: 20px;
          }
  
          .header h1 {
              margin: 0;
              font-size: 24px;
              color: #333333;
          }
  
          .info {
              margin-bottom: 20px;
          }
  
          .info p {
              margin: 5px 0;
              font-size: 14px;
              color: #666666;
          }
  
          table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
          }
  
          table th, table td {
              border: 1px solid #dddddd;
              padding: 8px;
              text-align: center;
          }
  
          table th {
              background-color: #f4f4f4;
              color: #333333;
              font-weight: bold;
          }
  
          .no-data {
              text-align: center;
              font-size: 14px;
              color: #999999;
              padding: 20px;
              background-color: #fefefe;
          }
          
          .summary {
            margin-top: 20px;
            padding: 15px;
          }

          .summary div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            font-size: 14px;
            color: #333333;
          }
  
          .summary .large-text {
            font-size: 18px;
            font-weight: bold;
            color: #000000;
          }
  
          .summary strong {
              color: #000000;
          }
      </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Hoá đơn</h1>
        </div>
        <div class="info">
            <p><strong>Thời gian tạo:</strong> {{created_at}}</p>
        </div>
        <div>Khách hàng: {{customerName}}</div>
        <div>Số điện thoại: {{customerPhone}}</div>
        <table>
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Tổng</th>
                    <th>Ghi chú</th>
                </tr>
            </thead>
            <tbody>
              {{body}} <!-- Dữ liệu này sẽ được điền vào động -->
            </tbody>
        </table>
        <br>

        <div class="summary">
            <div><span><strong>Ghi chú:</strong></span><span>{{description}}</span></div>
            <div><span><strong>Điểm đã sử dụng:</strong></span><span>{{pointsUsed}}</span></div>
            <div><span><strong>Tổng tiền:</strong></span><span class="large-text">{{totalAmount}}</span></div>
            <div><span><strong>Giảm giá:</strong></span><span class="large-text">{{discountAmount}}</span></div>
            <div><span><strong>Thành tiền:</strong></span><span class="large-text">{{finalAmount}}</span></div>
        </div>
    </div>
</body>
</html>
`;
