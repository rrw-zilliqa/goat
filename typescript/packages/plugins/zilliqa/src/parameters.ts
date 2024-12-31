import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

export class SayHelloParameters extends createToolParameters(
  z.object({
    greeting: z.string().describe("A greeting"),
  }),
) {}
