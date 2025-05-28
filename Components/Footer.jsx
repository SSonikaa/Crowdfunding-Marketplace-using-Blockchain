import React from 'react'

const Footer = () => {
  const productList=["Market","ERC20 Tokens","Donation"];
  const contactList = ["support@FundPrism.com","shruti05046@gmail.com","Contact us"];
  const usefullLink=["Home","About us","Company Bio"];
  return (
   <footer class="text-center text-white backgroundMain lg:text-left">
     <div class= "mx-6 py-10 text-center md:text-left">
     <div class= "grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
     <div class="">
     <h6 class= "mb-4 flex items-center justify-center font-semibold  md:justify-start text-amber-400">
      FundRaise
     </h6>
       <p>
        Crowdfunding is a popular method of raising funds for a variety of projects and initiatives
         through online plateforms. It involves a large number of individuals contributing small amounts of
         money to collectively finance a project.

       </p>
     </div>

        <div class="">
        <h6 class="mb-4 flex justify-center font-semibold uppercase md:justify-start text-pink-400">
          Products
        </h6>
          {productList.map((el,i)=>(
            <p class="mb-4" key={i + 1}>
            <a href="#!">{el}</a>
            </p>
          ))}
        </div>


        <div class="">
        <h6 class="mb-4 flex justify-center font-semibold uppercase md:justify-start text-pink-400">
          Useful links
        </h6>
          {usefullLink.map((el,i)=>(
            <p class="mb-4" key={i + 1}>
            <a href="#!">{el}</a>
            </p>
          ))}      
        </div>

        <div>
        <h6 class="mb-4 flex justify-center font-semibold uppercase md:justify-start text-pink-400">
         Contact
        </h6>
          {contactList.map((el,i)=>(
            <p class="mb-4" key={i + 1}>
            <a href="#!">{el}</a>
            </p>
          ))}      
        </div>
     </div>
     </div>

     <div class="backgroundMain p-6 text-center">
     <span>© 2023  Copyright: </span>
     <a class="font-semibold text-amber-400" href="http://tailwind-elements.com/">
      FundRaise
     </a>
     </div>
   </footer>
  )
}

export default Footer;
