import { PageHeader } from '@@CE/PageHeader';
import { Widget, WidgetBody } from '@@CE/Widget';

import { CreateHelmRepositoryForm } from './CreateHelmRespositoriesForm';

export function CreateHelmRepositoriesView() {
  return (
    <>
      <PageHeader
        title="Create Helm repository"
        breadcrumbs={[
          { label: 'My account', link: 'portainer.account' },
          { label: 'Create Helm repository' },
        ]}
        reload
      />

      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <WidgetBody>
              <CreateHelmRepositoryForm />
            </WidgetBody>
          </Widget>
        </div>
      </div>
    </>
  );
}
