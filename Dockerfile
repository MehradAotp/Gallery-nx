# استفاده از تصویر پایه Node.js
FROM node:23 AS build

# تنظیم دایرکتوری کاری
WORKDIR /usr/src/app

# کپی کردن فایل‌های package.json و yarn.lock
COPY package*.json ./

# نصب وابستگی‌ها با yarn
RUN yarn install

# نصب NX CLI به صورت جهانی
RUN yarn global add nx@16.3.2

# کپی کردن باقی‌مانده‌ی پروژه
COPY . .

# اکسپوز کردن پورت‌ها
EXPOSE 3001
EXPOSE 3002

# اجرای پروژه‌ها در حالت تولید
CMD ["yarn", "serve:all"]
