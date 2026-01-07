import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { EnvironmentBasicConfigSection } from './EnvironmentBasicConfigSection';

interface RenderOptions {
  values?: {
    name: string;
    url: string;
    publicUrl: string;
  };
  setValues?: (values: {
    name: string;
    url: string;
    publicUrl: string;
  }) => void;
  isEdge?: boolean;
  isAzure?: boolean;
  isAgent?: boolean;
  hasError?: boolean;
  isLocalEnvironment?: boolean;
}

function renderComponent({
  values = {
    name: 'test-environment',
    url: '10.0.0.10:2375',
    publicUrl: '10.0.0.10',
  },
  setValues = vi.fn(),
  isEdge = false,
  isAzure = false,
  isAgent = false,
  hasError = false,
  isLocalEnvironment = false,
}: RenderOptions = {}) {
  return render(
    <EnvironmentBasicConfigSection
      values={values}
      setValues={setValues}
      isEdge={isEdge}
      isAzure={isAzure}
      isAgent={isAgent}
      hasError={hasError}
      isLocalEnvironment={isLocalEnvironment}
    />
  );
}

describe('EnvironmentBasicConfigSection', () => {
  it('should render all fields when not edge and not azure', () => {
    renderComponent({
      isEdge: false,
      isAzure: false,
    });

    expect(screen.getByLabelText(/Name/i)).toBeVisible();
    expect(screen.getByLabelText(/Environment URL/i)).toBeVisible();
    expect(screen.getByLabelText(/Public IP/i)).toBeVisible();
  });

  it('should render with correct values', () => {
    const values = {
      name: 'my-docker-env',
      url: '192.168.1.100:2375',
      publicUrl: '192.168.1.100',
    };

    renderComponent({ values });

    expect(screen.getByDisplayValue('my-docker-env')).toBeVisible();
    expect(screen.getByDisplayValue('192.168.1.100:2375')).toBeVisible();
    expect(screen.getByDisplayValue('192.168.1.100')).toBeVisible();
  });

  describe('URL field conditional rendering', () => {
    it('should show URL field when not edge and hasError is false', () => {
      renderComponent({ isEdge: false, hasError: false });

      expect(screen.getByLabelText(/Environment URL/i)).toBeVisible();
    });

    it('should hide URL field when isEdge is true', () => {
      renderComponent({ isEdge: true, hasError: false });

      expect(
        screen.queryByLabelText(/Environment URL/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/Environment address/i)
      ).not.toBeInTheDocument();
    });

    it('should hide URL field when hasError is true', () => {
      renderComponent({ isEdge: false, hasError: true });

      expect(
        screen.queryByLabelText(/Environment URL/i)
      ).not.toBeInTheDocument();
    });

    it('should show "Environment address" label when isAgent is true', () => {
      renderComponent({
        isAgent: true,
        isEdge: false,
        hasError: false,
      });

      expect(screen.getByLabelText(/Environment address/i)).toBeVisible();
      expect(
        screen.queryByLabelText(/Environment URL/i)
      ).not.toBeInTheDocument();
    });

    it('should show "Environment URL" label when isAgent is false', () => {
      renderComponent({
        isAgent: false,
        isEdge: false,
        hasError: false,
      });

      expect(screen.getByLabelText(/Environment URL/i)).toBeVisible();
      expect(
        screen.queryByLabelText(/Environment address/i)
      ).not.toBeInTheDocument();
    });
  });

  describe('URL field disabled states', () => {
    it('should disable URL field when endpointType is local', () => {
      renderComponent({
        isLocalEnvironment: true,
        isEdge: false,
        hasError: false,
      });

      expect(screen.getByLabelText(/Environment URL/i)).toBeDisabled();
    });

    it('should disable URL field when isAzure is true', () => {
      renderComponent({
        isAzure: true,
        isEdge: false,
        hasError: false,
      });

      expect(screen.getByLabelText(/Environment URL/i)).toBeDisabled();
    });

    it('should enable URL field when endpointType is remote and not Azure', () => {
      renderComponent({
        isLocalEnvironment: false,
        isAzure: false,
        isEdge: false,
        hasError: false,
      });

      expect(screen.getByLabelText(/Environment URL/i)).not.toBeDisabled();
    });
  });

  describe('Public URL field conditional rendering', () => {
    it('should show Public URL field when not azure and hasError is false', () => {
      renderComponent({ isAzure: false, hasError: false });

      expect(screen.getByLabelText(/Public IP/i)).toBeVisible();
    });

    it('should hide Public URL field when isAzure is true', () => {
      renderComponent({ isAzure: true, hasError: false });

      expect(screen.queryByLabelText(/Public IP/i)).not.toBeInTheDocument();
    });

    it('should hide Public URL field when hasError is true', () => {
      renderComponent({ isAzure: false, hasError: true });

      expect(screen.queryByLabelText(/Public IP/i)).not.toBeInTheDocument();
    });

    it('should show Edge HTTPS message when isEdge is true and publicUrl field is shown', () => {
      renderComponent({
        isEdge: true,
        isAzure: false,
        hasError: false,
      });

      expect(
        screen.getByText(
          /Use https connection on Edge agent to use private registries with credentials/i
        )
      ).toBeVisible();
    });

    it('should not show Edge HTTPS message when isEdge is false', () => {
      renderComponent({
        isEdge: false,
        isAzure: false,
        hasError: false,
      });

      expect(
        screen.queryByText(
          /Use https connection on Edge agent to use private registries with credentials/i
        )
      ).not.toBeInTheDocument();
    });

    it('should not show Edge HTTPS message when publicUrl field is hidden', () => {
      renderComponent({
        isEdge: true,
        isAzure: true,
        hasError: false,
      });

      expect(
        screen.queryByText(
          /Use https connection on Edge agent to use private registries with credentials/i
        )
      ).not.toBeInTheDocument();
    });
  });

  describe('Name field', () => {
    it('should disable name field when hasError is true', () => {
      renderComponent({ hasError: true });

      expect(screen.getByRole('textbox', { name: /Name/i })).toBeDisabled();
    });

    it('should enable name field when hasError is false', () => {
      renderComponent({ hasError: false });

      expect(screen.getByRole('textbox', { name: /Name/i })).not.toBeDisabled();
    });
  });

  describe('Field updates', () => {
    it('should call setValues when name changes', async () => {
      const setValues = vi.fn();
      const initialValues = {
        name: 'test-environment',
        url: '10.0.0.10:2375',
        publicUrl: '10.0.0.10',
      };
      renderComponent({ setValues, values: initialValues });

      const nameInput = screen.getByRole('textbox', { name: /Name/i });
      await userEvent.type(nameInput, 'x');

      expect(setValues).toHaveBeenCalledWith({
        name: 'test-environmentx',
        url: '10.0.0.10:2375',
        publicUrl: '10.0.0.10',
      });
    });

    it('should call setValues when URL changes', async () => {
      const setValues = vi.fn();
      const initialValues = {
        name: 'test-environment',
        url: '10.0.0.10:2375',
        publicUrl: '10.0.0.10',
      };
      renderComponent({
        setValues,
        values: initialValues,
        isEdge: false,
        hasError: false,
      });

      const urlInput = screen.getByLabelText(/Environment URL/i);
      await userEvent.type(urlInput, 'x');

      expect(setValues).toHaveBeenCalledWith({
        name: 'test-environment',
        url: '10.0.0.10:2375x',
        publicUrl: '10.0.0.10',
      });
    });

    it('should call setValues when publicUrl changes', async () => {
      const setValues = vi.fn();
      const initialValues = {
        name: 'test-environment',
        url: '10.0.0.10:2375',
        publicUrl: '10.0.0.10',
      };
      renderComponent({
        setValues,
        values: initialValues,
        isAzure: false,
        hasError: false,
      });

      const publicUrlInput = screen.getByLabelText(/Public IP/i);
      await userEvent.type(publicUrlInput, 'x');

      expect(setValues).toHaveBeenCalledWith({
        name: 'test-environment',
        url: '10.0.0.10:2375',
        publicUrl: '10.0.0.10x',
      });
    });

    it('should preserve other values when updating name', async () => {
      const setValues = vi.fn();
      const initialValues = {
        name: 'old-name',
        url: '10.0.0.10:2375',
        publicUrl: '10.0.0.10',
      };
      renderComponent({ setValues, values: initialValues });

      const nameInput = screen.getByRole('textbox', { name: /Name/i });
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'n');

      expect(setValues).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '10.0.0.10:2375',
          publicUrl: '10.0.0.10',
        })
      );
    });
  });

  describe('Edge cases', () => {
    it('should render with empty values', () => {
      const values = { name: '', url: '', publicUrl: '' };
      renderComponent({ values });

      expect(screen.getByRole('textbox', { name: /Name/i })).toHaveValue('');
    });

    it('should render only name field for edge environment with hasError true', () => {
      renderComponent({ isEdge: true, hasError: true });

      expect(screen.getByLabelText(/Name/i)).toBeVisible();
      expect(
        screen.queryByLabelText(/Environment URL/i)
      ).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/Public IP/i)).not.toBeInTheDocument();
    });

    it('should render only name field for azure environment', () => {
      renderComponent({
        isAzure: true,
        isEdge: false,
        hasError: false,
      });

      expect(screen.getByLabelText(/Name/i)).toBeVisible();
      expect(screen.getByLabelText(/Environment URL/i)).toBeDisabled();
      expect(screen.queryByLabelText(/Public IP/i)).not.toBeInTheDocument();
    });
  });
});
