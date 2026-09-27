"use client";

import WillStageShell from "../../../components/WillStageShell";
import StageHeader from "../../../components/StageHeader";
import StageNav from "../../../components/StageNav";
import ListStage from "../../../components/ListStage";
import { card } from "../../../components/styles";

export default function UpdatePage() {
  return (
    <WillStageShell>
      {(willId, userId) => (
        <div style={card}>
          <StageHeader
            n={15}
            title="Updating"
            desc="You get 30 days of free changes after signing. After that, updates are available at a low cost — log any change you want to make here."
          />

          <ListStage
            willId={willId}
            userId={userId}
            table="amendment_log"
            emptyLabel="No changes logged yet."
            fields={[
              {
                key: "kind",
                label: "Type of change",
                type: "select",
                default: "correction",
                options: [
                  ["correction", "Correction (fixing a mistake)"],
                  ["revision", "Revision (life change — new beneficiary, new address, etc.)"],
                ],
              },
              { key: "description", label: "What needs to change", type: "textarea" },
            ]}
          />

          <p style={{ fontSize: 13.5, color: "#7a7266", marginTop: 4 }}>
            To make the actual change, go back to the relevant stage above and update your answers, then revisit{" "}
            <a href={`../document/?id=${willId}`} style={{ color: "#7a5225" }}>
              Document Pack
            </a>{" "}
            and{" "}
            <a href={`../signing/?id=${willId}`} style={{ color: "#7a5225" }}>
              Signing
            </a>{" "}
            to produce and sign an updated version.
          </p>

          <StageNav backHref={`../signing/?id=${willId}`} nextHref={`../../app/`} nextLabel="Back to your Wills" />
        </div>
      )}
    </WillStageShell>
  );
}
