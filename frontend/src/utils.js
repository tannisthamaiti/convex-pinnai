export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
};

export const groupFilesByType = (files) => {
  const groupedFiles = {};
  files.forEach(file => {
    const ext = getFileExtension(file.name);
    groupedFiles[ext] = (groupedFiles[ext] || 0) + 1;
  });
  return groupedFiles;
};
