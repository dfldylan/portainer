import { http, HttpResponse } from 'msw';

export const dockerImagesHandlers = [
  http.get('/api/docker/:envId/images', () => HttpResponse.json([])),
];
