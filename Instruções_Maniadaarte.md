# Instruções de Criação e Homologação do Blog - Maniadaarte.digital

**Objetivo:** Preparar o site `maniadaarte.digital/blog` para receber as automações e rodar o protocolo de testes do fluxo do n8n (modo rascunho), garantindo que a inteligência artificial escreva com tom afetuoso e focado em artesanato/papelaria no Japão.

## Fase 1: Preparação do Ambiente no WordPress (CMS)
Antes de ligar o n8n, o blog precisa estar com as "fundações" prontas para receber o conteúdo:

1. **Categorias Principais:** Crie categorias que conversem com a busca das mães e clientes. 
   - *Exemplos sugeridos:* Lembrancinhas, Festas Infantis no Japão, Topos de Bolo, Presentes Afetivos, Dicas de Decoração.
2. **Layout e Imagens:** Certifique-se de que o tema do blog exibe a "Imagem Destacada" (Featured Image) no topo dos posts. O blog deve ter uma estética limpa (tons pastéis ou as cores da marca), pois as imagens geradas pela IA terão o estilo *crafting/flat lay*.
3. **Autor:** Crie ou renomeie o usuário autor para "Equipe Maniadaarte" ou o seu nome, para que os posts não saiam com nome de "admin" ou "bot".

## Fase 2: Protocolo de Testes no n8n (Modo Rascunho)
Para evitar publicar conteúdo com erros ou tom de voz robótico, siga este roteiro antes de ativar a automação oficial:

1. **Trava de Segurança (Draft Mode):**
   - No n8n, abra o nó final de publicação no WordPress.
   - Altere o campo `Status` de `publish` para `draft` (Rascunho). 

2. **Execução Manual:**
   - Não ligue o agendador (Cron). Clique em **"Execute Workflow"** para rodar o fluxo uma vez de ponta a ponta.
   - Monitore se a busca (YouTube/Trends) puxou assuntos relacionados a festas e papelaria (ex: "ideias de lembrancinhas").

3. **Auditoria Visual no WordPress (O que checar no rascunho):**
   - Entre no painel do WordPress (`/wp-admin`), vá em "Posts" > "Rascunhos" e abra o post gerado.
   - **Imagem de Capa:** A imagem gerada pelo DALL-E/Imagen foi anexada corretamente como Imagem Destacada? Ela tem elementos de papelaria fofos e sem textos bizarros?
   - **Formatação SEO:** O texto tem subtítulos (H2/H3)? Existem *bullet points* (listas) para facilitar a leitura? Os parágrafos estão curtos (máximo 4 linhas)?

4. **Auditoria do Tom de Voz (CRÍTICO):**
   - Leia a introdução e a conclusão. O tom está afetuoso, criativo e doce?
   - O texto **não** deve ter palavras como: *Em resumo, Otimizar recursos, Mergulhe conosco, No cenário atual*.
   - O último parágrafo faz um convite para criar uma festa linda no Japão com a Maniadaarte?

## Fase 3: Go-Live (Colocando no ar)
Se o rascunho passou em todos os testes visuais e de leitura:

1. Volte no nó do WordPress no n8n e mude o Status de `draft` para `publish`.
2. Ative o workflow no n8n.
3. Confirme se o Cron está para o fuso horário correto do Japão (`Asia/Tokyo`) e configurado para `0 6 * * 1,4` (Segundas e Quintas, 06h da manhã).