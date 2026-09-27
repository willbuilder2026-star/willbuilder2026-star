"use client";

import WillStageShell from "../../../components/WillStageShell";
import StageHeader from "../../../components/StageHeader";
import StageNav from "../../../components/StageNav";
import ListStage from "../../../components/ListStage";
import { card } from "../../../components/styles";

export default function ExecutorsPage() {
  return (
    <WillStageShell>
      {(willId, userId) => (
        <div style={card}>
          <StageHeader
            n={4}
            title="Executors"
            desc="Who will carry out the wishes in your Will. Add a reserve executor as a backup in case your first choice can't act."
          />

          <ListStage
            willId={willId}
            userId={userId}
            table="executors"
            emptyLabel="No executors added yet."
            fields={[
              { key: "name", label: "Executor's full name", type: "text" },
              { key: "address", label: "Executor's address", type: "textarea" },
              {
                key: "role",
                label: "Role",
                type: "select",
                default: "primary",
                options: [
                  ["primary", "Primary"],
                  ["reserve", "Reserve (backup)"],
                ],
              },
            ]}
          />

          <StageNav
            backHref={`../children/?id=${willId}`}
            nextHref={`../property/?id=${willId}`}
          />
        </div>
      )}
    </WillStageShell>
  );
}
