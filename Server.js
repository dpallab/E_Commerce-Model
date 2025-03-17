import express from "express";
import bcrypt, { hash } from "bcrypt";
// import aws from "aws-sdk";
// import "dotenv/config";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore,doc,collection,setDoc,updateDoc,getDoc } from "firebase/firestore";   //package for firebase

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmt8_Eycras1NX2P6J5nQM9jCDHZvSHEo",
  authDomain: "e-commerse-project-e1336.firebaseapp.com",
  projectId: "e-commerse-project-e1336",
  storageBucket: "e-commerse-project-e1336.firebasestorage.app",
  messagingSenderId: "841526475490",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);     // initializing firebase
const db=getFirestore();                // creating a firebase instance

const app=express();
const port=3000;
app.use(express.json());             // Eneble form data sharing //

app.get('/',(req,res)=> { res.sendFile("index.html",{root:"Front End"})});
app.listen(port,()=> {
    console.log("Listeing on port number 3000!!!!")
});
app.use(express.static('Front End'));

app.get('/pageNotFound',(req,res)=>{res.sendFile("indexError.html",{root:"Front End"})});

// app.use((req,res)=>{res.redirect("/pageNotFound")});

//   For Sign Up page   //
app.get('/signUp',(req,res)=>{res.sendFile("SignUp.html",{root:"Front End"})});
app.post('/signUp',(req,res) => {                             // it is used for post request
    const {fullName,email,phNumber,password}=req.body;
    // res.json({'alert':'alert noticed'});
    const users=collection(db,"users");            // it is used for collection
    getDoc(doc(users,email)).then(user=> {          // it is used for get request
        if(user.exists())
            {
                return res.json({'alert':'Email already Exists'})
            }
            else
            {
                // Encryption of the password //
                bcrypt.genSalt(10,(error,salt)=>{                   // it is used for encryption
                    bcrypt.hash(password,salt,(err,hash)=> {
                        req.body.password=hash;
                        req.body.seller=false;
                        // set the document //
                        setDoc(doc(users,email),req.body).then (data=> {
                            res.json({
                                'alert':'User successfully Registered',
                                fullName:req.body.fullName,
                                email:req.body.email,
                                seller:req.body.seller,
                                signUp:true,
                            })
                        })
                    })
                });
            }
        })
    });

    //  For Sign In page  //
    app.get('/SignIn',(req,res)=>{res.sendFile("SignIn.html",{root:"Front End"})});
    app.post('/signIn',(req,res) =>{                             // it is used for post request
        const {email,password}=req.body;
        const users=collection(db,"users");            // it is used for collection
        getDoc(doc(users,email)).then(user=> {          // it is used for get request
                if(!user.exists())
                {
                    return res.json({'alert':'Email does not Registerd in Our Website'})
                }
                else
                {
                   bcrypt.compare(password,user.data().password,(err,result )=> {
                    if(result)
                    {
                        let data=user.data();
                        return res.json ({
                            fullName:data.fullName,
                            email:data.email,
                            seller:data.seller,
                            signIn:true,
                            'alert' : '<----login successful---->',
                        })
                    }
                    else
                    {
                        return res.json ({
                            'alert':'Incorrect Password!!!!!'
                        })
                    }
                   })
                }
            })
        });

    // For seller //
    app.get("/seller", (req,res)=>{res.sendFile("Seller.html",{root:"Front End"})});
    app.post('/seller',(req,res) => {                             //it is used for post request
        const {fName,email,password,contact}=req.body;
        const sellers=collection(db,"sellers");
        setDoc(doc(sellers,email),req.body).then(data=>{
            const users=collection(db,"sellers");
            updateDoc(doc(users,email),{
                seller:true,
            })
            .then(data=> {
                res.json({'seller':true})
            })
        })
    });

    // For search Page //
    app.get("/search", (req,res)=>{res.sendFile("Search.html",{root:"Front End"})});

    // For Product Page //
    app.get("/product", (req,res)=>{res.sendFile("Product.html",{root:"Front End"})});

    // For Dashboard //
    app.get("/dashboard",(req,res)=>{res.sendFile("Dashboard.html",{root:"Front End"})});

    // For Add Product
    app.get("/addproduct",(req,res)=>{res.sendFile("AddProduct.html",{root:"Front End"})});


app.get('*',(req,res)=>{res.sendFile("indexError.html",{root:"Front End"})});     // It is always in the last  because ki6u vul likhle aii page a asbee//
