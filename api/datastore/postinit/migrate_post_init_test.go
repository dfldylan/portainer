package postinit

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	portainer "github.com/portainer/portainer/api"
	"github.com/portainer/portainer/api/datastore"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/segmentio/encoding/json"
	"github.com/stretchr/testify/require"
)

func TestMigrateGPUs(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/containers/json") {
			containerSummary := []container.Summary{{ID: "container1"}}

			err := json.NewEncoder(w).Encode(containerSummary)
			require.NoError(t, err)

			return
		}

		container := container.InspectResponse{
			ContainerJSONBase: &container.ContainerJSONBase{
				ID: "container1",
				HostConfig: &container.HostConfig{
					Resources: container.Resources{
						DeviceRequests: []container.DeviceRequest{
							{Driver: "nvidia"},
						},
					},
				},
			},
		}

		err := json.NewEncoder(w).Encode(container)
		require.NoError(t, err)
	}))
	defer srv.Close()

	_, store := datastore.MustNewTestStore(t, true, false)

	migrator := &PostInitMigrator{dataStore: store}

	dockerCli, err := client.NewClientWithOpts(client.WithHost(srv.URL), client.WithHTTPClient(http.DefaultClient))
	require.NoError(t, err)

	// Nonexistent endpoint

	err = migrator.MigrateGPUs(portainer.Endpoint{}, dockerCli)
	require.Error(t, err)

	// Valid endpoint

	endpoint := portainer.Endpoint{ID: 1, PostInitMigrations: portainer.EndpointPostInitMigrations{MigrateGPUs: true}}

	err = store.Endpoint().Create(&endpoint)
	require.NoError(t, err)

	err = migrator.MigrateGPUs(endpoint, dockerCli)
	require.NoError(t, err)

	migratedEndpoint, err := store.Endpoint().Endpoint(endpoint.ID)
	require.NoError(t, err)

	require.Equal(t, endpoint.ID, migratedEndpoint.ID)
	require.False(t, migratedEndpoint.PostInitMigrations.MigrateGPUs)
	require.True(t, migratedEndpoint.EnableGPUManagement)
}
