
# --- STAGE 1: Build React App ---
    FROM node:22-alpine as builder

    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY . .
    # Lệnh này sinh ra thư mục /app/dist
    RUN npm run build 
    
    # --- STAGE 2: Serve bằng Nginx ---
    FROM nginx:alpine
    
    # Xóa các file mặc định của Nginx
    RUN rm -rf /usr/share/nginx/html/*
    
    # Copy thư mục dist từ Stage 1 sang thư mục phục vụ web của Nginx
    COPY --from=builder /app/dist /usr/share/nginx/html
    
    # Copy file cấu hình Nginx riêng cho React (Sẽ tạo ở Bước 3)
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]