# Portfolio Admin Backend - Node.js/Express.js

Este é o backend do sistema de administração de portfólio, migrado de Python/Flask para Node.js/Express.js para melhor compatibilidade com o frontend React e facilidade de deploy no Hostinger.

## Características

- **Framework**: Express.js
- **Banco de dados**: SQLite (desenvolvimento) / MySQL/PostgreSQL (produção)
- **Autenticação**: JWT (JSON Web Tokens)
- **Upload de arquivos**: Multer
- **CORS**: Configurado para frontend React
- **Criptografia**: bcryptjs para senhas

## Estrutura do Projeto

```
src/
├── routes/          # Rotas da API
│   ├── auth.js      # Autenticação (login, registro)
│   ├── projects.js  # Gerenciamento de projetos
│   ├── images.js    # Upload e gerenciamento de imagens
│   ├── user.js      # Gerenciamento de usuários
│   └── homepage.js  # Configurações da página inicial
├── middleware/      # Middlewares personalizados
│   └── auth.js      # Middleware de autenticação JWT
├── database/        # Configuração do banco de dados
│   └── database.js  # Conexão e helpers do SQLite
└── static/          # Arquivos estáticos
    └── images/      # Imagens uploadadas
```

## Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd portfolio-admin-backend-nodejs
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
NODE_ENV=development
PORT=5000
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET_KEY=jwt-secret-string-change-in-production
DATABASE_URL=sqlite:./src/database/app.db
ALLOWED_ORIGINS=https://christianbogaert.netlify.app
MAX_FILE_SIZE=16777216
```

### Execução

#### Desenvolvimento
```bash
npm run dev
```

#### Produção
```bash
npm start
```

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/me` - Obter informações do usuário atual
- `POST /api/auth/verify` - Verificar token JWT

### Projetos
- `GET /api/projects` - Listar todos os projetos
- `GET /api/projects/:id` - Obter projeto específico
- `POST /api/projects` - Criar novo projeto (autenticado)
- `PUT /api/projects/:id` - Atualizar projeto (autenticado)
- `DELETE /api/projects/:id` - Deletar projeto (autenticado)

### Imagens
- `POST /api/upload` - Upload de imagem única (autenticado)
- `POST /api/upload-multiple` - Upload de múltiplas imagens (autenticado)
- `GET /api/images` - Listar todas as imagens
- `DELETE /api/images/:id` - Deletar imagem (autenticado)
- `GET /api/images/:filename` - Servir imagem estática

### Usuários
- `GET /api/users` - Listar usuários (autenticado)
- `GET /api/users/:id` - Obter usuário específico (autenticado)
- `PUT /api/users/:id` - Atualizar perfil do usuário (autenticado)
- `PUT /api/users/:id/password` - Alterar senha (autenticado)
- `DELETE /api/users/:id` - Deletar usuário (autenticado)

### Homepage
- `GET /api/homepage` - Obter conteúdo da página inicial
- `PUT /api/homepage` - Atualizar conteúdo da página inicial (autenticado)
- `GET /api/homepage/stats` - Obter estatísticas (autenticado)

### Utilitários
- `GET /api/health` - Verificação de saúde da API

## Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Para acessar endpoints protegidos, inclua o token no header:

```
Authorization: Bearer <seu-jwt-token>
```

## Upload de Arquivos

O sistema suporta upload de imagens com as seguintes características:
- Formatos aceitos: JPEG, JPG, PNG, GIF, WebP
- Tamanho máximo: 16MB (configurável)
- Armazenamento: Sistema de arquivos local

## Banco de Dados

### Desenvolvimento
O projeto usa SQLite para desenvolvimento, com o banco criado automaticamente em `src/database/app.db`.

### Produção
Para produção, recomenda-se usar MySQL ou PostgreSQL. Instale o driver apropriado:

```bash
# Para MySQL
npm install mysql2

# Para PostgreSQL
npm install pg
```

E modifique a configuração em `src/database/database.js`.

## CORS

O CORS está configurado para permitir requisições dos seguintes origins:
- `https://christianbogaert.netlify.app`
- Outros origins configurados na variável `ALLOWED_ORIGINS`

## Deploy

### Hostinger
Consulte o arquivo `hostinger_deployment_guide.md` para instruções detalhadas de deploy no Hostinger.

### Outros Provedores
O projeto é compatível com qualquer provedor que suporte Node.js, incluindo:
- Heroku
- Vercel
- DigitalOcean
- AWS
- Google Cloud Platform

## Desenvolvimento

### Scripts Disponíveis
- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento com nodemon
- `npm test` - Executa testes (não implementado)

### Estrutura de Dados

#### Usuários
```javascript
{
  id: Integer,
  username: String,
  email: String,
  password_hash: String,
  created_at: DateTime,
  updated_at: DateTime
}
```

#### Projetos
```javascript
{
  id: Integer,
  title: String,
  description: String,
  image_url: String,
  project_url: String,
  github_url: String,
  technologies: Array<String>, // Armazenado como JSON
  featured: Boolean,
  created_at: DateTime,
  updated_at: DateTime
}
```

#### Homepage
```javascript
{
  id: Integer,
  hero_title: String,
  hero_subtitle: String,
  about_text: String,
  skills: Array<String>, // Armazenado como JSON
  contact_email: String,
  contact_phone: String,
  social_links: Object, // Armazenado como JSON
  created_at: DateTime,
  updated_at: DateTime
}
```

## Migração do Flask

Este projeto foi migrado de Python/Flask para Node.js/Express.js mantendo compatibilidade total com o frontend React existente. As principais mudanças incluem:

- Substituição do Flask por Express.js
- Migração de SQLAlchemy para SQLite3 nativo
- Conversão de Flask-JWT-Extended para jsonwebtoken
- Adaptação de Flask-CORS para cors
- Migração de Werkzeug para multer (upload de arquivos)

## Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença ISC - veja o arquivo LICENSE para detalhes.

## Suporte

Para suporte, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.

