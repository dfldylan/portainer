import { ComponentType } from 'react';
import { QueryClient } from '@tanstack/react-query';

import { withReactQuery } from '@CE/react-tools/withReactQuery';

export function withTestQueryProvider<T>(
  WrappedComponent: ComponentType<T & JSX.IntrinsicAttributes>
) {
  const testQueryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return withReactQuery(WrappedComponent, testQueryClient);
}
