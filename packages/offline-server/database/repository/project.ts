import { z } from "zod";

export const readOne = (id: string) => {
    
};

export const createOne = (data: z.input<typeof validator>) => {
    const validated = validator.safeParse(data);
    if (validated.success) {
        
    }
};

const validator = z.object({
    id: z.string(),
    title: z.string(),
    client_id: z.string(),
    workers_ids: z.array(z.string()),
    categories_ids: z.array(z.string()),
});
