"use client";

import WillStageShell from "../../../components/WillStageShell";
import StageHeader from "../../../components/StageHeader";
import StageNav from "../../../components/StageNav";
import ListStage from "../../../components/ListStage";
import { card } from "../../../components/styles";

export default function ChildrenPage() {
  return (
    <WillStageShell>
      {(willId, userId) => (
        <div style={card}>
          <StageHeader
            n={3}
            title="Children & Guardians"
            desc="Your children, and who should look after them if they're still under 18 when you die."
          />

          <ListStage
            heading="Children"
            emptyLabel="No children added yet."
            willId={willId}
            userId={userId}
            table="children"
            fields={[
              { key: "name", label: "Child's full name", type: "text" },
              { key: "date_of_birth", label: "Date of birth", type: "date" },
            ]}
          />

          <ListStage
            heading="Guardians"
            emptyLabel="No guardians added yet."
            willId={willId}
            userId={userId}
            table="guardians"
            fields={[
              { key: "name", label: "Guardian's full name", type: "text" },
              { key: "address", label: "Guardian's address", type: "textarea" },
            ]}
          />

          <StageNav
            backHref={`../partner/?id=${willId}`}
            nextHref={`../executors/?id=${willId}`}
          />
        </div>
      )}
    </WillStageShell>
  );
}
