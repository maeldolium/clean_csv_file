import re


def normalize_phone(phone) -> str:
    """Normalize a French phone number to the '06 01 02 03 04' format.

    Accepts numbers with dots, spaces, or a +33 prefix. Numbers that don't
    resolve to 10 digits are returned unchanged since they can't be
    confidently normalized.
    """
    if phone is None:
        return ""
    digits = re.sub(r"\D", "", str(phone))

    if digits.startswith("33") and len(digits) == 11:
        digits = "0" + digits[2:]

    if len(digits) != 10:
        return str(phone).strip()

    return " ".join(digits[i:i + 2] for i in range(0, 10, 2))
