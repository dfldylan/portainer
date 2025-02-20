package endpoints

import (
	"net/http"

	portainer "github.com/portainer/portainer/api"
	httperror "github.com/portainer/portainer/pkg/libhttp/error"
	"github.com/portainer/portainer/pkg/libhttp/request"
	"github.com/portainer/portainer/pkg/libhttp/response"
)

type endpointSettingsUpdatePayload struct {
	// Whether non-administrator should be able to use bind mounts when creating containers
	AllowBindMountsForRegularUsers *bool `json:"allowBindMountsForRegularUsers" example:"false"`
	// Whether non-administrator should be able to use privileged mode when creating containers
	AllowPrivilegedModeForRegularUsers *bool `json:"allowPrivilegedModeForRegularUsers" example:"false"`
	// Whether non-administrator should be able to browse volumes
	AllowVolumeBrowserForRegularUsers *bool `json:"allowVolumeBrowserForRegularUsers" example:"true"`
	// Whether non-administrator should be able to use the host pid
	AllowHostNamespaceForRegularUsers *bool `json:"allowHostNamespaceForRegularUsers" example:"true"`
	// Whether non-administrator should be able to use device mapping
	AllowDeviceMappingForRegularUsers *bool `json:"allowDeviceMappingForRegularUsers" example:"true"`
	// Whether non-administrator should be able to manage stacks
	AllowStackManagementForRegularUsers *bool `json:"allowStackManagementForRegularUsers" example:"true"`
	// Whether non-administrator should be able to use container capabilities
	AllowContainerCapabilitiesForRegularUsers *bool `json:"allowContainerCapabilitiesForRegularUsers" example:"true"`
	// Whether non-administrator should be able to use sysctl settings
	AllowSysctlSettingForRegularUsers *bool `json:"allowSysctlSettingForRegularUsers" example:"true"`
	// Whether non-administrator should be able to use security-opt settings
	AllowSecurityOptForRegularUsers *bool `json:"allowSecurityOptForRegularUsers" example:"true"`
	// Whether host management features are enabled
	EnableHostManagementFeatures *bool `json:"enableHostManagementFeatures" example:"true"`

	EnableGPUManagement *bool `json:"enableGPUManagement" example:"false"`

	Gpus []portainer.Pair `json:"gpus"`
}

func (payload *endpointSettingsUpdatePayload) Validate(r *http.Request) error {
	return nil
}

// @id EndpointSettingsUpdate
// @summary Update settings for an environment(endpoint)
// @description Update settings for an environment(endpoint).
// @description **Access policy**: authenticated
// @security ApiKeyAuth
// @security jwt
// @tags endpoints
// @accept json
// @produce json
// @param id path int true "Environment(Endpoint) identifier"
// @param body body endpointSettingsUpdatePayload true "Environment(Endpoint) details"
// @success 200 {object} portainer.Endpoint "Success"
// @failure 400 "Invalid request"
// @failure 404 "Environment(Endpoint) not found"
// @failure 500 "Server error"
// @router /endpoints/{id}/settings [put]
func (handler *Handler) endpointSettingsUpdate(w http.ResponseWriter, r *http.Request) *httperror.HandlerError {
	endpointID, err := request.RetrieveNumericRouteVariableValue(r, "id")
	if err != nil {
		return httperror.BadRequest("Invalid environment identifier route variable", err)
	}

	var payload endpointSettingsUpdatePayload
	err = request.DecodeAndValidateJSONPayload(r, &payload)
	if err != nil {
		return httperror.BadRequest("Invalid request payload", err)
	}

	endpoint, err := handler.DataStore.Endpoint().Endpoint(portainer.EndpointID(endpointID))
	if handler.DataStore.IsErrObjectNotFound(err) {
		return httperror.NotFound("Unable to find an environment with the specified identifier inside the database", err)
	} else if err != nil {
		return httperror.InternalServerError("Unable to find an environment with the specified identifier inside the database", err)
	}

	securitySettings := endpoint.SecuritySettings

	if payload.AllowBindMountsForRegularUsers != nil {
		securitySettings.AllowBindMountsForRegularUsers = *payload.AllowBindMountsForRegularUsers
	}

	if payload.AllowContainerCapabilitiesForRegularUsers != nil {
		securitySettings.AllowContainerCapabilitiesForRegularUsers = *payload.AllowContainerCapabilitiesForRegularUsers
	}

	if payload.AllowDeviceMappingForRegularUsers != nil {
		securitySettings.AllowDeviceMappingForRegularUsers = *payload.AllowDeviceMappingForRegularUsers
	}

	if payload.AllowHostNamespaceForRegularUsers != nil {
		securitySettings.AllowHostNamespaceForRegularUsers = *payload.AllowHostNamespaceForRegularUsers
	}

	if payload.AllowPrivilegedModeForRegularUsers != nil {
		securitySettings.AllowPrivilegedModeForRegularUsers = *payload.AllowPrivilegedModeForRegularUsers
	}

	if payload.AllowStackManagementForRegularUsers != nil {
		securitySettings.AllowStackManagementForRegularUsers = *payload.AllowStackManagementForRegularUsers
	}

	if payload.AllowVolumeBrowserForRegularUsers != nil {
		securitySettings.AllowVolumeBrowserForRegularUsers = *payload.AllowVolumeBrowserForRegularUsers
	}

	if payload.AllowSysctlSettingForRegularUsers != nil {
		securitySettings.AllowSysctlSettingForRegularUsers = *payload.AllowSysctlSettingForRegularUsers
	}

	if payload.AllowSecurityOptForRegularUsers != nil {
		securitySettings.AllowSecurityOptForRegularUsers = *payload.AllowSecurityOptForRegularUsers
	}

	if payload.EnableHostManagementFeatures != nil {
		securitySettings.EnableHostManagementFeatures = *payload.EnableHostManagementFeatures
	}

	if payload.EnableGPUManagement != nil {
		endpoint.EnableGPUManagement = *payload.EnableGPUManagement
	}

	if payload.Gpus != nil {
		endpoint.Gpus = payload.Gpus
	}

	endpoint.SecuritySettings = securitySettings

	err = handler.DataStore.Endpoint().UpdateEndpoint(portainer.EndpointID(endpointID), endpoint)
	if err != nil {
		return httperror.InternalServerError("Failed persisting environment in database", err)
	}

	return response.JSON(w, endpoint)
}
