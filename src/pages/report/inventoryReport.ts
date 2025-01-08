export const inventoryReportTemplate = `
<html  lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Báo cáo tồn kho</title>
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
      </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Báo cáo tồn kho</h1>
            
        </div>
        <div class="info">
            <p><strong>Thời gian tạo:</strong> {{created_at}}</p>
        </div>
        <div>Tổng tồn kho: {{totalInventory}}</div>
        <table>
            <thead>
                <tr>
                    <th>Mã hàng </th>
                    <th>Tên mặt hàng </th>
                    <th>Tồn kho</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody>
              {{body}} 
            </tbody>
        </table>
        <br>
    </div>
</body>
</html>`;
