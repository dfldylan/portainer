package libkubectl

import (
	"context"
	"errors"
	"fmt"
	"os"
	"strings"

	"k8s.io/apimachinery/pkg/api/meta"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/apimachinery/pkg/util/yaml"
	"k8s.io/client-go/discovery"
	"k8s.io/client-go/dynamic"
	"k8s.io/client-go/restmapper"
)

// ApplyDynamic applies Kubernetes resources using the dynamic client with Server-Side Apply.
// This implementation is more performant than the kubectl library approach and provides
// better conflict resolution through Server-Side Apply (SSA).
func (c *Client) ApplyDynamic(ctx context.Context, manifests []string) (string, error) {
	// Create REST config from the factory
	restConfig, err := c.factory.ToRESTConfig()
	if err != nil {
		return "", fmt.Errorf("failed to create REST config: %w", err)
	}

	// Create dynamic client
	dynamicClient, err := dynamic.NewForConfig(restConfig)
	if err != nil {
		return "", fmt.Errorf("failed to create dynamic client: %w", err)
	}

	// Create discovery client for resource mapping
	discoveryClient, err := discovery.NewDiscoveryClientForConfig(restConfig)
	if err != nil {
		return "", fmt.Errorf("failed to create discovery client: %w", err)
	}

	// Create REST mapper
	groupResources, err := restmapper.GetAPIGroupResources(discoveryClient)
	if err != nil {
		return "", fmt.Errorf("failed to get API group resources: %w", err)
	}
	mapper := restmapper.NewDiscoveryRESTMapper(groupResources)

	var results []string
	var processErr error

	// Process each manifest
	for _, manifest := range manifests {
		manifest = strings.TrimSpace(manifest)
		if manifest == "" {
			continue
		}

		var content string
		// Check if manifest is a file path
		if isManifestFile(manifest) {
			data, err := os.ReadFile(manifest)
			if err != nil {
				processErr = errors.Join(processErr, fmt.Errorf("failed to read file %s: %w", manifest, err))
				continue
			}
			content = string(data)
		} else {
			content = manifest
		}

		// Split by document separator if multiple resources in one manifest
		resources := strings.SplitSeq(content, "\n---\n")

		for resource := range resources {
			resource = strings.TrimSpace(resource)
			if resource == "" {
				continue
			}

			result, err := c.applyResource(ctx, dynamicClient, mapper, []byte(resource))
			if err != nil {
				processErr = errors.Join(processErr, fmt.Errorf("failed to apply resource: %w", err))
				continue
			}
			results = append(results, result)
		}
	}

	// Build output message
	output := strings.Join(results, "\n")

	if processErr != nil {
		if len(results) == 0 {
			return "", fmt.Errorf("failed to apply resources: %s", processErr.Error())
		}
		return output, fmt.Errorf("partially applied resources with errors: %s", processErr.Error())
	}

	return output, nil
}

// applyResource applies a single resource using Server-Side Apply
func (c *Client) applyResource(ctx context.Context, dynamicClient dynamic.Interface, mapper meta.RESTMapper, resourceYAML []byte) (string, error) {
	// Decode YAML to unstructured object
	obj := &unstructured.Unstructured{}
	decoder := yaml.NewYAMLOrJSONDecoder(strings.NewReader(string(resourceYAML)), 4096)
	if err := decoder.Decode(obj); err != nil {
		return "", fmt.Errorf("failed to decode YAML: %w", err)
	}

	// Skip empty objects
	if obj.Object == nil {
		return "", nil
	}

	// Get GVK (GroupVersionKind) from the object
	gvk := obj.GroupVersionKind()
	if gvk.Empty() {
		return "", errors.New("unable to determine resource type")
	}

	// Map GVK to GVR (GroupVersionResource)
	mapping, err := mapper.RESTMapping(gvk.GroupKind(), gvk.Version)
	if err != nil {
		return "", fmt.Errorf("failed to map resource type %s: %w", gvk.String(), err)
	}

	// Get namespace (if applicable)
	namespace := obj.GetNamespace()
	name := obj.GetName()

	// Get the dynamic resource client
	var resourceClient dynamic.ResourceInterface
	if mapping.Scope.Name() == meta.RESTScopeNameNamespace {
		// Namespaced resource
		if namespace == "" {
			namespace = "default"
			obj.SetNamespace(namespace)
		}
		resourceClient = dynamicClient.Resource(mapping.Resource).Namespace(namespace)
	} else {
		// Cluster-scoped resource
		resourceClient = dynamicClient.Resource(mapping.Resource)
	}

	// Convert object to JSON for Server-Side Apply
	data, err := obj.MarshalJSON()
	if err != nil {
		return "", fmt.Errorf("failed to marshal object to JSON: %w", err)
	}

	// Apply using Server-Side Apply
	// This is more efficient and handles field ownership better than traditional apply
	patchOptions := metav1.PatchOptions{
		FieldManager: "portainer",
		Force:        boolPtr(true),
	}

	_, err = resourceClient.Patch(
		ctx,
		name,
		types.ApplyPatchType,
		data,
		patchOptions,
	)
	if err != nil {
		return "", fmt.Errorf("failed to apply %s %s/%s: %w", gvk.Kind, namespace, name, err)
	}

	// Format output message
	resourceType := strings.ToLower(gvk.Kind)
	return fmt.Sprintf("%s/%s configured", resourceType, name), nil
}

// boolPtr returns a pointer to a bool value
func boolPtr(b bool) *bool {
	return &b
}
