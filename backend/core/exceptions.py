class ComparisonException(Exception):
    """Base exception for comparison operations"""
    pass


class ValidationException(Exception):
    """Exception for validation errors"""
    pass


class NLPProcessorException(Exception):
    """Exception for NLP processing errors"""
    pass