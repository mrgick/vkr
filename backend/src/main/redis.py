from django.core.cache import cache
from django.conf import settings


# LINK - https://github.com/jazzband/django-redis#scan--delete-keys-in-bulk
def delete_cache(key_prefix: str):
    """
    Delete all cache keys with the given prefix.
    """
    keys_pattern = f"views.decorators.cache.cache_*.{key_prefix}.*.{settings.LANGUAGE_CODE}.{settings.TIME_ZONE}"
    cache.delete_pattern(keys_pattern)
