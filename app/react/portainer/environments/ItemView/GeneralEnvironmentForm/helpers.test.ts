import { describe, it, expect } from 'vitest';

import { EnvironmentType } from '@/react/portainer/environments/types';

import { formatURL } from './helpers';

describe('helpers', () => {
  describe('formatURL', () => {
    it('should add tcp:// prefix for Docker environments', () => {
      const result = formatURL('10.0.0.1:2375', EnvironmentType.Docker);
      expect(result).toBe('tcp://10.0.0.1:2375');
    });

    it('should add tcp:// prefix for Docker standalone', () => {
      const result = formatURL('10.0.0.1:2375', EnvironmentType.Docker);
      expect(result).toBe('tcp://10.0.0.1:2375');
    });

    it('should add tcp:// prefix for Agent environment', () => {
      const result = formatURL('agent-host', EnvironmentType.AgentOnDocker);
      expect(result).toBe('tcp://agent-host');
    });

    it('should add https:// prefix for Kubernetes Local', () => {
      const result = formatURL(
        'k8s.example.com',
        EnvironmentType.KubernetesLocal
      );
      expect(result).toBe('https://k8s.example.com');
    });

    it('should not add prefix for Agent on Kubernetes', () => {
      const result = formatURL('k8s-agent', EnvironmentType.AgentOnKubernetes);
      expect(result).toBe('k8s-agent');
    });

    it('should strip existing protocol before formatting', () => {
      const result = formatURL('tcp://10.0.0.1:2375', EnvironmentType.Docker);
      expect(result).toBe('tcp://10.0.0.1:2375');
    });

    it('should handle empty URL', () => {
      const result = formatURL('', EnvironmentType.Docker);
      expect(result).toBe('');
    });

    it('should strip https:// and add tcp:// for Docker', () => {
      const result = formatURL('https://10.0.0.1:2375', EnvironmentType.Docker);
      expect(result).toBe('tcp://10.0.0.1:2375');
    });
  });
});
