import { Suspense } from "react";
import GitHubCallbackClient from "./GithubCallbackClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Signing you in with GitHub…</div>}>
      <GitHubCallbackClient />
    </Suspense>
  );
}
