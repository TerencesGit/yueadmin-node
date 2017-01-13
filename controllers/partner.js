var Partner = require('../models/partner');

//LOGO上传
exports.logoUpload = function(req, res, next){
	var idcardData = req.files.idcard_front;
	console.log(idcardData)
	if(idcardData && idcardData.originalFilename){
		var idcardPath = idcardData.path;
		fs.readFile(idcardPath, function(err, data){
			var timestamp = Date.now();
			var type = idcardData.name.split('.')[1];
			var idcardFront = 'idcard_front_' + timestamp + '.' + type;
			var newPath = path.join(__dirname, '../', 'public/upload/idcard/' + idcardFront);
			fs.writeFile(newPath, data, function(err){
				req.idcardFront = idcardFront;
				next()
			})
		})
	}else{
		next()
	}
}
exports.register = function(req, res){

}