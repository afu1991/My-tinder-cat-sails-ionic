


module.exports = {
    create : function (req, res) {
        var id_auth = req.param('owner');
        var id_card = req.param('target');
        Dislike.create({owner:id_auth,target:id_card}).exec(function createCB(err, created){
            console.log('Created user with name ' + created.id_card);
            return res.send(created);
        });
 
    },
   
    delete : function (req, res) {
        var id_like = req.param('id');
        Dislike.destroy({id : id_like}).exec(function deleteCB(err){
            console.log('The record has been deleted');
            return res.ok({
                success: 'Tout a été bien supprimé'
            });
        });
     
    },
    afficher : function (req, res) {
        var id_auth = req.param('id_auth');
        User.find({'id':id_auth}).populate('like').exec(function(err, users) {
            if(err) // handle error
            {

            }
            console.log(users);
        });

    },
    deleteByAll : function(req, res){
        var id_auth = req.param('id_auth');
        Dislike.destroy({owner : id_auth}).exec(function deleteCB(err){
            return res.ok({
                success: 'Tout a été bien supprimé'
            });
        });
    }

};