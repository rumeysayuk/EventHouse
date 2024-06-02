# Temel bir Node.js imajı kullanın
FROM node:20

# Çalışma dizinini ayarla
WORKDIR /app

# package.json ve package-lock.json dosyalarını çalışma dizinine kopyala
COPY package*.json ./

# Projeyi yükle
RUN npm install

# Uygulama kodunu çalışma dizinine kopyala
COPY . .

# Uygulamanın çalışacağı portu belirt
EXPOSE 5000

# Uygulamayı başlat
CMD ["npm", "start"]
