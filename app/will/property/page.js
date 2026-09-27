"use client";

import WillStageShell from "../../../components/WillStageShell";
import WillPageFrame from "../../../components/WillPageFrame";
import ListStage from "../../../components/ListStage";

export default function PropertyPage() {
  return (
    <WillStageShell>
      {(willId, userId) => (
        <WillPageFrame willId={willId} current={5} desc="Any homes or land you own — including property abroad — and how you hold them.">
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
        </WillPageFrame>
      )}
    </WillStageShell>
  );
}
