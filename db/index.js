const Sequelize = require('sequelize');
const {STRING} = Sequelize;


const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/bookmarks_db');


const Bookmarks = db.define('Bookmark',{
    name: STRING,
    url: {
        type:STRING,
        validate: {
            isUrl: true,
        }
    },
    category: STRING
});

const syncAndSeed = async()=>{
    await db.sync({force:true});
    await Bookmarks.create({name: 'fullstack', url: 'https://www.fullstackacademy.com/', category: 'code'});
}

const start = async()=>{
    try{
        await db.authenticate();
        await syncAndSeed();

        const port = process.env.PORT || 3000;
        app.listen(port, ()=>console.log(`listening on port ${port}`));
    }catch(ex){
        console.log(ex);
    }

}
start();

module.export = {
    syncAndSeed,
    db,
    Bookmarks
}