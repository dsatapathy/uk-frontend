import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { getComponent } from "@gov/core";
const AcknowledgePage = () => {
  const { search } = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(search);
  const AppButton = getComponent("AppButton");
  // Core fields
  const status = params.get('status') || 'success';
  const heading = params.get('heading') || 'Submission Successful';
  const form = params.get('form') || '';
  const body = params.get('body') || 'Your request has been received and is being processed.';

  // Collect all other params dynamically
  const details = {};
  params.forEach((value, key) => {
    if (!['status', 'heading', 'form', 'body'].includes(key)) {
      details[key] = value;
    }
  });

  const iconUrl =
    status === 'success'
      ? 'https://cdn-icons-png.flaticon.com/512/845/845646.png'
      : 'https://cdn-icons-png.flaticon.com/512/463/463612.png';

  const handleBackHome = () => {
    history.push('/landing');
  };
  function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/\b\w/g, str => str.toUpperCase())
    .trim();
}
  // background colors based on status
  const bgColor = status === 'success' ? '#e6f9ec' : '#fdeaea';
  const borderColor = status === 'success' ? '#15803d' : '#dc3545';

  return (
    <div>
    <div
      style={{
        maxWidth: '100%',
        marginBottom: '80px',
        marginLeft: 'auto',
        marginRight: 'auto',
        // margin: '80px auto',
        padding: 32,
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 8,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        textAlign: 'center',

      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <img src={iconUrl} alt={status} style={{ width: 48, marginRight: 16 }} />
        <h2 style={{ color: borderColor, margin: 0 }}>{heading}</h2>
      </div>
      {form && <h4 style={{ marginBottom: 8 }}>{form}</h4>}
      <p style={{ marginBottom: 16 }}>{body}</p>

      {/* Generic details section */}
      {Object.keys(details).length > 0 && (
        <div
          style={{
            textAlign: 'left',
            padding: 16,
          }}
        >
          <h4 style={{ marginBottom: 12 }}>Details are as follows:</h4>
          {Object.entries(details).map(([key, value]) => (
          <div
              key={key}
              style={{
                display: "block",
                marginBottom: 12,      // space between entries
                lineHeight: 1.4,
              }}
            >
              <strong style={{ marginRight: 8 }}>{formatLabel(key)}:</strong>
              <span>{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
      
      {/* Independent fixed button - visible regardless of container layout */}
      <div
        aria-hidden={false}
        style={{
          position: "fixed",
          right: 24,
          bottom: 16,
          zIndex: 1400, // above most content
          textAlign: "right",
        }}
      >
        <AppButton onClick={handleBackHome}>
          Back to Home
        </AppButton>
      </div>
    </div>
  );
};

export default AcknowledgePage;
