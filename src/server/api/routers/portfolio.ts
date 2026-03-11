import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { initialPortfolio } from "~/lib/data";

export const portfolioRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const dbPortfolio = await ctx.db.portfolio.findMany({
        orderBy: { createdAt: "desc" },
      });

      if (dbPortfolio.length > 0) {
        return dbPortfolio;
      }

      // Fallback to static data
      return initialPortfolio;
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      return initialPortfolio;
    }
  }),
});
