import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * 🤖 AGENTE DE CONTEÚDO DO BLOG — MANIA DA ARTE JAPÃO
 * 
 * Segue rigorosamente o protocolo de 'Instruções_Maniadaarte.md':
 *  - Categorias: lembrancinhas, festas-infantis, topos-de-bolo, presentes-afetivos, dicas-de-decoracao, rotina, corporativo
 *  - Autor: "Equipe Mania da Arte"
 *  - Tom de voz: Afetuoso, doce, materno, focado em papelaria no Japão
 *  - Filtro Anti-Clichês robóticos
 *  - Agendado automaticamente toda Segunda e Quinta às 06h (fuso Japão) via GitHub Actions
 */

const clichesProibidos = [
  /em resumo/i,
  /otimizar recursos/i,
  /mergulhe conosco/i,
  /no cenário atual/i,
  /no mundo de hoje/i,
  /em suma/i
];

const bancoTemas = [
  {
    titulo: "Lembrancinhas de Maternidade no Japão: Como Celebrar a Chegada do Bebê com Doçura",
    descricao: "Inspirações delicadas de mimos, caixas personalizadas e tags para agradecer visitas e colegas de trabalho na chegada do seu bebê no Japão.",
    categoria: "lembrancinhas",
    corFundoPastel: "bg-[#F3E5E8]",
    imagem: "/images/lembrancinha-mania.png",
    tags: ["maternidade", "lembrancinhas", "bebê no japão", "família"],
    secoes: [
      {
        subtitulo: "A tradição do carinho e os mimos no Japão",
        conteudo: "No Japão, a celebração do nascimento é cercada de afeto e respeito. O costume de presentear quem torceu pela família ganha um toque ainda mais especial com a papelaria personalizada em português e japonês."
      },
      {
        subtitulo: "O que colocar nas caixinhas de lembrança?",
        conteudo: "Mini sabonetes perfumados, chaveiros afetivos, doces artesanais brasileiros (brigadeiro gourmet ou bem-nascidos) e cartões com a foto e data de nascimento do bebê são os queridinhos das mamães no Japão."
      },
      {
        subtitulo: "Envio seguro e montagem prática",
        conteudo: "Sabemos que os primeiros dias pós-parto são intensos. Por isso, na Mania da Arte enviamos todas as caixinhas já vincadas, coladas e prontas para entrega, com laços em fita de cetim impecáveis."
      }
    ]
  },
  {
    titulo: "Festas Infantis no Japão: Como Fazer uma Comemoração Encantadora e Compacta",
    descricao: "Dicas de etiquetas personalizadas, topos de bolo temáticos e lembrancinhas compactas para comemorações escolares no Hoikuen e Shougakkou.",
    categoria: "festas-infantis",
    corFundoPastel: "bg-[#FCF0E3]",
    imagem: "/images/topo-bolo-mania.png",
    tags: ["festas infantis", "hoikuen", "shougakkou", "aniversário no japão"],
    secoes: [
      {
        subtitulo: "Comemorações compactas e charmosas",
        conteudo: "As regras das escolas e apartamentos no Japão valorizam praticidade. Criamos lembrancinhas no tamanho ideal para as mochilas das crianças, sem exageros e com acabamento apaixonante."
      },
      {
        subtitulo: "Etiquetas personalizadas resistentes",
        conteudo: "Identificar garrafinhas térmicas, estojos e cadernos com o nome da criança em Katakana e alfabeto romano evita extravios e dá um toque de carinho à rotina escolar."
      },
      {
        subtitulo: "Topos de bolo com o personagem do coração",
        conteudo: "Anime favorito, tema de princesas ou bichinhos fofos: transformamos o bolo caseiro de domingo em um cenário de festa profissional cheio de amor."
      }
    ]
  },
  {
    titulo: "Topos de Bolo em Camadas 3D: A Magia das Cores e Texturas no Japão",
    descricao: "Como valorizar qualquer comemoração no Japão com esculturas de papel personalizadas com nome, idade e papéis especiais importados.",
    categoria: "topos-de-bolo",
    corFundoPastel: "bg-[#FCF0E3]",
    imagem: "/images/topo-bolo-mania.png",
    tags: ["topos de bolo", "papercraft", "aniversário", "confeitaria japão"],
    secoes: [
      {
        subtitulo: "Escultura de papel que vira lembrança",
        conteudo: "Ao contrário de impressões planas comuns, nossos topos usam papéis especiais com relevo, glitter que não solta pó e foil metálico, criando um efeito tridimensional deslumbrante nas fotos."
      },
      {
        subtitulo: "Hastes seguras e higiênicas",
        conteudo: "Utilizamos hastes transparentes ou bambu tratado para sustentação perfeita, sem risco de tombar ou comprometer o bolo."
      }
    ]
  },
  {
    titulo: "Presentes Afetivos no Japão: Cadernos e Agendas Feitos para Durar",
    descricao: "Surpreenda quem você ama no Japão com presentes personalizados com frases especiais, capa dura e laminação fosca premium.",
    categoria: "presentes-afetivos",
    corFundoPastel: "bg-[#F3E5E8]",
    imagem: "/images/caderno-mania.png",
    tags: ["presentes afetivos", "agendas", "mimos no japão", "amizade"],
    secoes: [
      {
        subtitulo: "O valor de um presente personalizado",
        conteudo: "Quem mora longe da família valoriza profundamente um presente pensado exclusivamente para si. Uma agenda com seu nome e detalhes escolhidos a dedo aquece o coração."
      },
      {
        subtitulo: "Embalagem protetora para presente",
        conteudo: "Cada pedido sai do nosso ateliê envolto em papel de seda, com cheirinho suave e tag de agradecimento pronta para presentear."
      }
    ]
  },
  {
    titulo: "Dicas de Decoração: Como Montar uma Mesa de Aniversário Linda em Casa no Japão",
    descricao: "Truques práticos para harmonizar painéis de papel, caixas pirâmide e suporte de doces no espaço do seu apartamento japonês.",
    categoria: "dicas-de-decoracao",
    corFundoPastel: "bg-[#F5EFF6]",
    imagem: "/images/lembrancinha-mania.png",
    tags: ["decoração", "apartamento no japão", "festa em casa", "dicas"],
    secoes: [
      {
        subtitulo: "Aproveitando a luz natural e espaços compactos",
        conteudo: "Posicionar a mesinha do bolo perto da janela e utilizar alturas diferentes com caixas personalizadas cria profundidade perfeita para fotos inesquecíveis."
      },
      {
        subtitulo: "Cores pastéis que transmitem aconchego",
        conteudo: "Tons pastéis suaves como rosa blush, pêssego e menta trazem a delicadeza perfeita sem sobrecarregar o ambiente visualmente."
      }
    ]
  },
  {
    titulo: "Chá Revelação e Chá de Bebê no Japão: Detalhes Encantadores para Celebrar a Família",
    descricao: "Como preparar uma mesa de chá revelação intimista e inesquecível no Japão com caixinhas interativas e topos de bolo personalizados.",
    categoria: "lembrancinhas",
    corFundoPastel: "bg-[#F3E5E8]",
    imagem: "/images/lembrancinha-mania.png",
    tags: ["chá revelação", "chá de bebê", "maternidade japão", "família"],
    secoes: [
      {
        subtitulo: "A emoção de reunir amigos próximos",
        conteudo: "Mesmo longe do Brasil, o chá revelação no Japão é um dos momentos mais doces. Caixinhas com confetes e fitas duplas criam o suspense ideal para o grande anúncio."
      },
      {
        subtitulo: "Paleta de cores elegante e atemporal",
        conteudo: "Combinamos o rosa clássico e o azul sereno com tons neutros como areia e dourado, garantindo sofisticação às lembrancinhas."
      }
    ]
  },
  {
    titulo: "Batizado e Primeira Comunhão no Japão: Lembrancinhas que Eternizam a Fé",
    descricao: "Marcadores de página, mini livretos de oração e caixas anjinho para momentos de fé e bênção com a comunidade brasileira no Japão.",
    categoria: "presentes-afetivos",
    corFundoPastel: "bg-[#FCF0E3]",
    imagem: "/images/caderno-mania.png",
    tags: ["batizado no japão", "primeira comunhão", "fé", "lembrancinhas"],
    secoes: [
      {
        subtitulo: "Mimos delicados e cheios de significado",
        conteudo: "O batizado nas igrejas e paróquias brasileiras no Japão pede lembranças serenas. Papéis texturizados em linho e cortes a laser em formato de anjinhos transmitem a pureza da data."
      },
      {
        subtitulo: "Padrinhos e avós no Brasil e no Japão",
        conteudo: "Criamos caixas com fotos e mensagens especiais para enviar aos familiares no Brasil ou entregar em mãos aos padrinhos aqui no Japão."
      }
    ]
  },
  {
    titulo: "Agendas de Turnos no Japão: Como Organizar Folgas, Turnos Noturnos e Família",
    descricao: "O planner perfeito para quem trabalha em turnos alternados (Koutai) nas fábricas do Japão e quer manter o tempo com a família protegido.",
    categoria: "rotina",
    corFundoPastel: "bg-[#E2ECE9]",
    imagem: "/images/caderno-mania.png",
    tags: ["turnos no japão", "koutai", "rotina", "planner"],
    secoes: [
      {
        subtitulo: "Dominando os turnos diurnos e noturnos",
        conteudo: "Alternar semanas de dia e noite é desafiador para o corpo e para o convívio. Codificar os turnos por cores em um planner físico traz clareza imediata para toda a casa."
      },
      {
        subtitulo: "Planejamento dos feriados longos",
        conteudo: "Programe suas viagens de Golden Week, Obon e Oshougatsu com antecedência, reservando dias de descanso real com quem você ama."
      }
    ]
  }
];

function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-');
}

function validarTomDeVoz(texto) {
  for (const regex of clichesProibidos) {
    if (regex.test(texto)) {
      texto = texto.replace(regex, '');
    }
  }
  return texto;
}

function gerarPost(temaEscolhido, isDraft = false) {
  const dataHoje = new Date().toISOString().split('T')[0];
  const slug = slugify(temaEscolhido.titulo);
  const pastaBlog = path.resolve('./src/content/blog');

  if (!fs.existsSync(pastaBlog)) {
    fs.mkdirSync(pastaBlog, { recursive: true });
  }

  const arquivoPath = path.join(pastaBlog, `${slug}.md`);

  let markdown = `---
titulo: "${temaEscolhido.titulo}"
descricao: "${temaEscolhido.descricao}"
data: ${dataHoje}
categoria: "${temaEscolhido.categoria}"
imagem: "${temaEscolhido.imagem}"
corFundoPastel: "${temaEscolhido.corFundoPastel}"
autor: "Equipe Mania da Arte"
tags: ${JSON.stringify(temaEscolhido.tags)}
destaque: false
draft: ${isDraft}
---

${temaEscolhido.descricao}

---

`;

  for (const secao of temaEscolhido.secoes) {
    markdown += `## ${secao.subtitulo}\n\n${secao.conteudo}\n\n`;
  }

  markdown += `---

## Vamos criar uma celebração linda juntos no Japão?

Se você sonha com uma festa cheia de amor, uma lembrancinha inesquecível ou quer presentear alguém especial aqui no Japão, a **Equipe Mania da Arte** está pronta para sonhar junto com você.

✨ **Vantagem para Membros do Clube:** 
Lembre-se de que os membros do nosso **Clube Mania da Arte** garantem **15% de desconto** imediato em todas as peças do catálogo por apenas **¥500/mês**, além de prioridade na fila de confecção!

Fale conosco diretamente pelo WhatsApp no Japão: **[+81 70-2297-3498](https://wa.me/817022973498)** e receba a prévia digital da sua arte com todo o carinho.
`;

  markdown = validarTomDeVoz(markdown);

  fs.writeFileSync(arquivoPath, markdown, 'utf-8');
  console.log(`\n🎉 [AGENTE DE CONTEÚDO]: Novo post criado com sucesso!`);
  console.log(`📄 Arquivo: src/content/blog/${slug}.md`);
  console.log(`🏷️ Categoria: ${temaEscolhido.categoria}`);
  console.log(`🔒 Status: ${isDraft ? 'Rascunho (Draft)' : 'Publicado (Live)'}`);
  console.log(`🔗 URL: https://maniadaarte.digital/blog/${slug}`);

  return { slug, titulo: temaEscolhido.titulo };
}

// Analisa argumentos da linha de comando
const args = process.argv.slice(2);
const isDraft = args.includes('--draft');
const isGit = args.includes('--git');
const temaArgIndex = args.indexOf('--tema');

let temaEscolhido = null;

if (temaArgIndex !== -1 && args[temaArgIndex + 1]) {
  const tituloCustom = args[temaArgIndex + 1];
  temaEscolhido = {
    titulo: tituloCustom,
    descricao: `Ideias delicadas e dicas especiais sobre ${tituloCustom.toLowerCase()} para quem mora no Japão, criadas com carinho pela Equipe Mania da Arte.`,
    categoria: "dicas-de-decoracao",
    corFundoPastel: "bg-[#F3E5E8]",
    imagem: "/images/caderno-mania.png",
    tags: ["papelaria afetiva", "japão", "família", "dicas criativas"],
    secoes: [
      {
        subtitulo: "O valor da personalização em cada detalhe",
        conteudo: "Ter uma peça criada exclusivamente para você traz um sentimento único de aconchego e pertencimento, unindo a precisão japonesa ao carinho do artesanato brasileiro."
      },
      {
        subtitulo: "Como encomendar sob medida no Japão",
        conteudo: "Você escolhe as cores, o tema e os nomes. Enviamos a prévia digital pelo WhatsApp e só iniciamos a produção artesanal após a sua total aprovação."
      }
    ]
  };
} else {
  // Pega um tema da fila que ainda não exista na pasta
  const postsExistentes = fs.existsSync('./src/content/blog') 
    ? fs.readdirSync('./src/content/blog').map(f => f.replace('.md', '')) 
    : [];

  const temasDisponiveis = bancoTemas.filter(t => !postsExistentes.includes(slugify(t.titulo)));

  if (temasDisponiveis.length > 0) {
    temaEscolhido = temasDisponiveis[0];
  } else {
    // Gerador dinâmico de novos tópicos quando a lista fixa for concluída
    const timestamp = Date.now().toString().slice(-4);
    temaEscolhido = {
      titulo: `Tendências e Inspirações de Papelaria Afetiva no Japão #${timestamp}`,
      descricao: `Novas ideias criativas de papelaria artesanal para decorar, organizar e comemorar suas datas especiais no Japão.`,
      categoria: "dicas-de-decoracao",
      corFundoPastel: "bg-[#FCF0E3]",
      imagem: "/images/caderno-mania.png",
      tags: ["papelaria afetiva", "novidades", "japão", "decoração"],
      secoes: [
        {
          subtitulo: "Detalhes feitos à mão que encantam",
          conteudo: "Cada nova criação traz acabamentos exclusivos com papéis especiais de alta gramatura, foil metálico e recortes tridimensionais pensados para a sua família."
        },
        {
          subtitulo: "Peça seu orçamento pelo WhatsApp",
          conteudo: "Entre em contato conosco e receba seu atendimento em português com envio rápido para todas as províncias do Japão."
        }
      ]
    };
  }
}

const resultado = gerarPost(temaEscolhido, isDraft);

// Se a flag --git foi passada, comita e sobe automaticamente
if (isGit) {
  try {
    console.log('\n🚀 [AGENTE GIT]: Enviando post automaticamente para o GitHub e Vercel...');
    execSync('git add .', { stdio: 'inherit' });
    execSync(`git commit -m "feat(blog): novo artigo '${resultado.titulo}'"`, { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('✅ Deploy disparado com sucesso na Vercel!');
  } catch (err) {
    console.error('⚠️ Aviso: Não foi possível executar o git push automático:', err.message);
  }
}
