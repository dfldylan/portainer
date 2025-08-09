package kubernetes

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestNewLocalTransport(t *testing.T) {
	transport, err := NewLocalTransport(nil, nil, nil, nil, nil)
	require.NoError(t, err)
	require.True(t, transport.httpTransport.TLSClientConfig.InsecureSkipVerify) //nolint:forbidigo
}
