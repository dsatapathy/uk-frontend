# @gov/core

## Registry

The runtime registry stores components, actions, guards, and layouts that can be shared across the portal.

### Registering

Use `registerComponent`, `registerAction`, `registerGuard`, and `registerLayout` to add items. Duplicate names trigger a warning with a stack trace for easier debugging.

### Retrieving

Use the corresponding `get*` functions to retrieve registered items. These throw descriptive errors if the name is missing or not yet registered.

See [documentation](https://docs.gov-portal.dev/registry) for more details.