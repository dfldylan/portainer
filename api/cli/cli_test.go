package cli

import (
	"os"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestOptionParser(t *testing.T) {
	p := Service{}
	require.NotNil(t, p)

	a := os.Args
	defer func() { os.Args = a }()

	os.Args = []string{"portainer", "--edge-compute"}

	opts, err := p.ParseFlags("2.34.5")
	require.NoError(t, err)

	require.False(t, *opts.HTTPDisabled)
	require.True(t, *opts.EnableEdgeComputeFeatures)
}
