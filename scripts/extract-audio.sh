#!/bin/bash

# Extract audio from conference videos and convert to MP3
# This script creates audio-only versions of the conference messages

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

MESSAGES_DIR="content/messages"
OUTPUT_DIR="public/audio"

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}❌ ffmpeg is not installed${NC}"
    echo "Install it with: brew install ffmpeg"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo -e "${GREEN}🎵 CBC Audio Extraction Script${NC}"
echo "=================================="
echo ""

# Function to extract audio
extract_audio() {
    local input_file="$1"
    local filename=$(basename "$input_file" .mov)
    local output_file="$OUTPUT_DIR/${filename}.mp3"
    
    if [ ! -f "$input_file" ]; then
        echo -e "${RED}❌ File not found: $input_file${NC}"
        return 1
    fi
    
    local input_size=$(du -h "$input_file" | cut -f1)
    echo -e "${YELLOW}🎵 Extracting audio: $filename${NC}"
    echo "   Input: $input_file ($input_size)"
    echo "   Output: $output_file"
    echo ""
    
    # Extract audio and convert to MP3
    # -vn = no video
    # -acodec libmp3lame = use MP3 encoder
    # -q:a 2 = VBR quality (0-9, 2 is high quality ~170-210 kbps)
    ffmpeg -i "$input_file" \
        -vn \
        -acodec libmp3lame \
        -q:a 2 \
        -y \
        "$output_file"
    
    local output_size=$(du -h "$output_file" | cut -f1)
    echo ""
    echo -e "${GREEN}✅ Extracted: $filename${NC}"
    echo "   Original: $input_size"
    echo "   Audio MP3: $output_size"
    echo ""
}

# Get list of MOV files
mov_files=("$MESSAGES_DIR"/*.mov)

if [ ! -e "${mov_files[0]}" ]; then
    echo -e "${RED}❌ No MOV files found in $MESSAGES_DIR${NC}"
    exit 1
fi

echo "Found ${#mov_files[@]} video(s) to extract audio from"
echo ""

# Extract audio from each video
for video in "${mov_files[@]}"; do
    extract_audio "$video"
done

echo ""
echo -e "${GREEN}✨ All audio files extracted successfully!${NC}"
echo ""
echo "Audio files are in: $OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "1. Audio files will be automatically included in the deployment"
echo "2. Update the website to display audio players"
echo "3. Run: npm run deploy"
echo ""
