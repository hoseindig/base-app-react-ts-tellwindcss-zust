import re

# Read the TypeScript file
with open('src/data/words504.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Function to remove spaces between Persian characters
def remove_spaces_from_persian(match):
    text = match.group(0)
    # Remove spaces between Persian characters
    return re.sub(r'(?<=[\u0600-\u06FF])\s+(?=[\u0600-\u06FF])', '', text)

# Find all strings containing Persian text and fix them
# Look for quoted strings that contain Persian characters
content = re.sub(
    r'"[^"]*[\u0600-\u06FF][^"]*"',
    remove_spaces_from_persian,
    content
)

# Write back to file
with open('src/data/words504.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('File src/data/words504.ts updated successfully!')
