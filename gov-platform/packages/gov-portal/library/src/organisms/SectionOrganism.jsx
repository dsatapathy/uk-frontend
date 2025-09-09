import React from 'react';
import { Grid, Divider } from '@mui/material';
import FieldController from '../components/FieldController.jsx';
import TypographyX from '../atoms/TypographyX.jsx';

export default function SectionOrganism({ section }) {
  return (
    <section>
      {section.title ? (<><TypographyX variant="h6" sx={{ mt: 2 }}>{section.title}</TypographyX><Divider sx={{ mb: 1 }} /></>) : null}
      <Grid container spacing={2}>
        {section.fields?.map((f) => (
          <Grid item key={f.id} xs={f.layout?.xs || 12} sm={f.layout?.sm || 6} md={f.layout?.md || 6} lg={f.layout?.lg || 4}>
            <FieldController field={f} />
          </Grid>
        ))}
      </Grid>
    </section>
  );
}