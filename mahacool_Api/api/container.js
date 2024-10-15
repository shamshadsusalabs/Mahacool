const express = require("express");
const router = express.Router();
const { check,validationResult } = require('express-validator');
const ContainerSchemas = require('../schema/Container');
const Str = require('@supercharge/strings')

router.get('/getall',async (req,res) => {
    try{
        let policies = await ContainerSchemas.find({"active" : true});
        res.json(policies);
    }
    catch(err){
        res.json({msg:err.message});
    }
});

router.get('/all',async (req,res) => {
    try{
        let policies = await ContainerSchemas.find();
        res.json(policies);
    }
    catch(err){
        res.json({msg:err.message});
    }
});



router.post(
    '/add',
    async (req,res) => {
        try{

            let policies = await ContainerSchemas.find();
            console.log(policies.length);
            holiday = new ContainerSchemas(
               req.body
                );
            await holiday.save();
            res.json(holiday);  
        } catch (error){
            console.log(error.message);
            return res.status(500).json({ msg : "Server Error....."});
        }
    }
);

router.post(
    '/remove',
    async (req,res) => {
        try{
            let employer = await ContainerSchemas.findOne({"_id"  : req.body.id});
            if (!employer) {
                return res.status(401).json("Event not found");
            }
            await ContainerSchemas.deleteOne({"_id"  : req.body.id});
            return res.status(200).json("Event Deleted");
        } catch (error){
            console.log(error.message);
            return res.status(500).json({ msg : error.message});
        }
    }
);

router.post('/update',async (req,res) => {
    try {
        let {id} = req.query;
        let employer = await ContainerSchemas.findById(id);
        if (!employer) {
            return res.status(401).json("Event not found");
        }
        // let obj = {
        //     status : req.body.status
        // }
        Object.assign(employer, req.body);
        await employer.save();
        res.json(employer);
    } catch (error) {
        console.log(error.message);
        return res.status(500);
    }
});

router.get('/details',(req,res,next)=>{
    let {id}=req.query;
    ContainerSchemas.findById(id).then(result=>
         {res.status(200).json(result)
     }).catch(error=>{
                 console.log(error);
                     res.status(500).json(
                         {error:error}
                     )
     })
 });

 router.get('/getid',(req,res,next)=>{
    let {id}=req.query;
    ContainerSchemas.find({"cid" : id}).then(result=>
         {res.status(200).json(result)
     }).catch(error=>{
                 console.log(error);
                     res.status(500).json(
                         {error:error}
                     )
     })
 });


 router.get('/getcity',(req,res,next)=>{
    let {id}=req.query;
    ContainerSchemas.find({"city" : id}).then(result=>
         {res.status(200).json(result)
     }).catch(error=>{
                 console.log(error);
                     res.status(500).json(
                         {error:error}
                     )
     })
 });
 
module.exports = router;