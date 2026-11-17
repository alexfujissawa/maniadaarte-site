import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    descricao: z.string(),
    data: z.coerce.date(),
    categoria: z.enum([
      'lembrancinhas',
      'festas-infantis',
      'topos-de-bolo',
      'presentes-afetivos',
      'dicas-de-decoracao',
      'rotina',
      'corporativo',
    ]),
    imagem: z.string().default('/images/caderno-mania.png'),
    corFundoPastel: z.string().default('bg-[#F3E5E8]'),
    autor: z.string().default('Equipe Mania da Arte'),
    tags: z.array(z.string()).default([]),
    destaque: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
