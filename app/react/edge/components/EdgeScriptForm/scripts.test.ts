import { buildLinuxPodmanCommand } from './scripts';
import { ScriptFormValues } from './types';

describe('buildLinuxPodmanCommand', () => {
  const defaultProperties: ScriptFormValues = {
    allowSelfSignedCertificates: false,
    authEnabled: false,
    edgeGroupsIds: [],
    edgeIdGenerator: '',
    envVars: '',
    group: 0,
    os: 'linux',
    platform: 'podman',
    tagsIds: [],
    tlsEnabled: false,
  };

  it('should generate basic command with minimal configuration', () => {
    const command = buildLinuxPodmanCommand(
      '2.19.0',
      'test-edge-key',
      defaultProperties,
      false,
      'test-edge-id',
      'test-secret'
    );

    expect(command).toMatchSnapshot();
  });

  it('should generate command with async mode enabled', () => {
    const command = buildLinuxPodmanCommand(
      '2.19.0',
      'test-edge-key',
      defaultProperties,
      true, // async mode
      'test-edge-id',
      'test-secret'
    );

    expect(command).toMatchSnapshot();
  });

  it('should generate command with self-signed certificates allowed', () => {
    const properties = {
      ...defaultProperties,
      allowSelfSignedCertificates: true,
    };

    const command = buildLinuxPodmanCommand(
      '2.19.0',
      'test-edge-key',
      properties,
      false,
      'test-edge-id',
      'test-secret'
    );

    expect(command).toMatchSnapshot();
  });

  it('should generate command with edge ID generator', () => {
    const properties = {
      ...defaultProperties,
      edgeIdGenerator: 'uuidgen',
    };

    const command = buildLinuxPodmanCommand(
      '2.19.0',
      'test-edge-key',
      properties,
      false,
      undefined, // no edgeId when using generator
      'test-secret'
    );

    expect(command).toMatchSnapshot();
  });

  it('should generate command with custom environment variables', () => {
    const properties = {
      ...defaultProperties,
      envVars: 'MY_VAR=value1,ANOTHER_VAR=value2',
    };

    const command = buildLinuxPodmanCommand(
      '2.19.0',
      'test-edge-key',
      properties,
      false,
      'test-edge-id',
      'test-secret'
    );

    expect(command).toMatchSnapshot();
  });

  it('should generate command with edge groups', () => {
    const properties = {
      ...defaultProperties,
      edgeGroupsIds: [1, 2, 3],
    };

    const command = buildLinuxPodmanCommand(
      '2.19.0',
      'test-edge-key',
      properties,
      false,
      'test-edge-id',
      'test-secret'
    );

    expect(command).toMatchSnapshot();
  });

  it('should generate command with portainer group', () => {
    const properties = {
      ...defaultProperties,
      group: 5,
    };

    const command = buildLinuxPodmanCommand(
      '2.19.0',
      'test-edge-key',
      properties,
      false,
      'test-edge-id',
      'test-secret'
    );

    expect(command).toMatchSnapshot();
  });

  it('should generate command with tags', () => {
    const properties = {
      ...defaultProperties,
      tagsIds: [10, 20, 30],
    };

    const command = buildLinuxPodmanCommand(
      '2.19.0',
      'test-edge-key',
      properties,
      false,
      'test-edge-id',
      'test-secret'
    );

    expect(command).toMatchSnapshot();
  });

  it('should generate command with all meta variables', () => {
    const properties = {
      ...defaultProperties,
      edgeGroupsIds: [1, 2],
      group: 5,
      tagsIds: [10, 20],
    };

    const command = buildLinuxPodmanCommand(
      '2.19.0',
      'test-edge-key',
      properties,
      false,
      'test-edge-id',
      'test-secret'
    );

    expect(command).toMatchSnapshot();
  });

  it('should generate command without agent secret', () => {
    const command = buildLinuxPodmanCommand(
      '2.19.0',
      'test-edge-key',
      defaultProperties,
      false,
      'test-edge-id',
      undefined
    );

    expect(command).toMatchSnapshot();
  });

  it('should generate command with empty agent secret', () => {
    const command = buildLinuxPodmanCommand(
      '2.19.0',
      'test-edge-key',
      defaultProperties,
      false,
      'test-edge-id',
      ''
    );

    expect(command).toMatchSnapshot();
  });
});
