import os
import json

def describe_directory(root_dir, exclude_dirs):
    dir_structure = {"name": os.path.basename(root_dir), "type": "directory", "children": []}
    path_dict = {root_dir: dir_structure}
    
    for root, dirs, files in os.walk(root_dir, topdown=True):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]  # Исключаем нежелательные директории
        parent = path_dict[root]
        for directory in dirs:
            dir_path = os.path.join(root, directory)
            dir_info = {"name": directory, "type": "directory", "children": []}
            parent['children'].append(dir_info)
            path_dict[dir_path] = dir_info
        
        for file in files:
            file_info = {"name": file, "type": "file"}
            parent['children'].append(file_info)
    
    return dir_structure

def save_structure_to_file(structure, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(structure, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    current_directory = os.path.dirname(os.path.abspath(__file__))
    exclude_dirs = ['node_modules', '.next', '.git']  # Добавляем сюда папки, которые нужно исключить
    try:
        structure = describe_directory(current_directory, exclude_dirs)
        input("Press key to save file and exit.")
        save_structure_to_file(structure, os.path.join(current_directory, 'directory_structure.json'))
    except Exception as e:
        print(e)
        input("Press key exit.")
