import shutil
import subprocess
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path


OUTPUT = Path("output")


class SiteTests(unittest.TestCase):
    def test_legacy_generated_site_is_not_in_source_root(self):
        for path in (
            ".nojekyll",
            "about",
            "bookmarks",
            "categories",
            "css",
            "images",
            "index.html",
            "index.xml",
            "js",
            "lib",
            "posts",
            "resume",
            "sitemap.xml",
            "tags",
        ):
            with self.subTest(path=path):
                self.assertFalse(Path(path).exists())

    def test_required_pages_exist(self):
        for path in (
            "index.html",
            "about/index.html",
            "resume/index.html",
            "projects/index.html",
            "posts/index.html",
            "posts/1/index.html",
            "bookmarks/index.html",
            "theme/css/site.css",
            "theme/fonts/JetBrainsMono-Regular.woff2",
            "images/favicon.ico",
        ):
            with self.subTest(path=path):
                self.assertTrue((OUTPUT / path).is_file())

    def test_homepage_and_archived_post_are_honest(self):
        home = (OUTPUT / "index.html").read_text(encoding="utf-8")
        archived = (OUTPUT / "posts/1/index.html").read_text(encoding="utf-8")
        self.assertIn("Profiling Python", home)
        self.assertIn("placeholder text", archived)
        self.assertNotIn("latest.cactus.chat", home)

    def test_removed_page_is_not_generated(self):
        self.assertFalse((OUTPUT / "sd").exists())

    def test_rss_is_valid(self):
        root = ET.parse(OUTPUT / "index.xml").getroot()
        self.assertEqual(root.tag, "rss")
        self.assertIsNotNone(root.find("channel"))

    def test_sitemap_includes_pages_and_excludes_removed_page(self):
        root = ET.parse(OUTPUT / "sitemap.xml").getroot()
        locations = [
            node.text
            for node in root.findall("{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
        ]
        self.assertIn("https://mirzayevio.github.io/projects/", locations)
        self.assertNotIn("https://mirzayevio.github.io/sd/", locations)

    def test_article_is_listed_and_in_feed(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            temp = Path(temp_dir)
            shutil.copytree("content", temp / "content")
            posts = temp / "content" / "posts"
            posts.mkdir()
            (posts / "test.md").write_text(
                "Title: Test article\nDate: 2026-01-02\nSlug: test-article\n\nTest content.\n",
                encoding="utf-8",
            )
            result = subprocess.run(
                [sys.executable, "-m", "pelican", str(temp / "content"), "-s", "publishconf.py",
                 "-o", str(temp / "output"), "--fatal", "errors"],
                capture_output=True,
                text=True,
                encoding="utf-8",
                check=False,
            )
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            site = temp / "output"
            self.assertTrue((site / "posts/test-article/index.html").is_file())
            self.assertIn("Test article", (site / "posts/index.html").read_text(encoding="utf-8"))
            self.assertIn("Test article", (site / "index.xml").read_text(encoding="utf-8"))
            self.assertIn("/posts/test-article/", (site / "sitemap.xml").read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
