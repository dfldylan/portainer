import { withLimitToBE } from '@CE/react/hooks/useLimitToBE';

import { InformationPanel } from '@@CE/InformationPanel';
import { TextTip } from '@@CE/Tip/TextTip';
import { PageHeader } from '@@CE/PageHeader';
import { Link } from '@@CE/Link';
import { Alert } from '@@CE/Alert';

import { Datatable } from './Datatable';
import { useLicenseOverused, useUntrustedCount } from './queries';

export default withLimitToBE(WaitingRoomView);

function WaitingRoomView() {
  const untrustedCount = useUntrustedCount();
  const licenseOverused = useLicenseOverused(untrustedCount);
  return (
    <>
      <PageHeader
        title="Waiting Room"
        breadcrumbs={[{ label: 'Waiting Room' }]}
        reload
      />

      <div className="row">
        <div className="col-sm-12">
          <InformationPanel>
            <TextTip color="blue">
              Only environments generated from the{' '}
              <Link
                to="portainer.endpoints.edgeAutoCreateScript"
                data-cy="waitingRoom-edgeAutoCreateScriptLink"
              >
                auto onboarding
              </Link>{' '}
              script will appear here, manually added environments and edge
              devices will bypass the waiting room.
            </TextTip>
          </InformationPanel>
        </div>
      </div>

      {licenseOverused && (
        <div className="row">
          <div className="col-sm-12">
            <Alert color="warn">
              Associating all nodes in waiting room will exceed the node limit
              of your current license. Go to{' '}
              <Link
                to="portainer.licenses"
                data-cy="waitingRoom-portainerLicensesLink"
              >
                Licenses
              </Link>{' '}
              page to view the current usage.
            </Alert>
          </div>
        </div>
      )}

      <Datatable />
    </>
  );
}
