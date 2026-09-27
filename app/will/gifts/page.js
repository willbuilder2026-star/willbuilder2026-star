"use client";

import WillStageShell from "../../../components/WillStageShell";
import StageHeader from "../../../components/StageHeader";
import StageNav from "../../../components/StageNav";
import ListStage from "../../../components/ListStage";
import { card } from "../../../components/styles";

export default function GiftsPage() {
  return (
    <WillStageShell>
      {(willId, userId) => (
        <div style={card}>
          <StageHeader
            n={7}
            title="Specific Gifts"
            desc="Named items or sums of money you want to leave to particular people — everything else goes to your residuary beneficiaries later."
          />

          <ListStage
            willId={willId}
            userId={userId}
            table="gifts"
            emptyLabel="No specific gifts added yet."
            fields={[
              { key: "item", label: "Item or amount (e.g. 'my car', '£1,000')", type: "text" },
              { key: "beneficiary", label: "Who it goes to", type: "text" },
            ]}
          />

          <StageNav backHref={`../pensions/?id=${willId}`} nextHref={`../charity/?id=${willId}`} />
        </div>
      )}
    </WillStageShell>
  );
}
