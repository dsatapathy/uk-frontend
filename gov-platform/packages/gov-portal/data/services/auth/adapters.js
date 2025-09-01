export const adapters = {
    default: (data) => ({
      tokens: {
        accessToken: data?.accessToken || data?.token,
        refreshToken: data?.refreshToken,
        tokenType: data?.tokenType || "Bearer",
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