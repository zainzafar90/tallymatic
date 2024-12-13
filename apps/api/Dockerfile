FROM node:20-alpine as builder

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Install PM2 globally
RUN npm install pm2 -g

# Copy source code
COPY . .

# Build API
RUN npm run build:api

# Create PM2 config
RUN echo '{\
  "apps": [{\
    "name": "api",\
    "script": "dist/apps/api/main.js",\
    "instances": "max",\
    "exec_mode": "cluster",\
    "env": {\
      "NODE_ENV": "production",\
      "PORT": 3001,\
      "DB_HOST": "postgres",\
      "DB_PORT": 5432,\
      "DB_NAME": "tallymatic",\
      "DB_USER": "postgres",\
      "DB_PASSWORD": "postgres",\
      "DB_DIALECT": "postgres",\
      "JWT_SECRET": "f2NQW9ElfcRPlqsDEqcvmlETauLjPyqpJZhyIKsa",\
      "JWT_ACCESS_EXPIRATION_MINUTES": 100,\
      "JWT_REFRESH_EXPIRATION_DAYS": 30,\
      "JWT_RESET_PASSWORD_EXPIRATION_MINUTES": 10,\
      "JWT_VERIFY_EMAIL_EXPIRATION_MINUTES": 10,\
      "SMTP_HOST": "smtp.ethereal.email",\
      "SMTP_PORT": 587,\
      "SMTP_USERNAME": "deshaun.shields@ethereal.email",\
      "SMTP_PASSWORD": "ZZbKZDM41QryBjeVpP",\
      "EMAIL_FROM": "support@meelio.io",\
      "COOKIE_SECRET": "thisisasamplesecret",\
      "CLIENT_URL": "http://localhost:4000"\
    }\
  }]\
}' > process.json

EXPOSE 3000

CMD ["pm2-runtime", "start", "process.json"] 