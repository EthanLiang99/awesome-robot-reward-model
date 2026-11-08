"""Local preview server for the project page, with HTTP Range support.

Browsers need Range responses to seek inside <video>; `python -m http.server`
does not send them. GitHub Pages does, so this is only for local preview.

Usage (from anywhere):
    python project-page/_tools/serve.py            # http://127.0.0.1:8765
    python project-page/_tools/serve.py 9000

Opening http://127.0.0.1:8765/_tools/og_card.html re-renders the social card and saves it
as assets/img/og.jpg (the only write this server accepts).
"""
import http.server
import os
import re
import sys
from functools import partial

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Handler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        self._span = None
        rng = self.headers.get("Range")
        path = self.translate_path(self.path)
        if not rng or os.path.isdir(path):
            return super().send_head()
        m = re.match(r"bytes=(\d*)-(\d*)$", rng.strip())
        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None
        size = os.fstat(f.fileno()).st_size
        a, b = m.groups() if m else ("", "")
        if not m or (a == "" and b == ""):
            start, end = 0, size - 1
        elif a == "":
            start, end = max(0, size - int(b)), size - 1
        else:
            start, end = int(a), min(int(b) if b else size - 1, size - 1)
        if start > end or start >= size:
            f.close()
            self._span = 0
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.end_headers()
            return None
        self._span = end - start + 1
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(self._span))
        self.end_headers()
        f.seek(start)
        return f

    def copyfile(self, source, outputfile):
        try:
            if not self._span:
                return super().copyfile(source, outputfile)
            left = self._span
            while left > 0:
                chunk = source.read(min(1 << 16, left))
                if not chunk:
                    break
                outputfile.write(chunk)
                left -= len(chunk)
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            pass  # the browser cancelled a range request; normal for video

    def do_POST(self):
        if self.path != "/_tools/save-og":
            self.send_error(404)
            return
        data = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        if data[:3] != b"\xff\xd8\xff":
            self.send_error(400, "expected a JPEG")
            return
        with open(os.path.join(SITE, "assets", "img", "og.jpg"), "wb") as f:
            f.write(data)
        self.send_response(204)
        self.end_headers()

    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        if os.environ.get("RRM_SERVE_QUIET") != "1":
            super().log_message(fmt, *args)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), partial(Handler, directory=SITE))
    print(f"Serving {SITE} at http://127.0.0.1:{port}/", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
