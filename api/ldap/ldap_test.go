package ldap

import (
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	portainer "github.com/portainer/portainer/api"

	"github.com/stretchr/testify/require"
)

func TestCreateConnectionForURL(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))
	defer srv.Close()

	tlsSrv := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))
	defer tlsSrv.Close()

	srvURL, err := url.Parse(tlsSrv.URL)
	require.NoError(t, err)

	// TCP

	settings := &portainer.LDAPSettings{
		URL: srvURL.Host,
	}

	conn, err := createConnectionForURL(settings.URL, settings)
	require.NoError(t, err)
	require.NotNil(t, conn)
	conn.Close()

	// TLS

	settings.TLSConfig = portainer.TLSConfiguration{
		TLS:           true,
		TLSSkipVerify: true,
	}

	conn, err = createConnectionForURL(settings.URL, settings)
	require.NoError(t, err)
	require.NotNil(t, conn)
	conn.Close()

	// Invalid TLS

	settings.TLSConfig = portainer.TLSConfiguration{
		TLS:           true,
		TLSSkipVerify: true,
		TLSCertPath:   "/invalid/path/cert",
		TLSKeyPath:    "/invalid/path/key",
	}

	conn, err = createConnectionForURL(settings.URL, settings)
	require.Error(t, err)
	require.Nil(t, conn)

	// StartTLS

	settings.TLSConfig.TLS = false
	settings.StartTLS = true

	conn, err = createConnectionForURL(settings.URL, settings)
	require.Error(t, err)
	require.Nil(t, conn)
}
