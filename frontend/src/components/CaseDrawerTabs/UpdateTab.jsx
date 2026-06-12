/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { X, ArrowRight, MessageSquare, AlertTriangle, CheckCircle2, User, Phone, MapPin, Zap, FileText, ClipboardList, UserCheck, History, Package, Plus, Trash2, IndianRupee, FileCheck, AlertOctagon, Printer, Star, Clock, Navigation, Download, Edit2, Lock, RefreshCw, Microscope, Calculator, Headphones, Link as LinkIcon, Send } from "lucide-react";
import CaseTimeline from "../CaseTimeline";
import PaymentTracker from "../PaymentTracker";
import { edgeFetch, EDGE, supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { APP_CONFIG } from "../../config";

const UpdateTab = ({ ctx }) => {
  const {
    STAGES,
    TABS,
    accountsEditMode,
    accountsNotes,
    accountsSaving,
    accountsVerifyLoading,
    activeTab,
    assignLoading,
    canUpdate,
    caseData,
    caseId,
    crmNote,
    crmSaving,
    customerDocs,
    daysAtStage,
    delayLoading,
    delayReason,
    deptEmployees,
    dispatchDetails,
    dispatchItems,
    dispatchLoading,
    docStatuses,
    docs,
    downloadZipLoading,
    fData,
    feedbackList,
    feedbackLoading,
    feedbackSubmitting,
    financeEditMode,
    financeLoading,
    geoError,
    geoLoading,
    geoLocation,
    handleAccountsVerify,
    handleAddDispatchItem,
    handleCaptureLocation,
    handleDispatchItemChange,
    handleDispatchSubmit,
    handleDocStatusChange,
    handleDownloadPDF,
    handleDownloadZip,
    handleFeedbackSubmit,
    handleFinanceUpdate,
    handleMarkDelayed,
    handleQuotationVerify,
    handleRemoveDispatchItem,
    handleResendTrackingId,
    handleSubsidyUpdate,
    handleUpdateSubmit,
    hasDocError,
    hasFinanceError,
    hasQuotationError,
    history,
    inventoryList,
    isBankingStage,
    isCompleted,
    isDelayRisk,
    isFinanceApproved,
    isRegStage,
    newFeedback,
    newStage,
    normalized,
    onClose,
    onRefresh,
    ownerDept,
    ownerRole,
    pType,
    pct,
    portalGenerating,
    portalLink,
    printLoading,
    printRef,
    quotationAmountEdit,
    quotationEditMode,
    quotationVerifyLoading,
    remarks,
    resendLoading,
    role,
    selectedEmployee,
    setAccountsEditMode,
    setAccountsNotes,
    setAccountsSaving,
    setAccountsVerifyLoading,
    setActiveTab,
    setAssignLoading,
    setCrmNote,
    setCrmSaving,
    setCustomerDocs,
    setDelayLoading,
    setDelayReason,
    setDeptEmployees,
    setDispatchDetails,
    setDispatchItems,
    setDispatchLoading,
    setDocStatuses,
    setDownloadZipLoading,
    setFData,
    setFeedbackList,
    setFeedbackLoading,
    setFeedbackSubmitting,
    setFinanceEditMode,
    setFinanceLoading,
    setGeoError,
    setGeoLoading,
    setGeoLocation,
    setHistory,
    setInventoryList,
    setNewFeedback,
    setNewStage,
    setPortalGenerating,
    setPortalLink,
    setPrintLoading,
    setQuotationAmountEdit,
    setQuotationEditMode,
    setQuotationVerifyLoading,
    setRemarks,
    setResendLoading,
    setSelectedEmployee,
    setShowDelayForm,
    setSubsidyData,
    setSubsidyLoading,
    setTechnicalNotes,
    setTechnicalSaving,
    setUpdateLoading,
    showDelayForm,
    stageIdx,
    stageStartTime,
    subsidyData,
    subsidyLoading,
    technicalNotes,
    technicalSaving,
    unverifiedDocs,
    updateLoading
  } = ctx;

  return (
    <div>
              {/* READ-ONLY BANNER — shown when this role doesn't own the current stage */}
              {!canUpdate && !isCompleted && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    padding: "18px 20px",
                    borderRadius: "14px",
                    marginBottom: "20px",
                    background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
                    border: "1px solid #fde68a",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: "#f59e0b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AlertTriangle
                      style={{ width: "18px", height: "18px", color: "#fff" }}
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "13.5px",
                        fontWeight: 700,
                        color: "#92400e",
                        marginBottom: "4px",
                      }}
                    >
                      View-Only Access
                    </p>
                    <p
                      style={{
                        fontSize: "12.5px",
                        color: "#b45309",
                        lineHeight: 1.5,
                      }}
                    >
                      This customer is currently with{" "}
                      <strong>{ownerDept}</strong>. Your department has
                      completed its tasks for this record. Updates can only be
                      made by the assigned department.
                    </p>
                  </div>
                </div>
              )}

              {/* Stage info (always visible) */}
              {!isCompleted && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "14px",
                    borderRadius: "12px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <p
                      style={{
                        fontSize: "10.5px",
                        color: "#94a3b8",
                        marginBottom: "6px",
                      }}
                    >
                      Current stage
                    </p>
                    <span
                      style={{
                        display: "block",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        color: "#475569",
                        background: "#fff",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      {normalized.currentStage}
                    </span>
                  </div>
                  {canUpdate && (
                    <>
                      <ArrowRight
                        style={{
                          width: "16px",
                          height: "16px",
                          color: "#cbd5e1",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <p
                          style={{
                            fontSize: "10.5px",
                            color: "var(--color-primary)",
                            fontWeight: 600,
                            marginBottom: "6px",
                          }}
                        >
                          Moving to
                        </p>
                        <span
                          style={{
                            display: "block",
                            fontSize: "11.5px",
                            fontWeight: 600,
                            color: "#065f46",
                            background: "#d1fae5",
                            padding: "6px 10px",
                            borderRadius: "8px",
                            border: "1px solid #a7f3d0",
                          }}
                        >
                          {newStage}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── Delay Risk Banner (shown when 2+ days at stage but not yet flagged) ── */}
              {isDelayRisk && canUpdate && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    marginBottom: "16px",
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                  }}
                >
                  <Clock
                    style={{
                      width: "16px",
                      height: "16px",
                      color: "#d97706",
                      flexShrink: 0,
                      marginTop: "1px",
                    }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 700,
                        color: "#92400e",
                        marginBottom: "2px",
                      }}
                    >
                      Delay Risk — {daysAtStage} day
                      {daysAtStage !== 1 ? "s" : ""} at this stage
                    </p>
                    <p
                      style={{
                        fontSize: "11.5px",
                        color: "#b45309",
                        lineHeight: 1.4,
                      }}
                    >
                      This case has been in{" "}
                      <strong>{normalized.currentStage}</strong> for{" "}
                      {daysAtStage} days. Consider flagging a delay if progress
                      is blocked.
                    </p>
                  </div>
                </div>
              )}

              {/* ── ADMIN: Assign to Employee ── */}
              {role === "admin" && (
                <div
                  style={{
                    marginBottom: "20px",
                    padding: "14px 16px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11.5px",
                        fontWeight: 700,
                        color: "#475569",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <UserCheck
                        style={{
                          width: "13px",
                          height: "13px",
                          color: "#6366f1",
                        }}
                      />
                      Assign to Employee
                    </p>
                    {normalized.assignedTo && (
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#6366f1",
                          background: "#eef2ff",
                          padding: "2px 8px",
                          borderRadius: "20px",
                          border: "1px solid #c7d2fe",
                        }}
                      >
                        Currently: {normalized.assignedTo}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      onFocus={async () => {
                        if (deptEmployees.length === 0) {
                          try {
                            const emps = await edgeFetch(EDGE.workflow, {
                              action: "get_dept_employees",
                              caseId: normalized.caseId,
                            });
                            setDeptEmployees(emps || []);
                          } catch {
                            /* silently fail */
                          }
                        }
                      }}
                      className="input"
                      style={{
                        flex: 1,
                        fontSize: "12.5px",
                        paddingTop: "7px",
                        paddingBottom: "7px",
                      }}
                    >
                      <option value="">— Select employee —</option>
                      {deptEmployees.map((emp) => (
                        <option key={emp.id} value={emp.name}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={assignLoading || !selectedEmployee}
                      onClick={async () => {
                        setAssignLoading(true);
                        try {
                          await edgeFetch(EDGE.workflow, {
                            action: "assign",
                            caseId: normalized.caseId,
                            assignedTo: selectedEmployee,
                          });
                          toast.success(`Case assigned to ${selectedEmployee}`);
                          onRefresh();
                        } catch (err) {
                          toast.error(err.message || "Could not assign case.");
                        } finally {
                          setAssignLoading(false);
                        }
                      }}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        border: "none",
                        background:
                          assignLoading || !selectedEmployee
                            ? "#e2e8f0"
                            : "#6366f1",
                        color:
                          assignLoading || !selectedEmployee
                            ? "#94a3b8"
                            : "#fff",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor:
                          assignLoading || !selectedEmployee
                            ? "not-allowed"
                            : "pointer",
                        whiteSpace: "nowrap",
                        transition: "all 0.15s",
                      }}
                    >
                      {assignLoading ? "Saving…" : "Assign"}
                    </button>
                    {normalized.assignedTo && (
                      <button
                        type="button"
                        onClick={async () => {
                          setAssignLoading(true);
                          try {
                            await edgeFetch(EDGE.workflow, {
                              action: "assign",
                              caseId: normalized.caseId,
                              assignedTo: "",
                            });
                            toast.success("Assignment removed");
                            setSelectedEmployee("");
                            onRefresh();
                          } catch (err) {
                            toast.error(err.message || "Error");
                          } finally {
                            setAssignLoading(false);
                          }
                        }}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "8px",
                          border: "1px solid #fecdd3",
                          background: "#fff1f2",
                          color: "#be123c",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        <X style={{ width: "12px", height: "12px" }} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {isCompleted ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <CheckCircle2
                    style={{
                      width: "40px",
                      height: "40px",
                      color: "var(--color-primary)",
                      margin: "0 auto 12px",
                    }}
                  />
                  <p
                    style={{
                      fontWeight: 700,
                      color: "#0f172a",
                      fontSize: "15px",
                    }}
                  >
                    Customer Completed
                  </p>
                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "13px",
                      marginTop: "6px",
                    }}
                  >
                    This project has been fully processed.
                  </p>
                </div>
              ) : canUpdate ? (
                <>
                  <form onSubmit={handleUpdateSubmit}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "12.5px",
                        fontWeight: 600,
                        color: "#475569",
                        marginBottom: "8px",
                      }}
                    >
                      <FileText
                        style={{
                          width: "13px",
                          height: "13px",
                          color: "#94a3b8",
                        }}
                      />
                      Handoff note for next team (required)
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      required
                      placeholder="What was completed? What should the next department know?"
                      className="input"
                      style={{ minHeight: "100px", resize: "vertical" }}
                    />
                    {hasDocError && (
                      <div
                        style={{
                          marginTop: "14px",
                          padding: "12px 16px",
                          background: "#fef2f2",
                          border: "1px solid #fecaca",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "#b91c1c",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      >
                        <AlertOctagon
                          style={{
                            width: "16px",
                            height: "16px",
                            flexShrink: 0,
                          }}
                        />
                        Document not verified kindly verify first then proceed
                      </div>
                    )}

                    {/* ── Step 2: Quotation Verification (Registration stage only) ─────────── */}
                    {isRegStage &&
                      (role === "registration" || role === "admin") && (
                        <div
                          style={{
                            marginTop: "20px",
                            padding: "16px",
                            background: normalized.quotationVerified
                              ? "#f0fdf4"
                              : "#fffbeb",
                            border: `1px solid ${normalized.quotationVerified ? "#bbf7d0" : "#fde68a"}`,
                            borderRadius: "12px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "12px",
                            }}
                          >
                            <p
                              style={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: normalized.quotationVerified
                                  ? "#166534"
                                  : "#92400e",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                margin: 0,
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              {normalized.quotationVerified ? (
                                <CheckCircle2
                                  style={{ width: "14px", height: "14px" }}
                                />
                              ) : (
                                <AlertOctagon
                                  style={{ width: "14px", height: "14px" }}
                                />
                              )}
                              Step 2 — Quotation Verification
                            </p>
                            {/* Edit button: always shown to admin; hidden to registration after verify */}
                            {normalized.quotationVerified &&
                              !quotationEditMode &&
                              (role === "admin" ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setQuotationEditMode(true);
                                    setQuotationAmountEdit(
                                      String(normalized.quotationAmount || ""),
                                    );
                                  }}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "4px 10px",
                                    borderRadius: "6px",
                                    border: "1px solid #bbf7d0",
                                    background: "#dcfce7",
                                    color: "#16a34a",
                                    fontSize: "11.5px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  <Edit2
                                    style={{ width: "12px", height: "12px" }}
                                  />{" "}
                                  Edit
                                </button>
                              ) : (
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "4px 10px",
                                    borderRadius: "6px",
                                    border: "1px solid #bbf7d0",
                                    background: "#f0fdf4",
                                    color: "#16a34a",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                  }}
                                >
                                  <Lock
                                    style={{ width: "11px", height: "11px" }}
                                  />{" "}
                                  Admin Only
                                </span>
                              ))}
                          </div>

                          {normalized.quotationVerified &&
                          !quotationEditMode ? (
                            /* ── VERIFIED STATE: Green card, stays in-place, no popup ── */
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              <CheckCircle2
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  color: "#16a34a",
                                  flexShrink: 0,
                                }}
                              />
                              <div>
                                <p
                                  style={{
                                    fontSize: "11px",
                                    color: "#166534",
                                    fontWeight: 600,
                                    marginBottom: "2px",
                                  }}
                                >
                                  Verified ✓ — No further action needed
                                </p>
                                <p
                                  style={{
                                    fontSize: "18px",
                                    fontWeight: 800,
                                    color: "#14532d",
                                  }}
                                >
                                  ₹
                                  {Number(
                                    normalized.quotationAmount || 0,
                                  ).toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>
                          ) : quotationEditMode ? (
                            /* ── EDIT MODE (admin only after verify) ── */
                            <div>
                              <p
                                style={{
                                  fontSize: "12.5px",
                                  color: "#475569",
                                  marginBottom: "10px",
                                }}
                              >
                                Edit the quotation amount and re-verify:
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "10px",
                                  alignItems: "center",
                                }}
                              >
                                <input
                                  type="number"
                                  value={quotationAmountEdit}
                                  onChange={(e) =>
                                    setQuotationAmountEdit(e.target.value)
                                  }
                                  placeholder="Enter quotation amount"
                                  className="input"
                                  style={{ flex: 1 }}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQuotationVerify(quotationAmountEdit)
                                  }
                                  disabled={
                                    quotationVerifyLoading ||
                                    !quotationAmountEdit
                                  }
                                  style={{
                                    padding: "9px 16px",
                                    borderRadius: "8px",
                                    border: "none",
                                    background: "#16a34a",
                                    color: "#fff",
                                    fontSize: "12.5px",
                                    fontWeight: 700,
                                    cursor: quotationVerifyLoading
                                      ? "wait"
                                      : "pointer",
                                    opacity: !quotationAmountEdit ? 0.55 : 1,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {quotationVerifyLoading
                                    ? "Saving…"
                                    : "Re-Verify"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setQuotationEditMode(false);
                                    setQuotationAmountEdit("");
                                  }}
                                  style={{
                                    padding: "9px 12px",
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0",
                                    background: "#f1f5f9",
                                    color: "#475569",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* ── UNVERIFIED STATE: Show amount + Edit button + Verify button ── */
                            <div>
                              <p
                                style={{
                                  fontSize: "12.5px",
                                  color: "#92400e",
                                  marginBottom: "8px",
                                }}
                              >
                                Call the customer to confirm, then edit if
                                needed and verify:
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  marginBottom: "12px",
                                  flexWrap: "wrap",
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: "22px",
                                    fontWeight: 800,
                                    color: "#78350f",
                                    margin: 0,
                                  }}
                                >
                                  ₹
                                  {Number(
                                    normalized.quotationAmount || 0,
                                  ).toLocaleString("en-IN")}
                                </p>
                                {/* Edit amount BEFORE verify */}
                                {!quotationEditMode && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setQuotationEditMode(true);
                                      setQuotationAmountEdit(
                                        String(
                                          normalized.quotationAmount || "",
                                        ),
                                      );
                                    }}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px",
                                      padding: "5px 12px",
                                      borderRadius: "6px",
                                      border: "1px solid #fde68a",
                                      background: "#fef9c3",
                                      color: "#92400e",
                                      fontSize: "11.5px",
                                      fontWeight: 600,
                                      cursor: "pointer",
                                    }}
                                  >
                                    <Edit2
                                      style={{ width: "12px", height: "12px" }}
                                    />{" "}
                                    Edit Amount
                                  </button>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleQuotationVerify(
                                    normalized.quotationAmount,
                                  )
                                }
                                disabled={quotationVerifyLoading}
                                style={{
                                  width: "100%",
                                  padding: "10px",
                                  borderRadius: "8px",
                                  border: "none",
                                  background: "#16a34a",
                                  color: "#fff",
                                  fontSize: "13px",
                                  fontWeight: 700,
                                  cursor: quotationVerifyLoading
                                    ? "wait"
                                    : "pointer",
                                }}
                              >
                                {quotationVerifyLoading
                                  ? "Verifying…"
                                  : "✓ Mark Quotation as Verified"}
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                    {hasQuotationError && !hasDocError && (
                      <div
                        style={{
                          marginTop: "10px",
                          padding: "12px 16px",
                          background: "#fef2f2",
                          border: "1px solid #fecaca",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "#b91c1c",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      >
                        <AlertOctagon
                          style={{
                            width: "16px",
                            height: "16px",
                            flexShrink: 0,
                          }}
                        />
                        Please verify the quotation amount (Step 2 above) before
                        proceeding.
                      </div>
                    )}
                    {hasFinanceError && (
                      <div
                        style={{
                          marginTop: "14px",
                          padding: "12px 16px",
                          background: "#fef2f2",
                          border: "1px solid #fecaca",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "#b91c1c",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      >
                        <AlertOctagon
                          style={{
                            width: "16px",
                            height: "16px",
                            flexShrink: 0,
                          }}
                        />
                        Finance not approved! Update and approve the Loan or
                        Cash details to proceed.
                      </div>
                    )}

                    {/* ── Geo-location capture (field_installation only) ──────────────────────── */}
                    {role === "field_installation" && (
                      <div
                        style={{
                          marginTop: "16px",
                          padding: "14px 16px",
                          borderRadius: "12px",
                          background: "#f0f9ff",
                          border: "1px solid #bae6fd",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "11.5px",
                            fontWeight: 700,
                            color: "#0369a1",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            marginBottom: "10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <Navigation
                            style={{ width: "13px", height: "13px" }}
                          />
                          Site Location (Optional)
                        </p>
                        {geoLocation ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "8px",
                            }}
                          >
                            <div>
                              <p
                                style={{
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  color: "#075985",
                                  marginBottom: "2px",
                                }}
                              >
                                ✓ Location captured ({geoLocation.accuracy}m
                                accuracy)
                              </p>
                              <a
                                href={`https://maps.google.com/?q=${geoLocation.lat},${geoLocation.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: "11px",
                                  color: "#0284c7",
                                  textDecoration: "none",
                                }}
                              >
                                {geoLocation.lat}, {geoLocation.lng} ↗
                              </a>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setGeoLocation(null);
                                setGeoError("");
                              }}
                              style={{
                                fontSize: "11px",
                                color: "#64748b",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                            >
                              Clear
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={handleCaptureLocation}
                              disabled={geoLoading}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "7px",
                                padding: "8px 14px",
                                borderRadius: "8px",
                                background: geoLoading ? "#e0f2fe" : "#0ea5e9",
                                color: geoLoading ? "#075985" : "#fff",
                                border: "none",
                                fontSize: "12.5px",
                                fontWeight: 600,
                                cursor: geoLoading ? "wait" : "pointer",
                              }}
                            >
                              <Navigation
                                style={{ width: "13px", height: "13px" }}
                              />
                              {geoLoading
                                ? "Getting location…"
                                : "Capture GPS Location"}
                            </button>
                            {geoError && (
                              <p
                                style={{
                                  fontSize: "11px",
                                  color: "#dc2626",
                                  marginTop: "6px",
                                }}
                              >
                                {geoError}
                              </p>
                            )}
                            <p
                              style={{
                                fontSize: "10.5px",
                                color: "#64748b",
                                marginTop: "6px",
                              }}
                            >
                              Location is appended to handoff remarks for field
                              records.
                            </p>
                          </>
                        )}
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "14px",
                      }}
                    >
                      <button
                        type="submit"
                        disabled={
                          updateLoading || hasDocError || hasFinanceError
                        }
                        className="btn btn-primary"
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          opacity: hasDocError || hasFinanceError ? 0.6 : 1,
                          cursor:
                            hasDocError || hasFinanceError
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        {updateLoading ? (
                          <>
                            <div
                              style={{
                                width: "14px",
                                height: "14px",
                                border: "2px solid rgba(255,255,255,0.3)",
                                borderTopColor: "#fff",
                                borderRadius: "50%",
                                animation: "spin 0.8s linear infinite",
                              }}
                            />
                            Updating…
                          </>
                        ) : (
                          <>
                            Confirm & move to next stage{" "}
                            <ArrowRight
                              style={{ width: "14px", height: "14px" }}
                            />
                          </>
                        )}
                      </button>
                    </div>

                    {/* ── Resend Tracking ID — shown at Phone Verification Done stage ── */}
                    {normalized.currentStage === "Phone Verification Done" &&
                      (role === "registration" || role === "admin") && (
                        <div
                          style={{
                            marginTop: "12px",
                            padding: "12px 14px",
                            borderRadius: "10px",
                            background: "#f0f9ff",
                            border: "1px solid #bae6fd",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "10px",
                          }}
                        >
                          <div>
                            <p
                              style={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: "#0369a1",
                                marginBottom: "2px",
                              }}
                            >
                              Customer not received tracking ID?
                            </p>
                            <p style={{ fontSize: "11px", color: "#0284c7" }}>
                              Manually resend the tracking ID via email as a
                              fallback.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleResendTrackingId}
                            disabled={resendLoading}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "7px 14px",
                              borderRadius: "8px",
                              border: "none",
                              background: resendLoading ? "#e0f2fe" : "#0ea5e9",
                              color: "#fff",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: resendLoading ? "wait" : "pointer",
                              whiteSpace: "nowrap",
                              flexShrink: 0,
                            }}
                          >
                            {resendLoading ? (
                              <>
                                <div
                                  style={{
                                    width: "12px",
                                    height: "12px",
                                    border: "2px solid rgba(255,255,255,0.3)",
                                    borderTopColor: "#fff",
                                    borderRadius: "50%",
                                    animation: "spin 0.8s linear infinite",
                                  }}
                                />
                                Sending…
                              </>
                            ) : (
                              <>
                                <RefreshCw
                                  style={{ width: "12px", height: "12px" }}
                                />
                                Resend Tracking ID
                              </>
                            )}
                          </button>
                        </div>
                      )}
                  </form>

                  {/* Delay section */}
                  <div
                    style={{
                      marginTop: "20px",
                      borderTop: "1px solid #f1f5f9",
                      paddingTop: "18px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11.5px",
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "10px",
                      }}
                    >
                      Delay flag
                    </p>
                    {normalized.status === "Delayed" ? (
                      <div
                        style={{
                          padding: "12px 14px",
                          borderRadius: "10px",
                          background: "#fff7ed",
                          border: "1px solid #fed7aa",
                          marginBottom: "10px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "8px",
                            marginBottom: "10px",
                          }}
                        >
                          <AlertTriangle
                            style={{
                              width: "14px",
                              height: "14px",
                              color: "#ea580c",
                              flexShrink: 0,
                              marginTop: "2px",
                            }}
                          />
                          <div>
                            <p
                              style={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: "#9a3412",
                                marginBottom: "3px",
                              }}
                            >
                              Currently marked as Delayed
                            </p>
                            {normalized.delayReason && (
                              <p
                                style={{
                                  fontSize: "12px",
                                  color: "#c2410c",
                                  fontStyle: "italic",
                                }}
                              >
                                "{normalized.delayReason}"
                              </p>
                            )}
                            {normalized.markedDelayedBy && (
                              <p
                                style={{
                                  fontSize: "11px",
                                  color: "#c2410c",
                                  opacity: 0.75,
                                  marginTop: "2px",
                                }}
                              >
                                — by {normalized.markedDelayedBy}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleMarkDelayed(true)}
                          disabled={delayLoading}
                          className="btn"
                          style={{
                            background: "#dcfce7",
                            color: "#15803d",
                            borderColor: "#bbf7d0",
                            width: "fit-content",
                            padding: "6px 12px",
                            fontSize: "12px",
                          }}
                        >
                          <CheckCircle2
                            style={{ width: "13px", height: "13px" }}
                          />{" "}
                          Remove delay flag
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setShowDelayForm((v) => !v)}
                          className="btn"
                          style={{
                            color: showDelayForm ? "#ea580c" : "#b45309",
                            background: showDelayForm
                              ? "#fff7ed"
                              : "transparent",
                            borderColor: showDelayForm
                              ? "#fed7aa"
                              : "transparent",
                            width: "fit-content",
                            padding: "6px 12px",
                            fontSize: "12px",
                          }}
                        >
                          <AlertTriangle
                            style={{ width: "13px", height: "13px" }}
                          />
                          {showDelayForm ? "Cancel" : "Flag as Delayed"}
                        </button>
                        {showDelayForm && (
                          <div
                            style={{
                              marginTop: "10px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
                            <textarea
                              value={delayReason}
                              onChange={(e) => setDelayReason(e.target.value)}
                              placeholder="Reason for delay…"
                              className="input"
                              style={{ minHeight: "72px", resize: "vertical" }}
                            />
                            <button
                              onClick={() => handleMarkDelayed(false)}
                              disabled={delayLoading || !delayReason.trim()}
                              className="btn btn-primary"
                              style={{
                                background: "var(--amber)",
                                color: "#fff",
                                border: "none",
                                opacity:
                                  delayLoading || !delayReason.trim()
                                    ? 0.55
                                    : 1,
                              }}
                            >
                              Confirm delay
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              ) : null}
            </div>
  );
};

export default UpdateTab;
