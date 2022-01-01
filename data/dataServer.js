const fs= require("fs")
const express = require("express")
const cors = require("cors")
const _ = require("lodash")
const {v4 : uuid} = require("uuid")
const { toInteger } = require("lodash")

const app = express();

app.use(cors())
app.use(express.json())

const path = require('path');

app.get("/products", async (req,res)=>{
  const id = req.query.id
  const title = req.query.title
  const page =toInteger(req.query.page)
  const size =toInteger(req.query.size) 

  let products = JSON.parse(await fs.readFileSync(path.join(__dirname, 'data\\products.json')))
  if(id){
    res.json(products.filter(item=>item.id==id)[0])
  }else{
    if(title){
      products = products.filter(item=>item.title.toLowerCase().includes(title.toLowerCase()))
      if(page){
        res.json({
          "products":products.filter((i,k)=>(k>=(page-1)*size && k < size*page)),
          "total":products.length
        })
      }else{
        res.json(products)
      }
    }else{
      if(page){
        res.json({
          "products":products.filter((_,k)=>(k>=(page-1)*size && k < size*page)),
          "total":products.length
        })
      }else{
        res.json(products)
      }
    }
  }
});

app.get("/products/:category",async (req,res)=>{
  const category = req.params.category;
  const title = req.query.title
  const page = toInteger(req.query.page) 
  const size = toInteger(req.query.size)
  let products = JSON.parse(await fs.readFileSync(path.join(__dirname, 'data\\products.json')))

  if(category){
    products=products.filter(item=>item.category==category)
  }

  if(title){
    products=products.filter(item=>item.title.toLowerCase().includes(title.toLowerCase()))
    if(page){
      res.json({
        "products":products.filter((i,k)=>(k>=(page-1)*size && k < size*page)),
        "total":products.length
      })
    }else{
      res.json(products.filter(item=>item.title.includes(title)))
    }
  }else{
    if(page){
      
      res.json({
        "products":products.filter((i,k)=>(k>=(page-1)*size && k < size*page)),
        "total":products.length
      })
    }else{
      res.json(products)
    }
  }
})

app.get("/categories", async (req,res)=>{
  const products=JSON.parse(await fs.readFileSync(path.join(__dirname, 'data\\products.json')));
  let categories = [...new Set(products.map((item)=>{return item.category}))]

  let data = categories.map((category)=>{
    return {"category":category,"count":products.filter(item=>item.category==category).length}
  })
  res.json(data)
});

app.post("/login",async (req,res)=>{
  const users =JSON.parse(await fs.readFileSync(path.join(__dirname, 'data\\users.json')))
  const user = req.body
  let state = false

  users.map((item)=>{
    if (item.username == user.username && item.password == user.password && !state){
      state={"token":item.id}
    }else if(!state){
      state = (false || state)
    }
  })

  res.json(state)  
})

app.post("/signup",async (req,res)=>{
  const users =JSON.parse(await fs.readFileSync(path.join(__dirname, 'data\\users.json')))
  const user = req.body.user
  let state = true

  users.map((item)=>{
    if (item.username == user.username){
      state=false
    }
  })
  
  if(state){
    users.push({"id":[...users].pop().id+1,"firstname":user.firstname,"lastname":user.lastname,"username":user.username,"password":user.password})
    await fs.writeFile(`./data/users.json`,JSON.stringify(users), function(err, result) {
      if(err) console.log('error', err);
    })
  }
  
  res.json(state)
})

app.listen(8000, ()=>console.log(''))

