// general icons

import dataflow from '@CE/assets/ico/dataflow-1.svg?c';
import git from '@CE/assets/ico/git.svg?c';
import kube from '@CE/assets/ico/kube.svg?c';
import ldap from '@CE/assets/ico/ldap.svg?c';
import linux from '@CE/assets/ico/linux.svg?c';
import memory from '@CE/assets/ico/memory.svg?c';
import restorewindow from '@CE/assets/ico/restore-window.svg?c';
import route from '@CE/assets/ico/route.svg?c';
import sort from '@CE/assets/ico/sort.svg?c';
import subscription from '@CE/assets/ico/subscription.svg?c';
import Placeholder from '@CE/assets/ico/placeholder.svg?c'; // Placeholder is used when an icon name cant be matched
// vendor icons
import aws from '@CE/assets/ico/vendor/aws.svg?c';
import azure from '@CE/assets/ico/vendor/azure.svg?c';
import civo from '@CE/assets/ico/vendor/civo.svg?c';
import digitalocean from '@CE/assets/ico/vendor/digitalocean.svg?c';
import docker from '@CE/assets/ico/vendor/docker.svg?c';
import dockericon from '@CE/assets/ico/vendor/docker-icon.svg?c';
import dockercompose from '@CE/assets/ico/vendor/docker-compose.svg?c';
import ecr from '@CE/assets/ico/vendor/ecr.svg?c';
import github from '@CE/assets/ico/vendor/github.svg?c';
import gitlab from '@CE/assets/ico/vendor/gitlab.svg?c';
import google from '@CE/assets/ico/vendor/google.svg?c';
import googlecloud from '@CE/assets/ico/vendor/googlecloud.svg?c';
import kubernetes from '@CE/assets/ico/vendor/kubernetes.svg?c';
import helm from '@CE/assets/ico/vendor/helm.svg?c';
import akamai from '@CE/assets/ico/vendor/akamai.svg?c';
import microsoft from '@CE/assets/ico/vendor/microsoft.svg?c';
import microsofticon from '@CE/assets/ico/vendor/microsoft-icon.svg?c';
import openldap from '@CE/assets/ico/vendor/openldap.svg?c';
import proget from '@CE/assets/ico/vendor/proget.svg?c';
import quay from '@CE/assets/ico/vendor/quay.svg?c';

const placeholder = Placeholder;

export const SvgIcons = {
  dataflow,
  dockericon,
  git,
  ldap,
  linux,
  memory,
  placeholder,
  restorewindow,
  route,
  sort,
  subscription,
  aws,
  azure,
  civo,
  digitalocean,
  docker,
  dockercompose,
  ecr,
  github,
  gitlab,
  google,
  googlecloud,
  kubernetes,
  helm,
  akamai,
  microsoft,
  microsofticon,
  openldap,
  proget,
  quay,
  kube,
};

interface SvgProps {
  icon: keyof typeof SvgIcons;
  className?: string;
}

function Svg({ icon, className }: SvgProps) {
  const SvgIcon = SvgIcons[icon];

  if (!SvgIcon) {
    return (
      <span className={className} aria-hidden="true">
        <Placeholder />
      </span>
    );
  }

  return (
    <span className={className} aria-hidden="true">
      <SvgIcon />
    </span>
  );
}

export default Svg;
