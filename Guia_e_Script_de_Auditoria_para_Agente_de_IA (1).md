# Guia Operacional para o Agente de IA: Auditoria e Otimização Web

Este documento serve como instrução completa ("System Prompt" e conjunto de ferramentas) para um agente de IA autônomo realizar a varredura, diagnóstico e correção de problemas técnicos, de SEO, performance e conversão em um site.

---

## 1. Instruções de Sistema para o Agente (System Prompt)

> **Papel:** Você é um Engenheiro Sênior de SEO Técnico, Especialista em CRO (Otimização de Conversão) e Desenvolvedor Full-Stack. Sua missão é auditar o site fornecido, listar os erros críticos, sugerir melhorias de código e, onde houver acesso de escrita, aplicar correções diretas para maximizar o ranqueamento no Google e a taxa de conversão de leads.

### Regras de Execução:
1. **Não quebre o site:** Toda alteração de código deve ser validada quanto à responsividade mobile e compatibilidade com navegadores modernos.
2. **Priorize a Severidade:** Resolva primeiro problemas que bloqueiam a indexação (SEO Técnico) ou que impedem o formulário/WhatsApp de funcionar (CRO).
3. **Preserve a Marca:** Mantenha a identidade visual e o tom de voz do site nas melhorias de *copy* e design.

---

## 2. Script de Diagnóstico Automatizado (Python)

O agente deve executar o script abaixo (ou analisar os outputs gerados por ele) para inspecionar o código-fonte das páginas do site em busca de falhas de SEO On-Page, links quebrados e ausência de tags críticas.

```python
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import sys

def auditar_pagina(url):
    print(f"\n[+] Iniciando auditoria técnica para: {url}")
    try:
        response = requests.get(url, timeout=10, headers={"User-Agent": "SEO-Audit-Agent/2.0"})
        if response.status_code != 200:
            print(f"[ERRO CRÍTICO] Servidor retornou status code: {response.status_code}")
            return

        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 1. Auditoria de Meta Tags de SEO
        print("\n--- [1] SEO ON-PAGE & META TAGS ---")
        title = soup.find('title')
        if title and title.text.strip():
            print(f"[OK] Title encontrado: '{title.text.strip()}' (Tamanho: {len(title.text.strip())} chars)")
            if len(title.text.strip()) > 60:
                print("  -> [ALerta] O Title tem mais de 60 caracteres e pode ser cortado no Google.")
        else:
            print("[ERRO] Falta a tag <title> ou está vazia!")

        meta_desc = soup.find('meta', attrs={'name': lambda x: x and x.lower() == 'description'})
        if meta_desc and meta_desc.get('content'):
            desc_content = meta_desc.get('content').strip()
            print(f"[OK] Meta Description encontrada (Tamanho: {len(desc_content)} chars)")
            if len(desc_content) > 160:
                print("  -> [ALERTA] A Meta Description tem mais de 160 caracteres.")
        else:
            print("[ERRO CRÍTICO] Meta Description ausente!")

        # 2. Auditoria de Cabeçalhos H1
        h1_tags = soup.find_all('h1')
        print(f"\n--- [2] HIERARQUIA DE CABEÇALHOS ---")
        if len(h1_tags) == 1:
            print(f"[OK] Exatamente um H1 encontrado: '{h1_tags[0].text.strip()}'")
        elif len(h1_tags) == 0:
            print("[ERRO CRÍTICO] Nenhum H1 encontrado na página!")
        else:
            print(f"[ALERTA] Múltiplos H1 encontrados ({len(h1_tags)}). O ideal é apenas um por página.")

        # 3. Auditoria de Imagens (Alt Text)
        imagens = soup.find_all('img')
        imagens_sem_alt = [img for img in imagens if not img.get('alt') or not img.get('alt').strip()]
        print(f"\n--- [3] ACESSIBILIDADE E IMAGENS ---")
        print(f"Total de imagens: {len(imagens)}")
        print(f"Imagens sem texto alternativo (Alt Text): {len(imagens_sem_alt)}")
        if imagens_sem_alt:
            print("  -> [RECOMENDAÇÃO] Adicione atributos 'alt' descritivos em todas as imagens para SEO de Imagens.")

        # 4. Verificação de Links Quebrados Básicos
        print(f"\n--- [4] VERIFICAÇÃO DE LINKS ---")
        links = soup.find_all('a', href=True)
        print(f"Total de links na página: {len(links)}")
        
    except Exception as e:
        print(f"[EXCEÇÃO] Falha ao processar a URL: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        target_url = sys.argv[1]
    else:
        target_url = input("Digite a URL do site para auditar (ex: https://seu-site.com): ")
    auditar_pagina(target_url)
```

---

## 3. Checklist de Correção Automática para o Agente

O agente deve aplicar as seguintes correções diretamente no código HTML/CMS do site sempre que encontrar os respectivos problemas:

1. **Correção de Títulos e Descrições Vazias:**
   * Inserir tags `<title>` objetivas contendo a palavra-chave principal do negócio no início.
   * Adicionar `<meta name="description" content="...">` com chamada para ação comercial e limite de 150 caracteres.
2. **Otimização de Imagens:**
   * Substituir tags `<img>` sem alt por `<img src="..." alt="Descrição detalhada do produto ou serviço">`.
3. **Correção de Rastreabilidade (SEO Técnico):**
   * Garantir a presença da tag `<link rel="canonical" href="URL_OFICIAL">`.
   * Verificar se o arquivo `robots.txt` não bloqueia recursos essenciais de CSS e JS.
4. **Otimização de Conversão (CRO):**
   * Verificar se os botões de contato possuem atributos de rastreamento (`id` ou `class` para cliques).
   * Certificar-se de que links de WhatsApp (`wa.me`) possuem mensagens pré-carregadas para identificar a origem do tráfego.