import { tool } from "langchain";
import { z } from "zod/v4";
// export const geolocationGet = tool({
//   name: "geolocation_get",
//   description: "Get the user's current location from the browser.",
//   schema: z.object({
//     save: z.boolean().optional(),
//   }),
// });

export const geolocationGet = tool(
  async () => {
    return null;
  },
  {
    name: "geolocation_get",
    description: "Get the user's current location from the browser.",
    schema: z.object({
      save: z.boolean().optional(),
    }),
  },
);
