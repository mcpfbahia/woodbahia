import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { initialModels } from "~/lib/data";

export const modelRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const dbModels = await ctx.db.model.findMany({
        orderBy: { createdAt: "desc" },
      });

      if (dbModels.length > 0) {
        return dbModels;
      }

      // Fallback to initialModels if DB is empty
      return initialModels;
    } catch (error) {
      console.error("Error fetching models:", error);
      return initialModels;
    }
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const model = await ctx.db.model.findUnique({
          where: { id: input.id },
          include: { floorPlan: true },
        });

        if (model) {
          return model;
        }

        // Fallback search in initialModels
        const staticModel = initialModels.find((m) => m.id === input.id);
        if (staticModel) {
          return {
            ...staticModel,
            floorPlan: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }

        return null;
      } catch (error) {
        console.error(`Error fetching model ${input.id}:`, error);
        return initialModels.find((m) => m.id === input.id) || null;
      }
    }),
});
