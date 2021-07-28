const RequirementService = require('../services/requirement.service');

exports.handleForRequirement = async (req, res) => {
   try {
      const newRequirementInfo = req.body.newRequirementInfo;
      if (newRequirementInfo) {
         let result = await RequirementService.createNewRequirement(newRequirementInfo);
         if (result === null){
            res.json({ message: "createNewRequirement null result because of internal error"});
         }else {
            res.json({message:"createNewRequirement Success"});
         }
      } else {
         res.json(await RequirementService.getAllRequirements());
      }
   } catch (e) {
      console.log(e)
      res.json([]);
   }
   
}