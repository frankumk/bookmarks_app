const pg = require('pg');
const express = require('express');
const app = express();
const {syncAndSeed, db, Bookmarks} = require('./db')

app.use(express.urlencoded({extended:false}));
app.use(express.json());
//need to make form work and delete work

 app.get('/', async (req, res, next)=>{
     const books = await Bookmarks.findAll()
     
     res.send(`
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <h1>Bookmarks (${books.length})</h1>
            <form method="POST">
                <input type='text' name="name" placeholder='Enter Site Name'></input>
                <input type='text' name="url" placeholder='Enter Site URL'></input>
                <input type='text' name="category" placeholder='Enter Category'></input>
                <button>Create</button>
            </form>
            <div>
                <ul>
                    ${books.reduce((acc,book)=>{
                        if(acc.includes(book.category)){
                            return acc
                        }else{
                            acc.push(book.category)
                            return acc
                        }
                    },[]).map(async(curr)=>{
                        //add key word raw
                        let count =  await Bookmarks.findAll({  where: {   category: curr}  }, {raw : true}); //need to fix count
                        console.log(count);
                        return `
                            <li><a href='/bookmarks/${curr}'>${curr}(${count.length})</a></li>
                        `
                    }).join('')}
                </ul>
            </div>
        </body>
        </html>
     `)
 })

 app.post('/',async(req,res,next)=>{
     //res.send(req.body);
     try{
        const bookmark = await Bookmarks.create(req.body);
        res.redirect('/');
     }catch(ex){

     }
 })

 app.get('/bookmarks/:name', async (req,res,next)=>{
    const book = await Bookmarks.findAll({where: { category: req.params.name} })
    const books = await Bookmarks.findAll()
    res.send(`
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <h1>Bookmarks (${books.length})</h1>
            <div>
                <h2>${req.params.name}(${book.length})</h2>
                <a href='/'>Back</a>
                <ul>
                    ${book.map(curr=>{
                        return `<li><a href='${curr.url}'>${curr.name}</a><button>x</button></li>`
                    }).join('')}
                </ul>
            </div>
        </body>
        </html>
     `)
 })

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