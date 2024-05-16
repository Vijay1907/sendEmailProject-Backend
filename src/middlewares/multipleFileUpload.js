const multer = require('multer');
const fs = require('fs');


function getMultipleFilesUploader(fieldNames, publicDirName = '', mimetypes) {
  if (!mimetypes) mimetypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync(`public/${publicDirName}`)) {
        fs.mkdirSync(`public/${publicDirName}`, { recursive: true });
      }
      cb(null, `public/${publicDirName}`);
    },
    filename: function (req, file, cb) {
      const { originalname } = file;
      let fileExt = '.jpeg';
      const extI = originalname.lastIndexOf('.');
      if (extI !== -1) {
        fileExt = originalname.substring(extI).toLowerCase();
      }
      const fileName = `${Date.now()}${fileExt}`;
      cb(null, fileName);
    },
  });

  const fieldsArray = fieldNames.map(name => ({ name }));

  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      mimetypes.includes(file.mimetype) ? cb(null, true) : cb(new ApiError('Invalid image type', 400));
    },
  }).fields(fieldsArray);

  return upload;
}

module.exports = {getMultipleFilesUploader};
