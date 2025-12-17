import { http, HttpResponse } from 'msw';

import { TeamMembership } from '@CE/react/portainer/users/teams/types';
import { createMockUsers } from '@CE/react-tools/test-mocks';
import { Role } from '@CE/portainer/users/types';

export const userHandlers = [
  http.get('/api/users', async () =>
    HttpResponse.json(createMockUsers(10, Role.Standard))
  ),
  http.get<never, never, TeamMembership[]>(
    '/api/users/:userId/memberships',
    () => HttpResponse.json([])
  ),
  http.get('/api/users/:userId/gitcredentials', () => HttpResponse.json([])),
];
