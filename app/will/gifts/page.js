"use client";

import WillStageShell from "../../../components/WillStageShell";
import WillPageFrame from "../../../components/WillPageFrame";
import ListStage from "../../../components/ListStage";

export default function GiftsPage() {
  return (
    <WillStageShell>
      {(willId, userId) => (
        <WillPageFrame
          willId={willId}
          current={7}
          desc="Named items or sums of money you want to leave to particular people — everything else goes to your residuary beneficiaries later."
        >
          <ListStage
            willId={willId}
            userId={userId}
            table="gifts"
            emptyLabel="No specific gifts added yet."
            fields={[
              { key: "item", label: "Item or amount (e.g. 'my car', '£1,000')", type: "text" },
              { key: "beneficiary", label: "Who it goes to", type: "person" },
            ]}
          />
        </WillPageFrame>
      )}
    </WillStageShell>
  );
}
