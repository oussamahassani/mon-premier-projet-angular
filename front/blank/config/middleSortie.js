const Lot = require('../models/lot');
const Mouvement = require('../models/mouvement')
const Matiere = require('../models/matiere');
updateLots = function (prod_ids, products, callback) {
    console.log(products)
    Lot.find({ id_produit: { $in: prod_ids } }).sort({ "_id": 1 }).exec(function (err, lots) {
        if (err) {
            callback({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message, obj: err })
        } else {
            let lotsForUpdate = [];
            let mouvements = [];
            for (let prod of products) {
                let qte = prod.asked_quantite;
                for (let lot of lots) {
                    if (lot.id_produit === prod.id_produit) {
                        if (qte != 0) {
                            if (lot.quantite >= qte) {
                                lot.quantite = lot.quantite - qte;
                                mouvements.push({
                                    num: "",
                                    id_lot: lot._id,
                                    quantite: qte,
                                    id_produit: lot.id_produit,
                                    type_produit: lot.type_produit,
                                    entree: false,
                                    prix_ref: prod.prix_ref,
                                    prix_cmp: prod.prix_cmp,
                                    quantite_stock: prod.quantite_stock 
                                })
                                qte = 0;
                                lotsForUpdate.push(lot);
                            } else {
                                qte = qte - lot.quantite;
                                mouvements.push({
                                    num: "",
                                    id_lot: lot._id,
                                    quantite: lot.quantite,
                                    id_produit: lot.id_produit,
                                    type_produit: lot.type_produit,
                                    entree: false,
                                    prix_ref: prod.prix_ref,
                                    prix_cmp: prod.prix_cmp,
                                    quantite_stock: prod.quantite_stock 
                                })
                                lot.quantite = 0;
                                lotsForUpdate.push(lot);
                            }
                        }
                    }
                }
            }
            Lot.collection.bulkWrite(
                lotsForUpdate.map((lot) => {
                    return {
                        updateOne: {
                            filter: { _id: lot._id },
                            update: {
                                $set: {
                                    quantite: lot.quantite
                                }
                            },
                            upsert: true
                        }
                    }
                }), {}, (err, result) => {
                    if (err) {
                        console.log({ success: false, msg: err })
                    } else {
                        addMouvements(mouvements, function (result) {
                            if (result.success) {
                                callback({ success: true, obj: result })
                            } else {
                                callback({ success: false, obj: result })
                            }
                        })
                    }
                })
        }
    });
}
addMouvements = function (mouvements_update, callback) {
    console.log("in mouvement")
    Mouvement.find({}).sort({ _id: -1 }).limit(1).exec(function (err, mouvements) {
        var now = new Date();
        let year = now.getFullYear();
        var name = 0;
        if (mouvements === undefined || mouvements.length == 0) {
            name = 0;
        } else {
            name = mouvements[0].num;
        }
        if (!name || name === 0) {
            name = '0' + year;
        } else {
            let x = String(name);
            let year_no = x.substr(x.length - 4, 4)
            let Mouvement_no = x.substr(0, x.length - 4);
            if (String(year) === year_no) {
                tmp = Number(Mouvement_no) + 1;
                name = (tmp) + '' + year_no;
            } else {
                name = '0' + year;
            }
        }
        if (err) {
            callback({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message, obj: err })
        } else {
            let index = 1;
            for (let mouv of mouvements_update) {
                if (index == 1) {
                    mouv.num = name;
                } else {
                    let x = name;
                    let year_no = x.substr(x.length - 4, 4)
                    let mouvement_no = x.substr(0, x.length - 4);
                    let tmp = Number(mouvement_no) + 1;
                    name = (tmp) + '' + year_no;
                    mouv.num = name;
                }
                index++;
            }
            Mouvement.insertMany(mouvements_update, function (err, result) {
                if (err) {
                    callback({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message, obj: err })
                } else {
                    console.log("ajouter mouvement avec succées" + result)
                    callback({ success: true, msg: "Ajout de mouvements avec succées ", obj: result });
                }
            })
        }

    })
}
module.exports.updateMatieres = function (prod_ids, products, callback) {
   console.log(products.length)
    Matiere.find({ _id: { $in: prod_ids.split(',') } }).exec(function (err, matieres) {
        if (err) callback({ success: false, msg: err, obj: err })
        for (let matiere of matieres) {
            let qte = products.filter(x => x.id_produit === String(matiere._id))[0].asked_quantite;
            matiere.stock = matiere.stock - qte;
            matiere.stock_reel = matiere.stock;
        }
        products = products.map(x => {
            return {
                id_produit: x.id_produit,
                asked_quantite: x.asked_quantite,
                prix_ref: matieres.filter(mat => String(mat._id) === x.id_produit)[0].prix_initial,
                prix_cmp: matieres.filter(mat => String(mat._id) === x.id_produit)[0].prix_achat,
                quantite_stock: matieres.filter(mat => String(mat._id) === x.id_produit)[0].stock
            }
        })
        Matiere.collection.bulkWrite(
            matieres.map((matiere) => {
                return {
                    updateOne: {
                        filter: { _id: matiere._id },
                        update: {
                            $set: {
                                stock: matiere.stock,
                                stock_reel: matiere.stock_reel
                            }
                        },
                        upsert: true
                    }
                }
            }), {}, (err, result) => {
                if (err) {
                    callback({ success: false, msg: err.errors[Object.keys(err.errors)[0]].message, obj: err })
                } else {
                    callback({ success: true, obj: result })
                    updateLots(prod_ids, products, function (result) {
                        if (result.success) {
                            callback({ success: true, obj: result })
                        } else {
                            callback({ success: false, obj: result })
                        }
                    })
                }
            })
    })
}

module.exports.parsMatiereIds = function (products) {
    let ids = "";
    for (let i = 0; i < products.length; i++) {
        ids += "" + products[i].id_produit + ","
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
}
