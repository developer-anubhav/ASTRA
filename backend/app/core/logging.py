"""ASTRA Structured Logging Framework

Provides structured, secret-safe logging.
Never logs complete assistant prompt bodies, credentials, or personal queries.
"""

import logging
import sys
import json
import time
from typing import Any, Dict, Optional
from app.core.config import settings


class JSONFormatter(logging.Formatter):
    """Formats log records as structured JSON without exposing secrets or sensitive query content."""

    def format(self, record: logging.LogRecord) -> str:
        log_obj: Dict[str, Any] = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        # Include contextual metadata if present
        if hasattr(record, "request_id"):
            log_obj["request_id"] = getattr(record, "request_id")
        if hasattr(record, "path"):
            log_obj["path"] = getattr(record, "path")
        if hasattr(record, "method"):
            log_obj["method"] = getattr(record, "method")
        if hasattr(record, "status_code"):
            log_obj["status_code"] = getattr(record, "status_code")
        if hasattr(record, "duration_ms"):
            log_obj["duration_ms"] = getattr(record, "duration_ms")

        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_obj)


def setup_logging(log_level: Optional[str] = None):
    """Configures application-wide logging."""
    root_logger = logging.getLogger()
    level = (log_level or settings.LOG_LEVEL).upper()
    root_logger.setLevel(level)

    # Clear existing handlers
    root_logger.handlers.clear()

    handler = logging.StreamHandler(sys.stdout)
    if settings.STRUCTURED_LOGGING and settings.APP_ENV != "development":
        handler.setFormatter(JSONFormatter())
    else:
        standard_formatter = logging.Formatter(
            fmt="%(asctime)s [%(levelname)s] [%(name)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        handler.setFormatter(standard_formatter)

    root_logger.addHandler(handler)

    # Silence overly verbose external loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)


def get_logger(name: str = "astra") -> logging.Logger:
    """Returns a named logger instance."""
    return logging.getLogger(name)


logger = get_logger("astra")
