export interface Track {
    id: string; // UUID unique pour chaque track
    title: string; // Nom de la chanson
    artist: string; // Nom du chanteur
    description?: string; // Description optionnelle (max 200 caractères)
    addedDate: Date; // Date d'ajout (automatique)
    duration: number; // Durée de la chanson (calculée automatiquement)
    category: string; // Catégorie musicale (pop, rock, rap, cha3bi, etc.)
    coverImage?: string;
}
