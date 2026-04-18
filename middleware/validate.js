const validate = (schema) =>{
    return (req,res,next)=>{
        const rep = schema.safeParse(req.body);

        if(!rep.success){
            console.log(rep)
            res.status(400).json({
                errors: rep.error.issues.map(e=>({
                    field: e.path[0],
                    message: e.message
                }))
            })
            return;

        }
         next();
    }
}

module.exports = validate;