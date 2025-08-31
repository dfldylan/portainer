import { endsWith } from 'lodash';
import filesizeParser from 'filesize-parser';

export const KubernetesPortainerResourceQuotaPrefix = 'portainer-rq-';

export function generateResourceQuotaName(name: string) {
  return `${KubernetesPortainerResourceQuotaPrefix}${name}`;
}

/**
 * parseCPU converts a CPU string to a number in cores.
 * It supports m (milli), u (micro), n (nano), p (pico) suffixes.
 *
 * If given an empty string, it returns 0.
 */
export function parseCPU(cpu: string) {
  let res = parseInt(cpu, 10);
  if (Number.isNaN(res)) {
    return 0;
  }

  if (endsWith(cpu, 'm')) {
    // milli
    res /= 1000;
  } else if (endsWith(cpu, 'u')) {
    // micro
    res /= 1000000;
  } else if (endsWith(cpu, 'n')) {
    // nano
    res /= 1000000000;
  } else if (endsWith(cpu, 'p')) {
    // pico
    res /= 1000000000000;
  }
  return res;
}

export function terabytesValue(value: string | number) {
  return gigabytesValue(value) / 1000;
}

export function gigabytesValue(value: string | number) {
  return megaBytesValue(value) / 1000;
}

export function megaBytesValue(value: string | number) {
  return Math.floor(safeFilesizeParser(value, 10) / 1000 / 1000);
}

export function bytesValue(mem: string | number) {
  return safeFilesizeParser(mem, 10) * 1000 * 1000;
}

/**
 * Coverts Ki, Gi, Ti, Pi, Ei suffix values to Mi string
 * Used for kubernetes memory conversions currently
 */
export function convertBase2ToMiB(value: string | number) {
  if (typeof value === 'number') {
    return value;
  }

  // Extract the numeric part and suffix
  const match = value.match(/^(\d+(?:\.\d+)?)([A-Za-z]*)$/);
  if (!match) {
    return value;
  }

  const numericValue = parseFloat(match[1]);
  const suffix = match[2];

  switch (suffix) {
    case 'Mi':
      return `${numericValue}Mi`;
    case 'Gi':
      return `${numericValue * 1024}Mi`;
    case 'Ti':
      return `${numericValue * 1024 * 1024}Mi`;
    case 'Pi':
      return `${numericValue * 1024 * 1024 * 1024}Mi`;
    case 'Ei':
      return `${numericValue * 1024 * 1024 * 1024 * 1024}Mi`;
    default:
      return value;
  }
}

/**
 * The default base is 2, you can use base 10 if you want
 * https://github.com/patrickkettner/filesize-parser#readme
 */
function safeFilesizeParser(value: string | number, base: 2 | 10 = 2) {
  if (!value || Number.isNaN(value)) {
    return 0;
  }

  return filesizeParser(value, { base });
}
