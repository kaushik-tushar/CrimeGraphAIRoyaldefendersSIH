from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError, InvalidHashError

# Initialize Argon2 password hasher
_ph = PasswordHasher(
    time_cost=3,        # Number of iterations
    memory_cost=65536,  # 64 MB memory
    parallelism=4,      # 4 threads
    hash_len=32,        # Output hash length
    salt_len=16         # Random salt length
)


def get_password_hash(password: str) -> str:
    """
    Hash a plain text password using Argon2id.
    """
    return _ph.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain text password against an Argon2 hash.
    """
    try:
        return _ph.verify(hashed_password, plain_password)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False
