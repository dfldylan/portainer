package filesystem

import (
	"os"
	"path"
	"testing"

	"github.com/stretchr/testify/require"
)

func createService(t *testing.T) *Service {
	dataStorePath := path.Join(t.TempDir(), t.Name())

	service, err := NewService(dataStorePath, "")
	require.NoError(t, err, "NewService should not fail")

	t.Cleanup(func() {
		os.RemoveAll(dataStorePath)
	})

	return service
}
