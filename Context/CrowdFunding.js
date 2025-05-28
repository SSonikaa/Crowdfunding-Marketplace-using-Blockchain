// Manage the context of the entire application

import React,{useState, useEffect} from "react";
import Wenb3Modal from "web3modal";
import {ethers} from "ethers";

//Internal Import
import { CrowdFundingABI, CrowdFundingAddress } from "./contants";

//Fetch Smart Contract
const fetchContract =(signerOrProvider)=> new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signerOrProvider);

export const CrowdFundingContext = React.createContext();

 export const CrowdFundingProvider = ({children})=>{
    const titleData = "Crowd Funding Contract";
    const[currentAccount, setCurrentAccount] = useState("");

    const createCampaign = async(campaign) =>{
    const {title, description, amount, deadline} = campaign;
    const web3Modal= new Wenb3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    console.log(currentAccount);
    try{
        const transaction = await contract.createCampaign(
            currentAccount, //owner
            title,
            description,
            ethers.utils.parseUnits(amount, 18),
            new Date(deadline).getTime() // deadline
        );

        await transaction.wait();
        console.log("contract call success", transaction);
    }
    catch(error){
      console.log("Contract call failure", error)  ;
    }
    };

    const getCampaigns = async()=>{
        try{
        const provider = new ethers.providers.JsonRpcProvider('https://tan-testnetrpc2.tan.live/');
        const contract = fetchContract (provider);
        const campaigns = await contract.getCampaigns();

        const parsedCampaigns=campaigns.map((campaign, i) =>({
            owner: campaign.owner,
            title: campaign.title,
            description : campaign.description,
            target : ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected  : ethers.utils.formatEther(campaign.amountCollected.toString()),
            pId : i,           
        }));

        return parsedCampaigns;
    }catch(error){
        console.log("Error in GetContract function in CrowdFunding.js",error);
    }
    };

    const getUserCampaigns = async ()=>{
        const provider = new ethers.providers.JsonRpcProvider('https://tan-testnetrpc2.tan.live/');
        const contract = fetchContract(provider);
        const allCampaigns = await contract.getCampaigns();
        console.log("============",allCampaigns);
        
        const accounts = await window.ethereum.request({
            method : "eth_accounts",  //check shivam  "eth_accounts"
        });
        const currentUser= accounts[0];

        const filteredCampaigns = allCampaigns.filter( (campaign) =>
         campaign.owner === "0x93e2fdC61410cEC9227b6487e06AABE227C7837c");

        console.log("===============",filteredCampaigns);
        

         const userData = filteredCampaigns.map((campaign,i)=>({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            pId:i,
         }));
console.log("9999",userData);

         return userData;
    };
// while changing the state in smart contract when have to build connection so we use web3modal here.
       const donate = async (pId, amount)=>{
        const web3Modal = new Wenb3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchContract(signer);

        const campaignData= await contract.donateToCampaign(pId,{
            value: ethers.utils.parseEther(amount),
        });

        await campaignData.wait();
        location.reload();

        return campaignData;
       };


       const getDonations = async(pId)=>{
        const provider = new ethers.providers.JsonRpcProvider('https://tan-testnetrpc2.tan.live/');
        const contract = fetchContract(provider);

        const donations = await contract.getDonators(pId);
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];

        for (let i=0; i< numberOfDonations; i++){
            parsedDonations.push({
                donator : donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString()),
            })
        }

        console.log("kkkkk===",parsedDonations);
        
        return parsedDonations;
       }


       // Check if wallet is connected


       const checkIfWalletConnected = async()=>{
        try{
            if(!window.ethereum)
            return setOpenError(true), setError("Install Metamask");

            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });
        

        if (accounts.length){
            setCurrentAccount(accounts[0]);
        } else{
            console.log("No Account Found");
           
        }
     } catch (error){
            console.log("Something wrong while connecting to wallet");
            alert("Something wrong while connecting to wallet");
        }      
     };
                   

     useEffect(()=>{
       checkIfWalletConnected() ;
     },[]);

     //--Connect walllet function

     const connectWallet = async ()=>{
        try{
            if(!window.ethereum) return console.log("Install MetaMask");

            const accounts= await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            setCurrentAccount(accounts[0]);
        }
        catch(error){
         console.log("Error while connecting to wallet");
        }
        
     };

     return (<CrowdFundingContext.Provider 
       value = {{
        titleData,
        currentAccount,
        createCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        connectWallet,
       }}
       >
       {children}
       </CrowdFundingContext.Provider>);
 };