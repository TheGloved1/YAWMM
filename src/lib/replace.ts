import type { ModRow } from './types';

/** Normalized Nexus ID, mirroring backend `extract_nexus_id` for `/mods/`
 *  URLs and the digits-only convention for bare IDs. */
export function normalizeNexus(v: string | null | undefined): string {
  const t = (v ?? '').trim();
  const idx = t.indexOf('/mods/');
  if (idx >= 0) {
    const digits = t.slice(idx + 6).match(/^\d+/);
    if (digits) return digits[0];
  }
  return t.replace(/\D/g, '');
}

/** Archive basename, tolerant of `/` and `\` separators. */
export function archiveBasename(p: string | null | undefined): string {
  const s = (p ?? '').split(/[\\/]/).pop() ?? '';
  return s.toLowerCase();
}

export interface ReplaceInput {
  nexus: string;
  name: string;
  archivePath: string;
  explicitId?: string | null;
}

/**
 * Metadata-only replace resolution. No deployed-file overlap: an explicit
 * source id (reinstall / update flows) wins; otherwise a non-empty Nexus ID
 * matches installed rows with the same normalized ID; with no Nexus ID an
 * exact (case-insensitive, trimmed) name or archive-basename match applies.
 * Returns matches in list order, separators excluded.
 */
export function findReplaceCandidates(mods: ModRow[], input: ReplaceInput): ModRow[] {
  const live = mods.filter((m) => !m.sep);
  const explicit = (input.explicitId ?? '').trim();
  if (explicit) return live.filter((m) => m.id === explicit);

  const nx = normalizeNexus(input.nexus);
  if (nx) return live.filter((m) => normalizeNexus(m.nexus) === nx);

  const out: ModRow[] = [];
  const needle = (input.name ?? '').trim().toLowerCase();
  if (needle) {
    for (const m of live) {
      if ((m.name ?? '').trim().toLowerCase() === needle) out.push(m);
    }
  }
  const base = archiveBasename(input.archivePath);
  if (base) {
    for (const m of live) {
      if (out.includes(m)) continue;
      if (archiveBasename(m.archive) === base) out.push(m);
    }
  }
  return out;
}
