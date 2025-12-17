import { Badge } from '@@CE/Badge';

export function SystemBadge({ className }: { className?: string }) {
  return (
    <Badge type="success" className={className}>
      System
    </Badge>
  );
}
