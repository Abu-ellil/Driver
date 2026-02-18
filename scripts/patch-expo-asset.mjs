import fs from 'node:fs';
import path from 'node:path';

const target = path.resolve('node_modules/expo-asset/build/AssetUris.js');

const originalBlock = `export function getManifestBaseUrl(manifestUrl) {
    const urlObject = new URL(manifestUrl);
    let nextProtocol = urlObject.protocol;
    // Change the scheme to http(s) if it is exp(s)
    if (nextProtocol === 'exp:') {
        nextProtocol = 'http:';
    }
    else if (nextProtocol === 'exps:') {
        nextProtocol = 'https:';
    }
    urlObject.protocol = nextProtocol;
    // Trim filename, query parameters, and fragment, if any
    const directory = urlObject.pathname.substring(0, urlObject.pathname.lastIndexOf('/') + 1);
    urlObject.pathname = directory;
    urlObject.search = '';
    urlObject.hash = '';
    // The URL spec doesn't allow for changing the protocol to \`http\` or \`https\`
    // without a port set so instead, we'll just swap the protocol manually.
    return urlObject.protocol !== nextProtocol
        ? urlObject.href.replace(urlObject.protocol, nextProtocol)
        : urlObject.href;
}`;

const buggyPatchedBlock = `export function getManifestBaseUrl(manifestUrl) {
    // Some runtimes expose URL.protocol as getter-only. Normalize protocol from the raw URL
    // string instead of mutating URL.protocol to avoid runtime crashes.
    const input = String(manifestUrl);
    let normalizedUrl = input;
    if (input.startsWith('exp:')) {
        normalizedUrl = \`http:\${input.slice(4)}\`;
    }
    else if (input.startsWith('exps:')) {
        normalizedUrl = \`https:\${input.slice(5)}\`;
    }
    const urlObject = new URL(normalizedUrl);
    // Trim filename, query parameters, and fragment, if any
    const directory = urlObject.pathname.substring(0, urlObject.pathname.lastIndexOf('/') + 1);
    urlObject.pathname = directory;
    urlObject.search = '';
    urlObject.hash = '';
    return urlObject.href;
}`;

const patchedBlock = `export function getManifestBaseUrl(manifestUrl) {
    // Avoid mutating URL instance fields because some runtimes expose them as getter-only.
    // Normalize Expo schemes first, then derive the parent directory URL from the string.
    const input = String(manifestUrl);
    const normalizedUrl = input.startsWith('exp:')
        ? \`http:\${input.slice(4)}\`
        : input.startsWith('exps:')
            ? \`https:\${input.slice(5)}\`
            : input;
    return new URL('.', normalizedUrl).href;
}`;

try {
  if (!fs.existsSync(target)) {
    console.log('[patch-expo-asset] skipped: target file not found');
    process.exit(0);
  }

  const source = fs.readFileSync(target, 'utf8');

  if (source.includes('derive the parent directory URL from the string')) {
    console.log('[patch-expo-asset] already patched');
    process.exit(0);
  }

  if (!source.includes(originalBlock) && !source.includes(buggyPatchedBlock)) {
    console.log('[patch-expo-asset] skipped: source shape changed');
    process.exit(0);
  }

  const next = source.includes(originalBlock)
    ? source.replace(originalBlock, patchedBlock)
    : source.replace(buggyPatchedBlock, patchedBlock);
  fs.writeFileSync(target, next, 'utf8');
  console.log('[patch-expo-asset] applied');
} catch (error) {
  console.warn('[patch-expo-asset] failed:', error instanceof Error ? error.message : String(error));
}
