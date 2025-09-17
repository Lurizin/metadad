# Usa a imagem oficial do Node.js 18 no Alpine Linux, que é uma versão mais leve
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de configuração (package.json e package-lock.json) para o diretório de trabalho
# Isso é feito primeiro para que o cache do Docker possa ser usado de forma eficiente
COPY package*.json ./

# Instala as dependências do projeto
# O --production garante que apenas as dependências de produção sejam instaladas
RUN npm install --production

# Copia o código da sua API para o diretório de trabalho no contêiner
COPY . .

# Expõe a porta que a sua API vai usar. A porta 3000 é um padrão comum
EXPOSE 3000

# O comando para iniciar a sua aplicação quando o contêiner for iniciado
CMD ["node", "server.js"]