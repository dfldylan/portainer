import { http, HttpResponse } from 'msw';

export const templatesHandlers = [
  http.put('/api/custom_templates/:id/git_fetch', () =>
    HttpResponse.json({ FileContent: '' })
  ),
  http.get('/api/templates/helm/values', () => HttpResponse.json({})),
];
