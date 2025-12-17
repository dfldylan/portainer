import { render } from '@testing-library/react';

import { UserViewModel } from '@CE/portainer/models/user';
import { withUserProvider } from '@CE/react/test-utils/withUserProvider';
import { withTestQueryProvider } from '@CE/react/test-utils/withTestQuery';

import { TeamMembersList } from './TeamMembersList';

test('renders correctly', () => {
  const queries = renderComponent();

  expect(queries).toBeTruthy();
});

function renderComponent() {
  const user = new UserViewModel({ Username: 'user' });

  const Wrapped = withTestQueryProvider(
    withUserProvider(TeamMembersList, user)
  );

  return render(<Wrapped users={[]} roles={{}} teamId={3} />);
}

test.todo('when users list is empty, add all users button is disabled');
test.todo('filter displays expected users');
