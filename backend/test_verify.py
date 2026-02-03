from passlib.context import CryptContext
import bcrypt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# The hash created manually or from previous tests
manual_hash = '$2b$12$8nbipNSsmDKFaO.AU.gRvuC9oO4MUMUjALdOIPLqbscG78qJeyWvK'
password = 'admin123'

print(f"Testing password: {password}")
print(f"Against hash: {manual_hash}")

try:
    result = pwd_context.verify(password, manual_hash)
    print(f"Passlib verify result: {result}")
except Exception as e:
    print(f"Passlib verify error: {e}")

# Test self-consistency
try:
    print("\nTesting self-consistency:")
    new_hash = pwd_context.hash(password)
    print(f"Newly generated hash: {new_hash}")
    self_verify = pwd_context.verify(password, new_hash)
    print(f"Passlib self-verify result: {self_verify}")
except Exception as e:
    print(f"Passlib self-verify error: {e}")
