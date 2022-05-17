const db = require('../_helpers/conBD');

module.exports = {
    getEmpresa
};

 async function getEmpresa(uid) {
    try {
        var collection =  await db.collection('Paguinas')
        .doc(uid)
        .get()
        .then(snapshot => {
          const document = snapshot.data()
          return document;
        })
        return collection;
    } catch (error) {
      throw new Error(error);
    }
  }