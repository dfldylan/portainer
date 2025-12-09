import { http, HttpResponse } from 'msw';

export const endpointsHandlers = [
  http.get('/api/endpoints/agent_versions', () => HttpResponse.json([])),
  http.get('/api/endpoints/:endpointId', ({ params }) =>
    HttpResponse.json({
      Id: Number(params.endpointId),
      Name: `test-environment-${params.endpointId}`,
      Type: 1, // Docker standalone
    })
  ),
  http.get('/api/endpoints/:endpointId/registries', () =>
    HttpResponse.json([])
  ),
  http.get('/api/endpoints/:endpointId/registries/:id', () =>
    HttpResponse.json({})
  ),
];
