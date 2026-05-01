import os
import glob
import re

# 1. Update hardcoded colors in CSS
css_files = glob.glob('css/*.css') + glob.glob('pages/*/*.css') + glob.glob('pages/*/*/*.css')
for file in css_files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace old brand red #d9534f with new deeper red #c1121f
        content = re.sub(r'#d9534f\b', '#c1121f', content, flags=re.IGNORECASE)
        
        # Replace old background grey #2b2b2b with brand black #0a0908
        content = re.sub(r'#2b2b2b\b', '#0a0908', content, flags=re.IGNORECASE)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed colors in {file}')
    except Exception as e:
        print(f'Error on {file}: {e}')

# 2. Fix Italian residual in HTML files
html_files = glob.glob('*.html') + glob.glob('pages/*/*.html') + glob.glob('pages/*/*/*.html')
for file in html_files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Fix L'Arte -> El Arte
        content = content.replace("L'Arte", "El Arte")
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed text in {file}')
    except Exception as e:
        print(f'Error on {file}: {e}')
