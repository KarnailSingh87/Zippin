import os
import re

def fix_imports_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Match import/export statements that use relative paths
    pattern = re.compile(r'(import|export)(.*?)from\s+([\'"])(\.\.?/[^\'"]+)\3')
    
    def replacer(match):
        keyword = match.group(1)
        rest = match.group(2)
        quote = match.group(3)
        path = match.group(4)
        
        # Determine absolute path to check if it's a directory
        dirpath = os.path.dirname(filepath)
        target_path = os.path.join(dirpath, path)
        
        if os.path.isdir(target_path):
            new_path = path + '/index.js'
        elif not path.endswith('.js'):
            new_path = path + '.js'
        else:
            new_path = path
            
        return f'{keyword}{rest}from {quote}{new_path}{quote}'

    new_content = pattern.sub(replacer, content)
    
    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed imports in {filepath}")

def main():
    src_dir = os.path.join(os.path.dirname(__file__), 'src')
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.js'):
                fix_imports_in_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
