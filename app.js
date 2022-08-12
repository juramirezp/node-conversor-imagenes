const express = require("express");
const cors = require("cors");
const multer = require("multer");
const sharp = require("sharp");

const app = express();
app.use(cors());
app.use(express.static(__dirname + "/output"));
PORT = 3002;

const helperImage = (filePath, fileName, size = 300) => {
	// return sharp(filePath).resize(size).toFile(`./optimized/${fileName}`);
	return (
		sharp(filePath)
			.resize(size)
			.webp({ quality: 50 })
			// .toBuffer()
			.toFile(`./output/${fileName}`)
	);
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads");
	},
	filename: (req, file, cb) => {
		const ext = file.originalname.split(".").pop();
		cb(null, `${Date.now()}.${ext}`);
	},
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
	helperImage(
		req.file.path,
		`sm-resize-${req.file.filename.split(".")[0]}.webp`,
		50
	);
	helperImage(
		req.file.path,
		`md-resize-${req.file.filename.split(".")[0]}.webp`,
		500
	);
	helperImage(
		req.file.path,
		`lg-resize-${req.file.filename.split(".")[0]}.webp`,
		1000
	);
	helperImage(
		req.file.path,
		`xl-resize-${req.file.filename.split(".")[0]}.webp`,
		1500
	);
	res.send({
		message: "Convert success!",
		path: `xl-resize-${req.file.filename.split(".")[0]}.webp`,
	});
});

app.listen(PORT, () => {
	console.log("Corriendo en el puerto ", PORT);
});
