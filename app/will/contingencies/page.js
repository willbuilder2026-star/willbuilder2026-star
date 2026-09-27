"use client";

import WillStageShell from "../../../components/WillStageShell";
import WillPageFrame from "../../../components/WillPageFrame";

export default function ContingenciesPage() {
  return (
    <WillStageShell>
      {(willId) => (
        <WillPageFrame willId={willId} current={10} desc="What happens if a beneficiary can't inherit.">
          <div style={{ fontSize: 14.5, color: "#4a5867", lineHeight: 1.7 }}>
            <p>You've already covered the main contingency on the previous stage:</p>
            <ul style={{ paddingLeft: 20 }}>
              <li>
                Ticking <strong>"plan for this beneficiary predeceasing me"</strong> on a residuary beneficiary means their
                share passes to their own children instead (called a "per stirpes" gift), rather than being
                redistributed among the other beneficiaries.
              </li>
              <li>
                If your partner is set to inherit everything first, the residuary beneficiaries you listed only inherit if
                your partner doesn't survive you.
              </li>
            </ul>
            <p>
              If you want a different fallback arrangement for a beneficiary — for example, a gift going to a named
              alternative person rather than to their children — make a note of it on the next stage (Admin Notes) so it
              isn't missed, and mention it if you get this Will reviewed.
            </p>
          </div>
        </WillPageFrame>
      )}
    </WillStageShell>
  );
}
