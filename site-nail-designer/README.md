# Site Designer de Unhas - React

Este é um site para um designer de unhas, apresentando serviços, galeria e informações de contato, agora convertido para React!

## 🚀 Como usar o React

### Pré-requisitos
- Node.js instalado no seu computador
- npm (vem com o Node.js)

### Instalação e Execução

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar o projeto em modo de desenvolvimento:**
   ```bash
   npm start
   ```
   O site abrirá automaticamente em `http://localhost:3000`

3. **Para criar uma versão de produção:**
   ```bash
   npm run build
   ```

## 📁 Estrutura do Projeto React

```
site-nail-designer/
├── public/
│   ├── index.html          # HTML principal
│   └── img/                # Imagens do site
├── src/
│   ├── components/         # Componentes React
│   │   ├── Header.js       # Cabeçalho e navegação
│   │   ├── Home.js         # Seção de boas-vindas
│   │   ├── Services.js     # Seção de serviços
│   │   ├── Gallery.js      # Galeria de trabalhos
│   │   ├── Contact.js      # Informações de contato
│   │   └── Appointment.js  # Sistema de agendamento
│   ├── styles/             # Arquivos CSS
│   │   ├── normalize.css
│   │   ├── main.css
│   │   └── responsive.css
│   ├── App.js              # Componente principal
│   └── index.js            # Ponto de entrada do React
└── package.json            # Configurações e dependências
```

## 🎯 Principais Funcionalidades

### ✅ Convertidas para React:
- **Header**: Navegação responsiva com menu mobile
- **Home**: Seção de boas-vindas com troca de imagens
- **Services**: Exibição dos serviços oferecidos
- **Gallery**: Widget do Instagram integrado
- **Contact**: Links para WhatsApp e Instagram
- **Appointment**: Sistema completo de agendamento com calendário

### 🔧 Funcionalidades do Sistema de Agendamento:
- Calendário interativo
- Seleção de horários disponíveis
- Formulário de agendamento
- Armazenamento local dos agendamentos
- Validação de dados
- Interface responsiva

## 🎨 Estilos

O projeto mantém todos os estilos originais:
- Design responsivo
- Animações CSS
- Cores e tipografia personalizadas
- Layout moderno e profissional

## 📱 Responsividade

O site é totalmente responsivo e funciona perfeitamente em:
- Desktop
- Tablet
- Smartphone

## 🚀 Vantagens do React

1. **Componentização**: Código organizado em componentes reutilizáveis
2. **Estado**: Gerenciamento eficiente do estado da aplicação
3. **Performance**: Renderização otimizada
4. **Manutenibilidade**: Código mais fácil de manter e expandir
5. **Escalabilidade**: Fácil adição de novas funcionalidades

## 🔄 Comandos Úteis

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm start

# Criar build de produção
npm run build

# Executar testes
npm test

# Ejetar configurações (não recomendado)
npm run eject
```

## 📞 Suporte

Para dúvidas ou problemas, entre em contato através dos links no site ou abra uma issue no repositório.

---

**Desenvolvido com ❤️ usando React** 