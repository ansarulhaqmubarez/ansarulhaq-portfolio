#!/bin/sh
# Re-encode a video for smooth scroll scrubbing: every frame is a keyframe (-g 1).
# Usage: sh tools/encode-hero.sh input.mp4   ->  hero/hero.mp4
mkdir -p hero
ffmpeg -y -i "$1" -an -vf "scale=-2:720,fps=24" -c:v libx264 -preset slow -crf 24 -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart hero/hero.mp4
