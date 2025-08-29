import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Box } from '@mui/material';

import ErrorSummary from '../components/ErrorSummary.jsx';
import SectionOrganism from './SectionOrganism.jsx';
import { buildZodFromSchema } from '../adapters/zodFactory.js';
import { saveDraft } from '@gov/store';
import { setLastSavedAt, setSubmitting } from '@gov/store';

export default function FormShell({ schema, onSubmit }) {
  const dispatch = useDispatch();
  const formId = schema.id;
  const entityId = 'local-entity';
  const zodSchema = useMemo(() => buildZodFromSchema(schema), [schema]);

  const methods = useForm({
    resolver: zodResolver(zodSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: collectDefaults(schema),
  });
  const { handleSubmit, formState, watch } = methods;

  // Autosave draft (throttled simple impl)
  useEffect(() => {
    const sub = watch((values) => {
      const updatedAt = Date.now();
      dispatch(saveDraft({ key: `${formId}::${entityId}`, values, updatedAt }));
      dispatch(setLastSavedAt(updatedAt));
      localStorage.setItem(
        `draft::${formId}::${entityId}`,
        JSON.stringify({ values, updatedAt })
      );
    });
    return () => sub.unsubscribe();
  }, [watch, dispatch, formId]);

  const doSubmit = handleSubmit(async (values) => {
    dispatch(setSubmitting(true));
    try {
      await onSubmit(values);
    } finally {
      dispatch(setSubmitting(false));
    }
  });

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={doSubmit} noValidate sx={{ p: 2 }}>
        <ErrorSummary errors={formState.errors} />
        {(schema.sections || []).map((sec) => (
          <SectionOrganism key={sec.id} section={sec} />
        ))}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button type="submit" variant="contained">Submit</Button>
          <Button
            type="button"
            variant="outlined"
            onClick={() => methods.reset(collectDefaults(schema))}
          >
            Reset
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
}

function collectDefaults(schema) {
  const out = {};
  (schema.sections || []).forEach((s) =>
    s.fields?.forEach((f) => {
      out[f.id] = f.defaultValue ?? (f.type === 'checkbox' ? false : '');
    })
  );
  return out;
}
