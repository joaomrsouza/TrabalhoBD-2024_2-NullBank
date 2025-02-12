"use client";

import { PageLoader } from "@/components/page-loader";
import { actions } from "@/server/actions";
import React from "react";

export default function Logout() {
  React.useEffect(() => {
    void actions.auth.logout();
  }, []);

  return <PageLoader />;
}
