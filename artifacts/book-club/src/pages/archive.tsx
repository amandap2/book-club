import { useState } from "react";
import { useListBooks, useListYears, getListBooksQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export function Archive() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const booksParams = selectedYear === null ? undefined : { year: selectedYear };

  const { data: years, isLoading: isYearsLoading } = useListYears();
  
  const { data: books, isLoading: isBooksLoading } = useListBooks(
    booksParams,
    {
      query: {
        enabled: true,
        queryKey: getListBooksQueryKey(booksParams),
      }
    }
  );

  const sortedBooks = books
    ? [...books].sort((a, b) => b.year - a.year || b.id - a.id)
    : [];

  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <div className="mb-10 text-center md:text-left md:flex md:items-end md:justify-between">
        <div>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Acervo Literário</h1>
          <p className="text-muted-foreground">Nossa biblioteca de leituras passadas e presentes.</p>
        </div>
        
        {/* Year Filter */}
        <div className="mt-6 md:mt-0 flex flex-wrap justify-center md:justify-end gap-2">
          <Button 
            variant={selectedYear === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedYear(null)}
            className="font-medium"
            data-testid="button-filter-all"
          >
            Todos
          </Button>
          {!isYearsLoading && years?.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedYear(year)}
              className="font-medium"
              data-testid={`button-filter-${year}`}
            >
              {year}
            </Button>
          ))}
        </div>
      </div>

      {isBooksLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="flex flex-col h-[280px]">
              <CardHeader className="pb-2 flex-none">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="flex-1" />
              <CardFooter className="pt-0 justify-between">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-16" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : sortedBooks.length > 0 ? (
        <>
          <div className="mb-6 text-sm font-medium text-muted-foreground">
            Mostrando {sortedBooks.length} {sortedBooks.length === 1 ? "livro" : "livros"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedBooks.map((book) => (
              <Card key={book.id} className="flex flex-col h-full bg-card hover:border-primary/50 transition-colors shadow-sm group">
                <CardHeader className="pb-3 flex-none">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="font-serif text-xl leading-tight group-hover:text-primary transition-colors" data-testid={`text-book-title-${book.id}`}>
                      {book.title}
                    </CardTitle>
                  </div>
                  <p className="text-muted-foreground mt-1 font-medium" data-testid={`text-book-author-${book.id}`}>{book.author}</p>
                </CardHeader>
                <CardContent className="flex-1 pt-0">
                  {book.genre && (
                    <span className="inline-block px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md mt-2">
                      {book.genre}
                    </span>
                  )}
                </CardContent>
                <CardFooter className="pt-4 border-t border-border/40 flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground bg-muted px-2 py-1 rounded-sm" data-testid={`text-book-year-${book.id}`}>
                    {book.year}
                  </span>
                  
                  {book.rating !== null && book.rating !== undefined ? (
                    <div className="flex items-center gap-1 font-medium" data-testid={`text-book-rating-${book.id}`}>
                      <span className="text-foreground">{book.rating.toFixed(1)}</span>
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs italic">Sem nota</span>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="py-20 text-center bg-muted/20 rounded-xl border border-border/50">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-serif font-bold text-foreground mb-2">Nenhum livro encontrado</h3>
          <p className="text-muted-foreground">Não há livros registrados para este filtro.</p>
        </div>
      )}
    </div>
  );
}
