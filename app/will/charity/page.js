"use client";

import WillStageShell from "../../../components/WillStageShell";
import StageHeader from "../../../components/StageHeader";
import StageNav from "../../../components/StageNav";
import ListStage from "../../../components/ListStage";
import { card } from "../../../components/styles";

export default function CharityPage() {
  return (
    <WillStageShell>
      {(willId, userId) => (
        <div style={card}>
          <StageHeader n={8} title="Charitable Gifts" desc="Any amounts or items you'd like to leave to charity." />

          <ListStage
            willId={willId}
            userId={userId}
            table="charity_gifts"
            emptyLabel="No charitable gifts added yet."
            fields={[
              { key: "charity_name", label: "Charity name", type: "text" },
              { key: "amount", label: "Amount (e.g. '£500' or '10% of residue')", type: "text" },
            ]}
          />

          <StageNav backHref={`../gifts/?id=${willId}`} nextHref={`../residuary/?id=${willId}`} />
        </div>
      )}
    </WillStageShell>
  );
}
