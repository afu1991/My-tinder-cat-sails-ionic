module.exports = {

    delete : function (req, res) {
        var id_like = req.param('id');
        Like.destroy({id : id_like}).exec(function deleteCB(err){
            console.log('The record has been deleted');
            return res.ok({
                success: 'Tout a été bien supprimé'
            });
        });
   
    },
    afficher : function (req, res) {
        console.log('afficher');
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
        Like.destroy({owner : id_auth}).exec(function deleteCB(err){
            console.log('The record has been deleted');
            return res.ok({
                success: 'Tout a été bien supprimé'
            });
        });
    }


};