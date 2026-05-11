import { useGetStats } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Star, Trophy, Users } from "lucide-react";
import logoUrl from "@assets/file_1778172910075.jpg";

export function Home() {
  const { data: stats, isLoading } = useGetStats();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-24 sm:py-32 flex justify-center items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="container relative z-10 px-4 text-center text-primary-foreground flex flex-col items-center">
          <img src={logoUrl} alt="Logo" className="w-32 h-32 md:w-48 md:h-48 object-contain rounded-full shadow-2xl mb-8 border-4 border-primary-foreground/20" />
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">Clube do Livro</h1>
          <h2 className="font-cursive text-4xl md:text-6xl mb-8 drop-shadow-md text-primary-foreground/90">Caxias</h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto font-medium opacity-90 mb-10">
            Um salão literário aconchegante para amigas que compartilham o amor por grandes histórias.
          </p>
          <div className="flex gap-4">
            <Link href="/arquivo" className="bg-background text-primary hover:bg-background/90 px-6 py-3 rounded-md font-medium transition-colors shadow-lg" data-testid="button-hero-archive">
              Explorar Acervo
            </Link>
            {/* <Link href="/sugestoes" className="bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 px-6 py-3 rounded-md font-medium transition-colors shadow-lg" data-testid="button-hero-recommendations">
              Ver Sugestões
            </Link> */}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="font-serif text-3xl font-bold text-foreground mb-4">Nossa Jornada Literária</h3>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total de Livros</CardTitle>
                <BookOpen className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-serif font-bold text-foreground">{stats.totalBooks}</div>
                <p className="text-xs text-muted-foreground mt-1">obras lidas juntos</p>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Média de Notas</CardTitle>
                <Star className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-serif font-bold text-foreground">
                  {stats.averageRating ? stats.averageRating.toFixed(1) : "-"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">avaliação geral</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Mais Bem Avaliado</CardTitle>
                <Trophy className="h-5 w-5 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-serif font-bold text-foreground leading-tight truncate" title={stats.topRatedBook?.title}>
                  {stats.topRatedBook?.title || "N/A"}
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{stats.topRatedBook?.author}</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Autor Mais Lido</CardTitle>
                <Users className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-serif font-bold text-foreground leading-tight truncate" title={stats.mostReadAuthor}>
                  {stats.mostReadAuthor || "N/A"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">favorito do clube</p>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </section>

      {/* Livros por Ano */}
      {stats && stats.booksByYear && stats.booksByYear.length > 0 && (
        <section className="py-16 bg-muted/30 border-t border-border/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3">Livros por Ano</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
              {stats.booksByYear.map((yearStats) => (
                <div key={yearStats.year} className="bg-background border border-border/60 rounded-lg px-6 py-4 flex flex-col items-center shadow-sm min-w-[120px]">
                  <span className="font-serif font-bold text-2xl text-primary">{yearStats.year}</span>
                  <span className="text-sm text-muted-foreground mt-1 font-medium">{yearStats.count} livros</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
