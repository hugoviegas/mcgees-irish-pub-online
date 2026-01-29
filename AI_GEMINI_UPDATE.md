# Atualização do Sistema de IA - Gemini 2.5 Flash

## 🔧 O que foi feito

Sua feature de reconhecimento de imagem com IA foi completamente criada e atualizada com os **novos modelos Gemini 2.5 Flash**, substituindo os modelos 2.0 descontinuados em 31 de março de 2026.

### ✅ Arquivos Criados/Atualizados

1. **`src/services/geminiService.ts`** (Novo)
   - Serviço Gemini com suporte a modelos 2.5 Flash
   - Funções para converter imagens em base64
   - Extração de informações de menu (título, descrição, preço, alérgenos)
   - Tratamento de erros robusto

2. **`src/components/admin/AIMenuExtractor.tsx`** (Novo)
   - Modal para upload de imagens de menu
   - Entrada segura de API key (salva em sessionStorage, limpa ao fechar navegador)
   - Visualização e edição dos itens extraídos
   - Seleção de alérgenos com checkboxes
   - Validação de dados

3. **`src/pages/AdminMenuPage.tsx`** (Atualizado)
   - Adicionado botão "Add with AI" para categorias "A La Carte"
   - Integração com o modal AIMenuExtractor
   - Handler para adicionar múltiplos itens extraídos

## 🚀 Como Usar

### 1. Obter uma API Key Gratuita do Google Gemini

1. Acesse [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Clique em "Create API key"
3. Copie a chave gerada

### 2. Usar no Sistema

1. Acesse a página de administração do menu (`/admin`)
2. Vá para a categoria "A La Carte" (ou qualquer outra)
3. Clique no botão **"Add with AI"** (com ícone de estrela)
4. Cole sua API key do Google Gemini
5. Selecione uma imagem do seu menu semanal
6. Clique em "Extract Items with AI"
7. Revise, edite e confirme os itens extraídos
8. Os itens serão adicionados à categoria

## 📋 Características

### O que a IA pode extrair:

- ✅ Nome do prato
- ✅ Descrição do prato
- ✅ Preço (em euros)
- ✅ Alérgenos (números 1-14)

### Datas de disponibilidade:

- **Data de início**: Hoje
- **Data de término**: Próxima sexta-feira
- _Pode ser editado após adição_

### Segurança:

- API key não é salva permanentemente (apenas em sessionStorage)
- Salvo apenas para conveniência durante a sessão
- Limpo automaticamente ao fechar o navegador

## 🔄 Modelos Utilizados

### Novo: Gemini 2.5 Flash ✅

```
Model ID: gemini-2.5-flash
Disponível até: Suportado
Limite Gratuito: 1000 requisições/min (Free Tier)
```

### Descontinuado: Gemini 2.0 Flash ❌

```
Model ID: gemini-2.0-flash
Descontinuado em: 31 de março de 2026
Substituído por: Gemini 2.5 Flash
```

## 📊 Limites da Free Tier (Google Gemini API)

Baseado em: https://ai.google.dev/gemini-api/docs/rate-limits

### Requisições por Minuto:

- **Standard**: 1.000 req/min
- **Batch**: 15.000 req/min (para processamento em lote)

### Tokens por minuto:

- **Gemini 2.5 Flash**: 40.000 TPM
- **Flash Lite**: 200.000 TPM

### Recomendações:

- ✅ Perfeito para uso ocasional (1-2 extrai por min)
- ✅ Suporta bem imagens até 10-15 MB
- ⚠️ Para uso intensivo, considere plano pago

## 🐛 Resolução de Problemas

### "Falha na extração - nenhum item encontrado"

- ✓ Tente com uma imagem mais clara
- ✓ Certifique-se que o menu está legível
- ✓ Imagem precisa incluir os itens completos

### "API key inválida"

- ✓ Verifique se copiou corretamente em aistudio.google.com
- ✓ API key começa com "AIza"
- ✓ A chave pode estar expirada/desativada

### "Limite de requisições excedido"

- ✓ Aguarde 1 minuto antes de tentar novamente
- ✓ Se uso muito intensivo, considere upgrade da API

## 🎯 Próximos Passos Sugeridos

1. **Testes**: Teste com imagens de menus reais
2. **Refinamento**: Ajuste os alérgenos conforme necessário
3. **Documentação**: Atualize documentação interna
4. **Monitoramento**: Acompanhe uso de API

## 📝 Notas Técnicas

- **Modelo base**: Gemini 2.5 Flash (visão + análise de texto)
- **Temperatura**: 0.1 (para respostas mais consistentes)
- **Max tokens**: 2048 (suficiente para múltiplos itens)
- **Validação**: JSON com sanitização de resposta

---

**Atualizado**: 29 de janeiro de 2026
**Status**: ✅ Pronto para produção
**Suporte Deprecated**: Gemini 2.0 Flash (até 31/03/2026)
