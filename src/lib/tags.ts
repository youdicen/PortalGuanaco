// Shared tag color system for PortalGuanaco
// Categories: red (danger) | yellow (warning) | green (positive)

export type TagCategory = 'red' | 'yellow' | 'gray';

export const TAG_CATEGORY_MAP: Record<string, TagCategory> = {
  // ── Rojo: impacto crítico ────────────────────────────────
  'Estafa':                     'red',
  'Falso':                      'red',
  'No paga':                    'red',
  // ── Amarillo: desviación logística ───────────────────────────
  'Reserva cita y no llega':    'yellow',
  'Devolución constante':       'yellow',
  'Cancelación tardía':         'yellow',
  'Dirección incorrecta':       'yellow',
  // ── Gris: interacción comercial ────────────────────────────────────
  'No responde':                'gray',
  'Regateo agresivo':           'gray',
  'Mal trato':                  'gray',
};

/**
 * Calcula la puntuación de estrellas sugerida automáticamente
 * según las tags seleccionadas.
 *
 * Reglas:
 *  - Sin tags               → 0 (no sugerido, usuario elige)
 *  - Pedido completado      → 5 (positivo absoluto)
 *  - Rojo presente          → max(1, 5 - 2×nRojo - 1×nAmarillo)
 *  - Solo amarillo          → max(2, 5 - 1×nAmarillo)
 *  - Verde + rojo           → rojo domina → 1
 */
export function calcAutoRating(tags: string[]): number {
  if (tags.length === 0) return 0;

  const redTags   = tags.filter(t => TAG_CATEGORY_MAP[t] === 'red');
  const yellowTags = tags.filter(t => TAG_CATEGORY_MAP[t] === 'yellow');
  const grayTags   = tags.filter(t => TAG_CATEGORY_MAP[t] === 'gray');

  // Rojo presente (impacto crítico) → penalización fuerte
  if (redTags.length > 0) {
    const score = 5 - redTags.length * 2 - yellowTags.length;
    return Math.max(1, Math.min(2, score)); // rango 1-2
  }

  // Desviación logística o comercial
  if (yellowTags.length > 0 || grayTags.length > 0) {
    const score = 5 - yellowTags.length - (grayTags.length * 0.5);
    return Math.max(2, Math.min(4, Math.floor(score)));
  }

  return 0;
}

export function getTagBadgeClass(tagName: string): string {
  const category = TAG_CATEGORY_MAP[tagName] ?? 'neutral';
  switch (category) {
    case 'red':    return 'bg-red-500/10    border-red-500/25    text-red-400';
    case 'yellow': return 'bg-yellow-500/10 border-yellow-500/25 text-yellow-400';
    case 'gray':   return 'bg-white/5       border-white/10      text-cream/60';
    default:       return 'bg-white/5       border-white/10      text-cream/60';
  }
}
