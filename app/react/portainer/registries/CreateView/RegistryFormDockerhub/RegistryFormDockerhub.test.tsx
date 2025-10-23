import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withTestQueryProvider } from '@/react/test-utils/withTestQuery';

import {
  RegistryFormDockerhub,
  RegistryFormDockerhubValues,
} from './RegistryFormDockerhub';

test('should render form with all required fields', () => {
  renderComponent();

  expect(screen.getByText('Important notice')).toBeVisible();
  expect(screen.getByText('DockerHub account details')).toBeVisible();
  expect(screen.getByText('Actions')).toBeVisible();

  expect(screen.getByLabelText(/Name/)).toBeVisible();
  expect(screen.getByLabelText(/DockerHub username/)).toBeVisible();
  expect(screen.getByLabelText(/DockerHub access token/)).toBeVisible();

  expect(screen.getByRole('button', { name: 'Add registry' })).toBeVisible();
});

test('should show validation errors for empty required fields', async () => {
  renderComponent();

  const submitButton = screen.getByRole('button', { name: 'Add registry' });

  // Button should be disabled initially when form is empty
  expect(submitButton).toBeDisabled();

  await waitFor(() => {
    const errorMessages = screen.getAllByText('This field is required.');
    expect(errorMessages.length).toBe(3);
    expect(errorMessages[0]).toBeVisible();
  });
});

test('should show error when name is already used', async () => {
  const nameIsUsed = vi.fn((name: string) =>
    Promise.resolve(name === 'existing-name')
  );

  renderComponent({ nameIsUsed });

  const user = userEvent.setup();

  const nameInput = screen.getByLabelText(/Name/);
  await user.type(nameInput, 'existing-name');
  await user.tab(); // Trigger validation

  await waitFor(() => {
    expect(
      screen.getByText('A registry with the same name already exists.')
    ).toBeVisible();
  });
});

test('should submit form with valid data', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  renderComponent({ onSubmit });

  await user.type(screen.getByLabelText(/Name/), 'test-registry');
  await user.type(screen.getByLabelText(/DockerHub username/), 'testuser');
  await user.type(
    screen.getByLabelText(/DockerHub access token/),
    'secret-token'
  );

  const submitButton = screen.getByRole('button', { name: 'Add registry' });

  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });

  await user.click(submitButton);

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      Name: 'test-registry',
      Username: 'testuser',
      Password: 'secret-token',
    });
  });
});

test('should show loading state when isLoading is true', () => {
  renderComponent({ isLoading: true });

  const submitButton = screen.getByRole('button');
  expect(submitButton).toHaveTextContent('In progress...');
  expect(submitButton).toBeDisabled();
});

test('should populate form with initial values', () => {
  const initialValues = {
    Name: 'my-registry',
    Username: 'myuser',
    Password: 'mypassword',
  };

  renderComponent({ initialValues });

  expect(screen.getByDisplayValue('my-registry')).toBeVisible();
  expect(screen.getByDisplayValue('myuser')).toBeVisible();
  expect(screen.getByDisplayValue('mypassword')).toBeVisible();
});

test('should display dockerhub guide link', () => {
  renderComponent();

  const link = screen.getByRole('link', { name: /dockerhub guide/ });
  expect(link).toHaveAttribute(
    'href',
    'https://docs.docker.com/docker-hub/access-tokens/'
  );
  expect(link).toHaveAttribute('target', '_blank');
});

function renderComponent(
  props: Partial<React.ComponentProps<typeof RegistryFormDockerhub>> = {}
) {
  const defaultInitialValues: RegistryFormDockerhubValues = {
    Name: '',
    Username: '',
    Password: '',
  };

  const defaultProps = {
    initialValues: defaultInitialValues,
    onSubmit: vi.fn(),
    submitLabel: 'Add registry',
    isLoading: false,
    nameIsUsed: vi.fn(() => Promise.resolve(false)),
  };

  const actualProps = {
    ...defaultProps,
    ...props,
  };

  const Wrapped = withTestQueryProvider(RegistryFormDockerhub);

  return render(<Wrapped {...actualProps} />);
}
