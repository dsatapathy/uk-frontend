import React, { useMemo, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import TextFieldAtom from '../atoms/TextFieldAtom.jsx';
import CheckboxAtom from '../atoms/CheckboxAtom.jsx';
import AsyncAutocomplete from '../molecules/AsyncAutocomplete.jsx';
import { applyRulesForField } from '../rules/evaluate.js';

export default function FieldController({ field }) {
  const { watch, setValue } = useFormContext();
  const values = watch();
  const user = useSelector((s) => s.userContext);
  const flags = useSelector((s) => s.featureFlags);

  const ruleState = useMemo(() => applyRulesForField(field, { values, user, tenant: user && user.tenant, flags }), [field, values, user, flags]);

  // Apply derived values if any
  useEffect(() => {
    if (ruleState.derived !== undefined) setValue(field.id, ruleState.derived, { shouldValidate: true, shouldDirty: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruleState.derived]);

  return (
    <Controller
      name={field.id}
      defaultValue={field.defaultValue ?? ''}
      render={({ field: rhf, fieldState }) => switchByType(field, { rhf, fieldState, ruleState, values, user })}
    />
  );
}

function switchByType(field, { rhf, fieldState, ruleState, values, user }) {
  const common = { label: field.label, error: fieldState.error, disabled: ruleState.disabled, hidden: ruleState.hidden };
  const ctxDeps = pickDeps(field?.options?.dependsOn, values, user);

  switch (field.type) {
    case 'checkbox': return <CheckboxAtom rhf={rhf} {...common} />;
    case 'autocomplete': return <AsyncAutocomplete field={field} rhf={rhf} contextDeps={ctxDeps} {...common} />;
    case 'text':
    case 'password':
    case 'email':
    case 'tel':
    case 'url':
    case 'textarea':
    default:
      return <TextFieldAtom rhf={rhf} props={field.props} {...common} />;
  }
}

function pickDeps(depList = [], values, user) {
  const out = {};
  depList.forEach((d) => { if (d.startsWith('values.')) out[d] = getVal(values, d.replace('values.', '')); else if (d.startsWith('user.')) out[d] = getVal(user, d.replace('user.', '')); });
  return out;
}
function getVal(obj, path) { return path.split('.').reduce((a, k) => (a ? a[k] : undefined), obj); }