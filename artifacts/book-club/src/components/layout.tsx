import { ReactNode } from "react";
import { Link } from "wouter";
import logoUrl from "@assets/file_1778172910075.jpg";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80" data-testid="link-home">
            <img src={logoUrl} alt="Clube do Livro Caxias Logo" className="h-12 w-auto object-contain rounded-sm" />
            <div className="hidden sm:flex flex-col">
              <span className="font-serif font-bold text-xl leading-none text-primary">Clube do Livro</span>
              <span className="font-cursive text-2xl leading-none -mt-1 text-foreground">Caxias</span>
            </div>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-nav-home">
              Início
            </Link>
            <Link href="/arquivo" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-nav-archive">
              Acervo
            </Link>
            {/* <Link href="/sugestoes" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-nav-recommendations">
              Sugestões
            </Link> */}
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="py-8 border-t border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="font-serif text-primary/80">Clube do Livro Caxias</p>
          <p className="text-sm text-muted-foreground mt-2">Cultivando histórias e memórias.</p>
        </div>
      </footer>
    </div>
  );
}
