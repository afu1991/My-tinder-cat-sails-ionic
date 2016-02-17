module.exports = {

    login : function (req, res) {
        var bcrypt = require('bcrypt');
        var randtoken = require('rand-token');
        var username = req.param('username');
        var password = req.param('password');
        
        User.findOne({ username: username }, function (err, user) {
            if (err) { return; }
            
            if (!user) {
                 return res.json(500, { error: 'Votre identifiant ou mot de passe incorrect' })
            }
            bcrypt.compare(password, user.password , function(err, res) {

                // res == true 
            });
            var token = randtoken.generate(16);
            User.update({username:username},{token:token}).exec(function afterwards(err, updated){
                if (err) {
                    return;
                }
                return res.json(200, {
                    auth_profil: {
                        username : updated[0].username,
                        firstname : updated[0].firstname,
                        lastname : updated[0].lastname,
                        id : updated[0].id
                    }, token: token })
            });
        });
    },
    isLogged : function (req, res) {
        var token = req.param('token');
        User.findOne({token:token}).exec(function findOneCB(err, found){
            if (err) {
                return;
            }
            if(typeof found === 'undefined') {
                return res.json(500, { error: 'Vous ete pas connecter' })
            }
            return res.send(found);
        });
    },
     afficher : function (req, res) {
        var token = req.param('token');
        User.find({'token': token}).populate('liked','disliked').exec(function(err, users) {
            if(err) // handle error
            {

            }
            return res.ok(users[0]);
        });

    }

};