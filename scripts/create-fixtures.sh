#!/usr/bin/env bash
set -e
mkdir -p tests/fixtures
cat > tests/fixtures/sample.png <<'PNGBASE64'
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEklEQVQIW2P8z/C/HwAIAwMBybM8xQAAAABJRU5ErkJggg==
PNGBASE64
# decode base64 into binary
base64 --decode tests/fixtures/sample.png > tests/fixtures/sample.png.decoded.png || true
mv tests/fixtures/sample.png.decoded.png tests/fixtures/sample.png || true
echo "Created tests/fixtures/sample.png"
