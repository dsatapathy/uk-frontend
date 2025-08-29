import React, { useMemo, useState } from 'react';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { debounce } from '../utils/debounce.js';
// import { fetchOptions } from '../../data/options.service.js';

export default function AsyncAutocomplete({ field, rhf, label, error, disabled, hidden, contextDeps }) {
  const [query, setQuery] = useState('');
  const deps = contextDeps || {};

  const { data = [], isFetching } = useQuery({
    queryKey: ['options', field.options?.endpointKey, query, deps],
    // queryFn: () => fetchOptions({ endpointKey: field.options?.endpointKey, q: query, deps }),
    enabled: !!field.options?.endpointKey && !hidden && !disabled,
    staleTime: 10 * 60 * 1000,
  });

  const onInputChange = useMemo(() => debounce((_, v) => setQuery(v || ''), 300), []);

  if (hidden) return null;
  return (
    <Autocomplete
      loading={isFetching}
      options={data}
      value={null}
      onChange={(_, v) => rhf.onChange(v ? v[field.options?.valueKey] : null)}
      getOptionLabel={(o) => (o?.[field.options?.labelKey] ?? '')}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!error}
          helperText={error?.message}
          onInput={onInputChange}
          InputProps={{ ...params.InputProps, endAdornment: (<>{isFetching ? <CircularProgress size={18} /> : null}{params.InputProps.endAdornment}</>) }}
        />
      )}
    />
  );
}