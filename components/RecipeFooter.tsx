export default function RecipeFooter() {
  return (
    <footer className="bg-secondary py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">RecipeGen © {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}

