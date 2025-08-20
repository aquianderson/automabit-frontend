# Automabit Frontend

Sistema de monitoramento e gestão de silos desenvolvido em React com Vite.

## 🚀 Tecnologias

- **React 18** - Biblioteca para interfaces de usuário
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Biblioteca de ícones
- **jsPDF** - Geração de relatórios em PDF

## 📋 Funcionalidades

- ✅ **Dashboard Interativo** - Visão geral do sistema com gráficos e métricas
- ✅ **Monitoramento de Silos** - Acompanhamento em tempo real do status dos silos
- ✅ **Sistema de Alertas** - Notificações automáticas para situações críticas
- ✅ **Histórico de Movimentações** - Registro completo de todas as operações
- ✅ **Relatórios PDF** - Geração de relatórios personalizados
- ✅ **Interface Responsiva** - Compatível com desktop e dispositivos móveis
- ✅ **Sistema de Autenticação** - Login seguro com persistência de sessão

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/SEU_USUARIO/automabit-frontend.git
cd automabit-frontend
```

2. Instale as dependências:
```bash
pnpm install
# ou
npm install
```

3. Execute o projeto:
```bash
pnpm dev
# ou
npm run dev
```

4. Acesse no navegador: `http://localhost:5173`

## 📱 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de UI base
│   ├── Header.jsx      # Cabeçalho da aplicação
│   ├── BottomNavigation.jsx  # Navegação inferior
│   └── ...
├── pages/              # Páginas da aplicação
│   ├── Dashboard.jsx   # Painel principal
│   ├── Inicio.jsx     # Página inicial
│   ├── Alertas.jsx    # Gerenciamento de alertas
│   └── ...
├── hooks/              # Custom hooks
├── lib/                # Utilitários
└── assets/             # Recursos estáticos
```

## 🎨 Design System

O projeto utiliza um design system baseado em:
- **Cores**: Paleta azul profissional
- **Tipografia**: Sistema de tamanhos responsivos
- **Componentes**: Biblioteca própria de componentes UI
- **Ícones**: Lucide React para consistência visual

## 📊 Componentes Principais

### Dashboard
- Gráficos de ocupação e capacidade
- Métricas em tempo real
- Cards informativos

### Monitoramento
- Lista de silos com status visual
- Modais para detalhes e edição
- Sistema de criação/exclusão

### Alertas
- Notificações categorizadas
- Filtros por tipo e prioridade
- Histórico de alertas

### Relatórios
- Geração de PDFs personalizados
- Filtros por período e silo
- Múltiplos tipos de relatório

## 🚀 Deploy

Para fazer o build de produção:

```bash
pnpm build
# ou
npm run build
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

