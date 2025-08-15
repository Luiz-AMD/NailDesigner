# Livía Nail Art - Sistema de Agendamento

Sistema completo de agendamento para designer de unhas com interfaces separadas para clientes e proprietário.

## Funcionalidades

### Interface do Cliente (`index.html`)
- **Visualização de serviços**: Apresentação dos serviços oferecidos
- **Galeria de trabalhos**: Integração com Instagram via LightWidget
- **Agendamento online**: Sistema completo de agendamento com:
  - Calendário interativo
  - Seleção de horários disponíveis
  - Validação de datas e horários
  - Envio automático via WhatsApp
- **Contato**: Links para WhatsApp e Instagram

### Interface do Proprietário (`admin.html`)
- **Dashboard**: Estatísticas em tempo real
  - Total de agendamentos
  - Agendamentos do dia
  - Agendamentos da semana
  - Horários disponíveis
- **Gerenciamento de Agendamentos**:
  - Lista completa de agendamentos
  - Filtros por data e status
  - Edição de agendamentos
  - Confirmação/cancelamento
  - Exportação para CSV
- **Calendário Administrativo**:
  - Visualização mensal
  - Detalhes dos agendamentos por dia
  - Navegação entre meses
- **Configurações do Sistema**:
  - Horários de funcionamento
  - Configuração de serviços e preços
  - Configurações de notificação

## Como Usar

### Para Clientes
1. Acesse `index.html` no navegador
2. Navegue pelos serviços e galeria
3. Vá para a seção "Agendamento Online"
4. Selecione uma data no calendário
5. Escolha um horário disponível
6. Preencha seus dados
7. Clique em "Agendar"
8. Confirme o agendamento via WhatsApp

### Para o Proprietário
1. Acesse `admin.html` no navegador
2. Use o dashboard para visualizar estatísticas
3. Gerencie agendamentos na aba "Agendamentos"
4. Visualize o calendário na aba "Calendário"
5. Configure o sistema na aba "Configurações"

## 📁 Estrutura do Projeto

```
site-nail-designer/
├── src/
│   ├── index.html          # Interface do cliente
│   ├── admin.html          # Interface do proprietário
│   ├── img/                # Imagens e logo
│   ├── scripts/
│   │   ├── main.js         # JavaScript do cliente
│   │   └── admin.js        # JavaScript do proprietário
│   └── styles/
│       ├── main.css        # Estilos principais
│       ├── admin.css       # Estilos do painel administrativo
│       ├── normalize.css   # Reset CSS
│       └── responsive.css  # Estilos responsivos
└── README.md
```

## Tecnologias Utilizadas

- **HTML5**: Estrutura das páginas
- **CSS3**: Estilização e responsividade
- **JavaScript**: Funcionalidades interativas
- **LocalStorage**: Armazenamento local dos dados
- **WhatsApp API**: Integração para envio de mensagens
- **Instagram LightWidget**: Galeria de trabalhos

## Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Smartphone

## Configurações

### Horários de Funcionamento
- **Padrão**: 07:30 às 18:00
- **Almoço**: 12:00 às 13:30
- **Dias úteis**: Segunda a sexta-feira

### Serviços Disponíveis
- Fibra de vidro
- Molde F1
- Banho em gel
- Manutenção
- Esmaltação em gel

## Armazenamento de Dados

Os dados são armazenados localmente no navegador usando: ALTERAR 
- **Agendamentos**: Lista de todos os agendamentos
- **Configurações**: Configurações do sistema

## Segurança

- Validação de dados no frontend
- Verificação de horários disponíveis
- Prevenção de agendamentos duplicados
- Confirmação para ações importantes

## Suporte

Para suporte ou dúvidas:
- WhatsApp: (38) 99270-2823
- Instagram: @livia_nailart__

## Instalação

1. Clone ou baixe o projeto
2. Abra `src/index.html` no navegador
3. Para acessar o painel administrativo, clique em "Área Admin" no menu

## Notas

- O sistema funciona offline
- Os dados são salvos no navegador do usuário
- Recomenda-se fazer backup regular dos dados
- Para produção, considere implementar um backend

---

**Desenvolvido para Livía Nail Art** 
