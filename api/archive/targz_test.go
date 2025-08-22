package archive

import (
	"os"
	"os/exec"
	"path"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func listFiles(dir string) []string {
	items := make([]string, 0)

	filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if path == dir {
			return nil
		}

		items = append(items, path)

		return nil
	})

	return items
}

func Test_shouldCreateArchive(t *testing.T) {
	tmpdir := t.TempDir()
	content := []byte("content")

	err := os.WriteFile(path.Join(tmpdir, "outer"), content, 0600)
	require.NoError(t, err)

	os.MkdirAll(path.Join(tmpdir, "dir"), 0700)
	require.NoError(t, err)

	err = os.WriteFile(path.Join(tmpdir, "dir", ".dotfile"), content, 0600)
	require.NoError(t, err)

	err = os.WriteFile(path.Join(tmpdir, "dir", "inner"), content, 0600)
	require.NoError(t, err)

	gzPath, err := TarGzDir(tmpdir)
	require.NoError(t, err)
	assert.Equal(t, filepath.Join(tmpdir, filepath.Base(tmpdir)+".tar.gz"), gzPath)

	extractionDir := t.TempDir()
	cmd := exec.Command("tar", "-xzf", gzPath, "-C", extractionDir)
	if err := cmd.Run(); err != nil {
		t.Fatal("Failed to extract archive: ", err)
	}
	extractedFiles := listFiles(extractionDir)

	wasExtracted := func(p string) {
		fullpath := path.Join(extractionDir, p)
		assert.Contains(t, extractedFiles, fullpath)
		copyContent, err := os.ReadFile(fullpath)
		require.NoError(t, err)
		assert.Equal(t, content, copyContent)
	}

	wasExtracted("outer")
	wasExtracted("dir/inner")
	wasExtracted("dir/.dotfile")
}

func Test_shouldCreateArchive2(t *testing.T) {
	tmpdir := t.TempDir()
	content := []byte("content")

	err := os.WriteFile(path.Join(tmpdir, "outer"), content, 0600)
	require.NoError(t, err)

	err = os.MkdirAll(path.Join(tmpdir, "dir"), 0700)
	require.NoError(t, err)

	err = os.WriteFile(path.Join(tmpdir, "dir", ".dotfile"), content, 0600)
	require.NoError(t, err)

	err = os.WriteFile(path.Join(tmpdir, "dir", "inner"), content, 0600)
	require.NoError(t, err)

	gzPath, err := TarGzDir(tmpdir)
	require.NoError(t, err)
	assert.Equal(t, filepath.Join(tmpdir, filepath.Base(tmpdir)+".tar.gz"), gzPath)

	extractionDir := t.TempDir()
	r, _ := os.Open(gzPath)
	if err := ExtractTarGz(r, extractionDir); err != nil {
		t.Fatal("Failed to extract archive: ", err)
	}
	extractedFiles := listFiles(extractionDir)

	wasExtracted := func(p string) {
		fullpath := path.Join(extractionDir, p)
		assert.Contains(t, extractedFiles, fullpath)
		copyContent, _ := os.ReadFile(fullpath)
		assert.Equal(t, content, copyContent)
	}

	wasExtracted("outer")
	wasExtracted("dir/inner")
	wasExtracted("dir/.dotfile")
}
