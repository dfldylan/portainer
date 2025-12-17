import { VolumeViewModel } from '@CE/docker/models/volume';

export type DecoratedVolume = VolumeViewModel & { dangling: boolean };
