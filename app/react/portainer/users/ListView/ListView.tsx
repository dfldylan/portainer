import { PageHeader } from '@@CE/PageHeader';

import { NewUserForm } from './NewUserForm/NewUserForm';
import { UsersDatatable } from './UsersDatatable/UsersDatatable';

export function ListView() {
  return (
    <>
      <PageHeader title="Users" breadcrumbs="User management" reload />

      <NewUserForm />

      <UsersDatatable />
    </>
  );
}
