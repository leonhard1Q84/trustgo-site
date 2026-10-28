/**
 * High-performance, zero-dependency QR code generator for Byte Mode (Version 2, 25x25, ECC Level M).
 * Conforms to ISO/IEC 18004.
 */

// Galois Field math for Reed-Solomon error correction
const GF256 = new Uint8Array(512);
const GF256_LOG = new Uint8Array(256);
let gfInit = false;

function initGF() {
  if (gfInit) return;
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF256[i] = x;
    GF256[i + 255] = x;
    GF256_LOG[x] = i;
    x = (x << 1) ^ (x & 128 ? 0x11d : 0);
  }
  gfInit = true;
}

function gfMul(a: number, b: number): number {
  return a === 0 || b === 0 ? 0 : GF256[GF256_LOG[a] + GF256_LOG[b]];
}

function createRsBlock(data: Uint8Array, numEc: number): Uint8Array {
  initGF();
  let poly = [1];
  for (let i = 0; i < numEc; i++) {
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], GF256[i]);
    }
    poly = next;
  }
  const res = new Uint8Array(data.length + numEc);
  res.set(data);
  for (let i = 0; i < data.length; i++) {
    const coef = res[i];
    if (coef !== 0) {
      for (let j = 0; j < poly.length; j++) {
        res[i + j] ^= gfMul(poly[j], coef);
      }
    }
  }
  return res.slice(data.length);
}

/**
 * Encodes text into a standard 25x25 QR Matrix (Version 2, ECC Level M, Mask 0).
 */
export function generateQrMatrix(text: string): boolean[][] {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  if (bytes.length > 26) {
    throw new Error('Text exceeds 26 bytes for Version 2-M QR code');
  }

  // Bitstream: Mode (0100) + Count (8 bits) + Data + Terminator + Padding
  const bits: number[] = [];
  function pushBits(val: number, len: number) {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
  }

  pushBits(4, 4); // Byte mode (0100)
  pushBits(bytes.length, 8);
  for (const b of bytes) pushBits(b, 8);
  pushBits(0, Math.min(4, 28 * 8 - bits.length)); // Terminator
  while (bits.length % 8 !== 0) bits.push(0);

  const dataBytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
    dataBytes.push(byte);
  }

  const padPatterns = [0xec, 0x11];
  let padIdx = 0;
  while (dataBytes.length < 28) {
    dataBytes.push(padPatterns[padIdx % 2]);
    padIdx++;
  }

  const ecBytes = createRsBlock(new Uint8Array(dataBytes), 16);
  const allCodewords = [...dataBytes, ...ecBytes];

  const size = 25;
  const matrix: (number | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  const isReserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  function setFinder(r0: number, c0: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const nr = r0 + r;
        const nc = c0 + c;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          isReserved[nr][nc] = true;
          if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
            const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
            const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
            matrix[nr][nc] = isBorder || isCenter ? 1 : 0;
          } else {
            matrix[nr][nc] = 0;
          }
        }
      }
    }
  }

  setFinder(0, 0);
  setFinder(0, size - 7);
  setFinder(size - 7, 0);

  // Alignment pattern at (18, 18) for Version 2
  const ar = 18;
  const ac = 18;
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      isReserved[ar + r][ac + c] = true;
      matrix[ar + r][ac + c] = Math.max(Math.abs(r), Math.abs(c)) !== 1 ? 1 : 0;
    }
  }

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (!isReserved[6][i]) {
      matrix[6][i] = i % 2 === 0 ? 1 : 0;
      isReserved[6][i] = true;
    }
    if (!isReserved[i][6]) {
      matrix[i][6] = i % 2 === 0 ? 1 : 0;
      isReserved[i][6] = true;
    }
  }

  // Dark module
  matrix[size - 8][8] = 1;
  isReserved[size - 8][8] = true;

  // Format info area reservation
  for (let i = 0; i < 9; i++) {
    if (i !== 6) {
      isReserved[8][i] = true;
      isReserved[i][8] = true;
    }
  }
  for (let i = 0; i < 8; i++) {
    isReserved[8][size - 1 - i] = true;
    isReserved[size - 1 - i][8] = true;
  }

  // Place data bits in zig-zag
  const allBits: number[] = [];
  for (const cw of allCodewords) {
    for (let i = 7; i >= 0; i--) allBits.push((cw >> i) & 1);
  }
  // Remainder bits for v2: 7 bits
  for (let i = 0; i < 7; i++) allBits.push(0);

  let bitIdx = 0;
  for (let right = size - 1; right > 0; right -= 2) {
    if (right === 6) right--; // skip timing col
    const upwards = ((right + 1) / 2) % 2 === 1;
    for (let vert = 0; vert < size; vert++) {
      const r = upwards ? size - 1 - vert : vert;
      for (const c of [right, right - 1]) {
        if (!isReserved[r][c]) {
          const bit = bitIdx < allBits.length ? allBits[bitIdx++] : 0;
          // Apply mask 0: (r + c) % 2 === 0
          const mask = (r + c) % 2 === 0;
          matrix[r][c] = (bit ^ (mask ? 1 : 0)) === 1 ? 1 : 0;
        }
      }
    }
  }

  // Format bits for ECC M (00) and Mask 0 (000) => XOR with 101010000010010: 101010000010010
  const formatStr = '101010000010010';
  const coords1 = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  ];
  for (let i = 0; i < 15; i++) {
    const [r, c] = coords1[i];
    matrix[r][c] = formatStr[i] === '1' ? 1 : 0;
  }
  const coords2 = [
    [size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8], [size - 5, 8], [size - 6, 8], [size - 7, 8],
    [8, size - 8], [8, size - 7], [8, size - 6], [8, size - 5], [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1],
  ];
  for (let i = 0; i < 15; i++) {
    const [r, c] = coords2[i];
    matrix[r][c] = formatStr[i] === '1' ? 1 : 0;
  }

  return matrix.map((row) => row.map((val) => val === 1));
}

let cachedWechatMatrix: boolean[][] | null = null;

export function getWeChatQrMatrix(): boolean[][] {
  if (!cachedWechatMatrix) {
    cachedWechatMatrix = generateQrMatrix('yangsi3010');
  }
  return cachedWechatMatrix;
}
