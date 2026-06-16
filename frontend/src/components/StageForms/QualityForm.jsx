import React, { useState } from "react";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { edgeFetch, EDGE, supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";

const QualityForm = ({ ctx }) => {
  const { normalized, caseId, newStage, STAGES, onClose, onRefresh } = ctx;

  const [checklist, setChecklist] = useState({
    panels: false,
    wiring: false,
    inverter: false,
    earthing: false,
    output: false,
    netMeter: false,
  });
  
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  let nextStageText = newStage;
  if (!nextStageText) {
    const currentIndex = STAGES.indexOf(normalized.currentStage);
    if (currentIndex >= 0 && currentIndex < STAGES.length - 1) {
      nextStageText = STAGES[currentIndex + 1];
    }
  }

  const handleCheckboxChange = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if at least some critical Quality Assurance checks are confirmed
    const uncheckedCount = Object.values(checklist).filter(v => !v).length;
    if (uncheckedCount > 0) {
      const proceed = window.confirm(
        `There are still ${uncheckedCount} unchecked checklist items. Do you want to proceed anyway?`
      );
      if (!proceed) return;
    }

    setSubmitting(true);
    try {
      const itemsList = [];
      if (checklist.panels) itemsList.push("Panel Orientation/Tilt Verified");
      if (checklist.wiring) itemsList.push("Wiring/Routing Inspected");
      if (checklist.inverter) itemsList.push("Inverter Settings Verified");
      if (checklist.earthing) itemsList.push("Earthing/Grounding Confirmed");
      if (checklist.output) itemsList.push("System Output Tested");
      if (checklist.netMeter) itemsList.push("Net Meter Verified");

      const finalRemarks = `QA Checklist: [${itemsList.join(", ")}]. Observations: ${remarks || "System passed quality checks."}`;

      // 1. Insert QA Note to History
      await supabase.from("case_history").insert({
        case_id: caseId,
        stage: normalized.currentStage,
        action_type: "technical_qa_note",
        updated_by: localStorage.getItem("name") || "Quality QA",
        department: "quality",
        notes: finalRemarks,
      });

      // 2. Update Stage
      await edgeFetch(EDGE.workflow, {
        action: "update_stage",
        caseId,
        newStage: nextStageText,
        remarks: finalRemarks,
      });

      toast.success(`QA Approved! Case moved to ${nextStageText}!`);
      onClose();
      onRefresh();
    } catch (err) {
      toast.error(err.message || "Failed to process QA updates.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ paddingTop: "4px" }}>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <ClipboardCheck size={16} style={{ color: "#b91c1c" }} />
          <p style={{ fontSize: "11.5px", fontWeight: 700, color: "#b91c1c", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
            Quality Assurance Checklist & Approval
          </p>
        </div>

        {/* Checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", background: "#fef2f2", border: "1px solid #fecaca", padding: "14px", borderRadius: "10px", marginBottom: "14px" }}>
          {[
            { key: "panels", label: "Panel orientation and tilt verified" },
            { key: "wiring", label: "Wiring and cable routing inspected" },
            { key: "inverter", label: "Inverter installation & settings verified" },
            { key: "earthing", label: "Earthing and grounding confirmed" },
            { key: "output", label: "System output tested & within spec" },
            { key: "netMeter", label: "Net meter installation verified" },
          ].map((item) => (
            <label key={item.key} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "12.5px", color: "#451a03" }}>
              <input 
                type="checkbox" 
                checked={checklist[item.key]} 
                onChange={() => handleCheckboxChange(item.key)}
                style={{ width: "15px", height: "15px", accentColor: "#b91c1c" }}
              />
              {item.label}
            </label>
          ))}
        </div>

        {/* Notes */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "6px" }}>
            QA Notes & Observations
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Record detailed QA observations, issues found, or sign-off notes..."
            className="input"
            style={{ minHeight: "80px", resize: "vertical" }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary"
        style={{ width: "100%", display: "flex", justifyContent: "center", gap: "6px", backgroundColor: "#b91c1c", borderColor: "#b91c1c" }}
      >
        {submitting ? (
          <><div style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Processing…</>
        ) : (
          <>Approve & Move to {nextStageText} <ArrowRight style={{ width: "14px", height: "14px" }} /></>
        )}
      </button>
    </form>
  );
};

export default QualityForm;
