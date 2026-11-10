AUTHOR = "Farid Mirzayev"
SITENAME = "Farid Mirzayev"
SITEDESCRIPTION = "Python, performance, and software engineering."
SITEURL = ""

PATH = "content"
TIMEZONE = "Europe/Warsaw"
DEFAULT_LANG = "en"
THEME = "theme"
STATIC_PATHS = ["images"]

PAGE_URL = "{slug}/"
PAGE_SAVE_AS = "{slug}/index.html"
ARTICLE_URL = "posts/{slug}/"
ARTICLE_SAVE_AS = "posts/{slug}/index.html"
ARCHIVES_URL = "posts/"
ARCHIVES_SAVE_AS = "posts/index.html"
AUTHOR_SAVE_AS = ""
AUTHORS_SAVE_AS = ""
CATEGORY_SAVE_AS = ""
CATEGORIES_SAVE_AS = ""
TAG_SAVE_AS = ""
TAGS_SAVE_AS = ""
DIRECT_TEMPLATES = ["index", "archives", "sitemap"]
SITEMAP_SAVE_AS = "sitemap.xml"
DEFAULT_PAGINATION = False

FEED_ALL_ATOM = None
FEED_ALL_RSS = "index.xml"
CATEGORY_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

LINKS = (
    ("GitHub", "https://github.com/mirzayevio"),
    ("LinkedIn", "https://www.linkedin.com/in/mirzayevio/"),
)
