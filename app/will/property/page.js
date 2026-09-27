"use client";

import WillStageShell from "../../../components/WillStageShell";
import StageHeader from "../../../components/StageHeader";
import StageNav from "../../../components/StageNav";
import ListStage from "../../../components/ListStage";
import { card } from "../../../components/styles";

export default function PropertyPage() {
  return (
    <WillStageShell>
      {(willId, userId) => (
        <div style={card}>
          <StageHeader n={5} title="Property" desc="Any homes or land you own, and how you hold them." />

          <ListStage
            willId={willId}
            userId={userId}
            table="properties"
            emptyLabel="No property added yet."
            fields={[
              { key: "description", label: "Property description / address", type: "textarea" },
              {
                key: "ownership_type",
                label: "Ownership type",
                type: "select",
                default: "sole",
                options: [
                  ["sole", "Sole owner"],
                  ["joint_tenants", "Joint tenants (passes automatically to the other owner)"],
                  ["tenants_in_common", "Tenants in common (your share passes via your Will)"],
                ],
              },
            ]}
          />

          <StageNav
            backHref={`../executors/?id=${willId}`}
            nextHref={`../pensions/?id=${willId}`}
          />
        </div>
      )}
    </WillStageShell>
  );
}
