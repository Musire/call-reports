'use client';

import { useJwt } from "@/hooks";
import Dashboard from "./Dashboard";
import Intake from "./Intake";

export default function Rendering() {
  const { isAuthenticated, jwt } = useJwt();

  return (
    <div className="">
      {jwt ? (
        <Dashboard />
      ) : (
        <Intake />
      )}
    </div>
  );
}
