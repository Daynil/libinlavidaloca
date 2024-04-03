import os
from enum import StrEnum
from pathlib import Path


class CColors(StrEnum):
    HEADER = "\033[95m"
    OKBLUE = "\033[94m"
    OKCYAN = "\033[96m"
    OKGREEN = "\033[92m"
    WARNING = "\033[93m"
    FAIL = "\033[91m"
    ENDC = "\033[0m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"


def cprint(text: str, color: CColors):
    print(f"{color}{text}{CColors.ENDC}")


def load_env(env_path=Path(".env")):
    with env_path.open() as f:
        env_lines = f.readlines()

    for l in env_lines:
        k, v = l.rstrip().split("=")
        os.environ[k] = v


if __name__ == "__main__":
    load_env()
    print(os.environ["CLOUDFLARE_ZONE_ID"])
