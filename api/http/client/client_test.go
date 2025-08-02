package client

import (
	"testing"

	portainer "github.com/portainer/portainer/api"

	"github.com/stretchr/testify/require"
)

func TestExecutePingOperationFailure(t *testing.T) {
	host := "http://localhost:1"
	config := portainer.TLSConfiguration{
		TLS:           true,
		TLSSkipVerify: true,
	}

	// Invalid host
	ok, err := ExecutePingOperation(host, config)
	require.False(t, ok)
	require.Error(t, err)

	// Invalid TLS configuration
	config.TLSCertPath = "/invalid/path/to/cert"
	config.TLSKeyPath = "/invalid/path/to/key"

	ok, err = ExecutePingOperation(host, config)
	require.False(t, ok)
	require.Error(t, err)

}
