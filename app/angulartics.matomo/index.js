/* eslint-disable no-empty-function */
import angular from 'angular';

export default angular.module('analytics-stub', []).service('$analytics', service).name;

/* @ngInject */
function service() {
  return {
    setOptOut() {},
    setPortainerStatus() {},
    setUserRole() {},
    eventTrack() {},
  };
}
