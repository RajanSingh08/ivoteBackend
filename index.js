import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { Admin, Contestant, Election, Organizations, Users } from './schema.js';
import e from 'express';

const app = express();

app.use(express.json());
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

// mongoose setup

const PORT = 6001;
mongoose.connect('mongodb+srv://rajansingh2003rs:SPd17uzbLSA7V6Kd@cluster0.qkgvxrs.mongodb.net/Voting', {}
).then(()=>{


    // User authentication

     app.post('/user-register', async (req, res) =>{
        try{
    
            const {username, govtId, password, role, organization, userId} = req.body;

            console.log(organization)
    
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);
    
            const newUser = new Users({
                username, 
                govtId,
                password: passwordHash,
                role,
                organization,
                userId
            });
    
            const user = await newUser.save();
    
            res.status(200).json(user);
    
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });
    
    app.post('/user-login', async (req, res) =>{
        try{
            const {govtId, password} = req.body;
            const user = await Users.findOne({govtId:govtId});
            if(!user) return res.status(400).json({msg: "User does not exist"});
    
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return res.status(400).json({msg: "Invalid credentials"});
                                 
            res.status(200).json(user);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });


    // Organization authentication


    app.post('/organization-register', async (req, res) =>{
        try{
    
            const {username, govtId, password, role} = req.body;
    
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);
    
            const newOrg = new Organizations({
                username, 
                govtId,
                password: passwordHash,
                role
            });
    
            const org = await newOrg.save();
    
            res.status(200).json(org);
    
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });
     
    app.post('/organization-login', async (req, res) =>{
        try{
            const {govtId, password, role} = req.body;
            const org = await Organizations.findOne({govtId:govtId});
            if(!org) return res.status(400).json({msg: "org does not exist"});
    
            const isMatch = await bcrypt.compare(password, org.password);
            if(!isMatch) return res.status(400).json({msg: "Invalid credentials"});
                                 
            res.status(200).json(org);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });


    // Admin authentication

    app.post('/admin-register', async (req, res) =>{
        try{
    
            const {username, govtId, password, role} = req.body;
    
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);
    
            const newUser = new Admin({
                username, 
                govtId,
                password: passwordHash,
                role
            });
    
            const user = await newUser.save();
    
            res.status(200).json(user);
    
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });
    
    app.post('/admin-login', async (req, res) =>{
        try{
            const {govtId, password} = req.body;
            const user = await Admin.findOne({govtId:govtId});
            if(!user) return res.status(400).json({msg: "User does not exist"});
    
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return res.status(400).json({msg: "Invalid credentials"});
                                 
            res.status(200).json(user);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });

    // get all users
    app.get('/users', async (req, res) =>{
        try{
            const users = await Users.find();
            res.status(200).json(users);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });


    // get all organizations
    app.get('/organizations', async (req, res) =>{
        try{
            const orgs = await Organizations.find();
            res.status(200).json(orgs);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });


    // Update organization description
    app.put('/update-organization', async (req, res) =>{
        try{
            const {id, description} = req.body;
            const org = await Organizations.findOneAndUpdate({_id: id}, {description: description});
            res.status(200).json(org);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });

    // ban voter
    app.put('/ban-voter/:id', async (req, res) =>{
        try{
            const user = await Users.findOneAndUpdate({_id: req.params.id}, {votingStatus: "banned"});
            res.status(200).json(user);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });

    // unban voter
    app.put('/unban-voter/:id', async (req, res) =>{
        try{
            const user = await Users.findOneAndUpdate({_id: req.params.id}, {votingStatus: "eligible"});
            res.status(200).json(user);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });

    // get all elections
    app.get('/elections', async (req, res) =>{
        try{
            const elections = await Election.find();
            res.status(200).json(elections);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });


     // get election data
     app.get('/election/:id', async (req, res) =>{
        try{
            const election = await Election.findById(req.params.id);
            res.status(200).json(election);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });

    // create election
    app.post('/create-election', async (req, res) =>{
        try{
            const {title, description, start, end, organization, organizationId} = req.body;
            const newElection = new Election({
                title, 
                description,
                start,
                end,
                organization,
                organizationId
            });
            const election = await newElection.save();

            const org = await Organizations.findOneAndUpdate({_id: organizationId}, {$push: {elections: election._id}, $inc: {electionsCount: 1}});
                
            res.status(200).json(election);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });

    // update election
    app.put('/update-election', async (req, res) =>{
        try{
            const {id, title, description, start, end, organization} = req.body;
            const election = await Election.findById(id);
            election.title = title;
            election.description = description;
            election.start = start;
            election.end = end;
            election.organization = organization;
            const updatedElection = await election.save();
            res.status(200).json(updatedElection);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });

    // Close election
    app.put('/close-election/:id', async (req, res) =>{
        try{
            const election = await Election.findOneAndUpdate({_id: req.params.id}, {status: "closed"});
            res.status(200).json(election);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });

    // Apply as contestant
    app.post('/apply-contestant', async (req, res) =>{
        try{
            const {electionId, contestantId, contestantName, contestantgovtId} = req.body;

            const election = await Election.findById(electionId);

            const user = await Users.findById(contestantId);

            const newContestant = new Contestant({
                electionId, 
                contestantId,
                contestantName,
                contestantgovtId,
                userId: user.userId,
                organization: election.organization,
                organizationId: election.organizationId
            });
            const contestant = await newContestant.save();

            election.appliedCandidates.push(contestantId);
            await election.save();

            res.status(200).json(contestant);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });

    // Approve contestant
    app.put('/approve-contestant/:id', async (req, res) =>{
        try{
            const contestant = await Contestant.findById(req.params.id);
            contestant.status = "approved";
            const updatedContestant = await contestant.save();

            const election = await Election.findOneAndUpdate({_id: contestant.electionId}, {$push: {candidates: {id: contestant.contestantId, name: contestant.contestantName, userId: contestant.userId}}});

            res.status(200).json(updatedContestant);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });

    // Disapprove contestant
    app.put('/disapprove-contestant/:id', async (req, res) =>{
        try{
            const contestant = await Contestant.findById(req.params.id);
            contestant.status = "disapproved";
            const updatedContestant = await contestant.save();
            res.status(200).json(updatedContestant);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });

    // get all contestants
    app.get('/contestants', async (req, res) =>{
        try{
            const contestants = await Contestant.find();
            res.status(200).json(contestants);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });

    // get all contestants by election
    app.get('/contestants/:id', async (req, res) =>{
        try{
            const contestants = await Contestant.find({electionId: req.params.id});
            res.status(200).json(contestants);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });


    // Vote
    app.post('/vote', async (req, res) =>{
        try{
            const {electionId, candidateId, voterId} = req.body;

            const election = await Election.findById(electionId);
            if(election.voters.includes(voterId)){
                return res.status(400).json({msg: "You have already voted"});
            }
            
            election.voters.push(voterId);
            await election.save();

            const contestant = await Contestant.findOneAndUpdate({contestantId: candidateId, electionId: electionId}, {$push: {votes: voterId}, $inc: {votesCount: 1}});
            res.status(200).json(contestant);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    });

    
    

    app.listen(PORT, ()=>{
        console.log(`Running @ ${PORT}`);
    });
}
).catch((e)=> console.log(`Error in db connection ${e}`));