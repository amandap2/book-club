import { Router, type IRouter } from "express";
import { eq, asc, desc, isNotNull } from "drizzle-orm";
import { db, booksTable } from "@workspace/db";
import {
  ListBooksQueryParams,
  GetBookParams,
  ListBooksResponse,
  GetBookResponse,
  ListYearsResponse,
  GetStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/books/years", async (_req, res): Promise<void> => {
  const rows = await db
    .selectDistinct({ year: booksTable.year })
    .from(booksTable)
    .orderBy(asc(booksTable.year));
  const years = rows.map((r) => r.year);
  res.json(ListYearsResponse.parse(years));
});

router.get("/books/stats", async (_req, res): Promise<void> => {
  const allBooks = await db.select().from(booksTable);

  const totalBooks = allBooks.length;
  const currentYear = new Date().getFullYear();
  const booksThisYear = allBooks.filter((b) => b.year === currentYear).length;

  const ratedBooks = allBooks.filter((b) => b.rating != null);
  const averageRating =
    ratedBooks.length > 0
      ? ratedBooks.reduce((sum, b) => sum + (b.rating ?? 0), 0) / ratedBooks.length
      : null;

  const topRatedBook =
    ratedBooks.length > 0
      ? ratedBooks.reduce((best, b) =>
          (b.rating ?? 0) > (best.rating ?? 0) ? b : best
        )
      : allBooks[0];

  const authorCounts: Record<string, number> = {};
  for (const b of allBooks) {
    authorCounts[b.author] = (authorCounts[b.author] ?? 0) + 1;
  }
  const mostReadAuthor = Object.entries(authorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";

  const yearMap: Record<number, number> = {};
  for (const b of allBooks) {
    yearMap[b.year] = (yearMap[b.year] ?? 0) + 1;
  }
  const booksByYear = Object.entries(yearMap)
    .map(([year, count]) => ({ year: Number(year), count }))
    .sort((a, b) => a.year - b.year);

  res.json(
    GetStatsResponse.parse({
      totalBooks,
      booksThisYear,
      averageRating: averageRating ? Math.round(averageRating * 10) / 10 : null,
      topRatedBook,
      mostReadAuthor,
      booksByYear,
    })
  );
});

router.get("/books", async (req, res): Promise<void> => {
  const query = ListBooksQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let books = await db.select().from(booksTable).orderBy(asc(booksTable.year), asc(booksTable.id));

  if (query.data.year != null) {
    books = books.filter((b) => b.year === query.data.year);
  }
  if (query.data.genre != null) {
    books = books.filter((b) => b.genre === query.data.genre);
  }

  res.json(ListBooksResponse.parse(books));
});

router.get("/books/:id", async (req, res): Promise<void> => {
  const params = GetBookParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [book] = await db
    .select()
    .from(booksTable)
    .where(eq(booksTable.id, params.data.id));

  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return;
  }

  res.json(GetBookResponse.parse(book));
});

export default router;
