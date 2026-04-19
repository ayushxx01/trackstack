const z = require("zod");

const createMailSchema = z.object({
    name: z.string().min(1,"cannot be empty"),
    company: z.string().min(2,"cannot be empty"),
    emailedOn: z.string().min(1),
    replied: z.boolean().default(false),
    platform: z.string().min(1),
    notes: z.string().optional()
});

const updateMailSchema = z.object({
    name: z.string().min(1,"cannot be empty").optional(),
    company: z.string().min(2,"cannot be empty").optional(),
    emailedOn: z.string().min(1).optional(),
    replied: z.boolean().optional(),
    platform: z.string().min(1).optional(),
    notes: z.string().optional()
});

module.exports = {
    createMailSchema,
    updateMailSchema
}