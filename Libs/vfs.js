        // Envy VFS
        // Create a folder in localStorage
        function createFolder(folderName) {
            const folderKey = `VFS_FOLDER_${folderName}`;
            if (!localStorage.getItem(folderKey)) {
                localStorage.setItem(folderKey, ''); // Empty string to represent a folder
                console.log(`Folder created: ${folderName}`);
            } else {
                console.log(`Folder already exists: ${folderName}`);
            }
        }

        // Save a file in localStorage with folder support
        function saveFile(filePath, fileContent) {
            const folderName = filePath.includes('/') ? filePath.split('/')[0] : 'root';
            const folderKey = `VFS_FOLDER_${folderName}`;

            // Ensure the folder exists before saving the file
            if (!localStorage.getItem(folderKey)) {
                console.error(`Folder does not exist: ${folderName}. Create it first!`);
                return;
            }

            localStorage.setItem(filePath, fileContent);
            console.log(`Saved file: ${filePath}`);
        }

        // Delete a file or folder
        function deleteFileOrFolder(filePath) {
            const isFolder = localStorage.getItem(`VFS_FOLDER_${filePath}`) !== null;

            if (isFolder) {
                // Delete all files in the folder and the folder itself
                const folderKey = `VFS_FOLDER_${filePath}`;
                const keysToDelete = [];

                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith(`${filePath}/`) || key === folderKey) {
                        keysToDelete.push(key);
                    }
                });

                keysToDelete.forEach(key => {
                    localStorage.removeItem(key);
                    console.log(`Deleted: ${key}`);
                });

                console.log(`Folder "${filePath}" and its contents have been deleted.`);
            } else {
                if (localStorage.getItem(filePath)) {
                    localStorage.removeItem(filePath);
                    console.log(`Deleted file: ${filePath}`);
                } else {
                    console.error(`File or folder not found: ${filePath}`);
                }
            }
        }

        // Rename a file or folder in the VFS
        function renameFileOrFolder(oldPath, newPath) {
            const isFolder = localStorage.getItem(`VFS_FOLDER_${oldPath}`) !== null;

            if (isFolder) {
                // Rename a folder, updating all files and subfolders
                const folderKey = `VFS_FOLDER_${oldPath}`;
                const keysToRename = [];

                // Collect all files and folders that start with the old folder path
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith(`${oldPath}/`) || key === folderKey) {
                        keysToRename.push(key);
                    }
                });

                keysToRename.forEach(oldKey => {
                    const newKey = oldKey.replace(oldPath, newPath);

                    // Rename folder and all its contents
                    if (oldKey === folderKey) {
                        // Rename folder key
                        localStorage.setItem(`VFS_FOLDER_${newPath}`, '');
                        localStorage.removeItem(`VFS_FOLDER_${oldPath}`);
                        console.log(`Renamed folder: ${oldPath} to ${newPath}`);
                    } else {
                        // Rename file within the folder
                        const fileContent = localStorage.getItem(oldKey);
                        localStorage.setItem(newKey, fileContent);
                        localStorage.removeItem(oldKey);
                        console.log(`Renamed file: ${oldKey} to ${newKey}`);
                    }
                });
            } else {
                // Rename a single file
                const fileContent = localStorage.getItem(oldPath);
                if (fileContent) {
                    localStorage.setItem(newPath, fileContent);
                    localStorage.removeItem(oldPath);
                    console.log(`Renamed file: ${oldPath} to ${newPath}`);
                } else {
                    console.error(`File not found: ${oldPath}`);
                }
            }
        }

        // ZIP extraction and upload handling
        function handleZipFile(zipFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                JSZip.loadAsync(event.target.result).then(function(zip) {
                    console.log("ZIP file loaded. Extracting...");

                    // Go through each file in the zip
                    zip.forEach(function(relativePath, zipEntry) {
                        if (!zipEntry.dir) {
                            // It's a file, so read its contents
                            zipEntry.async("string").then(function(fileContent) {
                                // Save the file into the VFS (localStorage)
                                saveFile(relativePath, fileContent);
                            });
                        } else {
                            // It's a folder, so create it in the VFS
                            createFolder(relativePath.slice(0, -1)); // Remove trailing slash for folder
                        }
                    });

                    console.log("Extraction complete.");
                });
            };

            reader.readAsArrayBuffer(zipFile);
        }

        // List files and folders in the VFS (logs them to the console)
        function listFiles() {
            const keys = Object.keys(localStorage);
            const folderMap = {};

            keys.forEach(key => {
                if (key.startsWith('VFS_FOLDER_')) {
                    const folder = key.replace('VFS_FOLDER_', '');
                    folderMap[folder] = folderMap[folder] || [];
                } else {
                    const pathParts = key.split('/');
                    if (pathParts.length > 1) {
                        const folder = pathParts[0];
                        const file = pathParts.slice(1).join('/');
                        folderMap[folder] = folderMap[folder] || [];
                        folderMap[folder].push(file);
                    } else {
                        folderMap['root'] = folderMap['root'] || [];
                        folderMap['root'].push(key);
                    }
                }
            });

            // Log the folder and file structure to the console
            console.log('VFS Structure:');
            Object.keys(folderMap).forEach(folder => {
                console.log(`- ${folder}/`);
                folderMap[folder].forEach(file => {
                    console.log(`  - ${file}`);
                });
            });
        }
        console.log("[VFS] Virtual File System loaded")  