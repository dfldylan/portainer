const categories = [
  'docker',
  'kubernetes',
  'aci',
  'portainer',
  'edge',
] as const;
type Category = (typeof categories)[number];

enum DimensionConfig {
  PortainerVersion = 1,
  PortainerInstanceID,
  PortainerUserRole,
  PortainerEndpointUserRole,
}

export interface TrackEventProps {
  category: Category;
  metadata?: Record<string, unknown>;
  value?: string | number;
  dimensions?: DimensionConfig;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function trackEvent(action: string, properties: TrackEventProps) {}
