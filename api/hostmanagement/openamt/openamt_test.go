package openamt

import (
	"net/http"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestNewService(t *testing.T) {
	service := NewService(true)
	require.NotNil(t, service)
	require.True(t, service.httpsClient.Transport.(*http.Transport).TLSClientConfig.InsecureSkipVerify) //nolint:forbidigo
}
