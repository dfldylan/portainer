import { FeatureId } from '@CE/react/portainer/feature-flags/enums';

import { getFeatureDetails } from '@@CE/BEFeatureIndicator/utils';

export default class BeIndicatorController {
  limitedToBE?: boolean;

  url?: string;

  feature?: FeatureId;

  /* @ngInject */
  constructor() {
    this.limitedToBE = false;
    this.url = '';
  }

  $onInit() {
    const { url, limitedToBE } = getFeatureDetails(this.feature);

    this.limitedToBE = limitedToBE;
    this.url = url;
  }
}
