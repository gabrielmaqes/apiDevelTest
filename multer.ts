const multer = require("multer");
const path = require("path");
const fs = require("fs");

let info: string[];

export const config = (filename: string, oldFileName?: string) => ({
    storage: multer.diskStorage({
        destination: async (request: any, file: any, callback: any) => {
            let totalPath = __dirname + "/public/uploads";

            let currentImagePath = totalPath + "/" + oldFileName;

            if (fs.existsSync(currentImagePath)) {
                fs.unlinkSync(currentImagePath);
            }
            callback(null, path.resolve(totalPath));
        },
        filename: (request: any, file: any, callback: any) => {
            callback(null, filename + "." + file.originalname.split(".")[1]);
        },
    }),
    fileFilter: (req: any, file: any, callback: any) => {
        let ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            callback(new Error("Formato de arquivo não suportado."));
            return;
        }
        callback(null, true);
    },
});
