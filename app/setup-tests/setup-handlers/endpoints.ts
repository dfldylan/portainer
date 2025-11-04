import { http, HttpResponse } from 'msw';

export const endpointsHandlers = [
  http.get('/api/endpoints/agent_versions', () => HttpResponse.json([])),
  http.get('/api/endpoints/:endpointId', () => HttpResponse.json({})),
  http.get('/api/endpoints/:endpointId/registries', () =>
    HttpResponse.json([])
  ),
  http.get('/api/endpoints/:endpointId/registries/:id', () =>
    HttpResponse.json({})
  ),
];
