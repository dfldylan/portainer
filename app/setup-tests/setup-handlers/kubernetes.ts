import { http, HttpResponse } from 'msw';

export const kubernetesHandlers = [
  http.get(
    '/api/kubernetes/:endpointId/metrics/pods/namespace/:namespace',
    () => HttpResponse.json({})
  ),
  http.get('/api/kubernetes/:endpointId/namespaces/:namespace/events', () =>
    HttpResponse.json([])
  ),
  http.get('/api/kubernetes/:endpointId/namespaces/:namespace', () =>
    HttpResponse.json({})
  ),
  http.get('/api/kubernetes/:endpointId/ingresses', () =>
    HttpResponse.json({})
  ),
  http.get('/api/kubernetes/:endpointId/namespaces', () =>
    HttpResponse.json([])
  ),
  http.get('/api/kubernetes/:endpointId/customresourcedefinitions', () =>
    HttpResponse.json({})
  ),
  http.get('/api/kubernetes/:endpointId/customresourcedefinitions/:name', () =>
    HttpResponse.json({})
  ),
];
