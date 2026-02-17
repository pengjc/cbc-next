# Upload Conference Videos to Vimeo

## Quick Start

1. **Upload videos to Vimeo**
   - Go to https://vimeo.com and sign in
   - Click "New video" → "Upload"
   - Upload each conference video
   - Set privacy to "Unlisted" or "Public" (not "Private")

2. **Get Vimeo URLs**
   - After upload completes, click on each video
   - Copy the URL from the browser (e.g., `https://vimeo.com/123456789`)

3. **Update the website**
   - Open `lib/messages.ts`
   - Paste Vimeo URLs into the `vimeoUrl` fields
   - Save the file

4. **Deploy**
   ```bash
   npm run deploy
   ```

## Example Configuration

Edit `lib/messages.ts`:

```typescript
export const messages = [
  {
    id: 'message1',
    title: 'Message 1',
    speaker: 'Conference Speaker',
    date: '2026-01-17',
    description: 'First message of the Carolinas Blending Conference 2026',
    vimeoUrl: 'https://vimeo.com/123456789', // ← Add your Vimeo URL here
  },
  // ... more messages
];
```

## Benefits of Vimeo

✅ **No bandwidth costs** - Vimeo handles all streaming  
✅ **Professional player** - Beautiful, responsive video player  
✅ **Adaptive streaming** - Automatic quality adjustment  
✅ **No setup needed** - Just upload and embed  
✅ **Analytics** - View counts and engagement stats  
✅ **Privacy controls** - Unlisted, password-protected, or public  
✅ **Download options** - Allow or prevent downloads  

## Vimeo Privacy Settings

### Unlisted (Recommended)
- ✅ Anyone with the link can watch
- ✅ Won't appear in Vimeo search
- ✅ Can be embedded on your website
- ❌ Not discoverable publicly

### Public
- ✅ Anyone can find and watch
- ✅ Appears in Vimeo search
- ✅ Can be embedded anywhere
- ⚠️ Fully discoverable

### Private (Not Recommended for Website)
- ❌ Cannot be embedded
- ❌ Requires Vimeo login to watch
- Only use if you want restricted access

## Vimeo Pricing (as of 2026)

| Plan | Price | Storage | Monthly Views |
|------|-------|---------|---------------|
| **Free** | $0 | 500 MB/week | Limited |
| **Plus** | $7/month | 5 GB/week | Unlimited |
| **Pro** | $20/month | 20 GB/week | Unlimited |
| **Premium** | $75/month | Unlimited | Unlimited |

**Recommendation**: Vimeo Plus ($7/month) is perfect for 3 conference videos.

**Cost comparison**:
- AWS S3 (uncompressed): $200+/month
- AWS S3 (compressed): $27/month
- **Vimeo Plus: $7/month** ✅

## Upload Tips

1. **Upload original quality** - Vimeo will optimize
2. **Add video titles and descriptions** on Vimeo
3. **Set thumbnail** - Choose a nice preview image
4. **Enable subtitles** if available
5. **Test playback** before deploying website

## After Upload

Once you've added Vimeo URLs to `lib/messages.ts`:

```bash
# Test locally first
npm run dev
# Visit http://localhost:3000/messages

# If everything looks good, deploy
npm run deploy
```

## Troubleshooting

**"Video is private"**
- Change video privacy to "Unlisted" or "Public" in Vimeo settings

**"Embedding disabled"**
- Enable embedding in Vimeo video settings

**"Video won't play"**
- Check that the Vimeo URL is correct
- Ensure you're using the video URL, not the channel URL

**"Wrong video displays"**
- Double-check the video ID in the URL

## Next Steps

1. ✅ Upload videos to Vimeo
2. ✅ Copy Vimeo URLs
3. ✅ Update `lib/messages.ts`
4. ✅ Test locally with `npm run dev`
5. ✅ Deploy with `npm run deploy`

That's it! Much simpler than AWS S3 setup. 🎉
