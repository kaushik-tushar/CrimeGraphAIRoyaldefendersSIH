"""
NLP Entity Extraction Engine for CrimeGraph AI.
Extracts tactical entities (PERSON, PHONE, LOCATION) from processed OCR transcripts
and evidence artifacts using pattern recognition and entity intelligence heuristics.
"""

import re
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

# Known police/syndicate target profiles for fast prototype matching
KNOWN_TARGETS = [
    "Vikram Malhotra",
    "Amit Sharma",
    "Rajesh Kumar",
    "Sunil Verma",
    "Kavita Rao",
    "Pooja Mehta",
    "Deepak Joshi",
    "Raju",
    "Shadow",
    "Kabir Singhania",
    "Farhan Qureshi",
    "Mohan Lal",
]

# Common Indian cities and tactical regions
KNOWN_LOCATIONS = [
    "Connaught Place",
    "Western Logistics Corridor",
    "Sector 62, Noida",
    "Sector 18, Noida",
    "Rohini",
    "Karol Bagh",
    "Hauz Khas",
    "Chandni Chowk",
    "Bandra",
    "Andheri",
    "Whitefield",
    "Koramangala",
    "Indiranagar",
    "Noida",
    "Greater Noida",
    "New Delhi",
    "Delhi",
    "Gurugram",
    "Gurgaon",
    "Mumbai",
    "Bangalore",
    "Bengaluru",
    "Kolkata",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Kanpur",
    "Ghaziabad",
]

# Regex Patterns
PHONE_PATTERN = re.compile(
    r'(?:\+?91[\-\s]?)?[6-9]\d{4}[\-\s]?\d{5}|\b(?:\+?91[\-\s]?)?[6-9]\d{9}\b|\+?91[\-\s]?[6-9]\d{2,4}[\-\s]?[X\d]{4,6}',
    re.IGNORECASE
)

LOCATION_AREA_PATTERN = re.compile(
    r'\b(?:Sector\s+\d+(?:,\s*[A-Z][a-z]+)?|[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+(?:Nagar|Vihar|Chowk|Marg|Road|Colony|Enclave|Bagh|Corridor|Hub|Phase\s+\d+))\b'
)

PERSON_PREFIX_PATTERN = re.compile(
    r'\b(?:Suspect|Target|Subject|Accused|Associate|Witness|Caller|Alias|Mr\.|Mrs\.|Ms\.|Inspector|Officer|Constable)\s*[:\-]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})'
)


def extract_entities(text: str) -> List[Dict[str, Any]]:
    """
    Extract structured tactical entities (PERSON, PHONE, LOCATION) from raw input text.

    Args:
        text (str): Raw extracted document text or OCR transcript.

    Returns:
        List[Dict[str, Any]]: List of extracted entity dictionaries containing:
            - type / entity_type: 'Person', 'Phone', 'Location'
            - value / name_or_value: string representation
            - risk_score: estimated tactical risk score (0-100)
            - aliases: extraction metadata or detected aliases
    """
    if not text or not isinstance(text, str):
        return []

    entities: List[Dict[str, Any]] = []
    seen_values = set()

    def _add_entity(ent_type: str, val: str, risk: int, alias: str = "Extracted via NLP Ingestion"):
        cleaned_val = val.strip().strip(".,;:()")
        if not cleaned_val or len(cleaned_val) < 3:
            return
        dedup_key = (ent_type.upper(), cleaned_val.lower())
        if dedup_key not in seen_values:
            seen_values.add(dedup_key)
            entities.append({
                "type": ent_type,
                "entity_type": ent_type,
                "value": cleaned_val,
                "name_or_value": cleaned_val,
                "risk_score": risk,
                "aliases": alias
            })

    # 1. Extract PHONE entities
    for phone_match in PHONE_PATTERN.finditer(text):
        phone_num = phone_match.group(0).strip()
        # Filter out numbers that are likely dates or years
        digits_only = re.sub(r'\D', '', phone_num)
        if len(digits_only) >= 10:
            _add_entity("Phone", phone_num, 80, "Extracted Telecom Intercept")

    # 2. Extract PERSON entities
    # 2a. Match via prefix cues (Suspect: John Doe, Mr. Smith, etc.)
    for match in PERSON_PREFIX_PATTERN.finditer(text):
        name = match.group(1).strip()
        _add_entity("Person", name, 88, "Suspect / Subject Flagged by OCR NLP")

    # 2b. Match known tactical target profiles
    for target in KNOWN_TARGETS:
        pattern = rf'\b{re.escape(target)}\b'
        if re.search(pattern, text, re.IGNORECASE):
            _add_entity("Person", target, 92, "High-Value Target Match")

    # 3. Extract LOCATION entities
    # 3a. Known tactical locations & cities
    for loc in KNOWN_LOCATIONS:
        pattern = rf'\b{re.escape(loc)}\b'
        if re.search(pattern, text, re.IGNORECASE):
            _add_entity("Location", loc, 65, "Geospatial Landmark Match")

    # 3b. Regex location patterns (Sector 62, MG Road, Surya Nagar, etc.)
    for loc_match in LOCATION_AREA_PATTERN.finditer(text):
        loc_str = loc_match.group(0).strip()
        _add_entity("Location", loc_str, 70, "Syntactic Location Pattern")

    logger.info(f"NLP Entity Extraction completed. Found {len(entities)} unique tactical entities.")
    return entities
