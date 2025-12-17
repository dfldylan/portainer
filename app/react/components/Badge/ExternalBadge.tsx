import { Badge } from '@@CE/Badge';

export function ExternalBadge({ className }: { className?: string }) {
  return (
    <Badge type="info" className={className}>
      External
    </Badge>
  );
}
