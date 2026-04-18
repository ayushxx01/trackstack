const z = require("zod");

const registerSchema = z.object({
    username: z.string().min(6, "username should'nt be empty , atleast 6 letters"),
    email: z.string().email("Must be a valid email"),
    password: z.string().regex(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}/,"Password must contain uppercase, lowercase, number and be at least 8 characters")
});

const loginSchema = z.object({
    email: z.string().email("must be valid email"),
    password: z.string().min(1,"password cannot be empty")
});


module.exports = {registerSchema,loginSchema}