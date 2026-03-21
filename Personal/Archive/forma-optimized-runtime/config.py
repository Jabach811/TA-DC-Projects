from __future__ import annotations
import os
from pathlib import Path


def _path_from_env(env_var: str, default: Path) -> Path:
    value = os.getenv(env_var)
    if value:
        return Path(value).expanduser()
    return default


# === Base Paths ===
APP_ROOT = Path(__file__).resolve().parent
ASSETS_DIR = _path_from_env("FORMA_ASSETS_DIR", APP_ROOT)

# === OCR Dependencies ===
TESSERACT_PATH = _path_from_env(
    "FORMA_TESSERACT_PATH",
    Path(r"C:\Program Files\Tesseract-OCR\tesseract.exe")
)

POPPLER_PATH = _path_from_env(
    "FORMA_POPPLER_PATH",
    Path(r"C:\poppler\poppler-25.07.0\Library\bin")
)

# === Image Assets ===
SPLASH_IMAGE = _path_from_env("FORMA_SPLASH_IMAGE", ASSETS_DIR / "Splash Screen.jpg")
MAIN_UI_IMAGE = _path_from_env("FORMA_MAIN_UI_IMAGE", ASSETS_DIR / "Main UI.jpg")
LOGIN_IMAGE = _path_from_env("FORMA_LOGIN_IMAGE", ASSETS_DIR / "Login.jpg")
LOGO_IMAGE = _path_from_env("FORMA_LOGO_IMAGE", ASSETS_DIR / "HIPCO Logo.jpg")
INITIAL_FOLDER_IMAGE = _path_from_env("FORMA_INITIAL_FOLDER_IMAGE", ASSETS_DIR / "Initial Folder Select.jpg")
CONFIGURE_IMAGE = _path_from_env("FORMA_CONFIGURE_IMAGE", ASSETS_DIR / "Config Menu.jpg")


##-----Trial Licensing------##
# LICENSE_CONFIG_FILE = (APP_ROOT / "license_config.json").resolve()
# TRIAL_LENGTH_DAYS = 30
##--------------------------##


# === Data Root + Subfolders ===
USER_DATA_ROOT = _path_from_env("FORMA_DATA_ROOT", Path.home() / "Documents" / "Hipco")
QUOTES_DIR = USER_DATA_ROOT / "Quotes"
POS_DIR = USER_DATA_ROOT / "POs"

# Create all necessary folders
for directory in (USER_DATA_ROOT, QUOTES_DIR, POS_DIR):
    directory.mkdir(parents=True, exist_ok=True)


# === Utility Functions ===
def asset_path(name: str) -> Path:
    return ASSETS_DIR / name


def ensure_dir(path: Path) -> Path:
    path.mkdir(parents=True, exist_ok=True)
    return path
