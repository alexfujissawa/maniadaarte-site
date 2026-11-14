import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Tabela CRC32 padrão para PNG
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  typeBuf.copy(chunk, 4);
  data.copy(chunk, 8);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function createPNG(width, height, drawFn) {
  // Inicializa buffer RGBA com transparência total (0,0,0,0)
  const pixels = Buffer.alloc(width * height * 4, 0);

  function setPixel(x, y, r, g, b, a = 255) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = (y * width + x) * 4;
    if (a === 255) {
      pixels[idx] = r;
      pixels[idx + 1] = g;
      pixels[idx + 2] = b;
      pixels[idx + 3] = a;
    } else {
      // Alpha blending
      const prevA = pixels[idx + 3] / 255;
      const alpha = a / 255;
      const outA = alpha + prevA * (1 - alpha);
      if (outA > 0) {
        pixels[idx] = Math.round((r * alpha + pixels[idx] * prevA * (1 - alpha)) / outA);
        pixels[idx + 1] = Math.round((g * alpha + pixels[idx + 1] * prevA * (1 - alpha)) / outA);
        pixels[idx + 2] = Math.round((b * alpha + pixels[idx + 2] * prevA * (1 - alpha)) / outA);
        pixels[idx + 3] = Math.round(outA * 255);
      }
    }
  }

  function fillRect(x0, y0, w, h, r, g, b, a = 255) {
    for (let y = y0; y < y0 + h; y++) {
      for (let x = x0; x < x0 + w; x++) {
        setPixel(x, y, r, g, b, a);
      }
    }
  }

  function fillRoundRect(x0, y0, w, h, rad, r, g, b, a = 255) {
    for (let y = y0; y < y0 + h; y++) {
      for (let x = x0; x < x0 + w; x++) {
        const dx = Math.max(0, Math.max(x0 + rad - x, x - (x0 + w - 1 - rad)));
        const dy = Math.max(0, Math.max(y0 + rad - y, y - (y0 + h - 1 - rad)));
        if (dx * dx + dy * dy <= rad * rad) {
          setPixel(x, y, r, g, b, a);
        }
      }
    }
  }

  function fillCircle(cx, cy, radius, r, g, b, a = 255) {
    for (let y = cy - radius; y <= cy + radius; y++) {
      for (let x = cx - radius; x <= cx + radius; x++) {
        if ((x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2) {
          setPixel(x, y, r, g, b, a);
        }
      }
    }
  }

  // Executa desenho
  drawFn({ setPixel, fillRect, fillRoundRect, fillCircle, width, height });

  // Prepara scanlines com filtro 0x00
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    scanlines[rowOffset] = 0; // Filter None
    pixels.copy(scanlines, rowOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  const deflated = zlib.deflateSync(scanlines);

  // Cabeçalho IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', deflated),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

const outDir = path.resolve('./public/images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Caderno & Agenda Afetiva (Capa rosê elegante, espiral dourada, fita de cetim)
const caderno = createPNG(400, 400, ({ fillRoundRect, fillRect, fillCircle }) => {
  // Sombra suave flutuante
  fillRoundRect(70, 70, 260, 290, 20, 74, 62, 64, 30);
  fillRoundRect(65, 65, 260, 290, 20, 74, 62, 64, 40);

  // Páginas brancas do fundo
  fillRoundRect(68, 52, 256, 286, 16, 245, 243, 238);

  // Capa dura rosa blush elegante (#E8B4B8)
  fillRoundRect(60, 45, 260, 290, 16, 232, 180, 184);

  // Faixa de destaque com foil suave
  fillRoundRect(100, 140, 180, 70, 8, 253, 251, 247, 230);
  fillRoundRect(104, 144, 172, 62, 6, 200, 125, 107, 180);

  // Detalhes dourados no rótulo
  fillRect(120, 165, 140, 4, 255, 255, 255, 220);
  fillRect(140, 178, 100, 3, 255, 255, 255, 180);

  // Fita marcadora de página marrom / terracota
  fillRect(180, 20, 14, 335, 184, 93, 107);
  // Ponta da fita chanfrada
  for (let i = 0; i < 7; i++) {
    fillRect(180 + i, 355 - i, 1, i + 1, 0, 0, 0, 0);
    fillRect(193 - i, 355 - i, 1, i + 1, 0, 0, 0, 0);
  }

  // Furos e Espiral metálica dourada na lateral esquerda
  for (let y = 60; y < 320; y += 18) {
    fillCircle(75, y, 5, 50, 40, 42); // furo
    fillRoundRect(66, y - 3, 18, 6, 3, 212, 175, 55); // argola dourada
  }
});
fs.writeFileSync(path.join(outDir, 'caderno-mania.png'), caderno);

// 2. Topo de Bolo Personalizado (Haste acrílica, flores de papel em camadas, corações e faixa de aniversário)
const topoBolo = createPNG(400, 400, ({ fillRoundRect, fillRect, fillCircle }) => {
  // Sombra flutuante
  fillCircle(200, 200, 130, 74, 62, 64, 25);

  // Hastes de sustentação transparentes / bambu
  fillRect(150, 180, 6, 170, 210, 195, 170);
  fillRect(244, 180, 6, 170, 210, 195, 170);

  // Camada de flor e folhagens de papel pastel
  fillCircle(130, 150, 45, 196, 218, 210); // menta
  fillCircle(270, 150, 45, 252, 226, 210); // pêssego
  fillCircle(200, 110, 55, 243, 229, 232); // rosa bebê

  // Faixa principal curva / banner 3D de papel
  fillRoundRect(80, 145, 240, 60, 14, 253, 251, 247);
  fillRoundRect(84, 149, 232, 52, 12, 200, 125, 107);

  // Linhas simulando texto "Parabéns / Happy Birthday" em foil dourado
  fillRoundRect(110, 168, 180, 8, 4, 255, 235, 170);
  fillRoundRect(140, 183, 120, 6, 3, 255, 245, 200);

  // Borboletas ou corações em relevo 3D
  fillCircle(110, 120, 18, 232, 180, 184);
  fillCircle(124, 110, 14, 232, 180, 184);
  fillCircle(290, 120, 18, 245, 239, 246);
  fillCircle(276, 110, 14, 245, 239, 246);
  fillCircle(200, 75, 16, 212, 175, 55); // estrela / detalhe dourado
});
fs.writeFileSync(path.join(outDir, 'topo-bolo-mania.png'), topoBolo);

// 3. Cartões de Visita & Identidade (Dois cartões elegantes sobrepostos com relevo e toque pastel)
const cartaoVisita = createPNG(400, 400, ({ fillRoundRect, fillRect, fillCircle }) => {
  // Sombra cartão inferior
  fillRoundRect(100, 140, 220, 130, 8, 74, 62, 64, 35);
  // Cartão 1 (fundo verde sálvia / menta elegante)
  fillRoundRect(90, 130, 220, 130, 8, 124, 144, 130);
  fillCircle(140, 180, 22, 253, 251, 247, 180);
  fillRect(175, 172, 100, 6, 253, 251, 247, 220);
  fillRect(175, 186, 70, 4, 253, 251, 247, 160);

  // Sombra cartão superior em perspectiva flutuante
  fillRoundRect(65, 85, 230, 135, 8, 74, 62, 64, 45);
  // Cartão 2 (Off-white com cantos finos e logotipo foil dourado / terracota)
  fillRoundRect(55, 75, 230, 135, 8, 253, 251, 247);
  // Borda elegante interna
  fillRoundRect(63, 83, 214, 119, 6, 74, 62, 64, 15);
  fillRoundRect(65, 85, 210, 115, 5, 253, 251, 247);

  // Logotipo geométrico e tipografia
  fillCircle(110, 132, 20, 200, 125, 107);
  fillCircle(110, 132, 14, 253, 251, 247);
  fillRect(145, 122, 105, 7, 74, 62, 64);
  fillRect(145, 136, 75, 4, 107, 94, 96);
  fillRect(145, 147, 50, 3, 200, 125, 107);
});
fs.writeFileSync(path.join(outDir, 'cartao-visita-mania.png'), cartaoVisita);

// 4. Lembrancinhas e Mimos para Festas (Caixa pirâmide / milk box com laço delicado)
const lembrancinha = createPNG(400, 400, ({ fillRoundRect, fillRect, fillCircle }) => {
  // Sombra da caixinha
  fillRoundRect(115, 135, 170, 190, 16, 74, 62, 64, 35);

  // Corpo da caixa de papel (Lilás suave #F5EFF6 / Rosa vintage)
  fillRoundRect(110, 125, 180, 195, 16, 245, 239, 246);

  // Detalhe frontal recortado em camadas (shaker ou tag)
  fillRoundRect(130, 165, 140, 120, 12, 253, 251, 247);
  fillRoundRect(135, 170, 130, 110, 10, 243, 229, 232);

  // Desenho fofo no centro da tag
  fillCircle(200, 220, 30, 252, 226, 210);
  fillCircle(200, 220, 20, 200, 125, 107);

  // Dobra superior da embalagem
  fillRoundRect(125, 105, 150, 30, 8, 232, 220, 235);

  // Grande laço de fita gorgurão rosa queimado com nó dourado
  fillCircle(175, 105, 26, 200, 125, 107);
  fillCircle(225, 105, 26, 200, 125, 107);
  fillCircle(175, 105, 14, 245, 239, 246);
  fillCircle(225, 105, 14, 245, 239, 246);
  fillCircle(200, 105, 14, 212, 175, 55); // nó com chaton dourado

  // Pontas caídas da fita
  fillRect(182, 115, 12, 55, 200, 125, 107);
  fillRect(206, 115, 12, 55, 200, 125, 107);
});
fs.writeFileSync(path.join(outDir, 'lembrancinha-mania.png'), lembrancinha);

console.log('✅ 4 imagens PNG criadas com sucesso em public/images/!');
