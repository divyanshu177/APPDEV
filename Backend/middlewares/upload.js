const multer=require('multer');
const fs = require('fs');
const path = require('path');

console.log("in middleware");

const uploadPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

const storage=multer.diskStorage({
    destination:(req,file,cb)=> {
        cb(null,'../uploads');
    },
    filename:(req,file,cb) => {
        const ext=path.extname(file.originalname);
        cb(null,Date.now() + '-' +file.originalname)
    },
});

const upload = multer({ storage });
console.log("storage created");
module.exports=upload;