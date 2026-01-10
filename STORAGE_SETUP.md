# Supabase Storage Setup Guide

## Issue: Property images not displaying (broken image icon)

This means the `property-images` storage bucket either:
1. Doesn't exist yet
2. Exists but isn't configured as public
3. Has incorrect RLS policies

## Solution: Set up Storage Bucket in Supabase Dashboard

### Step 1: Navigate to Storage
1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/dunecyusauwafguvksjl
2. Click on **Storage** in the left sidebar
3. Look for a bucket named `property-images`

### Step 2: Create Bucket (if it doesn't exist)
1. Click **"New bucket"** button
2. Name: `property-images`
3. **Public bucket**: Toggle this to **ON** (very important!)
4. Click **Create bucket**

### Step 3: Verify Bucket is Public
1. Click on the `property-images` bucket
2. Go to **Configuration** tab
3. Ensure **"Public bucket"** is toggled **ON**
4. If not, toggle it on and save

### Step 4: Verify RLS Policies (should already exist from migration)
Go to **Policies** tab and ensure these policies exist:

**SELECT (Read) Policy:**
- Policy name: "Anyone can view property images"
- Target roles: `public`
- USING expression: `true`

**INSERT Policy:**
- Policy name: "Authenticated users can upload property images"
- Target roles: `authenticated`
- WITH CHECK expression: `true`

**UPDATE Policy:**
- Policy name: "Authenticated users can update property images"  
- Target roles: `authenticated`
- USING expression: `true`

**DELETE Policy:**
- Policy name: "Authenticated users can delete property images"
- Target roles: `authenticated`
- USING expression: `true`

### Step 5: Test Upload
1. Log into your admin panel
2. Try uploading a property with an image
3. Check the browser console (F12) for the logged image URL
4. Copy that URL and paste it in a new browser tab to verify it loads

### Expected URL Format
Your uploaded images should have URLs like:
```
https://dunecyusauwafguvksjl.supabase.co/storage/v1/object/public/property-images/[filename].jpg
```

### Troubleshooting

**If images still don't load:**
1. Open browser DevTools (F12) → Console tab
2. Look for the logged "Uploaded image URL:" message
3. Copy that URL and test it in a new tab
4. If it shows "Object not found" or 404:
   - The bucket might not be public
   - The file might not have uploaded successfully
5. If it shows "Access denied":
   - Check RLS policies on the storage bucket
   - Make sure public bucket is enabled

**Quick Test:**
Try this URL in your browser (after uploading an image):
```
https://dunecyusauwafguvksjl.supabase.co/storage/v1/object/public/property-images/
```
- Should show: `{"error":"Malformed key"}` (this is good - means bucket exists and is accessible)
- Should NOT show: Authentication error or 404

## Alternative: Use Database URLs Instead

If you want to bypass Supabase storage entirely and use external image URLs:

1. Use image hosting services like:
   - Imgur
   - Cloudinary
   - AWS S3
   - imgbb
   
2. Upload images there and paste the direct image URLs into the admin form

3. The property form already supports pasting URLs directly
