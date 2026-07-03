import re

import pandas as pd

FIRST_NAME_COL = "Prénom"
LAST_NAME_COL = "Nom"
EMAIL_COL = "Email"
PHONE_COL = "Téléphone"


def normalize_phone(phone) -> str:
    """Normalize a French phone number to the '06 01 02 03 04' format.

    Accepts numbers with dots, spaces, or a +33 prefix. Numbers that don't
    resolve to 10 digits are returned unchanged since they can't be
    confidently normalized.
    """
    if pd.isna(phone):
        return ""
    digits = re.sub(r"\D", "", str(phone))

    if digits.startswith("33") and len(digits) == 11:
        digits = "0" + digits[2:]

    if len(digits) != 10:
        return str(phone).strip()

    return " ".join(digits[i:i + 2] for i in range(0, 10, 2))


def format_name(name) -> str:
    """Format a name part (first or last name) with proper casing.

    Handles hyphens and apostrophes as separate word boundaries so
    "jean-pierre" and "d'ascq" capitalize correctly.
    """
    if pd.isna(name) or not str(name).strip():
        return ""
    parts = re.split(r"([-'\s]+)", str(name).strip().lower())
    return "".join(part.capitalize() if part.strip("-' ") else part for part in parts)


def remove_empty_rows(df: pd.DataFrame) -> pd.DataFrame:
    """Drop rows where every field is blank or missing."""
    is_blank = df.fillna("").apply(lambda col: col.astype(str).str.strip() == "")
    return df[~is_blank.all(axis=1)].reset_index(drop=True)


def remove_duplicates(df: pd.DataFrame, subset: str = EMAIL_COL) -> pd.DataFrame:
    """Drop rows with a duplicate email, keeping the first occurrence."""
    key = df[subset].fillna("").astype(str).str.strip().str.lower()
    return df[~key.duplicated()].reset_index(drop=True)


def clean_dataframe(df: pd.DataFrame) -> tuple[pd.DataFrame, dict]:
    """Run the full cleaning pipeline and return the cleaned df with stats."""
    df = remove_empty_rows(df)

    original_phones = df[PHONE_COL].fillna("").astype(str).str.strip()
    normalized_phones = df[PHONE_COL].apply(normalize_phone)
    phones_reformatted = int((original_phones != normalized_phones).sum())
    df[PHONE_COL] = normalized_phones

    df[FIRST_NAME_COL] = df[FIRST_NAME_COL].apply(format_name)
    df[LAST_NAME_COL] = df[LAST_NAME_COL].apply(format_name)

    rows_before = len(df)
    df = remove_duplicates(df)
    duplicates_removed = rows_before - len(df)

    stats = {
        "duplicates_removed": duplicates_removed,
        "phones_reformatted": phones_reformatted,
    }
    return df, stats
