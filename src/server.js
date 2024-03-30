const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3400;
const server = require('http').createServer(app);
const { database } = require('./api/board.js');
const { dataTable } = require('./lib/db.js');


app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
     res.json("hello this is backend")
})


app.get("/newsApi", async(req, res, ctx) => {
       
    const orderList = await database.news_api(req.body);
    res.send(orderList);
   })

app.post("/jobApi", async(req, res, ctx) => {
       
   const orderList = await database.job_api(req.body);
   res.send(orderList);
  })

app.post("/residenceApi", async(req, res, ctx) => {
       
    const orderList = await database.residence_api(req.body);
    res.send(orderList);
   })

app.post("/welfareApi", async(req, res, ctx) => {
       
    const orderList = await database.welfare_api(req.body);
    res.send(orderList);
   })
app.post("/educationApi", async(req, res, ctx) => {
       
    const orderList = await database.education_api(req.body);
    res.send(orderList);
   })
app.post("/financeApi", async(req, res, ctx) => {
       
    const orderList = await database.finance_api(req.body);
    res.send(orderList);
    
   })

app.post("/join" , async(req, res) => {
    
     const value = req.body;
     const sqlQuery = `INSERT INTO Login (userId, userPassword) VALUES('${value.userId}','${value.userPassword}');`;
     const promisePool = dataTable.db.promise();
     try{
         const res_data = await promisePool.query(sqlQuery);
         res.send(res_data[0]);

    }catch(err){
       res.send(err);
    }

})

app.post("/MyList" , async(req, res) => {
    
  const value = req.body;
  const sqlQuery = `SELECT * FROM MyList`;
  const promisePool = dataTable.db.promise();
  try{
      const res_data = await promisePool.query(sqlQuery);

      if(res_data[0].length >= 0){
        const ListUpdate = `INSERT INTO MyList (userId, section, link , title) VALUES('${value[0]}', '${value[1]}','${value[2]}', '${value[3]}');`;
        const answer = res_data[0].map((v,i) => {
          const result = res_data[0][i].userId == value[0] && res_data[0][i].title == value[3];
          return result;
        })
        if(answer.includes(true)){
           return res.send('already');
        }else{
          const upload = await promisePool.query(ListUpdate);
          upload;
          return res.send('업로드성공');
         }
      }

 }catch(err){
    res.send(err);
 }

});

app.get("/MyList" , async(req, res) => {

  const sqlQuery = `SELECT * FROM MyList`;
  const promisePool = dataTable.db.promise();
  try{
    const res_data = await promisePool.query(sqlQuery);

      res.send(res_data[0]);

  }catch(err){
    res.send(err);
  }
  
})

app.post("/login" , async(req, res) => {
    
  console.log(req.body);
  const sqlQuery = `SELECT * FROM Login`;
  const promisePool = dataTable.db.promise();
  try{
    const res_data = await promisePool.query(sqlQuery);

    if(res_data[0][0].userId == req.body[0] && res_data[0][0].userPassword == req.body[1]){
      const ListUpdate = `INSERT INTO LoginList( userId, userPassword)  VALUES('${req.body[0]}' , '${req.body[1]}')`;
      const List_data = await promisePool.query(ListUpdate);
      List_data;
    
    }else{}

    return res.send(res_data[0]);

    }catch(err){
      console.log(err);
    }

})


app.get("/LoginList" , async(req, res) => {
    
  const sqlQuery = `SELECT * FROM LoginList`;
  const promisePool = dataTable.db.promise();

  try{
    const res_data = await promisePool.query(sqlQuery);
    res.send(res_data[0]);

    }catch(err){
      console.log(err);
    }

})

app.post("/Logout" , async(req, res) => {
    
  console.log(req.body);
  const sqlQuery01 = `DELETE FROM LoginList WHERE userId LIKE '${req.body[0]}';`;
  const sqlQuery02 = `DELETE FROM LoginList WHERE userPassword LIKE '${req.body[1]}';`;
  const promisePool = dataTable.db.promise();
  try{
    const res_data = await promisePool.query(sqlQuery01, sqlQuery02);
    res.send(res_data);
    }catch(err){
      console.log(err);
    }

})
 

server.listen(PORT, ()=>{
    console.log(`${PORT}로 작동중`);
  })

