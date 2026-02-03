import json
import re

# Read the JSON file
with open('public/data/words504.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Function to remove spaces between Persian characters
def remove_spaces_from_persian(text):
    if not text:
        return text
    # Remove spaces between Persian characters
    # Persian Unicode range is \u0600-\u06FF
    return re.sub(r'(?<=[\u0600-\u06FF])\s+(?=[\u0600-\u06FF])', '', text)

# Apply the fix to all items
count = 0
for item in data:
    original_def = item.get('definition', '')
    original_trans = item.get('translation', '')
    
    if 'definition' in item:
        item['definition'] = remove_spaces_from_persian(item['definition'])
        if item['definition'] != original_def:
            count += 1
    
    if 'translation' in item:
        item['translation'] = remove_spaces_from_persian(item['translation'])
        if item['translation'] != original_trans:
            count += 1

# Write back to file
with open('public/data/words504.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'File updated successfully! Fixed items.')
