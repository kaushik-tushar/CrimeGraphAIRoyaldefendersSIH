import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.postgres import get_db
from app.models.user import User
from app.schemas.assistant import (
    AssistantQueryRequest,
    AssistantQueryResponse,
    EntityRiskResponse,
)
from app.ai.llm_assistant import generate_case_insight
from app.ai.risk_scoring import calculate_entity_risk
from app.security.permissions import get_current_user
from app.routes.audit import log_audit_event

logger = logging.getLogger(__name__)

router = APIRouter(tags=["AI Tactical Assistant & Risk Scoring"])


@router.post("/query", response_model=AssistantQueryResponse, summary="Submit Natural Language Tactical Inquiry to AI Assistant")
def query_assistant(
    payload: AssistantQueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Query the autonomous LLM assistant for explainable case insights, suspect correlations,
    evidence chain-of-custody verification, and tactical operational recommendations.
    """
    resolved_case_id = payload.case_id or payload.caseId

    # Generate explainable tactical briefing
    insight_data = generate_case_insight(
        query=payload.query,
        case_id=resolved_case_id
    )

    # Record in immutable audit trail
    log_audit_event(
        db=db,
        user=current_user,
        action_type="AI_ASSISTANT_QUERY",
        resource_type="CASE" if resolved_case_id else "AI_ASSISTANT",
        resource_id=resolved_case_id,
        details=f"Inquiry: '{payload.query[:80]}' (Confidence: {insight_data.get('confidence_score', 0.96)})"
    )

    return insight_data


@router.get("/risk-score/{entity_id}", response_model=EntityRiskResponse, summary="Compute Dynamic Multi-factor Risk Score for an Entity")
def get_entity_risk_score(
    entity_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Run the dynamic risk scoring engine against an entity, calculating weighted priority
    based on linked case severity, evidence correlation density, and surveillance frequency.
    """
    result = calculate_entity_risk(entity_id)
    if not result.get("success"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result.get("error", f"Entity '{entity_id}' not found.")
        )

    log_audit_event(
        db=db,
        user=current_user,
        action_type="RISK_SCORE_COMPUTE",
        resource_type="ENTITY",
        resource_id=entity_id,
        details=f"Score computed: {result['risk_score']} ({result['risk_level']})"
    )

    return result
