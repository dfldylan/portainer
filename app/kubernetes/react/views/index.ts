import angular from 'angular';

import { r2a } from '@CE/react-tools/react2angular';
import { withCurrentUser } from '@CE/react-tools/withCurrentUser';
import { withReactQuery } from '@CE/react-tools/withReactQuery';
import { withUIRouter } from '@CE/react-tools/withUIRouter';
import { IngressesDatatableView } from '@CE/react/kubernetes/ingresses/IngressDatatable';
import { CreateIngressView } from '@CE/react/kubernetes/ingresses/CreateIngressView';
import { DashboardView } from '@CE/react/kubernetes/dashboard/DashboardView';
import { ServicesView } from '@CE/react/kubernetes/services/ServicesView';
import { ConsoleView } from '@CE/react/kubernetes/applications/ConsoleView';
import { ConfigmapsAndSecretsView } from '@CE/react/kubernetes/configs/ListView/ConfigmapsAndSecretsView';
import { CreateNamespaceView } from '@CE/react/kubernetes/namespaces/CreateView/CreateNamespaceView';
import { ApplicationsView } from '@CE/react/kubernetes/applications/ListView/ApplicationsView';
import { ApplicationDetailsView } from '@CE/react/kubernetes/applications/DetailsView/ApplicationDetailsView';
import { ConfigureView } from '@CE/react/kubernetes/cluster/ConfigureView';
import { NamespacesView } from '@CE/react/kubernetes/namespaces/ListView/NamespacesView';
import { ServiceAccountsView } from '@CE/react/kubernetes/more-resources/ServiceAccountsView/ServiceAccountsView';
import { ClusterRolesView } from '@CE/react/kubernetes/more-resources/ClusterRolesView';
import { RolesView } from '@CE/react/kubernetes/more-resources/RolesView';
import { VolumesView } from '@CE/react/kubernetes/volumes/ListView/VolumesView';
import { NamespaceView } from '@CE/react/kubernetes/namespaces/ItemView/NamespaceView';
import { AccessView } from '@CE/react/kubernetes/namespaces/AccessView/AccessView';
import { JobsView } from '@CE/react/kubernetes/more-resources/JobsView/JobsView';
import { ClusterView } from '@CE/react/kubernetes/cluster/ClusterView';
import { HelmApplicationView } from '@CE/react/kubernetes/helm/HelmApplicationView';
import { HelmInstallView } from '@CE/react/kubernetes/helm/install/HelmInstallView';
import { NodeView } from '@CE/react/kubernetes/cluster/NodeView/NodeView';
import { KubectlShellView } from '@CE/react/kubernetes/cluster/KubectlShell/KubectlShellView';

export const viewsModule = angular
  .module('portainer.kubernetes.react.views', [])
  .component(
    'kubernetesCreateNamespaceView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(CreateNamespaceView))), [])
  )
  .component(
    'namespaceView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(NamespaceView))), [])
  )
  .component(
    'kubernetesNamespacesView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(NamespacesView))), [])
  )
  .component(
    'kubernetesNamespaceAccessView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(AccessView))), [])
  )
  .component(
    'kubernetesServicesView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ServicesView))), [])
  )
  .component(
    'kubernetesVolumesView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(VolumesView))), [])
  )
  .component(
    'kubernetesIngressesView',
    r2a(
      withUIRouter(withReactQuery(withCurrentUser(IngressesDatatableView))),
      []
    )
  )
  .component(
    'kubernetesIngressesCreateView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(CreateIngressView))), [])
  )
  .component(
    'kubernetesConfigMapsAndSecretsView',
    r2a(
      withUIRouter(withReactQuery(withCurrentUser(ConfigmapsAndSecretsView))),
      []
    )
  )
  .component(
    'kubernetesApplicationsView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ApplicationsView))), [])
  )
  .component(
    'applicationDetailsView',
    r2a(
      withUIRouter(withReactQuery(withCurrentUser(ApplicationDetailsView))),
      []
    )
  )
  .component(
    'kubernetesHelmApplicationView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(HelmApplicationView))), [])
  )
  .component(
    'helmInstallView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(HelmInstallView))), [])
  )
  .component(
    'kubectlShellView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(KubectlShellView))), [])
  )
  .component(
    'kubernetesClusterView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ClusterView))), [])
  )
  .component(
    'kubernetesNodeViewReact',
    r2a(withUIRouter(withReactQuery(withCurrentUser(NodeView))), [])
  )
  .component(
    'kubernetesConfigureView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ConfigureView))), [])
  )
  .component(
    'kubernetesDashboardView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(DashboardView))), [])
  )
  .component(
    'kubernetesConsoleView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ConsoleView))), [])
  )
  .component(
    'jobsView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(JobsView))), [])
  )
  .component(
    'serviceAccountsView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ServiceAccountsView))), [])
  )
  .component(
    'clusterRolesView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(ClusterRolesView))), [])
  )
  .component(
    'k8sRolesView',
    r2a(withUIRouter(withReactQuery(withCurrentUser(RolesView))), [])
  ).name;
