"""
Forma Pro — Mock Data Seeder
Generates one year of realistic sales data for 20 companies.
Run once: python seed_data.py
"""
import sqlite3
import random
from pathlib import Path
from datetime import datetime, timedelta

DB_PATH = Path(__file__).parent / "forma_repo.db"

# ---------------------------------------------------------------------------
# Products catalog (based on real Hipco product lines)
# ---------------------------------------------------------------------------
PRODUCTS = [
    # Pipe
    ("5001005", '1/2" PIPE P/E CG PP PRO150 16.4\' LGTH', "EA", 5.78),
    ("5001010", '3/4" PIPE P/E CG PP PRO150 16.4\' LGTH', "EA", 9.25),
    ("5001020", '2" PIPE P/E CG PP PRO150 16.4\' LGTH', "EA", 41.35),
    ("5001030", '3" PIPE P/E CG PP PRO150 16.4\' LGTH', "EA", 85.01),
    ("5001040", '4" PIPE P/E CG PP PRO150 16.4\' LGTH', "EA", 138.50),
    ("5550060", '6" PIPE P/E PP PRO-90 SDR117 5 METER LENGTH', "EA", 168.17),
    # Fittings — Elbows
    ("5304420", '2" IN 4" 90 ELBOW DBL CONT BF PP PRO150X45 DUO-PRO', "EA", 155.71),
    ("5304531", '3" IN 6" 90 ELBOW DBL CONT BF PP PRO150X45 DUO-PRO', "EA", 274.32),
    ("5307420", '2" IN 4" 45 ELBOW DBL CONT BF PP PRO150X45 DUO-PRO', "EA", 184.29),
    ("5307531", '3" IN 6" 45 ELBOW DBL CONT BF PP PRO150X45 DUO-PRO', "EA", 225.26),
    ("5307583", '4" IN 8" 45 ELBOW DBL CONT BF PP PRO150X45 DUO-PRO', "EA", 274.32),
    # Tees & Taps
    ("5323420", '2" IN 4" DOGBONE ANNULAR TAP PP PRO150X45 DUO-PRO', "EA", 307.16),
    ("5323531", '3" IN 6" DOGBONE ANNULAR TAP PP PRO150X45 DUO-PRO', "EA", 425.80),
    ("5312420", '2" IN 4" DBL CONT BF PP PRO150X45 DUO-PRO SIMULT 16.4\' LGTH', "EA", 312.50),
    ("5312531", '3" IN 6" PIPE DBL CONT BF PP PRO150X45 DUO-PRO SIMULT 16.4\' LGTH', "EA", 474.83),
    # Backing Rings
    ("5046040", '4" BACKING RING PP GREY ANSI-150', "EA", 33.53),
    ("5046060", '6" BACKING RING PP GREY ANSI-150', "EA", 54.20),
    # Tubing
    ("PFA0403-100", '1/4" OD x 3/16" ID x .031" W TUBING', "FT", 3.00),
    ("PFA0604-100", '3/8" OD x 1/4" ID x .062" W TUBING', "FT", 4.75),
    ("PFA0806-100", '1/2" OD x 3/8" ID x .062" W TUBING', "FT", 6.20),
    # Filters & Housings
    ("HUR 5X170FL-XXP", "FILTER HOUSING 304SS EP 750GPM 4\" FLGD W/SB HI PRES 200 PSI", "EA", 24305.49),
    ("HC/170-20", "30-3/4\" FILTER 20 MIC PEST-PLEAT FOR MDL HUR 170HP", "EA", 217.44),
    ("HC/170-50", "30-3/4\" FILTER 50 MIC PEST-PLEAT FOR MDL HUR 170HP", "EA", 198.00),
    # Valves
    ("V-PP-075-150", '3/4" PP BALL VALVE SOCKET ANSI-150', "EA", 48.90),
    ("V-PP-100-150", '1" PP BALL VALVE SOCKET ANSI-150', "EA", 62.75),
    ("V-PP-200-150", '2" PP BALL VALVE SOCKET ANSI-150', "EA", 118.40),
    ("V-PP-300-150", '3" PP BUTTERFLY VALVE FLANGED ANSI-150', "EA", 245.00),
    # Unions & Adapters
    ("U-PP-050", '1/2" PP TRUE UNION SOCKET ANSI-150', "EA", 22.30),
    ("U-PP-100", '1" PP TRUE UNION SOCKET ANSI-150', "EA", 34.50),
    ("U-PP-200", '2" PP TRUE UNION SOCKET ANSI-150', "EA", 68.20),
    # Gaskets & Hardware
    ("G-EPDM-150-4", '4" EPDM GASKET ANSI-150 FULL FACE', "EA", 8.75),
    ("G-EPDM-150-6", '6" EPDM GASKET ANSI-150 FULL FACE', "EA", 13.40),
    ("HB-304-58-25", '5/8" x 2-1/2" 304SS HEX BOLT & NUT SET', "SET", 4.20),
]

# ---------------------------------------------------------------------------
# Company definitions
# ---------------------------------------------------------------------------
COMPANIES = {
    # 5 Big accounts — lots of POs, large orders
    "big": [
        "ACCO ENGINEERED SYSTEMS",
        "AIR SYSTEMS INCORPORATED",
        "PERFORMANCE MECHANICAL INC",
        "WESTSIDE INDUSTRIAL CONTRACTORS",
        "PACIFIC MECHANICAL SYSTEMS",
    ],
    # 10 Normal accounts
    "normal": [
        "CALIFORNIA UNITED MECHANICAL",
        "SOUTHWEST PIPING SOLUTIONS",
        "DELTA INDUSTRIAL SUPPLY",
        "HARBOR MECHANICAL GROUP",
        "INLAND VALLEY CONTRACTORS",
        "COASTAL PROCESS SYSTEMS",
        "SIERRA NEVADA PIPING CO",
        "GOLDEN STATE MECHANICAL",
        "BAY AREA PROCESS SOLUTIONS",
        "CENTRAL VALLEY PIPE & SUPPLY",
    ],
    # 5 Small accounts — occasional quotes, smaller orders
    "small": [
        "ACCO AIR CONDITIONING",
        "FREMONT BRANCH SUPPLY",
        "TRI-CITY MECHANICAL",
        "VALLEY CONTRACTORS LLC",
        "SUNRISE INDUSTRIAL SERVICES",
    ],
}

# ---------------------------------------------------------------------------
# Sizing parameters
# ---------------------------------------------------------------------------
SIZE_CONFIG = {
    "big": {
        "orders_per_month_range": (8, 15),
        "items_range": (6, 18),
        "qty_range": (10, 80),
        "quote_weight": 0.25,   # % of docs that are quotes
        "po_weight": 0.55,
        "invoice_weight": 0.20,
        "price_multiplier": (0.85, 1.0),   # volume discount factor
    },
    "normal": {
        "orders_per_month_range": (3, 7),
        "items_range": (3, 10),
        "qty_range": (4, 35),
        "quote_weight": 0.35,
        "po_weight": 0.45,
        "invoice_weight": 0.20,
        "price_multiplier": (0.90, 1.05),
    },
    "small": {
        "orders_per_month_range": (1, 3),
        "items_range": (1, 5),
        "qty_range": (1, 15),
        "quote_weight": 0.50,
        "po_weight": 0.30,
        "invoice_weight": 0.20,
        "price_multiplier": (0.95, 1.10),
    },
}

DOC_TYPES = ["quote", "po", "invoice"]
TYPE_LABELS = {"quote": "Quotation", "po": "Purchase Order", "invoice": "Pick-up Ticket"}

random.seed(42)  # reproducible

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def random_date(start: datetime, end: datetime) -> datetime:
    delta = end - start
    return start + timedelta(seconds=random.randint(0, int(delta.total_seconds())))


def make_doc_number(doc_type: str, counter: int) -> str:
    if doc_type == "quote":
        return f"OO3Q{counter:04d}"
    elif doc_type == "po":
        return f"003TN{counter:03d}"
    else:
        return f"003LA{counter:03d}-1"


def pick_doc_type(cfg: dict) -> str:
    r = random.random()
    if r < cfg["quote_weight"]:
        return "quote"
    elif r < cfg["quote_weight"] + cfg["po_weight"]:
        return "po"
    return "invoice"


def make_items(cfg: dict) -> list:
    n = random.randint(*cfg["items_range"])
    selected = random.sample(PRODUCTS, min(n, len(PRODUCTS)))
    mult_lo, mult_hi = cfg["price_multiplier"]
    items = []
    for pid, desc, unit, base_price in selected:
        qty = random.randint(*cfg["qty_range"])
        price = round(base_price * random.uniform(mult_lo, mult_hi), 2)
        amount = round(qty * price, 2)
        items.append({
            "product_id": pid,
            "description": desc,
            "quantity": qty,
            "price": price,
            "unit": unit,
            "amount": amount,
            "non_returnable": random.choice([0, 0, 0, 1]),
        })
    return items


# ---------------------------------------------------------------------------
# Database write
# ---------------------------------------------------------------------------

SCHEMA = """
CREATE TABLE IF NOT EXISTS extractions (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    doc_type     TEXT NOT NULL,
    customer     TEXT NOT NULL,
    doc_number   TEXT,
    doc_date     TEXT,
    total_amount REAL DEFAULT 0.0,
    file_path    TEXT,
    output_path  TEXT,
    item_count   INTEGER DEFAULT 0,
    mode         TEXT DEFAULT 'extract',
    created_at   TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS line_items (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    extraction_id  INTEGER NOT NULL REFERENCES extractions(id) ON DELETE CASCADE,
    product_id     TEXT,
    description    TEXT,
    quantity       REAL DEFAULT 0,
    price          REAL DEFAULT 0,
    unit           TEXT,
    amount         REAL DEFAULT 0,
    non_returnable INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_extractions_customer  ON extractions(customer);
CREATE INDEX IF NOT EXISTS idx_extractions_doc_type  ON extractions(doc_type);
CREATE INDEX IF NOT EXISTS idx_extractions_created   ON extractions(created_at);
CREATE INDEX IF NOT EXISTS idx_line_items_extraction ON line_items(extraction_id);
"""


def seed():
    con = sqlite3.connect(str(DB_PATH))
    con.execute("PRAGMA foreign_keys = ON")
    con.executescript(SCHEMA)

    # Check if already seeded
    count = con.execute("SELECT COUNT(*) FROM extractions").fetchone()[0]
    if count > 0:
        print(f"Database already has {count} records. Skipping seed.")
        print("Delete forma_repo.db and re-run to reseed.")
        con.close()
        return

    year_start = datetime(2025, 1, 1, 8, 0, 0)
    year_end   = datetime(2025, 12, 31, 17, 0, 0)

    doc_counter = 100
    total_rows  = 0

    all_companies = (
        [("big",    c) for c in COMPANIES["big"]] +
        [("normal", c) for c in COMPANIES["normal"]] +
        [("small",  c) for c in COMPANIES["small"]]
    )

    for size, company in all_companies:
        cfg = SIZE_CONFIG[size]
        # Generate month-by-month
        current = year_start
        while current <= year_end:
            month_end = min(
                datetime(current.year, current.month % 12 + 1, 1) if current.month < 12
                else datetime(current.year + 1, 1, 1),
                year_end
            )
            n_orders = random.randint(*cfg["orders_per_month_range"])
            for _ in range(n_orders):
                doc_type   = pick_doc_type(cfg)
                items      = make_items(cfg)
                total      = round(sum(i["amount"] for i in items), 2)
                doc_number = make_doc_number(doc_type, doc_counter)
                doc_date   = random_date(current, month_end)
                created_at = doc_date.isoformat(timespec="seconds")
                date_str   = doc_date.strftime("%m/%d/%y")

                fake_output = (
                    f"C:/Users/mabac/Documents/Hipco/{company}/"
                    f"{'POs' if doc_type=='po' else 'Quotes' if doc_type=='quote' else 'Pick Ticket Orders'}/"
                    f"{doc_number}_{'PO' if doc_type=='po' else 'Quote' if doc_type=='quote' else 'Customer Pick Up'}.xlsx"
                )
                fake_pdf = fake_output.replace(".xlsx", ".pdf")

                cur = con.execute(
                    """INSERT INTO extractions
                       (doc_type, customer, doc_number, doc_date, total_amount,
                        file_path, output_path, item_count, mode, created_at)
                       VALUES (?,?,?,?,?,?,?,?,?,?)""",
                    (doc_type, company, doc_number, date_str, total,
                     fake_pdf, fake_output, len(items), "extract", created_at),
                )
                eid = cur.lastrowid

                for item in items:
                    con.execute(
                        """INSERT INTO line_items
                           (extraction_id, product_id, description, quantity,
                            price, unit, amount, non_returnable)
                           VALUES (?,?,?,?,?,?,?,?)""",
                        (eid, item["product_id"], item["description"],
                         item["quantity"], item["price"], item["unit"],
                         item["amount"], item["non_returnable"]),
                    )

                doc_counter += 1
                total_rows  += 1

            # Advance to next month
            if current.month == 12:
                current = datetime(current.year + 1, 1, 1)
            else:
                current = datetime(current.year, current.month + 1, 1)

    con.commit()
    con.close()

    print(f"Seeded {total_rows} extractions across {len(all_companies)} companies.")
    print(f"Database: {DB_PATH}")


if __name__ == "__main__":
    seed()
