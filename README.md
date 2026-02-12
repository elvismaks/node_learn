## 長樂未央 API

此項目為長樂未央公司開發的，專供學習`Node.js`的同學使用。項目使用了 Node.js + Express + MySQL + Sequelize ORM 開發。

項目課程地址：https://clwy.cn/courses/fullstack-node

讓我們一起從零基礎開始，學習接口開發。先從最基礎的項目搭建、數據庫的入門，再到完整的真實項目開發，一步步的和大家一起完成一個真實的項目。

## 配置環境變量

將`.env.example`文件拷貝為`.env`文件，並修改配置。

\```txt
PORT=3000
SECRET=你的秘鑰
\```

其中`PORT`配置為服務端口，`SECRET`配置為秘鑰。

## 生成秘鑰

在命令行中運行 

\```shell
node
\```

進入交互模式後，運行

\```shell
const crypto = require('crypto');
console.log(crypto.randomBytes(32).toString('hex'));
\```

複製得到的秘鑰，並填寫到`.env`文件中的`SECRET`配置。

> PS：可以使用 `ctrl + c` 退出交互模式。

## 配置數據庫

項目使用 Docker 容器運行 MySQL 數據庫。安裝好 Docker 後，可直接啟動 MySQL。

\```shell
docker-compose up -d
\```

如需使用自行安裝的 MySQL，需要修改`config/config.json`文件中的數據庫用戶名與密碼。

\```json
{
  "development": {
    "username": "您的數據庫用戶名",
    "password": "您的數據庫密碼"
  }
}
\```

## 安裝與運行

\```shell
# 安裝項目依賴包
npm i

# 創建數據庫。如創建失敗，可以手動建庫。
npx sequelize-cli db:create --charset utf8mb4 --collate utf8mb4_general_ci

# 運行遷移，自動建表。
npx sequelize-cli db:migrate

# 運行種子，填充初始數據。
npx sequelize-cli db:seed:all

# 啟動服務
npm start
\```

訪問地址：[http://localhost:3000](http://localhost:3000)，詳情請看接口文檔。

## 初始管理員賬號

\```txt
賬號：admin
密碼: 123123
\```
