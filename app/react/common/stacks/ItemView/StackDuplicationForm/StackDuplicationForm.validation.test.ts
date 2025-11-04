import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import type { AnySchema } from 'yup';

import {
  getBaseValidationSchema,
  getDuplicateValidationSchema,
  getMigrateValidationSchema,
  useValidation,
} from './StackDuplicationForm.validation';
import { FormSubmitValues } from './StackDuplicationForm.types';

describe('getDuplicateValidationSchema', () => {
  const schema = getDuplicateValidationSchema();

  describe('name validation', () => {
    it('should require stack name', async () => {
      await expect(
        schema.validate({ name: '', environmentId: 2 })
      ).rejects.toThrow('Stack name is required');
    });

    it.each([
      ['lowercase alphanumeric', 'mystack123'],
      ['with underscores', 'my_stack'],
      ['with hyphens', 'my-stack'],
      ['with underscores and hyphens', 'my_stack-123'],
    ])('should accept valid names: %s', async (_, name) => {
      await expect(
        schema.validate({ name, environmentId: 2 })
      ).resolves.toBeTruthy();
    });

    it.each([
      ['uppercase letters', 'MyStack'],
      ['spaces', 'my stack'],
      ['special characters', 'my@stack'],
    ])('should reject names with %s', async (_, name) => {
      await expect(schema.validate({ name, environmentId: 2 })).rejects.toThrow(
        "Stack name must consist of lower case alphanumeric characters, '_' or '-'"
      );
    });
  });

  describe('environmentId validation', () => {
    testEnvironmentIdValidation(schema);
  });
});

describe('getMigrateValidationSchema', () => {
  const currentEnvironmentId = 1;
  const schema = getMigrateValidationSchema(currentEnvironmentId);

  describe('name validation (optional)', () => {
    it.each([
      ['empty string', ''],
      ['undefined', undefined],
    ])('should accept %s', async (_, name) => {
      await expect(
        schema.validate({ name, environmentId: 2 })
      ).resolves.toBeTruthy();
    });

    it.each([
      ['valid format', 'mystack'],
      ['with underscores and hyphens', 'my_stack-123'],
    ])('should accept valid name when provided: %s', async (_, name) => {
      await expect(
        schema.validate({ name, environmentId: 2 })
      ).resolves.toBeTruthy();
    });

    it.each([
      ['uppercase letters', 'MyStack'],
      ['special characters', 'my@stack'],
    ])('should reject invalid format when provided: %s', async (_, name) => {
      await expect(schema.validate({ name, environmentId: 2 })).rejects.toThrow(
        "Stack name must consist of lower case alphanumeric characters, '_' or '-'"
      );
    });
  });

  describe('environmentId validation', () => {
    testEnvironmentIdValidation(schema, currentEnvironmentId);
  });
});

describe('getBaseValidationSchema', () => {
  const schema = getBaseValidationSchema();

  describe('name validation (optional)', () => {
    it.each([
      ['empty string', ''],
      ['undefined', undefined],
    ])('should accept %s', async (_, name) => {
      await expect(
        schema.validate({ name, environmentId: 2 })
      ).resolves.toBeTruthy();
    });

    it.each([
      ['valid format', 'mystack'],
      ['with underscores and hyphens', 'my_stack-123'],
    ])('should accept valid name when provided: %s', async (_, name) => {
      await expect(
        schema.validate({ name, environmentId: 2 })
      ).resolves.toBeTruthy();
    });

    it.each([
      ['uppercase letters', 'MyStack'],
      ['special characters', 'my@stack'],
    ])('should reject invalid format when provided: %s', async (_, name) => {
      await expect(schema.validate({ name, environmentId: 2 })).rejects.toThrow(
        "Stack name must consist of lower case alphanumeric characters, '_' or '-'"
      );
    });
  });

  describe('environmentId validation', () => {
    testEnvironmentIdValidation(schema);
  });
});

describe('useValidation', () => {
  const currentEnvironmentId = 1;

  it('should start with both migrate and duplicate as false', () => {
    const { result } = renderHook(() =>
      useValidation({
        values: {
          environmentId: undefined,
          newName: '',
          actionType: 'migrate',
        },
        currentEnvironmentId,
      })
    );

    expect(result.current.migrate).toBe(false);
    expect(result.current.duplicate).toBe(false);
  });

  describe('migrate validation state', () => {
    it('should set migrate to true when valid environmentId is selected', async () => {
      const { result } = renderHook(() =>
        useValidation({
          values: {
            environmentId: 2,
            newName: '',
            actionType: 'migrate',
          },
          currentEnvironmentId,
        })
      );

      await waitFor(() => {
        expect(result.current.migrate).toBe(true);
      });
    });

    it('should set migrate to true when valid environmentId and valid name provided', async () => {
      const { result } = renderHook(() =>
        useValidation({
          values: {
            environmentId: 2,
            newName: 'mystack',
            actionType: 'migrate',
          },
          currentEnvironmentId,
        })
      );

      await waitFor(() => {
        expect(result.current.migrate).toBe(true);
      });
    });

    it.each([
      ['matches current environment', currentEnvironmentId, ''],
      ['is undefined', undefined, ''],
      ['has invalid name format', 2, 'InvalidName'],
    ])(
      'should set migrate to false when environmentId %s',
      async (_, environmentId, newName) => {
        const { result } = renderHook(() =>
          useValidation({
            values: {
              environmentId,
              newName,
              actionType: 'migrate',
            },
            currentEnvironmentId,
          })
        );

        await waitFor(() => {
          expect(result.current.migrate).toBe(false);
        });
      }
    );
  });

  describe('duplicate validation state', () => {
    it('should set duplicate to true when valid name and environmentId provided', async () => {
      const { result } = renderHook(() =>
        useValidation({
          values: {
            environmentId: 2,
            newName: 'mystack',
            actionType: 'duplicate',
          },
          currentEnvironmentId,
        })
      );

      await waitFor(() => {
        expect(result.current.duplicate).toBe(true);
      });
    });

    it.each([
      ['name is empty', 2, ''],
      ['name format is invalid', 2, 'Invalid@Name'],
      [
        'environmentId matches current environment',
        currentEnvironmentId,
        'mystack',
      ],
      ['environmentId is undefined', undefined, 'mystack'],
    ])(
      'should set duplicate to false when %s',
      async (_, environmentId, newName) => {
        const { result } = renderHook(() =>
          useValidation({
            values: {
              environmentId,
              newName,
              actionType: 'duplicate',
            },
            currentEnvironmentId,
          })
        );

        await waitFor(() => {
          expect(result.current.duplicate).toBe(false);
        });
      }
    );
  });

  describe('reactive updates', () => {
    it('should revalidate when environmentId changes', async () => {
      const { result, rerender } = renderHook(
        ({ values }: { values: FormSubmitValues }) =>
          useValidation({ values, currentEnvironmentId }),
        {
          initialProps: {
            values: {
              environmentId: undefined as number | undefined,
              newName: 'mystack',
              actionType: 'duplicate' as const,
            },
          },
        }
      );

      await waitFor(() => {
        expect(result.current.duplicate).toBe(false);
      });

      rerender({
        values: {
          environmentId: 2,
          newName: 'mystack',
          actionType: 'duplicate',
        },
      });

      await waitFor(() => {
        expect(result.current.duplicate).toBe(true);
      });
    });

    it('should revalidate when newName changes', async () => {
      const { result, rerender } = renderHook(
        ({ values }: { values: FormSubmitValues }) =>
          useValidation({ values, currentEnvironmentId }),
        {
          initialProps: {
            values: {
              environmentId: 2,
              newName: '',
              actionType: 'duplicate' as const,
            },
          },
        }
      );

      await waitFor(() => {
        expect(result.current.duplicate).toBe(false);
      });

      rerender({
        values: {
          environmentId: 2,
          newName: 'mystack',
          actionType: 'duplicate',
        },
      });

      await waitFor(() => {
        expect(result.current.duplicate).toBe(true);
      });
    });
  });
});

function testEnvironmentIdValidation(
  schema: AnySchema,
  currentEnvironmentId?: number
) {
  it('should require environmentId', async () => {
    await expect(
      schema.validate({ name: 'mystack', environmentId: undefined })
    ).rejects.toThrow('Target environment must be selected');
  });

  if (currentEnvironmentId !== undefined) {
    it('should reject environmentId that matches currentEnvironmentId', async () => {
      await expect(
        schema.validate({
          name: 'mystack',
          environmentId: currentEnvironmentId,
        })
      ).rejects.toThrow(
        'Target environment must be different from the current environment'
      );
    });
  }

  it('should accept environmentId different from currentEnvironmentId', async () => {
    await expect(
      schema.validate({ name: 'mystack', environmentId: 2 })
    ).resolves.toBeTruthy();
  });
}
