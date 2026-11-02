// Pure calculation functions for seismic energy, depth, and intensity
// Separated to guarantee zero circular module dependencies

export function calculateSeismicEnergyJoules(magnitude: number): number {
  if (magnitude <= 0) return 0;
  return Math.pow(10, 4.8 + 1.5 * magnitude);
}

export function calculateTntEquivalentTons(joules: number): number {
  // 1 ton TNT = 4.184 x 10^9 Joules
  return joules / 4.184e9;
}

export function getDepthCategory(depthKm: number): 'shallow' | 'intermediate' | 'deep' | 'ultra-deep' {
  if (depthKm < 30) return 'shallow';
  if (depthKm < 70) return 'intermediate';
  if (depthKm < 300) return 'deep';
  return 'ultra-deep';
}

export function estimateMMI(magnitude: number, depthKm: number): number {
  // Estimated epicentral intensity based on Wald et al.
  const hypoDist = Math.max(depthKm, 5);
  const mmi = 2.2 + 1.3 * magnitude - 1.5 * Math.log10(hypoDist);
  return Math.min(Math.max(Math.round(mmi * 10) / 10, 1), 12);
}

export function formatTimeAgo(timestampMs: number): string {
  const diffSec = Math.floor((Date.now() - timestampMs) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}
