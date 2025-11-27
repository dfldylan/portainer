import { AlertTriangle } from 'lucide-react';

import { Stack } from '@/react/common/stacks/types';
import { StackDuplicationForm } from '@/react/common/stacks/ItemView/StackDuplicationForm/StackDuplicationForm';
import { Authorized } from '@/react/hooks/useUser';

import { Icon } from '@@/Icon';
import { FormSection } from '@@/form-components/FormSection';

import { StackRedeployGitForm } from './StackRedeployGitForm/StackRedeployGitForm';
import { StackActions } from './StackActions';
import { AssociateStackForm } from './AssociateStackForm';

interface StackInfoTabProps {
  stack?: Stack; // will be loaded only if regular or orphaned
  stackName: string;
  stackFileContent?: string;
  isRegular?: boolean;
  isExternal: boolean;
  isOrphaned: boolean;
  isOrphanedRunning: boolean;
  environmentId: number;
  yamlError?: string;
}

export function StackInfoTab({
  stack,
  stackName,
  stackFileContent,
  isRegular,
  isExternal,
  isOrphaned,
  isOrphanedRunning,
  environmentId,

  yamlError,
}: StackInfoTabProps) {
  return (
    <>
      <ExternalOrphanedWarning
        isExternal={isExternal}
        isOrphaned={isOrphaned || isOrphanedRunning}
      />

      <FormSection title="Stack details">
        <div className="form-group">
          {stackName}

          {stack && (
            <div className="inline-flex ml-3">
              <StackActions
                stack={stack}
                fileContent={stackFileContent}
                isRegular={isRegular}
                environmentId={environmentId}
                isExternal={isExternal}
              />
            </div>
          )}
        </div>
      </FormSection>

      {stack && (
        <>
          {isOrphaned ? (
            <AssociateStackForm
              stackName={stackName}
              environmentId={environmentId}
              isOrphanedRunning={isOrphanedRunning}
              stackId={stack.Id}
            />
          ) : (
            <>
              {stack.GitConfig && !stack.FromAppTemplate && (
                <Authorized authorizations="PortainerStackUpdate">
                  <StackRedeployGitForm stack={stack} />
                </Authorized>
              )}

              {isRegular && (
                <StackDuplicationForm
                  yamlError={yamlError}
                  currentEnvironmentId={environmentId}
                  originalFileContent={stackFileContent || ''}
                  stack={stack}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

function ExternalOrphanedWarning({
  isExternal,
  isOrphaned,
}: {
  isExternal: boolean;
  isOrphaned: boolean;
}) {
  if (!isExternal && !isOrphaned) return null;

  return (
    <FormSection title="Information">
      <div className="form-group">
        <span className="small">
          <p className="text-muted flex items-start gap-1">
            <Icon icon={AlertTriangle} mode="warning" className="!mr-0" />
            {isExternal && (
              <span>
                This stack was created outside of Portainer. Control over this
                stack is limited.
              </span>
            )}
            {isOrphaned && (
              <span>
                This stack is orphaned. You can re-associate it with the current
                environment using the &quot;Associate to this environment&quot;
                feature.
              </span>
            )}
          </p>
        </span>
      </div>
    </FormSection>
  );
}
