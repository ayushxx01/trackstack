const z = require("zod");

const createAppSchema = z.object({
    companyName: z.string().min(1,"company name cannot be empty"),
    position: z.string().min(1,"position cannot be empty"),
    status: z.enum(["Applied", "Under Review", "Interview", "Rejected", "Accepted"]).default("Applied"),
    coldMailStatus: z.enum(["Not Sent", "Sent", "Replied"]).default("Not Sent"),
    appliedDate: z.string().optional(),
    deadlineDate: z.string().min(1,"deadline date cannot be empty"),
    location: z.string().optional(),
    jobLink: z.string().optional(),
    notes: z.string().optional()
});

const updateAppSchema = z.object({
    companyName: z.string().min(1).optional(),
    position: z.string().min(1).optional(),
    status: z.enum(["Applied", "Under Review", "Interview", "Rejected", "Accepted"]).optional(),
    coldMailStatus: z.enum(["Not Sent", "Sent", "Replied"]).optional(),
    appliedDate: z.string().optional(),
    deadlineDate: z.string().optional(),
    location: z.string().optional(),
    jobLink: z.string().optional(),
    notes: z.string().optional()
})

module.exports = {
    createAppSchema,
    updateAppSchema
}