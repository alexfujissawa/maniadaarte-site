# 🌸 Mania da Arte — Vitrine & Catálogo Estático (SSG)

Site vitrine e catálogo oficial da papelaria personalizada e afetiva **Mania da Arte** no Japão. Desenvolvido com **Astro**, **Tailwind CSS** e projetado para alta conversão no modelo sem carrinho de compras, direcionando cada encomenda diretamente para o WhatsApp oficial e promovendo a assinatura recorrente do **Clube Mania da Arte** via Square Japão.

---

## 🌐 Domínio & Hospedagem
- **Domínio Oficial:** `https://maniadaarte.digital`
- **Hospedagem Recomendada:** Vercel (Modo Static Site Generation - SSG gratuito)

---

## 🎨 Identidade Visual (Estilo Minimalista Papier)
- **Fundo do Site:** Off-White / Textura de Papel (`#FDFBF7`)
- **Texto Principal:** Marrom Elegante (`#4A3E40`)
- **Tipografia:** 
  - Títulos: `Playfair Display` (Serifada elegante)
  - Textos & Botões: `DM Sans` (Sem serifa moderna)
- **Cards de Produtos:** Efeito de profundidade com produtos em PNG flutuando sobre caixas de cores pastéis suaves de acordo com a categoria (`bg-[#F3E5E8]`, `bg-[#FCF0E3]`, `bg-[#E2ECE9]`, `bg-[#F5EFF6]`).

---

## 💎 Destaque Principal: Clube Mania da Arte
- **Oferta:** 15% de DESCONTO em todas as compras do catálogo.
- **Assinatura:** ¥500/mês recorrente integrado à Square Japão.
- **Aviso nos Cards:** *"✨ Membros do Clube: 15% de desconto neste item"*.

---

## 📞 Canais de Atendimento
- **WhatsApp Internacional (Japão):** `+81 70-8415-0288` (`https://wa.me/817084150288`)
- **Instagram Oficial:** `https://instagram.com/mania.daarte`

---

## 📂 Estrutura do Projeto

```text
maniadaarte_site/
├── astro.config.mjs         # Configuração do Astro (site: https://maniadaarte.digital, SSG, Tailwind)
├── tailwind.config.mjs      # Configurações de cores, fontes Papier e sombras suaves
├── tsconfig.json            # TypeScript / Astro strict config
├── package.json             # Dependências e scripts
├── vercel.json              # Configurações de deploy estático na Vercel
├── public/
│   ├── favicon.svg          # Favicon oficial
│   └── images/              # Imagens dos produtos sem fundo (PNG)
│       ├── caderno-mania.png
│       ├── topo-bolo-mania.png
│       ├── cartao-visita-mania.png
│       └── lembrancinha-mania.png
├── src/
│   ├── data/
│   │   └── produtos.json    # Base de dados local dos produtos e mensagens do WhatsApp
│   ├── layouts/
│   │   └── Layout.astro     # Shell HTML com fontes do Google, SEO e textura de papel
│   ├── components/
│   │   ├── Header.astro     # Barra superior, logo, navegação e botões rápidos
│   │   ├── ClubBanner.astro # Hero de alta conversão para o Clube (¥500/mês, 15% OFF)
│   │   ├── ProductCard.astro# Card flutuante estilo Papier com botão de WhatsApp codificado
│   │   ├── ProductGrid.astro# Grid responsivo com filtro de categorias sem reload
│   │   ├── HowItWorks.astro # Passo a passo do pedido sem carrinho
│   │   └── Footer.astro     # Rodapé com dados de contato, Instagram e WhatsApp
│   └── pages/
│       └── index.astro      # Página inicial estática
```

---

## 🚀 Como Executar Localmente

### 1. Instalar as dependências
```bash
npm install
```

### 2. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:4321` no navegador.

### 3. Gerar a build estática para produção
```bash
npm run build
```
Os arquivos otimizados serão gerados na pasta `dist/`.

---

## ☁️ Deploy na Vercel
1. Conecte o repositório no dashboard da [Vercel](https://vercel.com).
2. O framework Astro será detectado automaticamente (`outputDirectory: dist`).
3. Adicione o domínio `maniadaarte.digital` nas configurações de Domínio da Vercel e aponte os registros DNS (CNAME/A) do seu registrador.
