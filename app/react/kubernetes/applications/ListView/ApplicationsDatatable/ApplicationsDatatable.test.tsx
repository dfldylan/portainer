import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { HttpResponse } from 'msw';

import { withTestQueryProvider } from '@CE/react/test-utils/withTestQuery';
import { withTestRouter } from '@CE/react/test-utils/withRouter';
import { UserViewModel } from '@CE/portainer/models/user';
import { withUserProvider } from '@CE/react/test-utils/withUserProvider';
import { http, server } from '@CE/setup-tests/server';
import { createMockEnvironment } from '@CE/react-tools/test-mocks';

import { PodKubernetesInstanceLabel, PodManagedByLabel } from '../../constants';

import { ApplicationsDatatable } from './ApplicationsDatatable';

const mockUseCurrentStateAndParams = vi.fn();
const mockUseEnvironmentId = vi.fn();

vi.mock('@uirouter/react', async (importOriginal: () => Promise<object>) => ({
  ...(await importOriginal()),
  useCurrentStateAndParams: () => mockUseCurrentStateAndParams(),
}));

vi.mock('@CE/react/hooks/useEnvironmentId', () => ({
  useEnvironmentId: () => mockUseEnvironmentId(),
}));

vi.mock('@CE/react/kubernetes/applications/queries/useApplications', () => ({
  useApplications: () => ({
    data: [
      {
        Id: '1',
        Name: 'app1',
        CreationDate: '2021-10-01T00:00:00Z',
        ResourcePool: 'namespace1',
        Image: 'image1',
        ApplicationType: 'Pod',
        Kind: 'Pod',
        DeploymentType: 'Replicated',
        Status: 'status1',
        TotalPodsCount: 1,
        RunningPodsCount: 1,
        Metadata: {
          labels: {
            [PodKubernetesInstanceLabel]: 'helm-release-1',
            [PodManagedByLabel]: 'Helm',
          },
        },
      },
      {
        Id: '2',
        Name: 'app2',
        CreationDate: '2021-10-01T00:00:00Z',
        ResourcePool: 'namespace1',
        Image: 'image1',
        ApplicationType: 'Pod',
        Kind: 'Pod',
        DeploymentType: 'Replicated',
        Status: 'status1',
        TotalPodsCount: 1,
        RunningPodsCount: 1,
        Metadata: {
          labels: {
            [PodKubernetesInstanceLabel]: 'helm-release-1',
            [PodManagedByLabel]: 'Helm',
          },
        },
      },
      {
        Id: '3',
        Name: 'app3',
        CreationDate: '2021-10-01T00:00:00Z',
        ResourcePool: 'namespace2',
        Image: 'image1',
        ApplicationType: 'Pod',
        Kind: 'Pod',
        DeploymentType: 'Replicated',
        Status: 'status1',
        TotalPodsCount: 1,
        RunningPodsCount: 1,
        Metadata: {
          labels: {
            [PodKubernetesInstanceLabel]: 'helm-release-1',
            [PodManagedByLabel]: 'Helm',
          },
        },
      },
    ],
    isLoading: false,
  }),
}));

vi.mock('@@CE/Link', () => ({
  Link: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="mock-link">{children}</span>
  ),
}));

vi.mock('@CE/react/kubernetes/components/CreateFromManifestButton', () => ({
  CreateFromManifestButton: ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    'data-cy'?: string;
  }) => (
    <button type="button" data-testid="mock-create-manifest-button" {...props}>
      {children || 'Create from manifest'}
    </button>
  ),
}));

function renderComponent() {
  server.use(
    http.get('/api/endpoints/:endpointId', () =>
      HttpResponse.json(createMockEnvironment())
    )
  );

  const user = new UserViewModel({ Username: 'user' });

  const Wrapped = withTestQueryProvider(
    withUserProvider(withTestRouter(ApplicationsDatatable), user)
  );

  return render(
    <Wrapped
      tableState={{
        search: '',
        setSearch: () => {},
        namespace: '',
        setNamespace: () => {},
        showSystemResources: false,
        autoRefreshRate: 0,
        setAutoRefreshRate: () => {},
        setShowSystemResources: () => {},
        sortBy: { id: 'Name', desc: false },
        setSortBy: () => {},
        pageSize: 10,
        setPageSize: () => {},
      }}
    />
  );
}

describe('ApplicationsDatatable', () => {
  beforeEach(() => {
    mockUseEnvironmentId.mockReturnValue(3);
    mockUseCurrentStateAndParams.mockReturnValue({
      params: {},
    });
  });

  it('should group helm apps by namespace and instance label', async () => {
    renderComponent();

    const helmReleases = await screen.findAllByText('helm-release-1');
    expect(helmReleases).toHaveLength(2);

    // Should show both namespaces in table cells
    const namespace1Cells = await screen.findAllByRole('cell', {
      name: 'namespace1',
    });
    const namespace2Cells = await screen.findAllByRole('cell', {
      name: 'namespace2',
    });
    expect(namespace1Cells.length).toBeGreaterThan(0);
    expect(namespace2Cells.length).toBeGreaterThan(0);
  });
});
