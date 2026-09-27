"use client";

import WillStageShell from "../../../components/WillStageShell";
import StageHeader from "../../../components/StageHeader";
import StageNav from "../../../components/StageNav";
import ListStage from "../../../components/ListStage";
import { card } from "../../../components/styles";

export default function AdminNotesPage() {
  return (
    <WillStageShell>
      {(willId, userId) => (
        <div style={card}>
          <StageHeader
            n={11}
            title="Admin Notes"
            desc="Practical notes for your executors — funeral wishes, digital accounts, pets, anything useful that isn't a legal instruction."
          />

          <ListStage
            willId={willId}
            userId={userId}
            table="admin_notes"
            emptyLabel="No notes added yet."
            fields={[{ key: "note_text", label: "Note", type: "textarea" }]}
          />

          <StageNav backHref={`../contingencies/?id=${willId}`} nextHref={`../review/?id=${willId}`} />
        </div>
      )}
    </WillStageShell>
  );
}
