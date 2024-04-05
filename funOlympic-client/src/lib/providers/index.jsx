"use client";
import { SnackbarProvider } from "notistack";
import { SnackbarUtilsConfigurator } from "@/components/common/snackbar";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { AuthProvider } from "../context/auth";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children, authSession }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <SnackbarUtilsConfigurator />
          <SessionProvider session={authSession}>{children}</SessionProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
