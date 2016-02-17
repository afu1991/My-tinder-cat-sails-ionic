module.exports = {
	
   updateImg : function (req, res) {
       var param = req.allParams();
		User.findOne({ token: param.token }, function (err, user) {
            if (err) { return; }

            if (!user) {
                 return res.json(500, { error: 'Une erreur est survenue' })
            }
            User.update({username:user.username},{image:param.image}).exec(function afterwards(err, updated){
                if (err) {
                    return;
                }
                return res.ok('Success');
            });
        });
    },
    update : function (req, res) {
       var param = req.allParams();
		
		console.log(param);
		
		User.findOne({ token: param.token }, function (err, user) {
            if (err) { return; }
            
            if (!user) {
                 return res.json(500, { error: 'Une erreur est survenue' })
            }

            User.update({username:user.username},param).exec(function afterwards(err, updated){
                if (err) {
                    return;
                }
                return res.ok('Success');
            });
        });
    }
};