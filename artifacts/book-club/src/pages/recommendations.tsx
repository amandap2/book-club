import { useGetRecommendations } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function Recommendations() {
  const { data: recommendations, isLoading } = useGetRecommendations();

  return (
    <div className="container mx-auto px-4 py-12 flex-1 max-w-5xl">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-foreground mb-4">Sugestões Especiais</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Recomendações curadas pela inteligência artificial, baseadas no histórico e no gosto literário do nosso clube.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden border-primary/10">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 bg-muted p-6 flex flex-col justify-center">
                  <Skeleton className="h-8 w-3/4 mb-3" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
                <div className="flex-1 p-6">
                  <Skeleton className="h-5 w-24 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mt-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : recommendations && recommendations.length > 0 ? (
        <div className="space-y-8">
          {recommendations.map((rec, index) => (
            <Card key={index} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-2/5 bg-primary/5 p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border/50">
                  <CardTitle className="font-serif text-2xl md:text-3xl leading-tight text-foreground mb-2" data-testid={`text-rec-title-${index}`}>
                    {rec.title}
                  </CardTitle>
                  <p className="text-lg font-medium text-muted-foreground" data-testid={`text-rec-author-${index}`}>{rec.author}</p>
                </div>
                
                <CardContent className="flex-1 p-8 flex flex-col justify-center">
                  <div className="mb-6">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">Por que o clube vai gostar:</h4>
                    <p className="text-foreground/90 leading-relaxed text-lg" data-testid={`text-rec-reason-${index}`}>
                      "{rec.reason}"
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-border/50 flex items-start gap-3">
                    <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm text-muted-foreground block mb-1">Se você gostou de:</span>
                      <span className="font-serif font-medium text-foreground italic" data-testid={`text-rec-similar-${index}`}>
                        {rec.similarTo}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-muted/20 rounded-xl border border-border/50">
          <p className="text-lg text-muted-foreground">Não foi possível carregar as recomendações no momento.</p>
        </div>
      )}
    </div>
  );
}
