import logging
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.models.case import Case
from app.models.evidence import Evidence
from app.models.entity import Entity
from app.models.vehicle import Vehicle
from app.models.phone import Phone
from app.models.location import Location
from app.models.audit import AuditLog
from app.security.hashing import get_password_hash

logger = logging.getLogger(__name__)

INITIAL_OFFICERS = [
    {
        "id": "OFFICER-9041",
        "badge_number": "INSP-26189",
        "name": "Inspector R. S. Verma",
        "rank": "Senior Cyber Investigator",
        "unit": "Special Crime Cell, Cyber Crime HQ",
        "role": UserRole.ADMIN,
        "clearance_level": "LEVEL_4_TOP_SECRET",
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "password": "password123"
    },
    {
        "id": "OFFICER-8021",
        "badge_number": "NCRB-OFFICER-8021",
        "name": "ACP Vikram Malhotra",
        "rank": "Senior Investigator",
        "unit": "National Crime Records Bureau, Special Cell",
        "role": UserRole.SENIOR_INVESTIGATOR,
        "clearance_level": "LEVEL_4_TOP_SECRET",
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "password": "password123"
    },
    {
        "id": "OFFICER-5501",
        "badge_number": "ANALYST-5501",
        "name": "Dr. Priya Sharma",
        "rank": "Chief Intelligence Analyst",
        "unit": "Forensic Data Intelligence Division",
        "role": UserRole.ANALYST,
        "clearance_level": "LEVEL_3_CONFIDENTIAL",
        "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        "password": "password123"
    }
]

INITIAL_CASES = [
    {
        "id": "26189-042",
        "case_id": "CASE #26189-042",
        "fir_number": "FIR-2026-NCRB-9021",
        "title": "Operation Phantom Call - Cross-Border Cyber Financial Scam",
        "crime_category": "Organized Crime / Cyber Fraud",
        "location": "Sector 62 Node, Noida / Delhi NCR",
        "date": "2026-09-01",
        "assigned_investigator_id": "OFFICER-9041",
        "assigned_officer_name": "Inspector R. S. Verma",
        "status": "ACTIVE",
        "risk_level": "CRITICAL",
        "risk_score": 94,
        "description": "Interstate cyber syndicate operating through spoofed VoIP routers and compromised corporate banking portals.",
        "suspect_count": 8,
        "evidence_count": 14
    },
    {
        "id": "26189-088",
        "case_id": "CASE #26189-088",
        "fir_number": "FIR-2026-DL-4410",
        "title": "Connaught Place Shell Account Laundering Ring",
        "crime_category": "Financial Crime",
        "location": "Connaught Place Branch, New Delhi",
        "date": "2026-09-03",
        "assigned_investigator_id": "OFFICER-8021",
        "assigned_officer_name": "ACP Vikram Malhotra",
        "status": "UNDER_INVESTIGATION",
        "risk_level": "HIGH",
        "risk_score": 89,
        "description": "High-value wire transfers and circular shell accounts funneling illicit proceeds via mule accounts.",
        "suspect_count": 4,
        "evidence_count": 9
    },
    {
        "id": "26189-102",
        "case_id": "CASE #26189-102",
        "fir_number": "FIR-2026-MH-1102",
        "title": "Cross-Border Telecom Tower Dump & Burner SIM Ring",
        "crime_category": "Telecom & Counter-Terror",
        "location": "Indirapuram Tower Cell, Ghaziabad",
        "date": "2026-09-05",
        "assigned_investigator_id": "OFFICER-5501",
        "assigned_officer_name": "Dr. Priya Sharma",
        "status": "UNDER REVIEW",
        "risk_level": "HIGH",
        "risk_score": 78,
        "description": "Correlating midnight CDR tower dumps and suspicious IMEI swaps activating fake identities.",
        "suspect_count": 6,
        "evidence_count": 12
    },
    {
        "id": "26189-144",
        "case_id": "CASE #26189-144",
        "fir_number": "FIR-2025-UP-8801",
        "title": "Commercial Cargo Theft & Vehicle Spoofing Ring",
        "crime_category": "Vehicle Theft / Smuggling",
        "location": "Western Logistics Corridor",
        "date": "2025-11-10",
        "assigned_investigator_id": "OFFICER-9041",
        "assigned_officer_name": "Inspector R. S. Verma",
        "status": "ARCHIVED",
        "risk_level": "MEDIUM",
        "risk_score": 62,
        "description": "GPS spoofing and counterfeit number plates tracked via automated highway ANPR matches.",
        "suspect_count": 3,
        "evidence_count": 7
    }
]

INITIAL_EVIDENCE = [
    {
        "id": "EVD-101",
        "case_id": "26189-042",
        "file_name": "tower_dump_sector_62_noida.csv",
        "file_type": "CDR_TOWER_DUMP",
        "file_url": "/uploads/tower_dump_sector_62_noida.csv",
        "file_size": "42.8 MB",
        "file_hash_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "uploaded_by_id": "OFFICER-9041",
        "uploaded_by_name": "Inspector R. S. Verma",
        "blockchain_status": "VERIFIED"
    },
    {
        "id": "EVD-102",
        "case_id": "26189-088",
        "file_name": "bank_statement_axis_9041.pdf",
        "file_type": "FINANCIAL_RECORD",
        "file_url": "/uploads/bank_statement_axis_9041.pdf",
        "file_size": "3.1 MB",
        "file_hash_sha256": "8f4e2a1b9c3d5e7f6a8b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f",
        "uploaded_by_id": "OFFICER-8021",
        "uploaded_by_name": "ACP Vikram Malhotra",
        "blockchain_status": "VERIFIED"
    }
]

INITIAL_ENTITIES = [
    {
        "id": "ENT-901",
        "entity_type": "Phone",
        "name_or_value": "+91 98210-XXXXX",
        "aliases": "Burner SIM-01",
        "risk_score": 92,
        "associated_case_id": "26189-042",
        "status": "UNDER_SURVEILLANCE"
    },
    {
        "id": "ENT-902",
        "entity_type": "Phone",
        "name_or_value": "IMEI 869402049182391",
        "aliases": "Primary Suspect Handset",
        "risk_score": 85,
        "associated_case_id": "26189-042",
        "status": "FLAGGED"
    },
    {
        "id": "ENT-903",
        "entity_type": "Bank Account",
        "name_or_value": "Axis Bank Acct #9041",
        "aliases": "Connaught Place Shell Acct",
        "risk_score": 88,
        "associated_case_id": "26189-088",
        "status": "FROZEN"
    },
    {
        "id": "ENT-904",
        "entity_type": "Person",
        "name_or_value": "Rajesh Kumar",
        "aliases": "Raju, Shadow",
        "risk_score": 95,
        "associated_case_id": "26189-042",
        "status": "ABSCONDING"
    }
]


def seed_users(db: Session):
    seeded_count = 0
    for officer_data in INITIAL_OFFICERS:
        existing = db.query(User).filter(User.badge_number == officer_data["badge_number"]).first()
        if not existing:
            hashed_pw = get_password_hash(officer_data["password"])
            user = User(
                id=officer_data["id"],
                badge_number=officer_data["badge_number"],
                name=officer_data["name"],
                rank=officer_data["rank"],
                unit=officer_data["unit"],
                role=officer_data["role"],
                clearance_level=officer_data["clearance_level"],
                avatar_url=officer_data["avatar_url"],
                hashed_password=hashed_pw,
                is_active=True
            )
            db.add(user)
            seeded_count += 1

    if seeded_count > 0:
        db.commit()
        logger.info(f"Seeded {seeded_count} initial officer accounts into database.")


def seed_cases(db: Session):
    seeded_count = 0
    for case_data in INITIAL_CASES:
        existing = db.query(Case).filter(Case.id == case_data["id"]).first()
        if not existing:
            case = Case(
                id=case_data["id"],
                case_id=case_data["case_id"],
                fir_number=case_data["fir_number"],
                title=case_data["title"],
                crime_category=case_data["crime_category"],
                location=case_data["location"],
                date=case_data["date"],
                assigned_investigator_id=case_data["assigned_investigator_id"],
                assigned_officer_name=case_data["assigned_officer_name"],
                status=case_data["status"],
                risk_level=case_data["risk_level"],
                risk_score=case_data["risk_score"],
                description=case_data["description"],
                suspect_count=case_data["suspect_count"],
                evidence_count=case_data["evidence_count"]
            )
            db.add(case)
            seeded_count += 1

    if seeded_count > 0:
        db.commit()
        logger.info(f"Seeded {seeded_count} initial case files into database.")


def seed_evidence(db: Session):
    seeded_count = 0
    for evd_data in INITIAL_EVIDENCE:
        existing = db.query(Evidence).filter(Evidence.id == evd_data["id"]).first()
        if not existing:
            evd = Evidence(
                id=evd_data["id"],
                case_id=evd_data["case_id"],
                file_name=evd_data["file_name"],
                file_type=evd_data["file_type"],
                file_url=evd_data["file_url"],
                file_size=evd_data["file_size"],
                file_hash_sha256=evd_data["file_hash_sha256"],
                uploaded_by_id=evd_data["uploaded_by_id"],
                uploaded_by_name=evd_data["uploaded_by_name"],
                blockchain_status=evd_data["blockchain_status"]
            )
            db.add(evd)
            seeded_count += 1

    if seeded_count > 0:
        db.commit()
        logger.info(f"Seeded {seeded_count} initial evidence records into database.")


def seed_entities(db: Session):
    seeded_count = 0
    for ent_data in INITIAL_ENTITIES:
        existing = db.query(Entity).filter(Entity.id == ent_data["id"]).first()
        if not existing:
            ent = Entity(
                id=ent_data["id"],
                entity_type=ent_data["entity_type"],
                name_or_value=ent_data["name_or_value"],
                aliases=ent_data["aliases"],
                risk_score=ent_data["risk_score"],
                associated_case_id=ent_data["associated_case_id"],
                status=ent_data["status"]
            )
            db.add(ent)
            seeded_count += 1

    if seeded_count > 0:
        db.commit()
        logger.info(f"Seeded {seeded_count} initial intelligence entities into database.")


INITIAL_VEHICLES = [
    {
        "id": "VEH-101",
        "license_plate": "UP 16 Z 9041",
        "make_model": "Toyota Fortuner",
        "color": "Obsidian Black",
        "vin": "MBJ11V4T001928374",
        "owner_name": "Rajesh Kumar",
        "associated_case_id": "26189-042",
        "risk_score": 88,
        "status": "FLAGGED",
        "last_seen_location": "Western Logistics Corridor Junction"
    },
    {
        "id": "VEH-102",
        "license_plate": "DL 01 AB 7744",
        "make_model": "Mahindra Scorpio",
        "color": "Metallic Silver",
        "vin": "MA1TA2SK009871234",
        "owner_name": "Amit Sharma",
        "associated_case_id": "26189-042",
        "risk_score": 79,
        "status": "SURVEILLANCE",
        "last_seen_location": "Sector 62, Noida"
    },
    {
        "id": "VEH-103",
        "license_plate": "HR 26 DQ 5510",
        "make_model": "Hyundai Creta",
        "color": "Polar White",
        "vin": "MALC5110023456789",
        "owner_name": "Shell Fleet Logistics",
        "associated_case_id": "26189-088",
        "risk_score": 72,
        "status": "IMPOUNDED",
        "last_seen_location": "Connaught Place Hub"
    }
]

INITIAL_PHONES = [
    {
        "id": "PHN-101",
        "phone_number": "+91 98210-44910",
        "imei": "869402049182391",
        "imsi": "404450123456789",
        "carrier": "Airtel",
        "registered_name": "Burner SIM-01",
        "associated_case_id": "26189-042",
        "risk_score": 92,
        "status": "UNDER_SURVEILLANCE",
        "call_count": 142
    },
    {
        "id": "PHN-102",
        "phone_number": "+91 98101-23456",
        "imei": "352098001755289",
        "imsi": "404450987654321",
        "carrier": "Jio",
        "registered_name": "Amit Sharma",
        "associated_case_id": "26189-042",
        "risk_score": 86,
        "status": "INTERCEPTED",
        "call_count": 98
    },
    {
        "id": "PHN-103",
        "phone_number": "+91 98765-43210",
        "imei": "864192039581102",
        "imsi": "404450112233445",
        "carrier": "Vodafone Idea",
        "registered_name": "Rajesh Kumar",
        "associated_case_id": "26189-088",
        "risk_score": 89,
        "status": "ACTIVE",
        "call_count": 67
    }
]

INITIAL_LOCATIONS = [
    {
        "id": "LOC-101",
        "name": "Sector 62 Tactical Safehouse",
        "address": "C-56/12, Industrial Area, Sector 62",
        "city": "Noida",
        "state": "Uttar Pradesh",
        "coordinates": "28.6280, 77.3649",
        "latitude": 28.6280,
        "longitude": 77.3649,
        "location_type": "SAFEHOUSE",
        "associated_case_id": "26189-042",
        "risk_score": 85,
        "status": "SURVEILLANCE"
    },
    {
        "id": "LOC-102",
        "name": "Connaught Place Shell Clearing Hub",
        "address": "Barakhamba Road, Inner Circle",
        "city": "New Delhi",
        "state": "Delhi",
        "coordinates": "28.6315, 77.2167",
        "latitude": 28.6315,
        "longitude": 77.2167,
        "location_type": "LOGISTICS_HUB",
        "associated_case_id": "26189-088",
        "risk_score": 80,
        "status": "MONITORED"
    },
    {
        "id": "LOC-103",
        "name": "Western Logistics Corridor Junction",
        "address": "NH-48 Freight Expressway",
        "city": "Gurugram",
        "state": "Haryana",
        "coordinates": "28.4595, 77.0266",
        "latitude": 28.4595,
        "longitude": 77.0266,
        "location_type": "TRANSIT",
        "associated_case_id": "26189-144",
        "risk_score": 70,
        "status": "SURVEILLANCE"
    }
]

INITIAL_AUDIT_LOGS = [
    {
        "id": "AUD-101",
        "user_id": "OFFICER-9041",
        "user_badge": "INSP-26189",
        "user_name": "Inspector R. S. Verma",
        "action_type": "USER_LOGIN",
        "resource_type": "SYSTEM",
        "details": "Officer authenticated with LEVEL_4 clearance credentials",
        "status": "SUCCESS"
    },
    {
        "id": "AUD-102",
        "user_id": "OFFICER-9041",
        "user_badge": "INSP-26189",
        "user_name": "Inspector R. S. Verma",
        "action_type": "EVIDENCE_UPLOAD",
        "resource_type": "EVIDENCE",
        "resource_id": "EVD-101",
        "details": "Uploaded telecom tower dump with SHA-256 integrity verification",
        "status": "SUCCESS"
    },
    {
        "id": "AUD-103",
        "user_id": "OFFICER-8021",
        "user_badge": "NCRB-OFFICER-8021",
        "user_name": "ACP Vikram Malhotra",
        "action_type": "CASE_ACCESS",
        "resource_type": "CASE",
        "resource_id": "26189-042",
        "details": "Accessed tactical intelligence dossier for Operation Phantom Call",
        "status": "SUCCESS"
    }
]


def seed_vehicles(db: Session):
    seeded = 0
    for v_data in INITIAL_VEHICLES:
        existing = db.query(Vehicle).filter(Vehicle.id == v_data["id"]).first()
        if not existing:
            v = Vehicle(
                id=v_data["id"],
                license_plate=v_data["license_plate"],
                make_model=v_data["make_model"],
                color=v_data["color"],
                vin=v_data.get("vin"),
                owner_name=v_data["owner_name"],
                associated_case_id=v_data["associated_case_id"],
                risk_score=v_data["risk_score"],
                status=v_data["status"],
                last_seen_location=v_data["last_seen_location"]
            )
            db.add(v)
            seeded += 1
    if seeded > 0:
        db.commit()
        logger.info(f"Seeded {seeded} initial vehicle records.")


def seed_phones(db: Session):
    seeded = 0
    for p_data in INITIAL_PHONES:
        existing = db.query(Phone).filter(Phone.id == p_data["id"]).first()
        if not existing:
            p = Phone(
                id=p_data["id"],
                phone_number=p_data["phone_number"],
                imei=p_data.get("imei"),
                imsi=p_data.get("imsi"),
                carrier=p_data.get("carrier"),
                registered_name=p_data.get("registered_name"),
                associated_case_id=p_data["associated_case_id"],
                risk_score=p_data["risk_score"],
                status=p_data["status"],
                call_count=p_data.get("call_count", 0)
            )
            db.add(p)
            seeded += 1
    if seeded > 0:
        db.commit()
        logger.info(f"Seeded {seeded} initial phone records.")


def seed_locations(db: Session):
    seeded = 0
    for l_data in INITIAL_LOCATIONS:
        existing = db.query(Location).filter(Location.id == l_data["id"]).first()
        if not existing:
            loc = Location(
                id=l_data["id"],
                name=l_data["name"],
                address=l_data.get("address"),
                city=l_data.get("city"),
                state=l_data.get("state"),
                coordinates=l_data.get("coordinates"),
                latitude=l_data.get("latitude"),
                longitude=l_data.get("longitude"),
                location_type=l_data.get("location_type", "SAFEHOUSE"),
                associated_case_id=l_data["associated_case_id"],
                risk_score=l_data["risk_score"],
                status=l_data["status"]
            )
            db.add(loc)
            seeded += 1
    if seeded > 0:
        db.commit()
        logger.info(f"Seeded {seeded} initial location records.")


def seed_audit_logs(db: Session):
    seeded = 0
    for a_data in INITIAL_AUDIT_LOGS:
        existing = db.query(AuditLog).filter(AuditLog.id == a_data["id"]).first()
        if not existing:
            a = AuditLog(
                id=a_data["id"],
                user_id=a_data["user_id"],
                user_badge=a_data["user_badge"],
                user_name=a_data["user_name"],
                action_type=a_data["action_type"],
                resource_type=a_data.get("resource_type"),
                resource_id=a_data.get("resource_id"),
                details=a_data.get("details"),
                status=a_data.get("status", "SUCCESS")
            )
            db.add(a)
            seeded += 1
    if seeded > 0:
        db.commit()
        logger.info(f"Seeded {seeded} initial audit log records.")


def seed_all(db: Session):
    seed_users(db)
    seed_cases(db)
    seed_evidence(db)
    seed_entities(db)
    seed_vehicles(db)
    seed_phones(db)
    seed_locations(db)
    seed_audit_logs(db)

