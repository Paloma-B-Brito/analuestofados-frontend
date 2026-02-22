🌿 Analu Executive Intelligence Suite v3.0

O Analu Suite é uma plataforma ERP/CRM de alto padrão desenvolvida exclusivamente para a gestão integrada da Analu Estofados & Cosméticos. O sistema une o controle de supply chain, gestão de vendas premium e monitoramento de fábrica em uma interface executiva minimalista.

Status do Sistema: Operacional / Em Desenvolvimento Ativo
Arquitetura: Micro-frontend React + Integração com Spring Boot API.

🛠 Tech Stack & Protocolos

- Core: React.js (Hooks & Context API)

- Design: Tailwind CSS (Arquitetura Utilitária Customizada)

- UI/UX: Design System Premium (Analu Gold & Emerald Theme)

- Icons: Heroicons & Custom SVG Assets

- Fonts: Inter & Montserrat (Executivas)

🚀 Comandos de Operação 

Para iniciar o núcleo do sistema em ambiente de desenvolvimento:

npm start

Inicia o servidor local.
Acesse via: http://localhost:3000

npm run build

Gera a versão de produção otimizada.
O build é injetado com minificação profunda e hashes de segurança para deploy no servidor Analu.

📐 Estrutura de Componentes Premium

O sistema utiliza uma biblioteca interna de componentes customizados:

Componente,Função
Login.jsx ------   Gateway de autenticação segura com verificação de papéis (Admin/User).
ModalConsultaGeral.jsx ------- "Motor de busca global (SKUs, Insumos e Produtos)."
ModalAdicionarMaterial.jsx ------- Interface de registro para Supply Chain e Inventário.
MenuBotao.jsx ------- Átomo de navegação com micro-interações de luxo.

🔐 Configurações de Segurança

Este repositório contém lógica de autenticação via JWT (JSON Web Tokens). As variáveis de ambiente para conexão com o backend devem ser configuradas no arquivo .env (não incluído no versionamento):

REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_SYSTEM_VERSION=3.0.0

🏛 Identidade Visual (Design Tokens)

- Analu Emerald: #064e3b (Primária - Autoridade)

- Analu Gold: #b49157 (Destaque - Prestígio)

- Pure White: #ffffff (Base - Limpeza visual)

- Slate Soft: #f1f5f9 (Contraste de Interface)

✒️ Créditos & Propriedade

Este software é de uso restrito da Analu Estofados. Desenvolvido sob os protocolos de engenharia de:

© 2026 Minister Noiret • Software Engineering
