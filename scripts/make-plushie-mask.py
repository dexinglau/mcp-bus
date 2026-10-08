"""Builds the recolour mask for the Sleepy Giant plushie photo.

Usage: python3 scripts/make-plushie-mask.py src/assets/plushie/sleepy-giant.webp \
           src/assets/plushie/sleepy-giant-mask.png

The output PNG marks body fur in the red channel and accent fabric (face,
belly, paws) in the green channel. The printed median lightness values are
the reference values in src/components/plushie/PlushiePhotoPreview.tsx.
Requires Pillow. Re-run (and adjust the outline polygon) if the photo changes.
"""
import sys, colorsys
from PIL import Image, ImageDraw, ImageFilter
im=Image.open(sys.argv[1]).convert('RGB'); W,H=im.size; px=im.load()
# Rough outline of the plushie so background pixels are never recoloured.
poly=[(118,98),(150,92),(185,98),(300,92),(340,72),(380,90),(405,120),(415,175),(420,218),(495,215),(510,200),(560,195),(600,215),(605,250),(630,290),(655,350),(665,410),(700,418),(762,418),(770,545),(640,565),(470,600),(320,600),(190,545),(75,505),(62,380),(125,250)]
sub=Image.new('L',(W,H),0); ImageDraw.Draw(sub).polygon(poly,fill=255); s_=sub.load()
body=Image.new('L',(W,H)); acc=Image.new('L',(W,H)); b=body.load(); a=acc.load()
Ls={'b':[], 'a':[]}
for y in range(H):
  for x in range(W):
    if not s_[x,y]: continue
    r,g,bb=px[x,y]; h,l,s=colorsys.rgb_to_hls(r/255,g/255,bb/255); h*=360
    if (h>=330 or h<=20) and s>0.25 and 0.06<l<0.85: b[x,y]=255; Ls['b'].append(l)
    elif 20<h<=55 and s>0.08 and l>0.26: a[x,y]=255; Ls['a'].append(l)
body=body.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(1))
acc=acc.filter(ImageFilter.MedianFilter(5)).filter(ImageFilter.GaussianBlur(1))
Image.merge('RGB',(body,acc,Image.new('L',(W,H)))).save(sys.argv[2], optimize=True)
for k,v in Ls.items(): v.sort(); print(k, 'median L', round(v[len(v)//2],3))
