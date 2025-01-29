# Brain Agriculture - Backend

API para gestão de produtores rurais com dashboard de métricas agrícolas.

## 🚀 Funcionalidades

- **Gestão de Produtores**

  - Cadastro, edição e exclusão de produtores
  - Validação de CPF/CNPJ
  - Controle de múltiplas propriedades rurais

- **Gestão de Fazendas**

  - Registro de áreas (total, agricultável e vegetação)
  - Validação de soma de áreas
  - Controle de culturas por safra

- **Dashboard Agrícola**
  - Total de fazendas cadastradas
  - Total de hectares cultivados
  - Distribuição por estado
  - Distribuição por cultura
  - Uso do solo (agricultável vs vegetação)

## 🛠️ Tecnologias

- **Backend**
  - NestJS
  - Prisma (ORM)
  - PostgreSQL
  - Docker
  - Swagger (Documentação)
  - class-validator (Validações)

## 📋 Pré-requisitos

- Node.js 18+
- npm 9+
- Docker 20+
- Docker Compose 2+

## ⚙️ Instalação

#### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/brain-agriculture.git
cd brain-agriculture/backend
```

#### 2. Instale as dependências

```bash
npm install
```

#### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

#### 4. Inicie os containers

```bash
docker-compose up -d

```

#### 5. Execute as migrações

```bash
npx prisma migrate dev
```

### 🔧 Configuração do Ambiente

Arquivo .env:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/brain-agriculture?schema=public"
PORT=3000
```

### Para salvar como arquivo:

1. Copie todo o conteúdo acima
2. Crie um novo arquivo chamado `README.md`
3. Cole o conteúdo
4. Salve o arquivo

A formatação está corrigida e todos os blocos de código serão exibidos corretamente no GitHub e em editores Markdown.
