import mongoose from "mongoose";

 
const users = mongoose.Schema({
    username: String,
    govtId: String,
    password: String,
    role: String,
    organization: String,
})

const organizations = mongoose.Schema({

    username: String,
    govtId: String,
    password: String,
    role: String,
    elections: Array,
    electionsCount: {
        type: Number,
        default: 0
    },
})

const admin = mongoose.Schema({
    username: String,
    govtId: String,
    password: String,
    role: String,
})

const election = mongoose.Schema({
    title: String,
    description: String,
    start: String,
    end: String,
    status: {
        type: String,
        default: "live"
    },
    organization: String,
    organizationId: String,
    appliedCandidates: {
        type: Array,
        default: []
    },
    candidates: {
        type: Array,
        default: []
    },
    voters: {
        type: Array,
        default: []
    }, 
})


const contestant = mongoose.Schema({
    electionId: String,
    contestantId: String,
    contestantName: String,
    contestantgovtId: String,
    userId: String,
    organization: String,
    organizationId: String,
    status: {
        type: String,
        default: "pending"
    },
    votes: {
        type: Array,
        default: []
    },
    votesCount:{
        type: Number,
        default: 0
    }
})


export const Users = mongoose.model('users', users);
export const Organizations = mongoose.model('organizations', organizations);
export const Admin = mongoose.model('admin', admin);
export const Election = mongoose.model('election', election);
export const Contestant = mongoose.model('contestants', contestant);


