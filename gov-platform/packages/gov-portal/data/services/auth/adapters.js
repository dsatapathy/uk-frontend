export const adapters = {
    default: (data) => ({
      tokens: {
        accessToken: data?.tokens?.accessToken || data?.token,
        refreshToken: data?.tokens?.refreshToken || data?.refreshToken,
        tokenType: data?.tokens?.tokenType || "Bearer",
      },
      user: data?.user,
    }),
  
    // Example: a backend that nests payload under `data`
    nested: (resp) => ({
      tokens: {
        accessToken: resp?.data?.access_token,
        refreshToken: resp?.data?.refresh_token,
        tokenType: "Bearer",
      },
      user: resp?.data?.user,
    }),
  };