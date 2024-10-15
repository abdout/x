// File: lib/validations/thread.ts

import * as z from "zod";

// Thread creation validation schema
export const ThreadValidation = z.object({
  thread: z.string().nonempty("Thread content is required").min(3, { message: "Minimum 3 characters." }),
  accountId: z.string(),
});

// Comment creation validation schema
export const CommentValidation = z.object({
  thread: z.string().nonempty("Comment content is required").min(3, { message: "Minimum 3 characters." }),
});
