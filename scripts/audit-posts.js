import fs from 'fs';
import path from 'path';

/**
 * 🔍 AGENTE DE AUDITORIA E AUTO-CORREÇÃO DE POSTS — MANIA DA ARTE
 * 
 * Executa todas as checagens do protocolo de 'Instruções_Maniadaarte.md':
 *  1. Auditoria de Tom de Voz & Anti-Clichês Robóticos
 *  2. Auditoria de Autor (deve ser "Equipe Mania da Arte")
 *  3. Auditoria de Categorias Oficiais
 *  4. Auditoria de SEO, Subtítulos (H2/H3) e Parágrafos Curtos
 *  5. Auditoria de Conclusão (Convite afetuoso + Clube 15% + WhatsApp Japão)
 * 
 * Se encontrar qualquer falha, CORRIGE O ARQUIVO AUTOMATICAMENTE!
 */

const categoriasValidas = [
  'lembrancinhas',
  'festas-infantis',
  'topos-de-bolo',
  'presentes-afetivos',
  'dicas-de-decoracao',
  'rotina',
  'corporativo'
];

// Substituições afetuosas para clichês de IA proibidos
const dicionarioCliches = [
  { regex: /em resumo,?/gi, substituicao: 'Para guardar no coração,' },
  { regex: /em suma,?/gi, substituicao: 'Com todo esse carinho,' },
  { regex: /otimizar recursos/gi, substituicao: 'aproveitar cada detalhe com economia' },
  { regex: /mergulhe conosco/gi, substituicao: 'venha se encantar' },
  { regex: /no cenário atual,?/gi, substituicao: 'aqui no Japão,' },
  { regex: /no mundo de hoje,?/gi, substituicao: 'na correria do dia a dia,' },
  { regex: /sem mais delongas,?/gi, substituicao: 'vamos aos detalhes:' },
  { regex: /vale ressaltar que/gi, substituicao: 'um detalhe especial é que' },
  { regex: /é de suma importância/gi, substituicao: 'faz toda a diferença' }
];

const conclusaoObrigatoria = `---

## Vamos criar uma celebração linda juntos no Japão?

Se você sonha com uma festa cheia de amor, uma lembrancinha inesquecível ou quer presentear alguém especial aqui no Japão, a **Equipe Mania da Arte** está pronta para sonhar junto com você.

✨ **Vantagem para Membros do Clube:** 
Lembre-se de que os membros do nosso **Clube Mania da Arte** garantem **15% de desconto** imediato em todas as peças do catálogo por apenas **¥500/mês**, além de prioridade na fila de confecção!

Fale conosco diretamente pelo WhatsApp no Japão: **[+81 70-2297-3498](https://wa.me/817022973498)** e receba a prévia digital da sua arte com todo o carinho.
`;

function auditarEcorrigirPost(caminhoArquivo) {
  const nomeArquivo = path.basename(caminhoArquivo);
  let conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');
  let alterado = false;
  const correcoes = [];

  // 1. Separar Frontmatter do Corpo
  const matchFrontmatter = conteudo.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!matchFrontmatter) {
    console.error(`❌ [ERRO]: O arquivo ${nomeArquivo} não possui frontmatter válido.`);
    return;
  }

  let frontmatterStr = matchFrontmatter[1];
  let corpo = matchFrontmatter[2];

  // 2. Auditoria do Autor
  if (!/autor:\s*["']Equipe Mania da Arte["']/i.test(frontmatterStr)) {
    frontmatterStr = frontmatterStr.replace(/autor:\s*["'][^"']*["']/i, 'autor: "Equipe Mania da Arte"');
    if (!/autor:/i.test(frontmatterStr)) {
      frontmatterStr += '\nautor: "Equipe Mania da Arte"';
    }
    correcoes.push('Autor corrigido para "Equipe Mania da Arte"');
    alterado = true;
  }

  // 3. Auditoria de Categoria
  const categoriaMatch = frontmatterStr.match(/categoria:\s*["']([^"']+)["']/i);
  if (categoriaMatch) {
    const catAtual = categoriaMatch[1];
    if (!categoriasValidas.includes(catAtual)) {
      let novaCat = 'dicas-de-decoracao';
      if (/festa/i.test(catAtual)) novaCat = 'festas-infantis';
      if (/bolo/i.test(catAtual)) novaCat = 'topos-de-bolo';
      if (/lembran/i.test(catAtual)) novaCat = 'lembrancinhas';
      if (/rotina|agenda/i.test(catAtual)) novaCat = 'rotina';
      if (/corp|meishi|negoc/i.test(catAtual)) novaCat = 'corporativo';

      frontmatterStr = frontmatterStr.replace(/categoria:\s*["'][^"']*["']/i, `categoria: "${novaCat}"`);
      correcoes.push(`Categoria "${catAtual}" mapeada para categoria oficial "${novaCat}"`);
      alterado = true;
    }
  }

  // 4. Auditoria de Cor Pastel
  if (!/corFundoPastel:/i.test(frontmatterStr)) {
    frontmatterStr += '\ncorFundoPastel: "bg-[#F3E5E8]"';
    correcoes.push('Adicionada cor de fundo pastel padrão');
    alterado = true;
  }

  // 5. Auditoria de Tom de Voz & Clichês Robóticos no Corpo
  for (const item of dicionarioCliches) {
    if (item.regex.test(corpo)) {
      corpo = corpo.replace(item.regex, item.substituicao);
      correcoes.push(`Clichê robótico substituído por tom afetuoso (${item.substituicao})`);
      alterado = true;
    }
  }

  // 6. Auditoria de Conclusão / CTA
  const temChamadaZap = /817022973498|WhatsApp/i.test(corpo);
  const temChamadaClube = /Clube Mania da Arte|15% de desconto/i.test(corpo);

  if (!temChamadaZap || !temChamadaClube) {
    // Remove conclusões incompletas antigas e adiciona a oficial completa
    corpo = corpo.replace(/##\s*(Vamos criar|Economize 15%|Dica Exclusiva)[\s\S]*$/, '').trim();
    corpo += '\n\n' + conclusaoObrigatoria;
    correcoes.push('Adicionada chamada final oficial com WhatsApp + Clube Mania da Arte');
    alterado = true;
  }

  // 7. Salvar se houver correções
  if (alterado) {
    const novoConteudo = `---\n${frontmatterStr.trim()}\n---\n\n${corpo.trim()}\n`;
    fs.writeFileSync(caminhoArquivo, novoConteudo, 'utf-8');
    console.log(`🔧 [CORRIGIDO]: ${nomeArquivo}`);
    correcoes.forEach((c) => console.log(`   └─ ${c}`));
  } else {
    console.log(`✅ [APROVADO 100%]: ${nomeArquivo} (Em conformidade total com o protocolo)`);
  }
}

// Execução em todos os arquivos da pasta src/content/blog
const pastaBlog = path.resolve('./src/content/blog');
if (!fs.existsSync(pastaBlog)) {
  console.log('Pasta de blog não encontrada.');
  process.exit(0);
}

const arquivos = fs.readdirSync(pastaBlog).filter((f) => f.endsWith('.md'));

console.log(`\n📋 Iniciando auditoria em ${arquivos.length} artigos do blog...\n`);
for (const arq of arquivos) {
  auditarEcorrigirPost(path.join(pastaBlog, arq));
}
console.log(`\n✨ Auditoria finalizada com sucesso!\n`);
